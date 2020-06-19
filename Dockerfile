FROM node:10.21.0-jessie

WORKDIR /usr/src/app

COPY package.json ./

COPY . .

RUN npm install 

CMD ["node", "src/index.js"]
