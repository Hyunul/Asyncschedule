# Asyncschedule 📅

**Asyncschedule**은 비동기적으로 입력된 팀원들의 일정을 분석하여 최적의 모임 시간을 찾아주는 협업 스케줄링 플랫폼입니다. 서로 다른 개인 일정을 동기화하고, 최적의 합의점을 지능적으로 추천합니다.

---

## 📌 주요 기능

- ✅ **일정 등록 및 수정**: 개인 일정을 직관적인 UI를 통해 빠르게 관리합니다.
- 📅 **주간 차트 뷰**: 주간 단위의 시각화된 일정표를 통해 팀 전체의 가용 시간을 한눈에 파악합니다.
- 👥 **지능형 일정 추천**: 그룹원이 설정한 조건(예: 저녁 19시~21시 사이)에 부합하는 최적의 모임 시간을 자동 추천합니다.
- 🤖 **Discord 봇 연동**: 웹 앱에 접속하지 않아도 디스코드 명령어를 통해 즉시 추천 일정을 확인합니다.
- 🔔 **알림 기능 (예정)**: 중요 일정 및 팀 모임 확정 시 자동 알림을 제공할 예정입니다.

## 🛠 기술 스택

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Java 17, Spring Boot, MyBatis, JPA
- **Database**: MySQL 8.0, Redis (Caching)
- **CI/CD**: GitHub Actions
- **Infrastructure**: Docker, Docker Compose

---

## 📁 프로젝트 구조

```
Asyncschedule/
├── be/                   # 백엔드 (Spring Boot API Server)
├── fe/                   # 프론트엔드 (React Web App)
├── bot/                  # Discord Bot (Node.js)
├── docker-compose.yml    # 전체 인프라 구성 (FE, BE, DB, Redis, Bot)
└── README.md
```

---

## 🚀 시작하기 (Docker)

Docker Compose를 사용하면 DB, Redis를 포함한 모든 환경을 한 번에 실행할 수 있습니다.

### 1. 환경 변수 설정
루트 디렉토리에 `.env` 파일을 생성하고 Discord 봇 토큰을 설정합니다. (봇 미사용 시 생략 가능)
```env
DISCORD_TOKEN=your_discord_bot_token_here
```

### 2. 전체 서비스 실행
```bash
docker-compose up --build
```
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8080](http://localhost:8080)

---

## 💻 로컬 개발 환경 실행

### 백엔드 (Java 17 이상 필요)
```bash
cd be
./gradlew bootRun
```

### 프론트엔드 (Node.js 18 이상 필요)
```bash
cd fe
npm install
npm start
```

---

## ⚙️ CI/CD

- `main` 브랜치에 푸시하면 GitHub Actions를 통해 자동 빌드 및 테스트가 수행됩니다.
- 설정 파일: `.github/workflows/CICD.yml`

---

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.