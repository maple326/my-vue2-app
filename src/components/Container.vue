<template>
  <div class="bg">
    <el-row
      type="flex"
      justify="space-between"
      align="middle"
      class="page-title"
    >
      <span class="cp">
        <a style="color: #000"> {{ prop.title }}</a>
      </span>
      <el-button
        type="primary"
        @click="emit('add')"
        class="btn"
        v-if="prop.showAddBtn"
        >新增</el-button
      >
    </el-row>
    <el-row class="main">
      <slot></slot>
    </el-row>
  </div>
</template>

<script setup>
const prop = defineProps({
  title: String,
  showAddBtn: Boolean,
});

const emit = defineEmits(["add"]);
</script>

<style lang="scss" scoped>
.bg {
  width: 100%;
  height: 100%;
  min-height: 800px;
  background: url("~@/assets/home-bg.png") bottom right no-repeat;
}

.main {
  padding: 24px 25px;
}

.page-title {
  padding: 0 24px;
  line-height: 55px;
  font-size: 18px;
  font-weight: 400;
  text-align: left;
  border-top: solid 6px #f0f2f5;
  border-bottom: solid 6px #f0f2f5;
}

.btn {
  padding: 0;
  width: 60px;
  height: 34px;
  line-height: 34px;
}
</style>
