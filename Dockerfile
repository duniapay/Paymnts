FROM node:14-alpine

# Install PM2
RUN npm install -g pm2

# Set working directory
RUN mkdir -p /var/www/paymnts
WORKDIR /var/www/paymnts

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /var/www/paymnts/node_modules/.bin:$PATH
# create user with no password
RUN adduser --disabled-password demo

# Copy existing application directory contents
COPY . /var/www/paymnts
# install and cache app dependencies
COPY package.json /var/www/paymnts/package.json
COPY package-lock.json /var/www/paymnts/package-lock.json

# grant a permission to the application
RUN chown -R demo:demo /var/www/paymnts
USER demo

# clear application caching
RUN npm cache clean --force
# install all dependencies
RUN npm install


EXPOSE 3003
# start run in production environment

#CMD [ "npm", "run", "pm2:delete" ]
#CMD [ "npm", "run", "build-docker:dev" ]

# start run in development environment
CMD [ "npm", "run", "start:dev" ]