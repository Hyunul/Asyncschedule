# 1단계: Gradle 빌드 환경
FROM gradle:8.5-jdk17 AS build
WORKDIR /app

# 의존성 캐싱을 위한 최소 파일 복사
COPY build.gradle settings.gradle ./
COPY gradle ./gradle
RUN gradle build -x test --no-daemon || return 0

# 전체 프로젝트 복사 후 실제 빌드
COPY . .
RUN gradle bootJar -x test --no-daemon

# 2단계: 실행 환경
FROM openjdk:17-jdk-slim
WORKDIR /app
VOLUME /tmp

# 빌드된 JAR 파일 복사
COPY --from=build /app/build/libs/*.jar app.jar

# 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "app.jar"]