import { createApp } from 'vue'
import { DatePicker } from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'


const app = createApp(App)

app.use(Antd)
app.use(DatePicker);
app.use(router)

app.mount('#app')
