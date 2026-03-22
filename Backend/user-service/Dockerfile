FROM eclipse-temurin:21-jdk
ARG JAR_FILE=target/*.jar
COPY ./target/user-service-1.0.0.jar app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]
EXPOSE 8082