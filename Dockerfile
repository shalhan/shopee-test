FROM node:8

#Create app directory
WORKDIR /usr/src/app
#Copy app dependencies
COPY package*.json ./

RUN npm install

#Bundle app source
COPY . .
#Listening
EXPOSE 8080
#RUN NPM
CMD ["npm", "start"]
