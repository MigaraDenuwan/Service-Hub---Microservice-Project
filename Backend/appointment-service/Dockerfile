FROM node:18

# Install netcat and postgresql-client
RUN apt-get update && apt-get install -y netcat-traditional postgresql-client && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm install
# Copy app source last to leverage layer caching
COPY . .
RUN sed -i 's/\r$//' wait-for-postgres.sh && chmod +x wait-for-postgres.sh

EXPOSE 5002

# Explicitly use absolute path and disable node's default entrypoint if necessary
ENTRYPOINT ["/app/wait-for-postgres.sh"]
CMD ["node", "index.js"]
