<template>
  <Container title="角色设置" show-add-btn @add="onAdd">
    <el-form>
      <div class="search">
        <el-form-item label="用户名">
          <el-input
            v-model="userName"
            placeholder="请输入"
            show-word-limit
            maxlength="20"
          ></el-input>
        </el-form-item>
        <el-form-item label="公司">
          <el-select v-model="companyId" placeholder="请选择">
            <el-option
              v-for="item in $store.state.form.companyList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-row type="flex" justify="center" class="row-btn">
          <el-button @click="onClear" class="my-btn">重置</el-button>
          <el-button type="primary" @click="onSeach" class="my-btn"
            >查询</el-button
          >
        </el-row>
      </div>
      <el-table
        :data="list"
        border
        class="my-table"
        :cell-class-name="cellClassName"
      >
        <el-table-column label="序号" type="index" min-width="66">
        </el-table-column>
        <el-table-column label="用户名" prop="userName" width="300">
          <template v-slot="{ row }">
            <span>{{ row.userName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="角色" prop="roleName">
          <template v-slot="{ row }">
            <span>{{ row.roleName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="公司" prop="companyName" width="300">
          <template v-slot="{ row }">
            <span>{{ row.companyName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template v-slot="{ row }">
            <el-button
              type="text"
              @click="onRemove(row)"
              class="btn-icon btn-remove"
              >删除</el-button
            >
            <el-button
              type="text"
              @click="onEdit(row)"
              class="btn-icon btn-edit"
              >调整角色</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="end" align="middle" class="row-pagination">
        <el-pagination
          :current-page.sync="pageIndex"
          :page-size.sync="pageSize"
          layout="total, prev, pager, next, sizes"
          :total="total"
          @size-change="onPageSizeChange"
          class="pagination"
        >
        </el-pagination>
      </el-row>
    </el-form>
    <Detail
      :visible.sync="showDialog"
      :data="detailData"
      @submit="onQuery"
    ></Detail>
  </Container>
</template>

<script setup>
import { ref, computed, watch, set } from "vue";
import { Message, MessageBox } from "element-ui";
import { useToggle } from "@vueuse/core";
import {
  useUser,
  useRemoveUser,
  useGetSeleteUserList,
  useGetCompanyAll,
  useGetRoleList,
} from "@/composables/role";
import { usePagination } from "@/composables/pagination";
import Container from "@/components/Container";
import Detail from "./components/Detail";

const { pageIndex, pageSize, onPageSizeChange } = usePagination();
const companyId = ref();
const userName = ref();

const condition = computed(() => {
  return {
    page: pageIndex.value,
    size: pageSize.value,
    companyId: companyId.value,
    userName: userName.value,
  };
});

const detailData = ref();

const { getList, list, getDetail, total } = useUser();

useGetSeleteUserList();

useGetRoleList();

useGetCompanyAll();

const onQuery = () => {
  getList(condition.value);
};

const onSeach = () => {
  pageIndex.value = 1;
  onQuery();
};
const onClear = () => {
  userName.value = "";
  companyId.value = "";
  pageIndex.value = 1;
  onQuery();
};

watch(
  [pageIndex, pageSize],
  () => {
    onQuery();
  },
  {
    immediate: true,
  }
);

const [showDialog] = useToggle();

const onAdd = () => {
  // list.value.unshift({
  //   id: '',
  //   name: '',
  //   isEdit: true,
  // })
  detailData.value = {};
  showDialog.value = true;
};

const preRow = ref(null);
const onEdit = (row) => {
  // preRow.value = {
  //   ...row
  // }
  // row.isEdit = true
  detailData.value = { ...row };
  showDialog.value = true;
};

const { data, err, request } = useRemoveUser();
const onRemove = (row) => {
  MessageBox.confirm(`确定删除 ${row.userName} 吗？`, "提示", {
    type: "warning",
  })
    .then(async () => {
      await request({
        id: row.id,
      });
      if (!err.value) {
        Message({
          type: "success",
          message: data.value.msg,
        });
        onQuery();
      }
    })
    .catch(() => {});
};

const onCancel = (index) => {
  set(list.value, index, {
    ...preRow.value,
    isEdit: false,
  });
};

const onSave = (row) => {
  row.isEdit = false;
};

const cellClassName = ({ column }) => {
  let { property } = column;
  if (property === "companyName" || property === "roleName") {
    return "text-left";
  }
  return "text-index";
};
</script>

<style lang="sass" scoped>
.search
  overflow: hidden
  .el-form-item
    float: left
    width: 350px
    .el-input,
    .el-select
      width: 234px
      /deep/ .el-input__inner
      height: 40px
.row
  &-condition
    margin-bottom: 20px
  &-pagination
    height: 64px
.el-form-item
  height: auto
  /deep/ .el-form-item__error
  top: 0
  font-size: 10px
.el-date-editor
  /deep/ .el-input__inner
  padding: 0 14px
  /deep/ .el-input__prefix
  display: none
.btn
  &-icon
    &:before
      content: ''
      display: inline-block
      margin-right: 4px
      width: 16px
      height: 16px
      background-size: 100%
      vertical-align: text-top
  &-edit
    &:before
      background-image: url('~@/assets/icon/edit.png')
  &-remove
    &:before
      background-image: url('~@/assets/icon/del.png')
</style>
