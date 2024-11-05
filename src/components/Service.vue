<template>
  <a-button
    class="editable-add-btn"
    style="margin-bottom: 8px"
    @click="showModal"
    >新增服務</a-button
  >

  <!-- 服務列表 -->
  <a-table :columns="columns" :data-source="services">
    <template #headerCell="{ column }">
      <template v-if="column.key === 'name'">
        <span>
          <smile-outlined />
          Name
        </span>
      </template>
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'serviceName'">
        <span>{{ record.serviceName }}</span>
      </template>
      <template v-if="column.key === 'duration'">
        <span>{{ record.duration }} 分鐘</span>
      </template>
      <template v-if="column.key === 'price'">
        <span>{{ record.price }} 元</span>
      </template>
      <template v-if="column.key === 'action'">
        <a-space>
          <a-button type="link" @click="editService(record)">編輯</a-button>
          <a-button type="link" danger @click="deleteService(record)"
            >刪除</a-button
          >
        </a-space>
      </template>
    </template>
  </a-table>

  <a-modal
    v-model:open="isModalVisible"
    title="新增客戶"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form :model="serviceForm" :rules="rules" @finish="onFinish">
      <a-form-item
        label="服務名稱"
        name="serviceName"
        :rules="[
          { required: true, message: '請輸入服務名稱', trigger: 'blur' },
        ]"
      >
        <a-input v-model:value="serviceForm.serviceName" />
      </a-form-item>

      <a-form-item
        label="服務時間(分鐘)"
        name="duration"
        :rules="[
          { required: true, message: '請輸入服務時間', trigger: 'blur' },
          {
            type: 'number',
            min: 1,
            message: '時間必須大於0分鐘',
            trigger: 'blur',
          },
        ]"
      >
        <a-input-number v-model:value="serviceForm.duration" />
      </a-form-item>

      <a-form-item
        label="服務價錢"
        name="price"
        :rules="[
          { required: true, message: '請輸入服務價錢', trigger: 'blur' },
          {
            type: 'number',
            min: 0,
            message: '價錢必須大於等於0',
            trigger: 'blur',
          },
        ]"
      >
        <a-input-number
          v-model:value="serviceForm.price"
          :precision="2"
          :step="100"
        />
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit">新增服務</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
  
  <script setup>
import { ref, reactive, onMounted, getCurrentInstance } from "vue";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
import { SmileOutlined } from "@ant-design/icons-vue"; // 导入 smile-outlined 组件

const { proxy } = getCurrentInstance();
const router = useRouter();
const services = ref([]);

const isModalVisible = ref(false); // 控制模态框的可见性
const showModal = () => {
  isModalVisible.value = true; // 显示模态框
};

const handleCancel = () => {
  isModalVisible.value = false; // 关闭模态框
};

const serviceForm = reactive({
  serviceName: "",
  duration: 30,
  price: 0,
});

const columns = [
  { title: "服務名稱", dataIndex: "serviceName", key: "serviceName" },
  { title: "時間(分鐘)", dataIndex: "duration", key: "duration" },
  {
    title: "價錢",
    dataIndex: "price",
    key: "price",
  },
  {
    title: "操作",
    dataIndex: "action",
    key: "action",
  },
];

// 獲取服務列表
const getServices = async () => {
  try {
    const response = await proxy.$axios.post(
      "/api/userService/getServicesByUserId"
    );

    if (response.status === 200) {
      services.value = response.data.services;
    } else if (response.status === 401) {
      message.error("請重新登入");
      router.push("/login");
    } else {
      message.error("獲取服務列表失敗");
    }
  } catch (error) {
    console.log(error);
    message.error("獲取服務列表失敗", error);
  }
};

// 新增服務
const handleOk = async () => {
  try {
    const response = await proxy.$axios.post(
      "/api/userService/createServiceByUser",
      {
        serviceName: serviceForm.serviceName,
        duration: serviceForm.duration,
        price: serviceForm.price,
      }
    );
    if (response.status === 200) {
      message.success("新增服務成功");
      getServices();
    } else {
      message.error("新增失败");
    }
  } catch (error) {
    message.error("新增失敗");
  }
};

onMounted(() => {
  getServices();
});
</script>