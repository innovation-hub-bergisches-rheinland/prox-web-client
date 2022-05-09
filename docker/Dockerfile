FROM node:16.13.2-alpine as deps
ENV NODE_ENV=production
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /usr/src/app/package.json
COPY package-lock.json /usr/src/app/package-lock.json
RUN npm ci --include=dev


#########################
### build environment ###
#########################

# base image
FROM node:16.13.2-alpine as builder
ENV NODE_ENV=production
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY --from=deps /usr/src/app/node_modules /usr/src/app/node_modules

# add app
COPY . /usr/src/app

# run tests
#RUN ng test --watch=false

# generate build
RUN npm run build:prod

##################
### production ###
##################

# base image
FROM nginx:1.21.5-alpine

COPY --from=builder /usr/src/app/dist/prox-web-client /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
