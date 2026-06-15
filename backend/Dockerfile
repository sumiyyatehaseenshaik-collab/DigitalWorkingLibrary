FROM maven:3.9.8-eclipse-temurin-21

WORKDIR /app

COPY . .

RUN mvn clean package -DskipTests

EXPOSE 9696

CMD ["java","-jar","target/*.jar"]