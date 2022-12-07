#########
# Build #
#########
# openscad doesn't seems to work on Alpine Linux :(
# FROM docker.io/node:alpine as IMAGE
FROM docker.io/node:slim as IMAGE

# External deps (for node-gyp add: "python3 make g++")
# git is used to install the npm packages with git deps
RUN apt-get update &&\
	apt-get install openscad -y

# run as non root user
USER node

# go to user repository
WORKDIR /home/node

# Add package json
ADD --chown=node:node package.json package-lock.json ./

# install dependencies from package lock
RUN npm ci

# Add project files
ADD --chown=node:node . .

# build
RUN npm run build

RUN npm ci --omit=dev

# Expose port
EXPOSE 3000

# run it !
CMD ["npm", "run", "start"]
