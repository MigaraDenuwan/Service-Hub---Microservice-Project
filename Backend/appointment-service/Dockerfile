FROM node:18

# Install netcat and postgresql-client
RUN apt-get update && apt-get install -y netcat-traditional postgresql-client && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN chmod +x wait-for-postgres.sh
EXPOSE 5002

CMD ["./wait-for-postgres.sh", "--", "node", "index.js"]
