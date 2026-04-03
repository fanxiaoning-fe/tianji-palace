# 天机阁 AI 占卜平台 - 项目规范

## 1. 项目概述

- **项目名称**: 天机阁 (Tianji Palace)
- **类型**: AI占卜 Web应用
- **核心功能**: 多体系AI占卜服务（塔罗、六爻、八字、紫微斗数、周公解梦、运势预测、合盘分析）
- **目标用户**: 对中国传统命理和西方占卜感兴趣的用户

## 2. 技术栈

- **前端**: React 18 + Next.js 14 + TypeScript
- **后端**: Python FastAPI
- **AI模型**: DeepSeek API (开源模型)
- **样式**: Tailwind CSS + Framer Motion
- **部署**: Railway

## 3. 功能规范

### 3.1 塔罗牌占卜
- 78张韦特塔罗牌
- 支持牌阵：三牌阵、凯尔特十字
- AI智能解读
- 支持追问功能

### 3.2 六爻/易经
- 64卦自动起卦
- 卦象解读
- 动爻分析
- AI智能解卦

### 3.3 生辰八字
- 四柱排盘
- 五行分析
- 大运流年解读
- AI命理分析

### 3.4 紫微斗数
- 十二宫位排布
- 主星分析
- 四化飞星
- AI命盘解读

### 3.5 周公解梦
- 梦境描述输入
- AI智能解梦
- 关键词提取

### 3.6 每日/每周运势
- 生日输入
- 星座判定
- 运势预测
- 多维度分析（事业、财运、爱情、健康）

### 3.7 命理合盘
- 双方八字合盘
- 五行互补分析
- 相处建议

## 4. 页面结构

### 4.1 首页 /
- 导航栏
- 主打功能展示
- 用户入口

### 4.2 占卜选择页 /divination
- 各类占卜入口卡片
- 功能介绍

### 4.3 占卜详情页 /divination/[type]
- 输入表单
- AI解读区域
- 历史记录

### 4.4 个人中心 /profile
- 用户信息
- 积分余额
- 历史记录

## 5. API 设计

### 5.1 占卜API
- POST /api/tarot - 塔罗牌占卜
- POST /api/liuqiao - 六爻占卜
- POST /api/bazi - 八字排盘
- POST /api/ziwei - 紫微斗数
- POST /api/dream - 解梦
- POST /api/fortune - 运势查询
- POST /api/compatibility - 合盘分析

### 5.2 用户API
- POST /api/user/register - 注册
- POST /api/user/login - 登录
- GET /api/user/profile - 获取用户信息
- POST /api/user/checkin - 签到

## 6. AI 提示词规范

每种占卜类型都有专门的system prompt，包含：
- 占卜理论背景
- 解读框架
- 术语解释
- 注意事项

## 7. 验收标准

- [ ] 首页正常加载
- [ ] 可以选择7种占卜类型
- [ ] 每种占卜可正常提交并获得AI解读
- [ ] 签到积分功能正常
- [ ] 部署到Railway后可访问
