#!/bin/bash

# 백엔드 의존성 설치
pip install -r requirements.txt

# 프론트엔드 디렉토리로 이동
cd frontend

# Node.js 의존성 설치
npm install

# TypeScript 컴파일 및 Vite 빌드 실행
NODE_OPTIONS=--openssl-legacy-provider npx tsc
NODE_OPTIONS=--openssl-legacy-provider npx vite build

# 빌드 결과물 확인
echo "프론트엔드 빌드 결과물 확인:"
ls -la dist/
ls -la dist/static/

# 루트 디렉토리로 돌아가기
cd ..

echo "빌드 완료!" 