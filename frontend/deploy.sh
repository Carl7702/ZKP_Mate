#!/bin/bash

# TimeLock 前端部署脚本
# 用于部署到静态文件托管服务

echo "🚀 开始部署 TimeLock 前端应用..."

# 检查是否已构建
if [ ! -d "build" ]; then
    echo "📦 构建生产版本..."
    npm run build
fi

echo "✅ 构建完成！"
echo ""
echo "📋 部署选项："
echo "1. 使用 Vercel: npx vercel --prod"
echo "2. 使用 Netlify: npx netlify deploy --prod --dir=build"
echo "3. 使用 GitHub Pages: 将 build 文件夹内容推送到 gh-pages 分支"
echo "4. 使用 Surge: npx surge build"
echo "5. 本地测试: npx serve -s build"
echo ""
echo "🌐 推荐使用 Vercel 或 Netlify 进行免费部署"
echo ""

# 显示构建信息
echo "📊 构建统计："
echo "构建目录: $(pwd)/build"
echo "文件数量: $(find build -type f | wc -l)"
echo "总大小: $(du -sh build | cut -f1)"
echo ""

echo "🎉 准备就绪！选择上述任一部署方式即可让其他人访问您的应用。"

