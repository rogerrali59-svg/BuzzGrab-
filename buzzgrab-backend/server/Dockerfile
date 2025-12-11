FROM node:20

# Create app directory
WORKDIR /buzzgrab-api

COPY package.json ./

RUN npm i -f

# Bundle app source
COPY . .

EXPOSE 2316

RUN  npm run swagger

CMD [ "npm", "start" ] 

