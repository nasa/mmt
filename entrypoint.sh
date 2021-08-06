#!/usr/bin/env bash
set -Eeuo pipefail
# set -x # print each command before executing

if [ "$ENV" == "production" ]
then
  echo "Running migrations in production"
  bundle exec rake db:create db:migrate
else
  echo "Not running migrations in development"
fi

bundle exec puma -C config/puma.rb
