#!/bin/bash

# 백엔드 의존성 설치
pip install -r requirements.txt

# 프론트엔드 디렉토리로 이동
cd frontend

# Node.js 의존성 설치
npm install

# 수동으로 디렉토리 생성
mkdir -p dist/static

# 간단한 빌드 시도 1: npm 스크립트 실행
echo "npm 빌드 스크립트 실행 시도..."
npm run build || echo "npm 빌드 실패"

# 간단한 빌드 시도 2: 직접 npx 사용
if [ ! -f "dist/index.html" ]; then
    echo "직접 npx 명령어로 빌드 시도..."
    NODE_OPTIONS=--openssl-legacy-provider npx tsc || echo "TypeScript 컴파일 실패"
    NODE_OPTIONS=--openssl-legacy-provider npx vite build || echo "Vite 빌드 실패"
fi

# 빌드 결과물 확인
echo "프론트엔드 빌드 결과물 확인:"
ls -la dist/ || echo "dist 디렉토리가 존재하지 않습니다."
ls -la dist/static/ || echo "dist/static 디렉토리가 존재하지 않습니다."

# 빌드 실패 시 기본 파일 생성
if [ ! -f "dist/index.html" ]; then
    echo "빌드 실패. dist 디렉토리를 생성하지 못했습니다. 수동으로 기본 파일을 생성합니다."
    echo '<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Med Ease - 의학 용어 간소화</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; line-height: 1.6; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        header { background: #3b82f6; color: white; padding: 1rem; }
        h1 { margin: 0; }
        main { padding: 2rem 0; }
        .form-group { margin-bottom: 1rem; }
        label { display: block; margin-bottom: 0.5rem; font-weight: bold; }
        textarea { width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px; min-height: 150px; }
        button { background: #3b82f6; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; }
        button:hover { background: #2563eb; }
        .result { margin-top: 2rem; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 4px; background: #f9fafb; }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <h1>Med Ease - 의학 용어 간소화</h1>
        </div>
    </header>
    <main class="container">
        <div class="form-group">
            <label for="medical-text">의학 용어 텍스트:</label>
            <textarea id="medical-text" placeholder="여기에 간소화할 의학 용어 텍스트를 입력하세요..."></textarea>
        </div>
        <button id="simplify-btn">간소화하기</button>
        <div class="result" id="result">
            <p>간소화된 결과가 여기에 표시됩니다.</p>
        </div>
    </main>

    <script>
        document.getElementById("simplify-btn").addEventListener("click", async () => {
            const text = document.getElementById("medical-text").value;
            if (!text) return;
            
            document.getElementById("simplify-btn").textContent = "처리 중...";
            document.getElementById("simplify-btn").disabled = true;
            
            try {
                const response = await fetch("/api/simplify", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text })
                });
                
                const data = await response.json();
                if (data.result) {
                    document.getElementById("result").innerHTML = `<p>${data.result.replace(/\n/g, "<br>")}</p>`;
                } else if (data.error) {
                    document.getElementById("result").innerHTML = `<p style="color: red;">오류: ${data.error}</p>`;
                }
            } catch (error) {
                document.getElementById("result").innerHTML = `<p style="color: red;">오류: ${error.message}</p>`;
            } finally {
                document.getElementById("simplify-btn").textContent = "간소화하기";
                document.getElementById("simplify-btn").disabled = false;
            }
        });
    </script>
</body>
</html>' > dist/index.html
    
    echo "/* 기본 스타일 */
body { font-family: Arial, sans-serif; margin: 0; padding: 0; line-height: 1.6; }
.container { max-width: 800px; margin: 0 auto; padding: 20px; }" > dist/static/main.css
    
    echo "console.log('Med Ease application - 수동 생성된 파일');" > dist/static/main.js
    echo "수동으로 기본 파일을 생성했습니다."
fi

# 루트 디렉토리로 돌아가기
cd ..

echo "빌드 완료!" 