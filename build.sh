#!/bin/bash

# 백엔드 의존성 설치
pip install -r requirements.txt

# 프론트엔드 디렉토리로 이동
cd frontend

# Node.js 의존성 설치
npm install

# TypeScript 컴파일 실행
NODE_OPTIONS=--openssl-legacy-provider ./node_modules/.bin/tsc

# Vite 빌드 실행
NODE_OPTIONS=--openssl-legacy-provider ./node_modules/.bin/vite build

# 루트 디렉토리로 돌아가기
cd ..

echo "빌드 완료!" 