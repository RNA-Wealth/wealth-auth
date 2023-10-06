 FROM node:18-alpine3.18
 WORKDIR /usr/src/app
 COPY . .
 RUN apk --no-cache add curl
 RUN apk --no-cache add --virtual builds-deps build-base python3
 RUN npm ci --ignore-scripts
 RUN npm run build
 ENV NODE_ENV production
 RUN npm ci --only=production --ignore-scripts
 RUN npm rebuild bcrypt --build-from-source
 USER node
 CMD [ "node", "dist/main.js" ]