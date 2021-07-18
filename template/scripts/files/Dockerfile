FROM strapi/base
WORKDIR /usr/src/app
COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm run install
COPY . .
ENV NODE_ENV production
RUN nmp run build
EXPOSE 1337
CMD ["npm", "run start"]
