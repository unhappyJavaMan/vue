<template>
    <div class="option2-container">
      <h1>選項 2 頁面</h1>
      <p>這是選項 2 的內容。您可以在這裡展示不同於選項 1 的信息。</p>
      <a-list :data-source="listData" bordered>
        <template #renderItem="{ item }">
          <a-list-item>{{ item }}</a-list-item>
        </template>
      </a-list>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const listData = ref(['項目 1', '項目 2', '項目 3', '項目 4']);
  </script>
  
  <style scoped>
  .option2-container {
    padding: 20px;
    background-color: #e6f7ff;
    border-radius: 4px;
  }
  
  h1 {
    color: #52c41a;
  }
  </style>