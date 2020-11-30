#############
### build ###
#############

# base image
FROM node:12.16.1 as build

# set working directory
WORKDIR /app

# add /app/node_modules/.bin to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/package.json
RUN yarn install --network-timeout=300000

# add app
COPY . /app
RUN set NODE_OPTIONS=--max_old_space_size=4096
# generate build
RUN yarn build:ci --output-path=dist

############
### prod ###
############

# base image
FROM nginx:1.16.0-alpine
## Copy our default nginx config
COPY nginx/default.conf /etc/nginx/conf.d/

# copy artifact build from the 'build environment'
COPY --from=build /app/dist /usr/share/nginx/html

# expose port 80
EXPOSE 80

# run nginx
CMD ["nginx", "-g", "daemon off;"]
