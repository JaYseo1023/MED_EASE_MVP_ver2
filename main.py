from fastapi import FastAPI, Request
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import requests
import json
import os
from dotenv import load_dotenv
from pathlib import Path

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
frontend_path = Path(__file__).parent / "frontend" / "dist"

# 프론트엔드 라우팅 지원 (SPA용)
@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    # API 경로는 무시
    if full_path.startswith("api/"):
        return JSONResponse(status_code=404, content={"message": "API not found"})
        
    # 정적 파일 경로 확인
    file_path = frontend_path / full_path
    if file_path.is_file():
        return FileResponse(file_path)
    
    # 그 외의 경로는 index.html 반환
    index_path = frontend_path / "index.html"
    if index_path.exists():
        return FileResponse(index_path)
    
    return JSONResponse(status_code=404, content={"message": "index.html not found"})
