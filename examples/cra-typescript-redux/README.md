# A quick start Byme

## 可用脚本

在项目目录中，你可以运行以下命令：

- `yarn start` - 以开发模式运行应用程序。在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看。

- `yarn test` - 以交互式监视模式启动测试运行器。

- `yarn build` - 将应用程序构建为生产环境的 `build` 文件夹。

- `yarn lint` - 根据 eslint 规则对项目文件进行 lint。典型用例：持续集成环境，如Travis、CircleCI等。

- `yarn fix` - 与 `yarn lint` 相同，但在可能的情况下还会修复错误。典型用例：本地开发环境，git hooks。

## Redux 配置

该模板提供了基本的Redux配置，采用[基于功能的](https://redux.js.org/style-guide/style-guide/#structure-files-as-feature-folders-or-ducks)文件夹结构。你可以使用[Redux devtools浏览器扩展](http://extension.remotedev.io/)。示例功能包含在 `src/features` 文件夹中，注意与技术无关的 `features` 文件夹名称。基于Redux维护者的建议。

## 测试

测试使用[React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)进行。

## [Prettier](https://prettier.io/)

我添加了 `prettier` 来强制保持一致的格式。不喜欢尾随分号？请随意在 `.prettierrc` 文件中[调整 prettier 规则](https://prettier.io/docs/en/configuration.html)以匹配你的代码风格。

## 样式/CSS/样式化

为了示例应用程序的样式目的，我使用了[Materialize](https://materializecss.com/)。该模板默认使用Materialize。我希望确保这个模板是样式无关的，所以你可以插入任何你想要使用的CSS-in-JS或其他库/框架来进行样式化。

### 如何移除 Materialize

为了移除Materialize [MaterializeCSS](https://materializecss.com/)，请导航到 `public` 文件夹，打开 `index.html` 文件，并删除 `<head>` 中的以下CDN链接，位于第18-22行：
