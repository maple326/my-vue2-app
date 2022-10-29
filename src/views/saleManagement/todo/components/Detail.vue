<template>
  <el-form>
    <el-row
      type="flex"
      justify="space-between"
      align="middle"
      class="row row-condition"
    >
      <div>{{ prop.date }}</div>
      <el-row type="flex" align="middle">
        <el-button
          type="text"
          @click="onDownload(row)"
          class="btn-icon btn-download"
          >上传模板下载</el-button
        >
        <Upload
          isEdit
          :fileType="[
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel',
          ]"
          fileTypeErrorMsg="只能上传excel文件"
        >
          <el-button type="primary">批量上传</el-button>
        </Upload>
      </el-row>
    </el-row>
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
      </el-table-column>
      <el-table-column
        label="含混动/纯电"
        prop="useElectricity"
        min-width="100"
      >
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
    <el-row type="flex" justify="center">
      <el-button type="danger" @click="onView(row)" class="my-btn"
        >退回</el-button
      >
      <el-button type="primary" @click="onView(row)" class="my-btn"
        >同意</el-button
      >
    </el-row>
  </el-form>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRouter } from "@/utils/vueApi";
import { useTypeMaintenance } from "@/composables/typeMaintenance";
import { usePagination } from "@/composables/pagination";
import Upload from "@/components/Upload";

const prop = defineProps({
  date: String,
  data: Array,
});

const { pageIndex, pageSize, onPageSizeChange } = usePagination();

const condition = computed(() => {
  return {
    page: pageIndex.value,
    size: pageSize.value,
  };
});

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

const router = useRouter();
const onView = (row) => {
  router.push({
    name: "todoDetail",
    params: {
      id: row.id,
    },
  });
};

const cellClassName = ({ column }) => {
  return "text-index";
};
</script>

<style lang="sass" scoped>
.row
  &-condition
    margin: -5px 0 17px
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
.el-button
  &+.el-button
    margin-left: 18px
  &.btn-download
    margin-right: 18px
</style>
