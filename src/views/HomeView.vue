<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <div class="logo" :style="{ padding: collapsed ? '10px' : '20px' }" @click="handleLogoClick">
        <a-avatar :size="collapsed ? 60 : 80">
          <template #icon>
            <img src="../assets/cute.jpg" alt="Logo" class="logo-img" />
          </template>
        </a-avatar>
      </div>
      <!-- <a-avatar :size="{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }">
        <template #icon>
          <img src="../assets/cute.jpg" alt="Logo" class="logo" />
        </template>
      </a-avatar> -->
      <!-- <div class="logo">
        <img src="../assets/cute.jpg" alt="Logo" class="logo" />
      </div> -->
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <a-menu-item key="1">
          <router-link to="/Calendar">
            <CalendarOutlined />
            <span>行事曆</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="2">
          <router-link to="/Customer">
            <team-outlined />
            <span>會員</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="3">
          <router-link to="/Service">
            <AppstoreOutlined />
            <span>服務項目</span>
          </router-link>
        </a-menu-item>
        <!-- <a-sub-menu key="sub1">
          <template #title>
            <span>
              <user-outlined />
              <span>User</span>
            </span>
          </template>
          <a-menu-item key="3">Tom</a-menu-item>
          <a-menu-item key="4">Bill</a-menu-item>
          <a-menu-item key="5">Alex</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub2">
          <template #title>
            <span>
              <team-outlined />
              <span>Team</span>
            </span>
          </template>
          <a-menu-item key="6">Team 1</a-menu-item>
          <a-menu-item key="8">Team 2</a-menu-item>
        </a-sub-menu>
        <a-menu-item key="9">
          <file-outlined />
          <span>File</span>
        </a-menu-item> -->
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <div class="logo" />
        <div class="header-right">
          <!-- 添加其他元素，比如功能表
          <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="horizontal"
            :style="{ lineHeight: '64px', display: 'inline-block' }">
            <a-menu-item key="1">菜單1</a-menu-item>
            <a-menu-item key="2">菜單2</a-menu-item>
          </a-menu> -->

          <!-- 頭像和下拉選單 -->
          <a-dropdown>
            <template #overlay>
              <a-menu>
                <a-menu-item key="1">
                  <user-outlined />
                  個人資料
                </a-menu-item>
                <a-menu-item key="2">
                  <setting-outlined />
                  設定
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="3" @click="handleLogout">
                  <logout-outlined />
                  登出
                </a-menu-item>
              </a-menu>
            </template>
            <div class="avatar-wrapper">
              <span class="username">{{ username }}</span>
              <a-avatar :size="40" :src="avatarUrl">
                <template #icon>
                  <UserOutlined />
                </template>
              </a-avatar>
            </div>
          </a-dropdown>
        </div>
      </a-layout-header>
      <a-layout-content style="margin: 16px">
        <router-view />
      </a-layout-content>

      <a-layout-footer style="text-align: center">
        Ant Design ©2018 Created by Ant UED
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script setup>
import { ref, getCurrentInstance } from "vue";
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import { CalendarOutlined, TeamOutlined, UserOutlined, SettingOutlined, LogoutOutlined, AppstoreOutlined} from '@ant-design/icons-vue';

const { proxy } = getCurrentInstance();
const router = useRouter();
const collapsed = ref(true);
const username = ref("");
const selectedKeys = ref(["1"]);
const avatarUrl = ref('');
proxy.$axios.defaults.headers.common[
  "Authorization"
] = `Bearer ${localStorage.getItem("token")}`;

const handleLogout = async () => {
  const response = await proxy.$axios.post("/api/auth/logout");
  localStorage.removeItem("token");
  message.success("登出成功");
  router.push("/login");
};

const handleLogoClick = () => {
  router.push('/');
};


const getInfo = async () => {
  try {
    const response = await proxy.$axios.post("/api/users/getUserInfo", {});
    if (response.status === 200) {
      // 將會員資訊存儲到 localStorage
      localStorage.setItem("userInfo", JSON.stringify(response.data));
      // 解析用户信息
      const userInfo = response.data.user;

      // 存储其他可能需要的用户信息
      localStorage.setItem("userId", userInfo.id);
      localStorage.setItem("userEmail", userInfo.email);
      localStorage.setItem("userPhone", userInfo.phone);
      localStorage.setItem("userRoles", JSON.stringify(userInfo.roleIds));
      // 可以在這裡更新頁面上的用戶名和頭像
      // 例如：
      username.value = userInfo.nickName;
      // avatarUrl.value = response.data.avatarUrl;
    } else if (response.status === 401) {
      message.error("請先登入");
      router.push("/login");
    } else {
      message.error("獲取會員資訊失敗");
      router.push("/login");
    }
  } catch (error) {
    console.error("獲取會員資訊時發生錯誤:", error);
    message.error("獲取會員資訊失敗，請重新登入");
    router.push("/login");
  }
};

onMounted(() => {

  getInfo();

});
</script>
<style scoped>
.header-right {
  float: right;
  height: 64px;
  display: flex;
  align-items: center;
}

.avatar-wrapper {
  cursor: pointer;
  padding: 0 12px;
  display: flex;
  align-items: center;
}

.username {
  color: #8362d9;
  margin-right: 8px;
}

/* 確保 header 內容對齊 */
.ant-layout-header {
  padding: 0 50px;
  display: flex;
  justify-content: space-between;
}

#components-layout-demo-side .logo {
  height: 80%;
  margin: 80%;
  background: rgba(255, 255, 255, 0.3);
}

/* img {
  display: block;
  height: 100%;
  width: 100%;
  border-radius: 50%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
} */

/* .site-layout .site-layout-background {
  background: #fff;
}

[data-theme="dark"] .site-layout .site-layout-background {
  background: #141414;
} */
</style>