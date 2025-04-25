# 빌드 단계
FROM node:18 AS build

WORKDIR /app

# 패키지 설치
COPY package*.json ./
RUN npm install

# 소스 복사
COPY tsconfig.json ./
COPY src ./src

# TypeScript 빌드
RUN npm run build

# 실행 단계
FROM node:18-slim

WORKDIR /app

# 빌드 결과 복사
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./

# 앱 실행 (빌드된 JS 실행)
CMD ["npm", "start"]