import { BrowserRouter } from 'react-router-dom'
import React from 'react'

const Browser = (props) => {
  // 根据 history type 返回不同的 Browser
  return <BrowserRouter {...props}></BrowserRouter>
}

export default Browser
