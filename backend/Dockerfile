# Stage 1: build with Gradle
FROM gradle:7.6-jdk17 AS build
WORKDIR /workspace

# copy only the wrapper and build files first (for caching)
COPY gradlew .
COPY gradle ./gradle
COPY build.gradle settings.gradle ./

# download dependencies
RUN ./gradlew --no-daemon dependencies || true

# now copy the rest of the code & assemble
COPY . .
RUN ./gradlew --no-daemon clean bootJar

# Stage 2: runtime image
FROM eclipse-temurin:17-jre
WORKDIR /app

# pull in the fat JAR produced by Spring Boot
COPY --from=build /workspace/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]