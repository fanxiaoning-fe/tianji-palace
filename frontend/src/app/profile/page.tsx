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
      if (data.history) {
        setHistory(data.history)
      }
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
        const newUser = { ...user, points: data.points }
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    )
  }

  if (!user) {
    return null
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

          <div className="glass-card rounded-3xl p-8 mb-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{user.username}</h1>
                  <p className="text-gray-400">欢迎来到天机阁</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <LogOut className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div
                className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-xl p-6"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Gift className="w-5 h-5 text-purple-400" />
                  <p className="text-gray-400">积分余额</p>
                </div>
                <p className="text-3xl font-bold text-white">{user.points}</p>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 rounded-xl p-6"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <p className="text-gray-400">今日签到</p>
                </div>
                <p className="text-3xl font-bold text-white">{user.checked_in_today ? '已签到' : '未签到'}</p>
              </motion.div>
            </div>

            <motion.button
              onClick={handleCheckIn}
              disabled={user.checked_in_today || checkingIn}
              className="w-full mt-6 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed btn-mystic"
              whileHover={{ scale: user.checked_in_today || checkingIn ? 1 : 1.02 }}
              whileTap={{ scale: user.checked_in_today || checkingIn ? 1 : 0.98 }}
            >
              {checkingIn ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
              <span>{user.checked_in_today ? '明日再来' : '立即签到'}</span>
            </motion.button>
          </div>

          <div className="glass-card rounded-3xl p-8">
            <h2 className="text-xl font-bold text-white mb-6">占卜历史</h2>
            {history.length === 0 ? (
              <p className="text-gray-500 text-center py-8">暂无占卜记录</p>
            ) : (
              <div className="space-y-4">
                {history.map((item, idx) => (
                  <div key={idx} className="border-b border-white/10 pb-4">
                    <p className="text-white font-medium">{item.divination_type}</p>
                    <p className="text-gray-500 text-sm">{item.question}</p>
                    <p className="text-gray-600 text-xs mt-1">{new Date(item.created_at).toLocaleString()}</p>
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