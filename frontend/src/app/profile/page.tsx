'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, User, Gift, Clock, Sparkles, LogOut, Loader2 } from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [checkingIn, setCheckingIn] = useState(false)
  const [history, setHistory] = useState<any[]>([])

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      fetchHistory(JSON.parse(storedUser).username)
    } else {
      router.push('/auth')
    }
    setLoading(false)
  }, [router])

  const fetchHistory = async (username: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiUrl}/api/user/history/${username}`)
      const data = await response.json()
      if (data.history) setHistory(data.history)
    } catch (err) {
      console.error('Failed to fetch history:', err)
    }
  }

  const handleCheckIn = async () => {
    if (!user || checkingIn) return
    setCheckingIn(true)
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiUrl}/api/user/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user.username, password: '' })
      })
      const data = await response.json()
      if (!data.error) {
        const newUser = { ...user, points: data.points, checked_in_today: data.checked_in_today }
        setUser(newUser)
        localStorage.setItem('user', JSON.stringify(newUser))
        alert(data.message)
      } else {
        alert(data.error)
      }
    } catch (err) {
      alert('签到失败，请稍后重试')
    } finally {
      setCheckingIn(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/auth')
  }

  if (loading) {
    return <div className="min-h-screen bg-[#ffffff] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
  }

  if (!user) return null

  return (
    <main className="min-h-screen bg-[#ffffff] pt-20 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>返回首页</span>
          </Link>

          <div className="card p-8 mb-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">{user.username}</h1>
                  <p className="text-slate-500">欢迎来到天机阁</p>
                </div>
              </div>
              <button onClick={handleLogout} className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors">
                <LogOut className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div className="bg-indigo-50 rounded-xl p-6" whileHover={{ scale: 1.02 }}>
                <div className="flex items-center gap-3 mb-2">
                  <Gift className="w-5 h-5 text-indigo-600" />
                  <p className="text-slate-600">积分余额</p>
                </div>
                <p className="text-3xl font-bold text-slate-900">{user.points}</p>
              </motion.div>

              <motion.div className="bg-amber-50 rounded-xl p-6" whileHover={{ scale: 1.02 }}>
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <p className="text-slate-600">今日签到</p>
                </div>
                <p className="text-3xl font-bold text-slate-900">{user.checked_in_today ? '已签到' : '未签到'}</p>
              </motion.div>
            </div>

            <motion.button onClick={handleCheckIn} disabled={user.checked_in_today || checkingIn} className="btn-primary w-full mt-6 flex items-center justify-center gap-2" whileHover={{ scale: user.checked_in_today || checkingIn ? 1 : 1.02 }}>
              {checkingIn ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              <span>{user.checked_in_today ? '明日再来' : '立即签到'}</span>
            </motion.button>
          </div>

          <div className="card p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6">占卜历史</h2>
            {history.length === 0 ? (
              <p className="text-slate-400 text-center py-8">暂无占卜记录</p>
            ) : (
              <div className="space-y-4">
                {history.map((item, idx) => (
                  <div key={idx} className="border-b border-slate-100 pb-4">
                    <p className="text-slate-900 font-medium">{item.divination_type}</p>
                    <p className="text-slate-500 text-sm">{item.question}</p>
                    <p className="text-slate-400 text-xs mt-1">{new Date(item.created_at).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  )
}