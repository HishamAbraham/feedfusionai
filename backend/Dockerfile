LABEL authors="hishamabraham"

# Stage 1: build
FROM gradle:7.6-jdk17 as builder
WORKDIR /home/gradle/project
COPY --chown=gradle:gradle . .
RUN gradle bootJar --no-daemon -x test

# Stage 2: runtime
FROM eclipse-temurin:17-jre-jammy
VOLUME /tmp
COPY --from=builder /home/gradle/project/build/libs/feedfusionai-backend-0.0.1-SNAPSHOT.jar /app/app.jar

# expose port
EXPOSE 8080

ENTRYPOINT ["java","-jar","/app/app.jar"]