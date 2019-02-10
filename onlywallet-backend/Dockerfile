FROM centos
#FROM lionelman45/rhel7

RUN yum -y install curl
RUN yum -y install epel-release
RUN curl --silent --location https://rpm.nodesource.com/setup_11.x | bash -
RUN yum -y install nodejs
RUN yum -y install gcc-c++ make

RUN echo -e "verifying nodejs installation"
RUN npm -v

RUN mkdir -p $HOME/onlywallet

COPY . $HOME/onlywallet

EXPOSE 3000

WORKDIR $HOME/onlywallet
ENTRYPOINT ["node", "app.js"]
