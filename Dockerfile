FROM ubuntu

RUN apt-get -y update && \
  apt-get -y install python ruby \
    openjdk-8-jdk \
    git build-essential ruby-dev \
    zlib1g-dev libxml2-dev && \
  gem install bundler

WORKDIR /website

ENTRYPOINT [ "make" ]
