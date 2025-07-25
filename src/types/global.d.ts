// 全局类型声明文件

// 声明环境变量的类型
declare namespace NodeJS {
  interface ProcessEnv {
    API_BASE_URL: string;
    WS_BASE_URL: string;
    MINIO_BASE_URL: string;
  }
}

// 声明CSS模块
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

// 声明图片资源
declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

// 声明其他可能用到的模块
declare module '*.json' {
  const content: Record<string, unknown>;
  export default content;
}