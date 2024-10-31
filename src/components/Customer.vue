<template>
  <a-button
    class="editable-add-btn"
    style="margin-bottom: 8px"
    @click="showModal"
    >新增客戶</a-button
  >
  <a-table :dataSource="dataSource" :columns="columns" />

  <a-modal
    v-model:open="isModalVisible"
    title="新增客戶"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form>
      <a-form-item label="姓名">
        <a-input v-model="newCustomer.name" />
      </a-form-item>
      <a-form-item label="電子信箱">
        <a-input v-model="newCustomer.email" />
      </a-form-item>
      <a-form-item label="電話">
        <a-input v-model="newCustomer.phone" />
      </a-form-item>
      <a-form-item label="生日">
        <a-date-picker v-model="newCustomer.birthday" />
      </a-form-item>
      <a-form-item label="性別">
        <a-radio-group v-model="newCustomer.gender">
          <a-radio value="Male">男</a-radio>
          <a-radio value="Female">女</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { onMounted ,getCurrentInstance, ref } from "vue";
import { message } from "ant-design-vue";

export default {
  setup() {
    const { proxy } = getCurrentInstance();
    const dataSource = ref([]);
    const isModalVisible = ref(false); // 控制模态框的可见性
    const newCustomer = ref({ // 新客户的输入数据
      name: '',
      email: '',
      phone: '',
      birthday: null,
      gender: '',
    });

    const getCustomers = async () => {
      try {
        const response = await proxy.$axios.post('/api/customer/getCustomerByUserId');
        dataSource.value = response.data.customers
        // 处理响应数据
      } catch (error) {
        proxy.$message.error('Error fetching customers:', error); // 使用 proxy 访问 message
      }
    };

    const showModal = () => {
      isModalVisible.value = true; // 显示模态框
    };

    const handleOk = () => {
      console.log(newCustomer)
      console.log(newCustomer.value.name);
      // 处理添加客户的逻辑
      console.log(newCustomer.value);
      isModalVisible.value = false; // 关闭模态框
    };

    const handleCancel = () => {
      isModalVisible.value = false; // 关闭模态框
    };

    onMounted(() => {
      getCustomers(); // 组件加载时调用
    });

    return {
      dataSource,
      isModalVisible,
      newCustomer,
      showModal,
      handleOk,
      handleCancel,
      columns: [
        {
          title: "姓名",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "年齡",
          dataIndex: "age",
          key: "age",
        },
        {
          title: "電話",
          dataIndex: "phone",
          key: "phone",
        },
        {
          title: "電子信箱",
          dataIndex: "email",
          key: "email",
        },
        {
          title: "狀態",
          dataIndex: "status",
          key: "status",
        },
        {
          title: "操作",
          dataIndex: "action",
          key: "action",
        },
      ],
    };
  },
};
</script>