#!/bin/bash

# 停止并移除已存在的容器
docker stop conwise-nginx-prod || true
docker rm conwise-nginx-prod || true

# 创建日志目录
mkdir -p $(pwd)/logs/nginx

# 运行新的Nginx容器
docker run -d \
  --name conwise-nginx-prod \
  -p 80:80 \
  -v $(pwd)/nginx-prod.conf:/etc/nginx/conf.d/default.conf \
  -v $(pwd)/logs/nginx:/var/log/nginx \
  -v $(pwd)/../dist:/usr/share/nginx/html \
  --add-host=host.docker.internal:host-gateway \
  nginx:latest

echo "Nginx生产环境容器已启动，访问 http://localhost"