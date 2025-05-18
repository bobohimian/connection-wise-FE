#!/bin/bash
docker stop connectwise-nginx-dev || true
docker rm connectwise-nginx-dev || true
docker run -d\
  --name connectwise-nginx-dev \
  -p 80:80 \
  -v $(pwd)/nginx-dev.conf:/etc/nginx/conf.d/default.conf \
  -v $(pwd)/logs/nginx:/var/log/nginx \
  nginx:latest