const tsImportPluginFactory = require('ts-import-plugin')
const { getLoader } = require('react-app-rewired')
const rewireLess = require('react-app-rewire-less')
const rewireBabelLoader = require('react-app-rewire-babel-loader')
const path = require('path')
const fs = require('fs')

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)

module.exports = function override(config, env) {
  const tsLoader = getLoader(
    config.module.rules,
    rule =>
      rule.loader &&
      typeof rule.loader === 'string' &&
      rule.loader.includes('ts-loader'),
  )

  tsLoader.options = {
    getCustomTransformers: () => ({
      before: [
        tsImportPluginFactory({
          libraryDirectory: 'es',
          libraryName: 'antd',
          style: true,
        }),
      ],
    }),
  }

  config = config = rewireBabelLoader.include(
    config,
    resolveApp('node_modules/@feathersjs'),
  )

  config = rewireLess.withLoaderOptions({
    modifyVars: { '@primary-color': '#5FC6DC' },
  })(config, env)

  return config
}
