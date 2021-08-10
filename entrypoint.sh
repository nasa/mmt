#!/usr/bin/env bash
set -Eeuo pipefail
set -x # print each command before executing

echo "Running migrations..."
PGPASSWORD=${POSTGRES_PASSWORD} psql -h ${DATABASE_HOST} -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = '${DATABASE_NAME}'" | grep -q 1 || \
  PGPASSWORD=${POSTGRES_PASSWORD} psql -h ${DATABASE_HOST} -U postgres -c "CREATE DATABASE ${DATABASE_NAME}"
PGPASSWORD=${POSTGRES_PASSWORD} psql -h ${DATABASE_HOST} -U postgres -v ON_ERROR_STOP=1 \
  -c "CREATE USER ${DATABASE_USERNAME} WITH PASSWORD '${DATABASE_PASSWORD}';" || true # will fail if already exists 
PGPASSWORD=${POSTGRES_PASSWORD} psql -h ${DATABASE_HOST} -U postgres -v ON_ERROR_STOP=1 \
  -c "GRANT ALL PRIVILEGES ON DATABASE ${DATABASE_NAME} TO ${DATABASE_USERNAME};"
PGPASSWORD=${POSTGRES_PASSWORD} psql -h ${DATABASE_HOST} -U postgres -v ON_ERROR_STOP=1 \
  -c "ALTER USER ${DATABASE_USERNAME} CREATEDB;"

echo "Running migrations..."
bundle exec rake db:create db:migrate

echo "Running application..."
bundle exec puma -C config/puma.rb
