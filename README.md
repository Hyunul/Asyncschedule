# Asyncschedule

**Asyncschedule**은 팀 간의 효율적인 일정 공유 및 협업을 위한 플랫폼입니다.  
사용자는 개인 일정을 등록하고 팀원들과 공유하며, 공동의 일정을 조율할 수 있습니다.

---

## 📌 주요 기능

- ✅ **일정 등록 및 수정**  
  개인 일정을 쉽고 빠르게 생성하고 편집할 수 있습니다.


- 📅 **차트 UI 기반 일정 보기**  
  주간 뷰를 제공하여 시각적으로 일정을 관리할 수 있습니다.

- 👥 **팀 일정 공유 및 추천 모임 일정 제공**  
  팀에 속한 멤버들이 자신의 일정을 공유할 수 있고, 그룹장이 설정한 조건에 따라 추천 모임 일정을 제공합니다.
  
- 🤖 **Discord 봇 연동**  
  Discord 봇과 연동하여 채팅창 내에서 명령어를 통해 간단히 추천 모임 일정을 제공받을 수 있습니다.

- 🔔 **알림 기능 (예정)**  
  중요한 일정이 다가오면 알림을 받을 수 있도록 설계 예정입니다.
  
## 🛠 기술 스택

- **Frontend**: TypeScript (React)
- **Backend**: Java (Spring Boot)
- **CI/CD**: GitHub Actions
- **컨테이너 오케스트레이션**: Docker Compose

---

## 📁 프로젝트 구조

```
Asyncschedule/
├── .github/              # GitHub Actions 워크플로우
│   └── workflows/
├── .vscode/              # VSCode 설정
├── be/                   # 백엔드 (Spring Boot)
├── fe/                   # 프론트엔드 (React 또는 기타)
├── bot/                  # 봇 서비스 (선택 사항)
├── docker-compose.yml    # 전체 서비스 구성
└── README.md
```

---

## 🚀 시작하기

### 1. 백엔드 실행 (Spring Boot)

```bash
cd be
./gradlew bootRun
```

### 2. 프론트엔드 실행

```bash
cd fe
npm install
npm start
```

### 3. 전체 서비스 Docker Compose로 실행

```bash
docker-compose up --build
```

---

## ⚙️ CI/CD

- `main` 브랜치에 변경 사항(commit)이 감지되면 GitHub Actions에 의해 자동으로 빌드 및 배포를 수행합니다.
- CI 설정은 `.github/workflows/` 폴더 내에 정의되어 있습니다.

---

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.  
자세한 내용은 `LICENSE` 파일을 참조하세요.
