# 📅 Asyncschedule  
Asyncschedule는 팀원 간의 효율적인 일정 공유를 위한 플랫폼입니다. 이 애플리케이션은 사용자들이 개인 일정을 등록하고, 팀원들과 공유하며, 공동의 일정을 조율할 수 있도록 도와줍니다.

# 🛠️ 기술 스택  
프론트엔드: HTML, CSS, JavaScript, TypeScript

백엔드: Java (Spring Boot)

CI/CD: GitHub Actions​

# 📁 프로젝트 구조
```bash
Asyncschedule/
├── .github/
│   └── workflows/        # GitHub Actions 워크플로우 파일
├── be/                   # 백엔드(Spring Boot) 소스 코드
├── fe/                   # 프론트엔드 소스 코드
├── .gitignore
└── README.md
```
# 🚀 시작하기
## 1. 백엔드 실행
```bash
cd be
./gradlew bootRun
```

## 2. 프론트엔드 실행
```bash
cd fe
npm install
npm start
```
# 🔧 CI/CD 설정  
이 프로젝트는 GitHub Actions를 사용하여 CI/CD 파이프라인을 구성하였습니다. develop 브랜치에 푸시될 때마다 자동으로 빌드 및 배포가 진행됩니다.  

# 📄 라이선스
이 프로젝트는 MIT 라이선스를 따릅니다. 자세한 내용은 LICENSE 파일을 참고하세요.
