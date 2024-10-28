<template>
  <div class="login-container">
    <a-form
    :model="formState"
    name="basic"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 16 }"
    autocomplete="off"
    @finish="onFinish"
    @finishFailed="onFinishFailed"
  >
    <a-form-item
      label="Username"
      name="username"
      :rules="[{ required: true, message: 'Please input your username!' }]"
    >
      <a-input v-model:value="formState.username" />
    </a-form-item>

    <a-form-item
      label="Password"
      name="password"
      :rules="[{ required: true, message: 'Please input your password!' }]"
    >
      <a-input-password v-model:value="formState.password" />
    </a-form-item>

    <a-form-item name="remember" :wrapper-col="{ offset: 8, span: 16 }">
      <a-checkbox v-model:checked="formState.remember">Remember me</a-checkbox>
    </a-form-item>

    <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
      <a-button type="primary" html-type="submit">Submit</a-button>
    </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
import { reactive, getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
const { proxy } = getCurrentInstance();

const router = useRouter();
const formState = reactive({
  username: '',
  password: '',
  remember: true,
});
const login = () => {
  return proxy.$axios.post('/api/auth/login', {
    account: formState.username,
    password: formState.password
  })
}

const onFinish = async (values) => {
  try {
    const response = await login()
    if (response.status === 200) {
      // 登入成功
      localStorage.setItem('token', response.data.loginToken);
      message.success('登入成功');
      router.push('/'); 
    } else {
      // 登入失敗
      message.error('登入失敗，請檢查帳號與密碼是否正確');
    }
  } catch (error) {
    message.error('登入失敗，請檢查帳號與密碼是否正確');
  }
};

const onFinishFailed = (errorInfo) => {
  message.error('請填寫帳號密碼。');
};

</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
}

.login-container form {
  width: 100%;
  max-width: 400px;
  padding: 20px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background-color: #fff;
}
</style>
