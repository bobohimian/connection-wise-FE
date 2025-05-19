# Nginx 生产环境配置

这个目录包含了用于在Docker容器中运行Nginx的生产环境配置，用于模拟生产服务器环境，将前端静态资源通过Nginx提供服务，并将API请求代理到后端服务。

## 文件说明

- `nginx-prod.conf`: Nginx的配置文件，包含了静态资源服务、API代理、WebSocket支持等配置
- `pull-nginx.sh`: 拉取最新的Nginx Docker镜像
- `run-nginx-prod.sh`: 启动Nginx容器的脚本

## 使用方法

### 前提条件

1. 已安装Docker
2. 已构建前端项目（在`../dist`目录下有构建好的静态文件）
3. 后端服务运行在本地的8080端口

### 步骤

1. 拉取最新的Nginx镜像：

```bash
chmod +x pull-nginx.sh
./pull-nginx.sh
```

2. 启动Nginx容器：

```bash
chmod +x run-nginx-prod.sh
./run-nginx-prod.sh
```

启动后，可以通过 http://localhost:8080 访问应用。

## 配置说明

- 静态资源：前端构建的静态文件从`../dist`目录挂载到容器的`/usr/share/nginx/html`
- API代理：所有`/api/`开头的请求会被代理到`http://host.docker.internal:8080`
- WebSocket支持：`/api/ws/`路径配置了WebSocket代理
- Minio代理：`/minio/`路径配置了对象存储服务的代理

## 与开发环境的区别

与开发环境（nginx_dev）的主要区别：

1. 开发环境将前端请求代理到webpack devserver（端口3000）
2. 生产环境直接提供静态文件服务，不依赖devserver
3. 生产环境启用了静态资源缓存
4. 生产环境容器使用8080端口，避免与开发环境冲突

## 服务器部署参考

实际部署到服务器时，可以参考此配置，主要需要修改：

1. 将`host.docker.internal`替换为实际的后端服务地址
2. 根据需要调整端口映射
3. 配置SSL证书（如需HTTPS）