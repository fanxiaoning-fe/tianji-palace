# 天机阁部署指南

## 准备条件
- GitHub 账号
- Vercel 账号 (前端)
- Railway 账号 (后端)

---

## 第一步：推送代码到 GitHub

```bash
cd /Users/fxn/Documents/opencode

# 初始化 git（如果还没有）
git init
git add .
git commit -m "initial commit"

# 创建 GitHub 仓库并推送
git remote add origin https://github.com/你的用户名/tianji-palace.git
git branch -M main
git push -u origin main
```

---

## 第二步：部署后端 (Railway)

1. 访问 https://railway.app/login 登录
2. 点击 "New Project" → "Deploy from GitHub repo"
3. 选择 `tianji-palace` 仓库
4. 选择 `backend` 文件夹
5. 在 Variables 添加：
   - `USE_SQLITE` = `true`
   - `DEEPSEEK_API_KEY` = `你的DeepSeek密钥`
   - `DEEPSEEK_BASE_URL` = `https://api.deepseek.com`
6. 点击 Deploy

部署完成后，Railway 会提供后端 URL，例如：`https://tianji-backend.up.railway.app`

---

## 第三步：部署前端 (Vercel)

1. 访问 https://vercel.com/login 登录
2. 点击 "Add New" → "Project"
3. 选择 `tianji-palace` 仓库
4. Framework Preset 选择 `Next.js`
5. 在 Environment Variables 添加：
   - `NEXT_PUBLIC_API_URL` = `你的后端URL` (例如: `https://tianji-backend.up.railway.app`)
6. 点击 Deploy

部署完成后，Vercel 会提供前端 URL，例如：`https://tianji-palace.vercel.app`

---

## 第四步：更新前端 API 地址

如果后端 URL 不是 localhost，需要更新前端配置：

在 Vercel 的 Environment Variables 中添加：
- Key: `NEXT_PUBLIC_API_URL`
- Value: 你的后端 Railway URL

---

## 注意事项

1. **DeepSeek API 密钥**：确保在 Railway 中设置了 `DEEPSEEK_API_KEY`
2. **免费额度**：Railway 和 Vercel 都有免费额度
3. **SQLite**：后端已配置为使用 SQLite，无需额外数据库