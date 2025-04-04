from fastapi import FastAPI, Request
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import requests
import json
import os
import logging
from dotenv import load_dotenv
from pathlib import Path

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

app = FastAPI()

# CORS 설정 (로컬 테스트용, 실제로는 필요 없을 수도 있음)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class SimplifyRequest(BaseModel):
    text: str

@app.post("/api/simplify")
async def simplify_text(req: SimplifyRequest):
    request_data = {
        "model": "gpt-4o-mini",
        "messages": [
            {
                "role": "user",
                "content": f"""다음 설명을 10세 정도의 문해력 수준으로도 쉽게 이해할 수 있도록 최대한 쉽게 풀어 써 주세요.

아래 조건을 지켜 주세요:

- 핵심 개념과 의학적 의미를 유지해 주세요.
- 전문 용어나 생소한 표현은 가능한 한 쉽게 풀어 쓰고, 의미 전달이 중요한 경우에는 짧은 설명을 덧붙여 주세요.
- 필요한 경우 간단한 예시나 쉬운 비유를 사용해 이해를 도와 주세요. 단, 전체 흐름을 해치지 않도록 균형 있게 사용해 주세요.
- 자연스럽게 받아들일 수 있는 어조로, 의료인이 설명하듯 친절하고 차분하게 작성해 주세요.

다음 텍스트를 위 조건에 맞게 변환해주세요:
{req.text}"""
            }
        ],
        "temperature": 0,
        "top_p": 1
    }
    
    try:
        response = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {OPENAI_API_KEY}"
            },
            json=request_data
        )
        
        if response.status_code != 200:
            return JSONResponse(
                status_code=500, 
                content={"error": f"OpenAI API 오류: {response.status_code} - {response.text}"}
            )
            
        data = response.json()
        return {"result": data["choices"][0]["message"]["content"]}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

# 정적 파일 (프론트엔드 build된 결과) 경로 설정
# 일반적인 경로 시도
frontend_path = Path(__file__).parent / "frontend" / "dist"
logger.info(f"기본 프론트엔드 경로: {frontend_path}")
logger.info(f"기본 프론트엔드 경로 존재 여부: {frontend_path.exists()}")

# 경로가 없으면 대체 경로 시도
if not frontend_path.exists():
    # Render 배포 환경에서 가능한 대체 경로들
    alternative_paths = [
        Path("/opt/render/project/src/frontend/dist"),
        Path(__file__).parent.parent / "frontend" / "dist",
        Path(__file__).parent / "dist",
    ]
    
    for alt_path in alternative_paths:
        logger.info(f"대체 경로 시도: {alt_path}")
        if alt_path.exists():
            logger.info(f"유효한 대체 경로 발견: {alt_path}")
            frontend_path = alt_path
            break
    
    logger.info(f"최종 선택된 프론트엔드 경로: {frontend_path}")
    logger.info(f"최종 경로 존재 여부: {frontend_path.exists()}")

# 정적 파일 디렉토리 마운트 - 디렉토리가 존재할 경우에만
static_dir = frontend_path / "static"
logger.info(f"정적 파일 경로: {static_dir}")
logger.info(f"정적 파일 경로 존재 여부: {static_dir.exists()}")

if static_dir.exists() and static_dir.is_dir():
    app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")
    logger.info("정적 파일 디렉토리가 성공적으로 마운트되었습니다.")

# 루트 경로 및 그 외 모든 경로 처리 (SPA용)
@app.get("/")
@app.get("/{full_path:path}")
async def serve_spa(full_path: str = ""):
    # API 경로는 별도 처리
    if full_path.startswith("api/") and full_path != "api/simplify":
        return JSONResponse(status_code=404, content={"message": "API not found"})
    
    # 먼저 요청된 파일이 실제로 존재하는지 확인
    requested_path = frontend_path / full_path
    if requested_path.is_file():
        return FileResponse(requested_path)
    
    # 그 외의 경로는 index.html 반환 (SPA 라우팅 지원)
    index_path = frontend_path / "index.html"
    logger.info(f"index.html 경로: {index_path}")
    logger.info(f"index.html 존재 여부: {index_path.exists()}")
    
    if index_path.exists():
        logger.info("index.html 파일을 반환합니다.")
        return FileResponse(index_path)
    
    logger.error(f"index.html 파일을 찾을 수 없습니다. 경로: {index_path}")
    return JSONResponse(status_code=404, content={"message": "index.html not found"})
