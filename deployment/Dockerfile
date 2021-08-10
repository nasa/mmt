FROM ruby:2.7.2

RUN apt-get update -qq && apt-get install -y build-essential libpq-dev nodejs npm postgresql-client

# Set an environment variable where the Rails app is installed to inside of Docker image
ENV RAILS_ROOT /var/www/mmt
RUN mkdir -p $RAILS_ROOT

# Set working directory
WORKDIR $RAILS_ROOT

# Build layers with only dependencies, so they cache
COPY Gemfile Gemfile
COPY Gemfile.lock Gemfile.lock
RUN bundle install --jobs 20 --retry 5

# Adding project files
COPY . .
COPY config/database.yml.maap config/database.yml
RUN chmod u+x entrypoint.sh

RUN npm install -g yarn
RUN bundle exec rake assets:precompile

EXPOSE 3000

CMD ./entrypoint.sh
