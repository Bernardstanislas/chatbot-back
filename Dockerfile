FROM node:12

COPY . /app/chatbot-back

WORKDIR /app/chatbot-back

RUN npm install
RUN npm run build
