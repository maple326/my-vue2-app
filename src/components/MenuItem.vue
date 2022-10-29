<template>
  <div>
    <el-submenu
      v-if="prop.menu.children && prop.menu.children.length > 0"
      :index="prop.menu.path"
    >
      <template slot="title">
        <i
          v-if="prop.menu.meta && prop.menu.meta.icon"
          :class="`el-icon-${prop.menu.meta.icon}`"
        ></i>
        <span>{{ prop.menu.meta && prop.menu.meta.title }}</span>
      </template>
      <MenuItem
        v-for="subMenu in prop.menu.children"
        :key="subMenu.path"
        :menu="subMenu"
      ></MenuItem>
    </el-submenu>
    <el-menu-item v-else :index="prop.menu.path">
      <i
        v-if="prop.menu.meta && prop.menu.meta.icon"
        :class="`el-icon-${prop.menu.meta.icon}`"
      ></i>
      <template #title>{{ prop.menu.meta && prop.menu.meta.title }}</template>
    </el-menu-item>
  </div>
</template>

<script>
export default {
  name: "MenuItem",
};
</script>

<script setup>
const prop = defineProps({
  menu: {
    type: Object,
    default: () => ({}),
  },
});
</script>

<style lang="sass" scoped>
$color: #ccc
$color-active: #fff
$bg-color: #2B2B2B
$menu-item-height: 40px

.el-menu
  border-right: none
  cursor: pointer
  .el-menu-item
    color: $color
    &.is-active
      color: $color-active
  .el-submenu
    /deep/ .el-submenu__title
      height: $menu-item-height
      line-height: $menu-item-height
      color: $color
      .el-submenu__icon-arrow
        transform: rotate(-90deg)
        font-size: 16px
    &.is-opened
      /deep/ .el-submenu__title
        .el-submenu__icon-arrow
          transform: rotate(0)
    &.is-active
      /deep/ .el-submenu__title
        color: $color-active
    /deep/ .el-menu
      &-item
        height: $menu-item-height
        line-height: $menu-item-height
        font-size: 12px
        color: #ccc
        &::before
          content: ''
          display: inline-block
          margin-right: 7px
          width: 4px
          height: 4px
          border-radius: 50px
          background: rgba(255,255,255,0.15)
          vertical-align: middle
        &.is-active
          color: $color-active
          &::before
            background: $color-active
</style>
