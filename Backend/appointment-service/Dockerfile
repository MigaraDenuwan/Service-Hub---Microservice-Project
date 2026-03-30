FROM node:18

WORKDIR /app
COPY package*.json ./
RUN npm install

# Copy app source last to leverage layer caching
COPY . .

EXPOSE 5002

CMD ["npm", "start"]
