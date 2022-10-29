<template>
  <Container title="型谱维护" show-add-btn @add="onAdd">
    <el-form>
      <el-table
        :data="list"
        border
        class="my-table"
        :cell-class-name="cellClassName"
      >
        <el-table-column label="序号" type="index" min-width="66">
        </el-table-column>
        <el-table-column label="品牌" prop="brand" min-width="150">
        </el-table-column>
        <el-table-column label="轿车/SUV/MPV" prop="type" min-width="119">
          <template v-slot="{ row }">{{ getText(row.type) }}</template>
        </el-table-column>
        <el-table-column
          label="含混动/纯电"
          prop="useElectricity"
          min-width="100"
        >
          <template v-slot="{ row }">{{
            getUseElectricityEnumText(row.useElectricity)
          }}</template>
        </el-table-column>
        <el-table-column label="细分市场" prop="market" min-width="181">
        </el-table-column>
        <el-table-column label="车型名称" prop="name" min-width="100">
        </el-table-column>
        <el-table-column label="车型代号" prop="code" min-width="100">
        </el-table-column>
        <el-table-column label="平台/架构" prop="platform" min-width="100">
        </el-table-column>
        <el-table-column label="SOP" prop="sop" min-width="100">
        </el-table-column>
        <el-table-column label="总销量" prop="totalSaleNum" min-width="100">
        </el-table-column>
        <el-table-column label="驱动系统" prop="driveSystem" min-width="171">
        </el-table-column>
        <el-table-column label="制造地" prop="madePlace" min-width="100">
        </el-table-column>
        <el-table-column label="操作" min-width="188" fixed="right">
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
import { getText } from "@/utils/enums/vehicleTypeEnum";
import { getText as getUseElectricityEnumText } from "@/utils/enums/useElectricityEnum";
import { useTypeMaintenance } from "@/composables/typeMaintenance";
import { useRemoveTypeMaintenance } from "@/composables/typeMaintenance";
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

const { getList, list, getDetail, total } = useTypeMaintenance();

const onQuery = () => {
  getList(condition.value);
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

const { data, err, request } = useRemoveTypeMaintenance();
const onRemove = (row) => {
  MessageBox.confirm(`确定删除型谱 ${row.brand} 吗？`, "提示", {
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
