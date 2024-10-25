<template>
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: '#a880ff',
        colorWarning: '#fa5914'
      },
    }"
  ></a-config-provider>
  <router-view />
</template>
<script>

export default {}
</script>
