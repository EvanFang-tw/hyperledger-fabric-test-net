# basic environment
FROM node:8.17.0-stretch
WORKDIR /home/middleware
COPY package*.json ./
RUN npm install --only=production

COPY ./src ./src
EXPOSE 3000

# start service
CMD [ "npm", "start" ]
