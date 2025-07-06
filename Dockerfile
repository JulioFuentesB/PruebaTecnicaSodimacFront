FROM node:14.21.3 as build
LABEL stage=builder

WORKDIR front
COPY package*.json ./
RUN npm i
COPY . .
RUN npm run {{Project.Environment}}


FROM nginx:stable-alpine

#ADD PERMISES
RUN chgrp -R 0 /etc/nginx /var/cache/nginx /var/run && \
chmod -R g=u /etc/nginx /var/cache/nginx /var/run

#REMOVE AND COPY NEW CUSTOM CONF TO NGINX
RUN rm /etc/nginx/conf.d/default.conf

#REMOVE INDEX
RUN rm /usr/share/nginx/html/index.html
RUN rm /usr/share/nginx/html/50x.html

#COPY PRODUCTION FILES TO NGINX SERVERE
COPY --from=build /front/dist /usr/share/nginx/html
COPY config/nginx.conf /etc/nginx/conf.d/default.conf

#COPY PRODUCTION FILES TO NGINX SERVERE
EXPOSE 8080
USER 1001
ENTRYPOINT ["nginx", "-g", "daemon off;"]
