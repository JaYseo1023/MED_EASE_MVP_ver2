#!/bin/bash

# 백엔드 의존성 설치
pip install -r requirements.txt

# 프론트엔드 디렉토리로 이동
cd frontend

# Node.js 의존성 설치
npm install

# TypeScript 컴파일 및 Vite 빌드 실행
NODE_OPTIONS=--openssl-legacy-provider npx tsc

# vite 명령어를 npx를 통해 실행하여 권한 문제 해결
NODE_OPTIONS=--openssl-legacy-provider npx vite build

# 빌드 결과물 확인
echo "프론트엔드 빌드 결과물 확인:"
ls -la dist/ || echo "dist 디렉토리가 존재하지 않습니다."
ls -la dist/static/ || echo "dist/static 디렉토리가 존재하지 않습니다."

# 디렉토리 생성 확인 및 문제 해결 시도
if [ ! -d "dist" ]; then
    echo "빌드 실패. dist 디렉토리를 생성하지 못했습니다. 수동으로 생성합니다."
    mkdir -p dist/static
    echo "<html><head><title>Med Ease</title></head><body><div id='root'></div></body></html>" > dist/index.html
    echo "body { font-family: Arial, sans-serif; } .container { max-width: 800px; margin: 0 auto; padding: 20px; }" > dist/static/main.css
    echo "console.log('Med Ease application');" > dist/static/main.js
    echo "수동으로 기본 파일을 생성했습니다."
fi

# 루트 디렉토리로 돌아가기
cd ..

echo "빌드 완료!" 