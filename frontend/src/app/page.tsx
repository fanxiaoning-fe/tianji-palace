'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Sparkles, Star, Moon, Sun, Heart, Briefcase, Wallet, User, Sparkle } from 'lucide-react'

const divinationTypes = [
  { id: 'tarot', name: '塔罗占卜', icon: Moon, description: '78张塔罗牌，解读过去现在未来', color: 'from-purple-500 to-pink-500' },
  { id: 'liuqiao', name: '六爻占卜', icon: Sparkles, description: '易经64卦，洞悉事物发展变化', color: 'from-blue-500 to-cyan-500' },
  { id: 'bazi', name: '生辰八字', icon: Star, description: '四柱五行，解读命理格局', color: 'from-yellow-500 to-orange-500' },
  { id: 'ziwei', name: '紫微斗数', icon: Sparkle, description: '十二宫位，星曜组合分析', color: 'from-indigo-500 to-purple-500' },
  { id: 'dream', name: '周公解梦', icon: Moon, description: '解读梦境，预知未来运势', color: 'from-teal-500 to-green-500' },
  { id: 'fortune', name: '每日运势', icon: Sun, description: '星座运势，把握今日机遇', color: 'from-amber-500 to-yellow-500' },
  { id: 'compatibility', name: '命理合盘', icon: Heart, description: '八字合盘，解析双方缘分', color: 'from-rose-500 to-pink-500' },
]

const features = [
  { icon: Star, title: 'AI智能解读', desc: 'GPT-4深度学习模型' },
  { icon: Sparkles, title: '实时分析', desc: '秒级响应，即时反馈' },
  { icon: Moon, title: '多维分析', desc: '事业财运爱情健康' },
]

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  return (
    <main className="min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Sparkles className="w-8 h-8 text-purple-400" />
              <span className="text-xl font-bold text-gradient">天机阁</span>
            </motion.div>
            <div className="flex items-center gap-4">
              <Link href="/divination" className="text-gray-300 hover:text-white transition-colors">
                占卜入口
              </Link>
              <Link href="/profile" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                <User className="w-5 h-5" />
                <span>我的</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-gradient">探索你的命运</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              融合东方命理与西方占卜，AI智能解读你的人生轨迹
            </p>
            <motion.div 
              className="flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="glass-card rounded-xl px-6 py-3 flex items-center gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <feature.icon className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="font-medium text-white">{feature.title}</p>
                    <p className="text-sm text-gray-400">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {divinationTypes.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Link href={`/divination/${item.id}`}>
                  <motion.div
                    className={`glass-card rounded-2xl p-6 cursor-pointer h-full hover:scale-105 transition-transform`}
                    onMouseEnter={() => setHoveredCard(item.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}>
                      <item.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            className="glass-card rounded-3xl p-12"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">准备好探索你的命运了吗？</h2>
            <p className="text-gray-300 mb-8">立即开始你的占卜之旅，获得AI智能指引</p>
            <Link href="/divination">
              <motion.button
                className="btn-mystic px-8 py-4 rounded-xl text-white font-bold text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                开始占卜
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      <footer className="py-8 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center text-gray-500">
          <p>© 2024 天机阁. AI占卜平台，仅供娱乐参考</p>
        </div>
      </footer>
    </main>
  )
}
