#FROM node:6.9.2
#EXPOSE 8080
#COPY server.js .
#CMD node server.js

FROM centos

RUN yum -y install curl
RUN yum -y install epel-release
RUN curl --silent --location https://rpm.nodesource.com/setup_11.x | bash -
RUN yum -y install nodejs
RUN yum -y install gcc-c++ make

RUN echo -e "verifying nodejs installation"
RUN npm -v

COPY server.js .

EXPOSE 8080

ENTRYPOINT ["node", "server.js"]
