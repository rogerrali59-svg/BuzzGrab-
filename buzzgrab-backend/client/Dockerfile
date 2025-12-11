# Pull the Node image from Docker Hub
FROM node:20 

# Setting Working Directory
WORKDIR /buzzgrab-ui

# Copying only package.json
COPY package.json .

# Install Dependencies
RUN npm install 

# Copy rest of the code to container
COPY . .

RUN npm run build

EXPOSE 2315
CMD npm run start