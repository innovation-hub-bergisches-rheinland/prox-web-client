FROM nginx:1.21.0-alpine

COPY ./dist/prox-web-client /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]