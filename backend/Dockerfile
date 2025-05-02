# -----------------------------------------------------------------------------
# Stage 1: Builder — compile & assemble with the Gradle wrapper
# -----------------------------------------------------------------------------
    FROM gradle:7.6-jdk17 AS builder

    # (Optional) who maintains this image
    LABEL maintainer="you@example.com"
    
    # Work inside /workspace
    WORKDIR /workspace
    
    # 1) Copy only the wrapper and config files first for efficient Docker caching
    COPY gradlew .
    COPY gradle ./gradle
    COPY build.gradle settings.gradle ./
    
    # 2) Download all project dependencies (this step will be cached until you
    #    change your build files)
    RUN ./gradlew --no-daemon dependencies || true
    
    # 3) Now copy the rest of your application sources
    COPY src ./src
    
    # 4) Build the Spring Boot “fat” JAR
    RUN ./gradlew --no-daemon clean bootJar
    
    # -----------------------------------------------------------------------------
    # Stage 2: Runtime — small JRE image to run your app
    # -----------------------------------------------------------------------------
    FROM eclipse-temurin:17-jre
    
    # 1) Set a working directory inside the container
    WORKDIR /app
    
    # 2) Default to the production profile so we don’t accidentally run in “dev”
    ENV SPRING_PROFILES_ACTIVE=prod
    
    # 3) Credentials for production Basic Auth (pick secure values in your CI/CD)
    #    In your production environment, you should supply these via secrets:
    ENV SPRING_USER=admin
    ENV SPRING_PASSWORD=
    
    # 4) MongoDB connection (override via Docker Compose or `docker run`):
    #    e.g. -e SPRING_DATA_MONGODB_URI=mongodb://mongo:27017/feedfusionai
    #    Note: the default dev URI lives in application-dev.properties and is never used here.
    ENV SPRING_DATA_MONGODB_URI=
    
    # 5) Expose the HTTP port your Spring Boot app will listen on
    EXPOSE 8080
    
    # 6) Copy the assembled JAR from the builder stage
    COPY --from=builder /workspace/build/libs/*.jar app.jar
    
    # 7) Finally, run your JAR
    ENTRYPOINT ["java","-jar","/app/app.jar"]