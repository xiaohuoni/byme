import React from 'react'
import {
  BymeRoutes,
  // Browser,
  Provider, // plugin1 plugin2 plugin3 
  Html,
  HtmlHead,
  HtmlMeta,
  HtmlLink,
  HtmlTitle,
  HtmlBody,
  render,
} from 'byme'
import { Navbar } from './components/Navbar'
import 'byme/global'

import { HashRouter } from 'react-router-dom'

const Browser = (props: any) => {
  // 根据 history type 返回不同的 Browser
  return <HashRouter {...props}></HashRouter>
}

const Root = () => {
  return (
    <Html>
      <HtmlHead>
        <HtmlMeta
          name="viewport"
          content="width=device-width, initial-scale=1"
        ></HtmlMeta>
        <HtmlMeta name="theme-color" content="#000000"></HtmlMeta>
        <HtmlMeta
          name="description"
          content="Web site created using create-react-app"
        ></HtmlMeta>
        <HtmlLink
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css"
        />
        <HtmlLink
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
        <HtmlTitle>Byme App11</HtmlTitle>
      </HtmlHead>
      <HtmlBody>
        <Provider>
          <Browser>
            <Navbar />
            <div className="container">
              <BymeRoutes />
            </div>
          </Browser>
        </Provider>
      </HtmlBody>
    </Html>
  )
}

// 可能是 ssr
render(Root())
