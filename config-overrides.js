const {fixBabelImports,override,addLessLoader} = require('customize-cra')

module.exports = override(
  fixBabelImports('import',{
    libraryName:'antd',
    libraryDirectory:'es',
    style:true
  }),
  addLessLoader({
    javascriptEnabled:true,
    modifyVars:{'@primary-color':'coral'}
  })
)
