<template>
  <a-button
    class="editable-add-btn"
    style="margin-bottom: 8px"
    @click="showModal"
    >新增客戶</a-button
  >
  <!-- <a-table :dataSource="dataSource" :columns="columns" /> -->
  <a-table :columns="columns" :data-source="dataSource">
    <template #headerCell="{ column }">
      <template v-if="column.key === 'name'">
        <span>
          <smile-outlined />
          Name
        </span>
      </template>
    </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'name'">
        <a>
          {{ record.name }}
        </a>
      </template>
      <template v-if="column.key === 'status'">
        <a-tag :color="record.status === 'Active' ? 'green' : 'red'">
          {{ record.status === "Active" ? "開啟" : "關閉" }}
        </a-tag>
      </template>

      <template v-else-if="column.key === 'action'">
        <span>
          <a
            v-if="record.status === 'Revoke'"
            @click="updateCustomerStatus(record.id, true)"
            style="color: green"
            >開啟</a
          >
          <a v-else style="color: grey; cursor: not-allowed">開啟</a>
          <a-divider type="vertical" />
          <a
            v-if="record.status === 'Active'"
            @click="updateCustomerStatus(record.id, false)"
            style="color: red"
            >關閉</a
          >
          <a v-else style="color: grey; cursor: not-allowed">關閉</a>
          <a-divider type="vertical" />

          <a class="ant-dropdown-link">
            More actions
            <down-outlined />
          </a>
        </span>
      </template>
    </template>
  </a-table>

  <a-modal
    v-model:open="isModalVisible"
    title="新增客戶"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }"
      :model="newCustomer"
    >
      <a-form-item
        label="姓名"
        name="name"
        :rules="[
          {
            required: true,
            message: 'Please input your username!',
            trigger: 'blur',
          },
        ]"
      >
        <a-input v-model:value="newCustomer.name" />
      </a-form-item>
      <a-form-item
        label="電子信箱"
        name = "email"
        :rules="[
          { required: true, message: '請輸入 Email', trigger: 'blur' },
          {
            type: 'email',
            message: '請輸入有效的 Email 格式',
            trigger: 'blur',
          },
        ]"
      >
        <a-input v-model:value="newCustomer.email" />
      </a-form-item>
      <a-form-item
        label="電話"
        name="phone"
        :rules="[
          { required: true, message: '請輸入手機號碼', trigger: 'blur' },
          {
            pattern: /^09\d{8}$/,
            message: '請輸入有效的手機號碼格式',
            trigger: 'blur',
          },
        ]"
      >
        <a-input v-model:value="newCustomer.phone" />
      </a-form-item>
      <a-form-item label="生日">
        <a-date-picker v-model:value="newCustomer.birthDate" />
      </a-form-item>
      <a-form-item label="性別">
        <a-radio-group v-model:value="newCustomer.gender">
          <a-radio value="Male">男</a-radio>
          <a-radio value="Female">女</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { onMounted, getCurrentInstance, ref, reactive } from "vue";
import { message } from "ant-design-vue";
import {SmileOutlined, DownOutlined} from '@ant-design/icons-vue'; // 导入 smile-outlined 组件


export default {
  components: {
    SmileOutlined,
    DownOutlined,
  },
  setup() {
    const columns = [
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
        title: "生日",
        dataIndex: "birthday",
        key: "birthday",
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
    ];
    const { proxy } = getCurrentInstance();
    const dataSource = ref([]);
    const isModalVisible = ref(false); // 控制模态框的可见性
    const newCustomer = ref({
      // 新客户的输入数据
      name: "",
      email: "",
      phone: "",
      birthDate: null,
      gender: "",
    });

    onMounted(() => {
      getCustomers(); // 组件加载时调用
    });

    const showModal = () => {
      isModalVisible.value = true; // 显示模态框
    };

    const handleCancel = () => {
      isModalVisible.value = false; // 关闭模态框
    };

    const updateCustomerStatus = async (customerId, status) => {
      try {
        const response = await proxy.$axios.post(
          "/api/customer/updateCustomerStatusByUser",
          {
            id: customerId,
            status: status,
          }
        );
        if (response.status === 200) {
          message.success("撤销成功");
          getCustomers(); // 重新获取客户列表
        } else {
          message.error("撤销失败");
        }
      } catch (error) {
        message.error("撤销失败", error);
      }
    };

    const handleOk = async () => {
      // 处理添加客户的逻辑
      try {
        const response = await proxy.$axios.post(
          "/api/customer/createCustomerByUserId",
          newCustomer.value
        );
        if (response.status === 200) {
          message.success("新增成功");
          isModalVisible.value = false; // 关闭模态框
          getCustomers(); // 重新获取客户列表
        } else {
          message.error("新增失败");
        }
      } catch (error) {
        message.error("新增失败", error);
      }
    };

    const getCustomers = async () => {
      try {
        const response = await proxy.$axios.post(
          "/api/customer/getCustomerByUserId"
        );

        response.data.customers.forEach((customer) => {
          if (customer.birthday !== null) {
            customer.age = calculateAge(customer.birthday);
          }
        });
        dataSource.value = response.data.customers;

        // 处理响应数据
      } catch (error) {
        message.error("get Customers info error", error);
      }
    };

    function calculateAge(birthDateString) {
      // 將生日字符串轉換為 Date 對象
      const birthDate = new Date(birthDateString);
      // 獲取當前日期
      const today = new Date();

      // 計算年份差異
      let age = today.getFullYear() - birthDate.getFullYear();

      // 獲取生日的月份和日期
      const birthMonth = birthDate.getMonth();
      const birthDay = birthDate.getDate();

      // 獲取當前的月份和日期
      const currentMonth = today.getMonth();
      const currentDay = today.getDate();

      // 如果當前月份小於生日月份，或者月份相同但當前日期小於生日日期
      // 則年齡減1，因為還沒到生日
      if (
        currentMonth < birthMonth ||
        (currentMonth === birthMonth && currentDay < birthDay)
      ) {
        age--;
      }

      return age;
    }

    return {
      dataSource,
      isModalVisible,
      newCustomer,
      showModal,
      handleOk,
      handleCancel,
      updateCustomerStatus,
      columns,
    };
  },
};
</script>