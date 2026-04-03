'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Moon, Sparkles, Star, Sun, Heart } from 'lucide-react'

const divinationTypes = [
  { 
    id: 'tarot', 
    name: '塔罗占卜', 
    icon: Moon, 
    description: '78张韦特塔罗牌，解读过去现在未来',
    color: 'from-purple-500 to-pink-500',
    features: ['三牌阵', '凯尔特十字', 'AI智能解读']
  },
  { 
    id: 'liuqiao', 
    name: '六爻占卜', 
    icon: Sparkles, 
    description: '易经64卦，洞悉事物发展变化',
    color: 'from-blue-500 to-cyan-500',
    features: ['自动起卦', '动爻分析', '卦象解读']
  },
  { 
    id: 'bazi', 
    name: '生辰八字', 
    icon: Star, 
    description: '四柱五行，解读命理格局',
    color: 'from-yellow-500 to-orange-500',
    features: ['四柱排盘', '五行分析', '大运流年']
  },
  { 
    id: 'ziwei', 
    name: '紫微斗数', 
    icon: Sparkles, 
    description: '十二宫位排布，星曜组合分析',
    color: 'from-indigo-500 to-purple-500',
    features: ['十二宫位', '主星分析', '四化飞星']
  },
  { 
    id: 'dream', 
    name: '周公解梦', 
    icon: Moon, 
    description: '解读梦境，预知未来运势',
    color: 'from-teal-500 to-green-500',
    features: ['梦境输入', 'AI解梦', '关键词提取']
  },
  { 
    id: 'fortune', 
    name: '每日运势', 
    icon: Sun, 
    description: '星座运势，把握今日机遇',
    color: 'from-amber-500 to-yellow-500',
    features: ['星座判定', '运势预测', '多维分析']
  },
  { 
    id: 'compatibility', 
    name: '命理合盘', 
    icon: Heart, 
    description: '八字合盘，解析双方缘分',
    color: 'from-rose-500 to-pink-500',
    features: ['八字合盘', '五行互补', '相处建议']
  },
]

export default function DivinationPage() {
  return (
    <main className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>返回首页</span>
          </Link>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              选择你的占卜方式
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              融合东方命理与西方占卜，多种选择为你揭示命运奥秘
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {divinationTypes.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/divination/${item.id}`}>
                  <motion.div
                    className="glass-card rounded-2xl p-6 cursor-pointer h-full"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}>
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{item.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {item.features.map(feature => (
                        <span 
                          key={feature}
                          className="text-xs px-2 py-1 rounded-full bg-white/10 text-gray-300"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  )
}