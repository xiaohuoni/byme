import { Routes, Route } from 'react-router-dom'
import React from 'react'
import { About } from '@/pages/About'
import { Home } from '@/pages/Home'

const BymeRoutes = () => {
  // 根据用户配置或者约定生成
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  )
}

export default BymeRoutes
