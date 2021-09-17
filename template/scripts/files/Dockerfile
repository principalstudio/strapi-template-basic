FROM strapi/base
WORKDIR /usr/src/app
COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm ci
COPY . .
ENV NODE_ENV production
RUN npm run build
EXPOSE 1337
CMD bash -c "npm run strapi config:restore -- -f dump.json && npm start"
