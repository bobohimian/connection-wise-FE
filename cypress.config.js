import { defineConfig } from "cypress";
import fs from 'fs';
import path from 'path';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // 实现文件写入任务
      on('task', {
        writeFile({ filePath, content }) {
          // 确保目录存在
          const dir = path.dirname(filePath);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          
          // 写入文件
          fs.writeFileSync(filePath, content);
          
          return true; // 任务必须返回值
        }
      });
    },
    viewportWidth: 1920,
    viewportHeight: 1080,
    defaultCommandTimeout: 10000,
  },
});
