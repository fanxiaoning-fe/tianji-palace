'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Sparkles, Send, Loader2 } from 'lucide-react'

const divinationInfo: Record<string, { title: string; description: string; fields: any }> = {
  tarot: { title: '塔罗占卜', description: '抽取三张塔罗牌，解读过去、现在、未来的运势', fields: [{ name: 'question', label: '请输入你的问题', type: 'textarea', placeholder: '例如：我的事业发展方向如何？' }] },
  liuqiao: { title: '六爻占卜', description: '易经六爻起卦，洞悉事物发展变化', fields: [{ name: 'question', label: '请输入你的问题', type: 'textarea', placeholder: '例如：这件事能否成功？' }] },
  bazi: { title: '生辰八字', description: '四柱排盘，五行分析，解读命理格局', fields: [{ name: 'name', label: '姓名', type: 'text', placeholder: '请输入姓名' }, { name: 'gender', label: '性别', type: 'select', options: [{ value: '男', label: '男' }, { value: '女', label: '女' }] }, { name: 'birthDate', label: '出生日期', type: 'date' }, { name: 'birthTime', label: '出生时间', type: 'time' }, { name: 'birthCity', label: '出生城市', type: 'text', placeholder: '例如：北京' }] },
  ziwei: { title: '紫微斗数', description: '十二宫位排布，主星分析，紫微命盘解读', fields: [{ name: 'name', label: '姓名', type: 'text', placeholder: '请输入姓名' }, { name: 'gender', label: '性别', type: 'select', options: [{ value: '男', label: '男' }, { value: '女', label: '女' }] }, { name: 'birthDate', label: '出生日期', type: 'date' }, { name: 'birthTime', label: '出生时间', type: 'time' }, { name: 'birthCity', label: '出生城市', type: 'text', placeholder: '例如：上海' }] },
  dream: { title: '周公解梦', description: 'AI智能解梦，解读梦境中的潜意识信息', fields: [{ name: 'dreamContent', label: '描述你的梦境', type: 'textarea', placeholder: '请详细描述你的梦境...' }] },
  fortune: { title: '每日运势', description: '根据出生信息，预测今日运势', fields: [{ name: 'birthDate', label: '出生日期', type: 'date' }, { name: 'birthTime', label: '出生时间', type: 'time' }] },
  compatibility: { title: '命理合盘', description: '八字合盘分析，解析双方缘分', fields: [{ name: 'person1Name', label: '一方姓名', type: 'text', placeholder: '请输入姓名' }, { name: 'person1Gender', label: '一方性别', type: 'select', options: [{ value: '男', label: '男' }, { value: '女', label: '女' }] }, { name: 'person1BirthDate', label: '一方出生日期', type: 'date' }, { name: 'person1BirthTime', label: '一方出生时间', type: 'time' }, { name: 'person2Name', label: '另一方姓名', type: 'text', placeholder: '请输入姓名' }, { name: 'person2Gender', label: '另一方性别', type: 'select', options: [{ value: '男', label: '男' }, { value: '女', label: '女' }] }, { name: 'person2BirthDate', label: '另一方出生日期', type: 'date' }, { name: 'person2BirthTime', label: '另一方出生时间', type: 'time' }] },
}

export default function DivinationPage({ params }: { params: { type: string } }) {
  const info = divinationInfo[params.type]
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  if (!info) {
    return (
      <div className="min-h-screen bg-[#ffffff] flex items-center justify-center">
        <p className="text-slate-500">未找到该占卜类型</p>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      let endpoint = ''
      let body: any = {}

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
          body = { name: formData.name, gender: formData.gender, birth_date: formData.birthDate, birth_time: formData.birthTime, birth_city: formData.birthCity }
          break
        case 'ziwei':
          endpoint = '/api/ziwei'
          body = { name: formData.name, gender: formData.gender, birth_date: formData.birthDate, birth_time: formData.birthTime, birth_city: formData.birthCity }
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
          body = { person1: { name: formData.person1Name, gender: formData.person1Gender, birth_date: formData.person1BirthDate, birth_time: formData.person1BirthTime }, person2: { name: formData.person2Name, gender: formData.person2Gender, birth_date: formData.person2BirthDate, birth_time: formData.person2BirthTime } }
          break
      }

      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setResult({ error: '请求失败，请稍后重试' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#ffffff] pt-20 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/divination" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>返回</span>
          </Link>

          <div className="card p-8 mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{info.title}</h1>
            <p className="text-slate-500">{info.description}</p>
          </div>

          <form onSubmit={handleSubmit} className="card p-8 mb-8">
            <div className="space-y-5">
              {info.fields.map((field: any) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-slate-700 mb-2">{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={formData[field.name] || ''}
                      onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                      placeholder={field.placeholder}
                      className="input-field min-h-[120px] resize-none"
                      required
                    />
                  ) : field.type === 'select' ? (
                    <select
                      value={formData[field.name] || ''}
                      onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                      className="input-field"
                      required
                    >
                      <option value="">请选择</option>
                      {field.options?.map((opt: any) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      value={formData[field.name] || ''}
                      onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                      placeholder={field.placeholder}
                      className="input-field"
                      required
                    />
                  )}
                </div>
              ))}
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-6 flex items-center justify-center gap-2"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              <span>{loading ? '解读中...' : '开始解读'}</span>
            </motion.button>
          </form>

          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="result-card">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">解读结果</h2>
              
              {result.error ? (
                <p className="text-red-500">{result.error}</p>
              ) : result.interpretation?.error ? (
                <p className="text-red-500">{result.interpretation.error}</p>
              ) : result.cards ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {result.cards.map((card: any, idx: number) => (
                      <motion.div key={idx} className="bg-purple-50 rounded-xl p-4 text-center" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.2 }}>
                        <p className="text-purple-600 text-sm mb-2">{card.position}</p>
                        <p className="text-2xl font-bold text-slate-900 mb-1">{card.card.name}</p>
                        <p className="text-slate-500 text-sm">{card.card.meaning}</p>
                      </motion.div>
                    ))}
                  </div>
                  <div className="border-t border-slate-200 pt-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">详细解读</h3>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {typeof result.interpretation === 'string' ? result.interpretation : result.interpretation?.content || '暂无解读'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-slate-600 leading-relaxed whitespace-pre-wrap">
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