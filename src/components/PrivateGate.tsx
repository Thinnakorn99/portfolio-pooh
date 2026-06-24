import React, { useState } from 'react'
import './PrivateGate.css'

interface PrivateGateProps {
  onAccessGranted: () => void;
}

export default function PrivateGate({ onAccessGranted }: PrivateGateProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'FLUKE88') {
      sessionStorage.setItem('private_authorized', 'true')
      onAccessGranted()
    } else {
      setError('รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง')
      setPassword('')
    }
  }

  const handleCancel = () => {
    window.location.href = '/'
  }

  return (
    <div className="pg-container">
      {/* Background Decorative Bubble Glows */}
      <div className="pg-bg-glow pg-bg-glow--cyan" />
      <div className="pg-bg-glow pg-bg-glow--blue" />

      <div className="pg-card">
        <div className="pg-icon-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="32" height="32">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <h2>ยืนยันสิทธิ์การเข้าถึง</h2>
        <p>กรุณาระบุรหัสผ่านระบบเพื่อเข้าสู่โหมดพื้นที่ส่วนตัว (Private Area)</p>

        <form onSubmit={handleSubmit} className="pg-form">
          <div className="pg-input-group">
            <svg 
              className="pg-input-icon" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              width="18" 
              height="18"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input 
              type="password" 
              placeholder="ป้อนรหัสผ่าน..." 
              className="pg-input"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (error) setError(null)
              }}
              required
              autoFocus
            />
          </div>

          {error && (
            <div className="pg-error-message">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="pg-actions">
            <button type="submit" className="pg-btn-submit">
              ยืนยันการเข้าถึง
            </button>
            <button type="button" onClick={handleCancel} className="pg-btn-cancel">
              กลับหน้าหลัก
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
