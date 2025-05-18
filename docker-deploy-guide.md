# Docker 自动部署指南

## 配置概述

本项目已配置了通过 GitHub Actions 自动构建 Docker 镜像并部署的功能。当代码推送到 GitHub 仓库的主分支（main 或 master）时，会自动触发构建流程。

## 文件说明

### Dockerfile

`Dockerfile` 定义了两个阶段的构建过程：
1. **构建阶段**：使用 Node.js 环境构建前端应用
2. **部署阶段**：使用 Nginx 作为静态资源服务器，将构建产物挂载到 Nginx 中

### nginx.conf

`nginx.conf` 配置了 Nginx 服务器，主要功能包括：
- 静态资源服务
- Gzip 压缩
- 静态资源缓存策略
- 支持前端路由（SPA 应用）

### GitHub Actions 工作流

`.github/workflows/docker-deploy.yml` 定义了自动化工作流程：
- 检出代码
- 设置 Docker Buildx
- 登录到 Docker Hub
- 构建并推送 Docker 镜像
- （可选）部署到服务器

## 使用前准备

在使用此自动部署功能前，需要在 GitHub 仓库中设置以下 Secrets：

1. `DOCKER_USERNAME` - Docker Hub 用户名
2. `DOCKER_PASSWORD` - Docker Hub 密码或访问令牌

如果需要自动部署到服务器，还需要添加：

1. `SERVER_HOST` - 服务器 IP 地址
2. `SERVER_USERNAME` - 服务器登录用户名
3. `SERVER_SSH_KEY` - 服务器 SSH 私钥

## 本地测试

在推送到 GitHub 前，可以在本地测试 Docker 构建：

```bash
# 构建镜像
docker build -t connectwise-frontend .

# 运行容器
docker run -d -p 8080:80 connectwise-frontend
```

访问 http://localhost:8080 查看应用。

## 注意事项

- 确保 `.dockerignore` 文件正确配置，排除不必要的文件
- 如果后端 API 地址发生变化，需要更新 webpack 配置中的环境变量
- 部署到生产环境前，建议先在测试环境验证