FROM node:8
WORKDIR /usr/src/app
COPY server/package*.json ./
RUN npm install

COPY ./server .
RUN find *
EXPOSE 8081

CMD ["npm", "start"]