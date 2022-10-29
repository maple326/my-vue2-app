<template>
  <Container title="企业管理" show-add-btn @add="onAdd">
    <router-view></router-view>
    <el-row type="flex" justify="end">
      <el-button @click="onExport">导出Excel</el-button>
    </el-row>
    <el-form>
      <el-table
        :data="list"
        border
        class="my-table"
        :cell-class-name="cellClassName"
        id="table"
      >
        <el-table-column label="序号" type="index" min-width="66">
        </el-table-column>
        <el-table-column label="企业名称" prop="name" min-width="581">
          <template v-slot="{ row }">
            <el-input v-if="row.isEdit" v-model="row.name"></el-input>
            <span v-else>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="537">
          <template v-slot="{ row, $index }">
            <template v-if="row.isEdit">
              <el-button
                type="text"
                class="btn-icon btn-remove"
                @click="onCancel($index)"
                >删除</el-button
              >
              <el-button
                type="text"
                class="btn-icon btn-edit"
                @click="onSave(row)"
                >保存</el-button
              >
            </template>
            <template v-else>
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
                >编辑</el-button
              >
            </template>
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
import { export_json_to_excel } from "/src/utils/Export2Excel";
import { useEnterprise } from "@/composables/enterprise";
import { useRemoveEnterprise } from "@/composables/enterprise";
import { usePagination } from "@/composables/pagination";
import Container from "@/components/Container";
import Detail from "./components/Detail";

const { pageIndex, pageSize, onPageSizeChange } = usePagination();

const condition = computed(() => {
  return {
    page: pageIndex.value,
    size: pageSize.value,
  };
});

const detailData = ref();

const { getList, list, getDetail, total } = useEnterprise();

const onQuery = () => {
  getList(condition.value);
  console.log(list);
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
  console.log(list);
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

const { data, err, request } = useRemoveEnterprise();
const onRemove = (row) => {
  MessageBox.confirm(`确定删除企业 ${row.name} 吗？`, "提示", {
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
  if (property === "name") {
    return "text-left";
  }
  return "text-index";
};

const formatJson = (filterVal, jsonData) => {
  return jsonData.map((v) => filterVal.map((j) => v[j]));
};

const onExport = () => {
  const tHeader = ["序号", "文章标题", "作者", "阅读数", "发布时间"]; // excel 表格头
  const filterVal = ["id", "name", "author", "pageviews", "date"];
  const data = formatJson(filterVal, list.value); // 自行洗数据 按序排序的一个array数组
  export_json_to_excel({
    header: tHeader,
    data,
  });
};
</script>

<style lang="sass" scoped>
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
</style>
