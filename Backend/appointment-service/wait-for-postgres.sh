#!/bin/bash

echo "Waiting for Postgres to be ready..."

until pg_isready -h postgres -p 5432; do
  echo "Postgres is unavailable - sleeping"
  sleep 2
done

echo "Postgres is up - starting service"
exec "$@"
