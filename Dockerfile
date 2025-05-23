# Dockerfile
FROM node:20-alpine

WORKDIR /app

# COPY package*.json ./

COPY . .

RUN yarn install


# RUN yarn build

CMD ["yarn", "start:dev"]
