FROM node:carbon

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 1335
#EXPOSE 1336
EXPOSE 1337

ENV NODE_ENV=production

CMD [ "npm", "run", "build"]
CMD [ "npm", "start"]