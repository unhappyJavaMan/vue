import { createApp } from 'vue'
import { DatePicker } from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'
import axios from 'axios'


const app = createApp(App)

app.use(Antd)
app.use(DatePicker)
app.use(router)

// 创建全局 Axios 实例
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080', // 设置基础URL
    timeout: 5000, // 设置请求超时时间
    // 其他配置项...
  })
  
  // 将 Axios 实例挂载到全局
  app.config.globalProperties.$axios = axiosInstance

app.mount('#app')
