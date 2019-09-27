//axios 的配置
import axios from 'axios';
import config from './config';
import qs from 'qs';

axios.defaults.baseURL = config.baseURL;  //baseURL的配置

//拦截器
//相应成功后拦截
axios.interceptors.response.use((response) => {
  //console.log(response, '+++++++++++++');
  //response是axios封装过后的属性 response.data是服务器返回的数据
  //封装返回的数据
  let res = {
    ...response,
    data: response.data.data,
    status: response.data.status,
    statusText: response.data.message
  };
  return res;
}, (error) => {
  //相应失败后拦截
  return Promise.reject(error);
});

//请求发送前拦截
axios.interceptors.request.use((config) => {
  //请求发送成功时对应的函数
  //res.config.data时json格式的数据，先转成js数据，在使用qs转为表单格式数据
  if(config.method === 'post'){
    config.data = qs.stringify(config.data);
  }
  return config
},(err) => {
  //请求
  return Promise.reject(err);
});
export default axios;