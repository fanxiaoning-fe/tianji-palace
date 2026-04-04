'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Sparkles, Star, Moon, Sun, Heart, Sparkle, ArrowRight, User, Menu, X } from 'lucide-react'

const divinationTypes = [
  { id: 'tarot', name: '塔罗占卜', icon: Moon, description: '78张韦特塔罗牌，解读过去现在未来', gradient: 'from-purple-500 to-pink-500' },
  { id: 'liuqiao', name: '六爻占卜', icon: Sparkles, description: '易经64卦，洞悉事物发展变化', gradient: 'from-blue-500 to-cyan-500' },
  { id: 'bazi', name: '生辰八字', icon: Star, description: '四柱五行，解读命理格局', gradient: 'from-yellow-500 to-orange-500' },
  { id: 'ziwei', name: '紫微斗数', icon: Sparkle, description: '十二宫位，星曜组合分析', gradient: 'from-indigo-500 to-purple-500' },
  { id: 'dream', name: '周公解梦', icon: Moon, description: '解读梦境，预知未来运势', gradient: 'from-teal-500 to-green-500' },
  { id: 'fortune', name: '每日运势', icon: Sun, description: '星座运势，把握今日机遇', gradient: 'from-amber-500 to-yellow-500' },
  { id: 'compatibility', name: '命理合盘', icon: Heart, description: '八字合盘，解析双方缘分', gradient: 'from-rose-500 to-pink-500' },
]

const features = [
  { icon: Sparkles, title: 'AI智能解读', desc: 'DeepSeek大模型，智能分析' },
  { icon: Star, title: '实时分析', desc: '秒级响应，即时反馈' },
  { icon: Moon, title: '多维分析', desc: '事业财运爱情健康' },
]

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <main className="min-h-screen bg-[#ffffff]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 nav-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-indigo-600" />
              <span className="text-xl font-bold text-slate-900">天机阁</span>
            </Link>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/divination" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">
                占卜入口
              </Link>
              <Link href="/auth" className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium transition-colors">
                <User className="w-5 h-5" />
                <span>登录</span>
              </Link>
              <Link href="/divination" className="btn-primary">
                开始占卜
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Nav */}
          {menuOpen && (
            <div className="md:hidden py-4 border-t border-slate-200">
              <Link href="/divination" className="block py-2 text-slate-600">占卜入口</Link>
              <Link href="/auth" className="block py-2 text-slate-600">登录</Link>
              <Link href="/divination" className="block py-2 text-indigo-600 font-medium">开始占卜</Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 badge mb-6">
              <Sparkles className="w-4 h-4" />
              <span>AI智能占卜平台</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="hero-gradient">探索你的命运</span>
            </h1>
            
            <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10">
              融合东方命理与西方占卜，AI智能解读你的人生轨迹
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-16">
              {features.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="feature-card flex items-center gap-3"
                >
                  <item.icon className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/divination" className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4">
                开始占卜
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/auth" className="btn-secondary inline-flex items-center gap-2 text-lg px-8 py-4">
                登录账号
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Divination Types */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              选择你的占卜方式
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              多种占卜方式，融合东方命理与西方占卜，为你揭示命运奥秘
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {divinationTypes.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link href={`/divination/${item.id}`}>
                  <div className="type-card h-full">
                    <div className={`icon bg-gradient-to-br ${item.gradient}`}>
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{item.name}</h3>
                    <p className="text-slate-500 text-sm">{item.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="card p-12 text-center"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              准备好探索你的命运了吗？
            </h2>
            <p className="text-slate-500 mb-8">
              立即开始你的占卜之旅，获得AI智能指引
            </p>
            <Link href="/divination" className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4">
              开始占卜
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-slate-200">
        <div className="max-w-7xl mx-auto text-center text-slate-400">
          <p>© 2024 天机阁. AI占卜平台，仅供娱乐参考</p>
        </div>
      </footer>
    </main>
  )
}