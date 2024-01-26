# 组装式前端元框架 - byme

参考文档 [213 - 《如果我重新设计 Umi 01：组装式》](https://t.zsxq.com/166SXGHRt) 云谦付费星球

> 前端框架： react，vue，inula
> 前端元框架：umi，nextjs
> 集中式前端元框架：umi，nextjs

组装式框架是一种编程框架，其设计思想主要聚焦在提供功能和开放入口，让开发者能够像搭积木一样构建应用。框架的每个部分都被设计为可替换、可插拔的模块化结构。因此，如果开发者不希望使用内置的模块、功能或其他默认配置，他们可以轻易地自行创建新的模块并将其融入到整体框架中。

这给予了开发者更多对应用的掌控权。例如，当遇到某个问题时，若绕过难题需要付出的时间和精力成本过高，则开发者可以选择直接将有问题的部分替换掉。

对于 umi 来说，把控了用户的路由和入口文件(.umi/umi.ts)，能做的事情更多，比如能够很好的做到开箱即用，并且能够使得内部项目在一致性上得到高度的统一。alita 则在 umi 的基础上把控的更多，甚至一般情况下，开发人员仅仅需要维护页面文件即可（src/pages/pathname/index.tsx）。但是框架管控的越多，用户知道的就越少，平时开发时需要了解的和掌握的知识点越小（零基础快速上手），在遇到问题时，往往意味着更大的调试和学习成本。（用的时候爽的不行，需要自己干活的时候，又说“umi 太重”。昨晚还叫人家小甜甜，今天就叫牛夫人。）这个黑盒的概念和矛盾还是很好理解的。因此我之前还在 alita 中提供过 `kill-me` 的命令，来将一个 alita 项目展开来成为一个 umi 项目。效果还行，但是真正用的人很少。因为将 alita “展开” 确实可以更清晰的查看和定位问题，但是意味着项目中需要维护的成本上升，这是一个新的矛盾点。

基于上诉需求的考虑，我设想一种 umi 的另类打开方式，类似 `eject` 的命令，可以将其展开成一个 `webpack` 项目。也就是一个黑盒转白盒的过程，因此乌米(umi)也就变成了白米(byme)。

## Umi 插件机制

![Umi 插件机制](https://gw.alipayobjects.com/mdn/rms_ffea06/afts/img/A*GKNdTZgPQCIAAAAAAAAAAAAAARQnAQ)

### 生命周期

- init stage: 该阶段 Umi 将加载各类配置信息。包括：加载 `.env` 文件； require `package.json`  ；加载用户的配置信息； resolve 所有的插件（内置插件、环境变量、用户配置依次进行）。
- initPresets stage:  该阶段 Umi 将注册 presets。presets 在注册的时候可以通过 `return { presets, plugins }` 来添加额外的插件。其中 presets 将添加到 presets 队列的队首，而 plugins 将被添加到 plugins 队列的队尾。
- initPlugins stage: 该阶段 Umi 将注册 plugins。这里的 plugins 包括上个阶段由 presets 添加的额外的 plugins， 一个值得注意的点在于： 尽管 plugins 也可以 `return { presets, plugins }` ，但是 Umi 不会对其进行任何操作。插件的 init 其实就是执行插件的代码（但是插件的代码本质其实只是调用 api 进行各种 hook 的注册，而 hook 的执行并非在此阶段执行，因此这里叫插件的注册）。
- resolveConfig stage: 该阶段 Umi 将整理各个插件中对于 `config schema` 的定义，然后执行插件的 `modifyConfig` 、`modifyDefaultConfig`、 `modifyPaths` 等 hook，进行配置的收集。
- collectionAppData stage: 该阶段 Umi 执行 `modifyAppData` hook，来维护 App 的元数据。（ `AppData` 是 `umi@4` 新增的 api ）
- onCheck stage: 该阶段 Umi 执行 `onCheck` hook。
- onStart stage: 该阶段 Umi 执行 `onStart` hook。
- runCommand stage:  该阶段 Umi 运行当前 cli 要执行的 command，（例如 `umi dev`, 这里就会执行 dev command）Umi 的各种核心功能都在 command 中实现。包括我们的插件调用 api 注册的绝大多数 hook。

以上就是 Umi 的插件机制的整体流程。

### `register()` 、 `registerMethod()` 以及 `applyPlugins()`

`register()` 接收一个 key 和 一个 hook，它维护了一个 `key-hook[]` 的 map，每当调用 `register()` 的时候，就会为 key 额外注册一个 hook。

`register()` 注册的 hooks 供 applyPlugins 使用。 这些 hook 的执行顺序参照 [tapable](https://github.com/webpack/tapable)。

`registerMethod()` 接收一个 key 和 一个 fn，它会在 api 上注册一个方法。如果你没有向 `registerMethod()` 中传入 fn，那么 `registerMethod()` 会在 api 上注册一个“注册器”： 它会将 `register()` 传入 key 并柯里化后的结果作为 fn 注册到 api 上。这样就可以通过调用这个“注册器”，快捷地为 key 注册 hook 了。

值得注意的是在组装式插件中中调用类似 `rootContainer` `dataflowProvider` 等运行时插件 api 时，需要先生成独立的临时文件，如：

```tsx
// plugin/xx 提供临时文件 RootContainer

const RootContainer = ()=>{
  // TODO
}

import React from 'react';
// 独立文件导出 RootContainer
import { RootContainer } from './plugin/xx';

// Provider
// 临时文件中，框架自动用的 src/.byme/Provider
import { RootContainer } from './plugin/xx';
const Provider = (props) => {
  return <RootContainer {...props}></RootContainer>
}

// 项目文件中，用户自己用 src/index
import { RootContainer } from 'byme/plugin/xx';
const Root = (props) => {
  return <RootContainer {...props}></RootContainer>
}
```

因为组装式和集中式的最主要差异就是 `生而不用`。将原本隐私的入口，指到项目中的文件。

## cli

### dev

```ts
// 用户自由选择要用啥
import bundlerLocal from '../scripts/dev';
import bundlerWebpack from '@umijs/bundler-webpack';
import bundlerVite from '@umijs/bundler-vite';
import bundlerMako from '@umijs/bundler-mako';

const config = await this.applyPlugins({
    key: 'config',
});

bundlerLocal.dev(config);
bundlerWebpack.dev(config);
bundlerVite.dev(config);
bundlerMako.dev(config);
```

## bundler config

用户选择不同的编译工具的同时也可以选择完全使用当前项目的配置文件，为了方便一般用户使用，从框架中导出默认配置用户可以在这基础上修改完成。

如 config/webpack.config.ts。

```ts
import { base, plugins } from 'umi/webpack';
import { composeWebpackConfig } from '@umijs/mfsu';
export default composeWebpackConfig([
  {
    ...base,
    plugins: { ...plugins, yourPlugin },
  }
]);
```

## main 入口文件

src/index （可以是任意文件，只需要和构建中指定的 main 配置对应即可）

```ts
import React from 'react';
import {
  UmiRoutes,
  Browser,
  Provider,
  Html,
  HtmlHead,
  HtmlMeta,
  HtmlLink,
  HtmlTitle,
  HtmlBody,
  render,
} from 'umi';
import { Navbar } from './components/Navbar';
import 'umi/global';

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
        <HtmlTitle>Umi App</HtmlTitle>
      </HtmlHead>
      <HtmlBody>
        <Provider>
          <Browser>
            <Navbar />
            <div className="container">
              <UmiRoutes />
            </div>
          </Browser>
        </Provider>
      </HtmlBody>
    </Html>
  )
}

// 可能是 ssr
render(Root());
```
用户可以自由控制各个层级，可以选择引入所有插件合并后的Provider，也可以只使用某一个插件的能力  `import ReduxProvider from './plugins/redux';`。 

其中 `UmiRoutes`,`Browser`,`Provider`,`Html`,`HtmlHead`,`HtmlMeta`,`HtmlLink`,`HtmlTitle`,`HtmlBody`,`render` 均来自于插件机制执行后的临时文件，通过 `import all from umi`。

## 国际化插件演示

下面以国际化插件为例子，演示用户如何使用国际化插件。

### 配置插件

您可以在 `.inularc.ts` 中配置国际化插件。默认值如下：

```ts
export default {
  intl: {
    default: 'zh-CN',
    localeFolder: 'locals',
  },
};
```

配置的详细介绍如下：

| 配置项 | 类型 | 默认值 | 介绍 |
| --- | --- | --- | --- |
| `default` | `String` | `zh-CN` | 项目**默认语言**。当检测不到具体语言时，使用 `default` 设置的默认语言。 |
| `localeFolder` | `String` | `locals` |  指定国际化文件存放路径 |

### 使用方式

默认会将 src/locals 下的文件挂载为国际化文件，可以通过 localeFolder 配置来指定存放目录

```tsx
import { addLocale, getAllLocales, getLocale, setLocale, useIntl } from 'inula';

const Page = () => {
  const intl = useIntl();
  const locals = getAllLocales();
  return (
    <div>
      <p>
        {getLocale()}:{intl.formatMessage({ id: 'navBar.lang' })}
      </p>
      <button
        onClick={() => {
          setLocale(locals[Math.floor(Math.random() * locals.length)], false);
        }}
      >
        换语言啦
      </button>
      <p>写一个不存在的 id :{intl.formatMessage({ id: 'hello.inula' })}</p>
      <button
        onClick={() => {
          setLocale(locals[Math.floor(Math.random() * locals.length)], false);
          addLocale(
            'zh-CN',
            {
              'hello.inula': '你好，OpenInula',
            },
          );
          setLocale('zh-CN',false);
        }}
      >
        增加一个中文的 `id: 'hello.inula'`，并将当前语言设置成中文
      </button>
    </div>
  );
};

export default Page;
```

### Api

插件可以导出 Api 供用户使用。

### useIntl

获取当前应用程序的I18n实例，详见 [useIntl](https://docs.openinula.net/apis/Inula-intl#useintl)


### `addLocale` 动态添加多语言支持

无需创建并编写单独的多语言文件，使用 `addLocale()` 接口可以在运行时动态添加语言支持。它接受三个参数：

| 参数      | 类型     | 介绍                          |
| --------- | -------- | ----------------------------- |
| `name`    | `String` | 多语言的 Key                  |
| `message` | `Object` | 多语言的内容对象              |

例如，您想要动态引入繁体中文的多语言支持，可以编写代码如下：

```ts
import { addLocale } from 'inula';

addLocale(
  'zh-TW',
  {
    welcome: '歡迎！',
  },
);
```

### `getAllLocales` 获取多语言列表

通过 `getAllLocales()` 接口可以获取当前所有多语言选项的数组，包括通过 `addLocale()` 方法添加的多语言选项。该接口默认会在 `src/locales` 目录下寻找形如 `zh-CN.(js|json|ts)` 的文件，并返回多语言的 Key。

```ts
import { getAllLocales } from 'inula';

getAllLocales();
// [en-US, zh-CN, ...]
```

### `getLocale` 获取当前选择的语言

通过 `getLocale()` 接口可以获取当前选择的语言：

```ts
import { getLocale } from 'inula';

getLocale();
// zh-CN
```

### `setLocale` 设置语言

通过 `setLocale()` 接口可以使用编程的方法动态设置当前的语言。它有两个参数：

| 参数         | 类型      | 介绍                                       |
| ------------ | --------- | ------------------------------------------ |
| `lang`       | `String`  | 切换到的语言                               |
| `realReload` | `Boolean` | 切换时是否刷新页面，默认为 `true` 刷新页面 |

```ts
import { setLocale } from 'inula';

// 切换时刷新页面
setLocale('en-US');

// 切换时不刷新页面
setLocale('en-US', false);
```

### 其他插件中使用国际化插件

插件开发的时候，也可以暴露新的插件开发 Api 供其它插件使用，比如国际化插件暴露 `modifyIntlData` 

#### 声明和调用新的插件 Api

国际化插件中声明和调用新的插件 Api

```ts
// 增加 api 供其他的插件使用
api.registerMethod({ name: 'modifyIntlData' });

// 调用 modifyIntlData 方法，取得最终的 intl 数据
const cacheIntlConfig = api.applyPlugins({
    key: 'modifyIntlData',
    type: 'modify',
    initialValue: localeInfo,
});
```

#### 其他插件使用新的插件 Api

举个例子，可能是组件库的插件，如 antd ，组件库一般都有自己切换国际化的方法，这时候就可以跟国际化插件配合，

```ts
api.modifyIntlData((localeInfo: any) => {
    localeInfo = {
      ...localeInfo,
      ...antd.locales
    };
    return localeInfo;
});
```

## 临时文件

以下均为临时文件,临时文件是根据用户的配置和多个插件相互协作之后的数据生成的运行时的组件或方法，在每一次重启服务的时候都会重新生成。
因此用户无需过度关注这里面的代码逻辑，仅仅需要知道框架提供的能力即可 。在黑盒和白盒之间取一个均衡。

### UmiRoutes

```tsx
import { Routes, Route } from 'react-router-dom';
import React from 'react';
import { About } from '@/pages/About';
import { Home } from '@/pages/Home';

const UmiRoutes = () => {
  // 根据用户配置或者约定生成
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  )
}

export default UmiRoutes;
```

### Browser

```tsx
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

const Browser = (props) => {
  // 根据 history type 返回不同的 Browser
  return <BrowserRouter {...props}></BrowserRouter>
}

export default Browser;
```

### Provider

```tsx
import React from 'react';

const Provider = (props) => {
  const rootContainer = api.applyPlugins({
    type: 'modify',
    key: 'rootContainer',
    initialValue: props?.children,
    args: {},
  })
  return <>{rootContainer}</>
}

export default Provider;
```

### render

```tsx
import { createRoot } from 'react-dom/client'

export const render = (Root)=>{
    const container = document.getElementById('root') as HTMLDivElement
    const root = createRoot(container!)
    // 根据用户配置，可能是 ssr
    root.render(Root)
}
```



