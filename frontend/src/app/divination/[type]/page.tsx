'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Sparkles, Send, Loader2 } from 'lucide-react'

const divinationInfo: Record<string, { title: string; description: string; fields: any }> = {
  tarot: {
    title: '塔罗占卜',
    description: '抽取三张塔罗牌，解读过去、现在、未来的运势',
    fields: [
      { name: 'question', label: '请输入你的问题', type: 'textarea', placeholder: '例如：我的事业发展方向如何？' }
    ]
  },
  liuqiao: {
    title: '六爻占卜',
    description: '易经六爻起卦，洞悉事物发展变化',
    fields: [
      { name: 'question', label: '请输入你的问题', type: 'textarea', placeholder: '例如：这件事能否成功？' }
    ]
  },
  bazi: {
    title: '生辰八字',
    description: '四柱排盘，五行分析，解读命理格局',
    fields: [
      { name: 'name', label: '姓名', type: 'text', placeholder: '请输入姓名' },
      { name: 'gender', label: '性别', type: 'select', options: [{ value: '男', label: '男' }, { value: '女', label: '女' }] },
      { name: 'birthDate', label: '出生日期', type: 'date' },
      { name: 'birthTime', label: '出生时间', type: 'time' },
      { name: 'birthCity', label: '出生城市', type: 'text', placeholder: '例如：北京' }
    ]
  },
  ziwei: {
    title: '紫微斗数',
    description: '十二宫位排布，主星分析，紫微命盘解读',
    fields: [
      { name: 'name', label: '姓名', type: 'text', placeholder: '请输入姓名' },
      { name: 'gender', label: '性别', type: 'select', options: [{ value: '男', label: '男' }, { value: '女', label: '女' }] },
      { name: 'birthDate', label: '出生日期', type: 'date' },
      { name: 'birthTime', label: '出生时间', type: 'time' },
      { name: 'birthCity', label: '出生城市', type: 'text', placeholder: '例如：上海' }
    ]
  },
  dream: {
    title: '周公解梦',
    description: 'AI智能解梦，解读梦境中的潜意识信息',
    fields: [
      { name: 'dreamContent', label: '描述你的梦境', type: 'textarea', placeholder: '请详细描述你的梦境...' }
    ]
  },
  fortune: {
    title: '每日运势',
    description: '根据出生信息，预测今日运势',
    fields: [
      { name: 'birthDate', label: '出生日期', type: 'date' },
      { name: 'birthTime', label: '出生时间', type: 'time' }
    ]
  },
  compatibility: {
    title: '命理合盘',
    description: '八字合盘分析，解析双方缘分',
    fields: [
      { name: 'person1Name', label: '一方姓名', type: 'text', placeholder: '请输入姓名' },
      { name: 'person1Gender', label: '一方性别', type: 'select', options: [{ value: '男', label: '男' }, { value: '女', label: '女' }] },
      { name: 'person1BirthDate', label: '一方出生日期', type: 'date' },
      { name: 'person1BirthTime', label: '一方出生时间', type: 'time' },
      { name: 'person2Name', label: '另一方姓名', type: 'text', placeholder: '请输入姓名' },
      { name: 'person2Gender', label: '另一方性别', type: 'select', options: [{ value: '男', label: '男' }, { value: '女', label: '女' }] },
      { name: 'person2BirthDate', label: '另一方出生日期', type: 'date' },
      { name: 'person2BirthTime', label: '另一方出生时间', type: 'time' }
    ]
  }
}

export default function DivinationPage({ params }: { params: { type: string } }) {
  const info = divinationInfo[params.type]
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  if (!info) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">未找到该占卜类型</p>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      let endpoint = ''
      let body = {}
      
      switch (params.type) {
        case 'tarot':
          endpoint = '/api/tarot'
          body = { question: formData.question, spread_type: 'three_cards' }
          break
        case 'liuqiao':
          endpoint = '/api/liuqiao'
          body = { question: formData.question }
          break
        case 'bazi':
          endpoint = '/api/bazi'
          body = {
            name: formData.name,
            gender: formData.gender,
            birth_date: formData.birthDate,
            birth_time: formData.birthTime,
            birth_city: formData.birthCity
          }
          break
        case 'ziwei':
          endpoint = '/api/ziwei'
          body = {
            name: formData.name,
            gender: formData.gender,
            birth_date: formData.birthDate,
            birth_time: formData.birthTime,
            birth_city: formData.birthCity
          }
          break
        case 'dream':
          endpoint = '/api/dream'
          body = { dream_content: formData.dreamContent }
          break
        case 'fortune':
          endpoint = '/api/fortune'
          body = { birth_date: formData.birthDate, birth_time: formData.birthTime }
          break
        case 'compatibility':
          endpoint = '/api/compatibility'
          body = {
            person1: {
              name: formData.person1Name,
              gender: formData.person1Gender,
              birth_date: formData.person1BirthDate,
              birth_time: formData.person1BirthTime
            },
            person2: {
              name: formData.person2Name,
              gender: formData.person2Gender,
              birth_date: formData.person2BirthDate,
              birth_time: formData.person2BirthTime
            }
          }
          break
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Error:', error)
      setResult({ error: '请求失败，请稍后重试' })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <main className="min-h-screen pt-20 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>返回首页</span>
          </Link>

          <div className="glass-card rounded-3xl p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{info.title}</h1>
                <p className="text-gray-400">{info.description}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {info.fields.map((field: any) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {field.label}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      required
                    />
                  ) : field.type === 'select' ? (
                    <select
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    >
                      <option value="" className="bg-slate-900">请选择</option>
                      {field.options?.map((opt: any) => (
                        <option key={opt.value} value={opt.value} className="bg-slate-900">{opt.label}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  )}
                </div>
              ))}

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full btn-mystic py-4 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>解读中...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>开始解读</span>
                  </>
                )}
              </motion.button>
            </form>
          </div>

          {result && (
            <motion.div
              className="glass-card rounded-3xl p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6">解读结果</h2>
              
              {result.error ? (
                <p className="text-red-400">{result.error}</p>
              ) : result.interpretation?.error ? (
                <p className="text-red-400">{result.interpretation.error}</p>
              ) : result.cards ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {result.cards.map((card: any, idx: number) => (
                      <motion.div
                        key={idx}
                        className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-xl p-4 text-center"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.2 }}
                      >
                        <p className="text-purple-400 text-sm mb-2">{card.position}</p>
                        <p className="text-2xl font-bold text-white mb-1">{card.card.name}</p>
                        <p className="text-gray-400 text-sm">{card.card.meaning}</p>
                      </motion.div>
                    ))}
                  </div>
                  <div className="border-t border-white/10 pt-6">
                    <h3 className="text-lg font-semibold text-white mb-3">详细解读</h3>
                    <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                      {typeof result.interpretation === 'string' ? result.interpretation : result.interpretation?.content || '暂无解读'}
                    </div>
                  </div>
                </div>
              ) : result.hexagram ? (
                <div className="space-y-6">
                  <div className="flex justify-center gap-8">
                    <div className="text-center">
                      <p className="text-purple-400 text-sm mb-2">本卦</p>
                      <p className="text-4xl font-bold text-white">{result.hexagram.primary}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-purple-400 text-sm mb-2">变卦</p>
                      <p className="text-4xl font-bold text-white">{result.hexagram.secondary}</p>
                    </div>
                  </div>
                  <div className="border-t border-white/10 pt-6">
                    <h3 className="text-lg font-semibold text-white mb-3">详细解读</h3>
                    <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                      {typeof result.interpretation === 'string' ? result.interpretation : result.interpretation?.content || '暂无解读'}
                    </div>
                  </div>
                </div>
              ) : result.bazi ? (
                <div className="space-y-6">
                  <div className="flex justify-center gap-4 flex-wrap">
                    {Object.entries(result.bazi).map(([key, value]) => (
                      <div key={key} className="bg-yellow-900/30 rounded-lg px-4 py-2 text-center">
                        <p className="text-yellow-400 text-xs uppercase">{key}</p>
                        <p className="text-xl font-bold text-white">{value as string}</p>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-white/10 pt-6">
                    <h3 className="text-lg font-semibold text-white mb-3">详细解读</h3>
                    <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                      {typeof result.interpretation === 'string' ? result.interpretation : result.interpretation?.content || '暂无解读'}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {typeof result.interpretation === 'string' ? result.interpretation : result.interpretation?.content || '暂无解读'}
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </main>
  )
}
