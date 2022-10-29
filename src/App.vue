<template>
  <div id="app">
    <router-view v-if="isLogin" />
    <el-container v-else>
      <el-header>
        <Header></Header>
      </el-header>
      <el-container>
        <el-aside width="210px">
          <Menu></Menu>
        </el-aside>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { computed } from "vue";
import Header from "@/components/Header.vue";
import Menu from "@/components/Menu.vue";
import { useRoute } from "@/utils/vueApi";

const route = useRoute();

const isLogin = computed(() => route.value?.meta?.isLogin);
</script>

<style lang="scss">
$header-height: 60px;

#app {
  font-family: $font-family;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  .el-header {
    padding: 0;
  }

  .el-aside {
    box-sizing: border-box;
    height: calc(100vh - #{$header-height});
    background: #4c4c4c;
  }

  .el-main {
    padding: 0;
    height: calc(100vh - #{$header-height});
    overflow: auto;
  }
}
</style>
