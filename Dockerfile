FROM quay.io/centos/centos:stream8
USER root

# Setup mirror list and install base packages
RUN cd /etc/yum.repos.d/ && \
    sed -i 's/mirrorlist/#mirrorlist/g' /etc/yum.repos.d/CentOS-* && \
    sed -i 's|#baseurl=http://mirror.centos.org|baseurl=http://vault.centos.org|g' /etc/yum.repos.d/CentOS-* && \
    dnf -y install epel-release dnf-plugins-core && \
    dnf -y install https://download.postgresql.org/pub/repos/yum/reporpms/EL-8-x86_64/pgdg-redhat-repo-latest.noarch.rpm && \
    dnf -y module disable postgresql && \
    dnf -y config-manager --set-enabled powertools && \
    dnf clean all && dnf makecache

# Install development tools and other necessary packages
RUN dnf -y groupinstall "Development Tools" && \
    dnf -y install \
    bzip2 cmake chromedriver git gcc gcc-c++ \
    ImageMagick java-11-openjdk-headless.x86_64 \
    liberation-fonts libffi-devel libicu-devel libxml2-devel \
    make openssl-devel readline-devel sqlite-devel \
    tar which xorg-x11-server-Xvfb docker \
    llvm-toolset clang-devel llvm-devel perl-IPC-Run && \
    dnf clean all

# Install Google Chrome
RUN dnf -y install https://dl.google.com/linux/direct/google-chrome-stable_current_x86_64.rpm

# Setup Node v18 and Yarn
RUN curl -fsSL https://rpm.nodesource.com/setup_18.x | bash - && \
    curl -sL https://dl.yarnpkg.com/rpm/yarn.repo | tee /etc/yum.repos.d/yarn.repo && \
    dnf -y install nodejs yarn && \
    dnf clean all

ENV JAVA_HOME /etc/alternatives/jre

# Install Ruby from source
WORKDIR /
RUN curl -OL https://cache.ruby-lang.org/pub/ruby/3.0/ruby-3.0.7.tar.gz && \
    tar -xzf ruby-3.0.7.tar.gz && \
    rm ruby-3.0.7.tar.gz && \
    cd /ruby-3.0.7 && \
    ./configure --enable-shared --disable-install-doc && \
    make -j $(nproc) && \
    make install && \
    cd / && \
    rm -fr ruby-3.0.7

# Install PostgreSQL
RUN dnf -y install postgresql14-server postgresql14 postgresql14-devel && \
    dnf clean all

# Setup environment and install gems
ENV PATH=/home/bamboo/.gem/ruby/3.0.7/bin:/usr/pgsql-11/bin:/opt/google/chrome/:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
RUN gem install bundler:2.2.33 rspec:3.12 debase:0.2.5.beta2 --user-install

# Setup bamboo user
RUN groupadd -g 500 bamboo && \
    useradd --gid bamboo --create-home --uid 500 bamboo

# Setup final environment
USER bamboo
WORKDIR /build
ENV HOME /home/bamboo
ENV NODE_OPTIONS --openssl-legacy-provider
