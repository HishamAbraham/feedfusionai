# Stage 1: compile and package
FROM maven:3.8.7-eclipse-temurin-17 AS build
WORKDIR /workspace
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: runtime image
FROM eclipse-temurin:17-jre
LABEL authors="hishamabraham"
WORKDIR /app
# copy the fat jar from the build stage
COPY --from=build /workspace/target/feedfusionai-backend-*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]