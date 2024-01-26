import React from "react"
// 这里只是模拟写法，都是错的
export const HtmlHead = (props)=>{
    return <head {...props}></head>
}
export const HtmlMeta = (props)=>{
    return <meta {...props}></meta>
}
export const HtmlLink = (props)=>{
    return <link {...props}></link>
}
export const HtmlTitle = (props)=>{
    return <title {...props}></title>
}
export const Html = (props)=>{
    return <>{props.children}</>
}
export const HtmlBody = (props)=>{
    return <body {...props}></body>
}
