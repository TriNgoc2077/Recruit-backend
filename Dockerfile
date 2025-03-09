#Base image
FROM node:18-alpine

#Create app directory
WORKDIR /Backend/backend-nest

# a wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

#Install app dependencies
RUN npm install --legacy-peer-deps

RUN npm i -g @nestjs/cli

#bundle app source
COPY . . 

#Create a 'dist' folder with the production build
RUN npm run build

#Start the server using the production build
CMD ["node",  "dist/main.js"]