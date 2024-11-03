# sudo docker build -t fawazsullialabs/roam-eazy-api:0.0.1 .
# sudo docker push fawazsullialabs/roam-eazy-api:0.0.1 .


FROM node:18

# Set the working directory
WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 9005

CMD ["yarn", "run", "start"]