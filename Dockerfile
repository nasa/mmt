# This image provides the ability to run Ruby/RSpec tests against a Clojure app.
# To build:
# sudo docker build --rm --force-rm --tag=$(basename $(pwd)) .

FROM centos:centos7

# Get java, epel, whatnot
RUN yum install -y epel-release \
                  https://rpm.nodesource.com/pub_8.x/el/7/x86_64/nodesource-release-el7-1.noarch.rpm \
                  https://download.postgresql.org/pub/repos/yum/9.6/redhat/rhel-7-x86_64/pgdg-redhat-repo-latest.noarch.rpm \
 && yum --enablerepo=updates clean metadata \
 && yum install -y bzip2 \
                   chromedriver \
#                   clamav \
                   cmake \
                   gcc \
                   gcc-c++ \
                   git \
                   https://dl.google.com/linux/direct/google-chrome-stable_current_x86_64.rpm \
                   ImageMagick \
                   java-1.8.0-openjdk-headless.x86_64 \
                   liberation-fonts \
                   libffi-devel \
                   libicu-devel \
                   libxml2-devel \
                   make \
                   nodejs \
                   openssl-devel \
                   postgresql96-devel \
                   readline-devel \
                   sqlite-devel \
                   tar \
                   which \
                   xorg-x11-server-Xvfb \
                   yarn \
 && yum install -y  \
  tmux \
  tree \
  zsh \
 && yum clean all #\  #add in if you plan to run clamav
# && freshclam        #add in if you plan to run clamav

ENV JAVA_HOME /etc/alternatives/jre

# Install Ruby from source
WORKDIR /
RUN curl -OL https://cache.ruby-lang.org/pub/ruby/2.7/ruby-2.7.2.tar.gz \
 && tar -xzf ruby-2.7.2.tar.gz \
 && rm ruby-2.7.2.tar.gz \
 && cd /ruby-2.7.2 \
 && ./configure --disable-install-doc \
 && make -j $(nproc) \
 && make install \
 && cd / \
 && rm -fr ruby-2.7.2

RUN gem update --system 3.1.4

RUN groupadd -g 500 bamboo
RUN useradd --gid bamboo --create-home --uid 500 bamboo

ENV PATH /build/bin:/usr/pgsql-9.6/bin:/opt/google/chrome:$PATH

USER bamboo
WORKDIR /build

COPY bashrc.env /home/bamboo/bashrc.env
RUN echo "source /home/bamboo/bashrc.env" >> /home/bamboo/.bashrc
