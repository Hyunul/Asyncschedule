# Asyncschedule

Asyncschedule는 팀원 간의 효율적인 일정 공유 및 모임 추천을 위한 **비동기 스케줄링 플랫폼**입니다. 사용자는 개인 근무 일정을 등록하고, 팀원들과 공유된 일정 차트에서 퇴근 시간이 겹치는 최적의 모임 시간을 자동으로 탐색할 수 있습니다. 또한, 추천된 일정은 Discord 봇을 통해 손쉽게 배포됩니다.

## 주요 기능

- **개인 일정 등록 및 공유**: 웹 UI에서 개인 근무 일정을 입력하고 팀원과 실시간으로 공유합니다.
- **모임 시간 추천**: 직장인들의 퇴근 시간(일반적으로 오후 7시~9시)에 겹치는 일정을 자동으로 감지하여 차트에서 강조 표시합니다.
- **Discord 봇 연동**: `!일정 <사용자명>` 명령어로 추천 일정을 Discord 채널에 배포하여 별도 확인 없이 모임을 관리할 수 있습니다.
- **Docker Compose 기반 배포**: 백엔드, 프론트엔드, 봇 서비스를 한 번에 로컬 및 서버 환경에 쉽게 배포합니다.

## 기술 스택

- **Backend**: Java, Spring Boot, JPA
- **Frontend**: React (Create React App), TypeScript
- **Bot**: Node.js, Discord.js
- **Deployment**: Docker, Docker Compose

## 아키텍처

```
+----------------+        +-----------+        +-------------+
|   Frontend     | <----> |  Backend  | <----> |  Database   |
| (React + TS)   |  REST  | (Spring   |        | (JPA)       |
+----------------+  API   | Boot)     |        +-------------+
       |                      |
       v                      v
 +-------------+         +-------------+
 |  Docker     |         |  Discord    |
 | Compose     |         |   Bot       |
 +-------------+         +-------------+
```

## 설치 및 실행

1. 저장소를 클론합니다.

   ```bash
   git clone https://github.com/Hyunul/Asyncschedule.git
   cd Asyncschedule
   ```

2. 환경변수를 설정합니다.

   - 루트 디렉터리에 `.env` 파일을 생성하고, Discord 봇 토큰을 추가합니다.
     ```ini
     DISCORD_TOKEN=your_discord_bot_token
     ```

3. Docker Compose로 모든 서비스를 빌드하고 실행합니다.

   ```bash
   docker-compose up --build
   ```

4. 웹 브라우저에서 프론트엔드 애플리케이션을 확인합니다.

   ```
   http://localhost:3000
   ```

5. Discord 채널에서 `!일정 <username>` 명령어를 입력하여 추천 일정을 확인합니다.

## 디렉터리 구조

```
Asyncschedule/
├── .github/              # GitHub Actions 워크플로우
├── be/                   # Spring Boot 백엔드 소스 코드
├── fe/                   # React 프론트엔드 소스 코드
├── bot/                  # Discord 봇 소스 코드
├── .gitignore
├── docker-compose.yml
└── README.md             # 프로젝트 소개 및 실행 가이드
```

## 기여

1. Fork 이슈를 생성합니다.
2. 브랜치를 분기(`feature/your-feature`)합니다.
3. 변경사항을 커밋합니다.
4. Pull Request를 생성하여 검토를 요청합니다.

## 라이선스

이 프로젝트는 **BSD 3-Clause License** 하에 배포됩니다. 자세한 내용은 `be/LICENSE` 파일을 참고하세요.

