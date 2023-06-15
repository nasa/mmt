#This image provides the ability to run Ruby/RSpec tests against a Clojure app.
# To build:
# sudo docker build --rm --force-rm --tag=$(basename $(pwd)) .

FROM centos:centos7

USER root
# Get java, epel, whatnot
RUN yum install -y epel-release centos-release-scl-rh llvm-toolset-7-clang \
 && yum --enablerepo=updates clean metadata \
 && yum install -y bzip2 \
    		   chromedriver \
                   cmake \
                  https://dl.google.com/linux/direct/google-chrome-stable_current_x86_64.rpm \
		  https://download.postgresql.org/pub/repos/yum/reporpms/EL-7-x86_64/pgdg-redhat-repo-latest.noarch.rpm \
                   git \
                   gcc \
                   gcc-c++ \
                   ImageMagick \
		   java-11-openjdk-headless.x86_64 \
                   liberation-fonts \
                   libffi-devel \
                   libicu-devel \
                   libxml2-devel \
                   make \
                   openssl-devel \
                   readline-devel \
                   sqlite-devel \
                   tar \
                   which \
                   xorg-x11-server-Xvfb \
                   docker \
 && yum clean all
# && freshclam

RUN curl -sL https://rpm.nodesource.com/setup_16.x | bash -
RUN yum install -y nodejs && yum clean all
RUN npm install --global yarn

ENV JAVA_HOME /etc/alternatives/jre

# Install Ruby from source
WORKDIR /
RUN curl -OL https://cache.ruby-lang.org/pub/ruby/3.0/ruby-3.0.6.tar.gz \
 && tar -xzf ruby-3.0.6.tar.gz \
 && rm ruby-3.0.6.tar.gz \
 && cd /ruby-3.0.6 \
 && ./configure --disable-install-doc \
 && make -j $(nproc) \
 && make install \
 && cd / \
 && rm -fr ruby-3.0.6

ENV PATH /usr/pgsql-11/bin:$PATH
RUN gem install bundler 
RUN groupadd -g 500 bamboo
RUN useradd --gid bamboo --create-home --uid 500 bamboo
RUN yum install -y postgresql11-devel

USER bamboo
WORKDIR /build
ENV HOME /home/bamboo
ENV PATH /home/bamboo/.gem/ruby/3.0.6/bin:/opt/google/chrome/:$PATH
RUN gem install rspec --version=3.9 --user-install
USER root