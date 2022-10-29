<template>
  <el-menu router :default-active="route.path" background-color="#2B2B2B">
    <MenuItem v-for="item in menu" :key="item.path" :menu="item"></MenuItem>
  </el-menu>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useStore } from "@/utils/vueApi";
import MenuItem from "components/MenuItem.vue";

const store = useStore();
const menu = computed(() => store.value.getters["user/menu"]);
const route = useRoute();
</script>
