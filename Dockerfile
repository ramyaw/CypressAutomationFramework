
FROM docker.artifactory.healthpartners.com/platform-tools/hp-nodejs-server:latest

USER root

RUN apt-get -y install libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb

WORKDIR .
COPY src ./src

WORKDIR ./src

#ENV CYPRESS_INSTALL_BINARY=/opt/app-root/src/linux/cypress-linux.zip
ENV CYPRESS_INSTALL_BINARY=0

#RUN CYPRESS_INSTALL_BINARY=/src/linux/cypress-linux.zip npm install cypress
#RUN npm install
RUN npm ci

WORKDIR ./linux
RUN tar -xzvf Cypress.tar.gz

#ENTRYPOINT ["npm run start"]
CMD ["npm", "run", "start"]




