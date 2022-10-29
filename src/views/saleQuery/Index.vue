<template>
  <Container title="销量查询">
    <el-form>
      <el-table
        :data="list"
        border
        class="my-table"
        :cell-class-name="cellClassName"
      >
        <el-table-column label="序号" type="index" min-width="66">
        </el-table-column>
        <el-table-column label="发布版本" prop="date" min-width="176">
        </el-table-column>
        <el-table-column label="填报单位" prop="company" min-width="177">
        </el-table-column>
        <el-table-column label="填报人" prop="writer" min-width="176">
        </el-table-column>
        <el-table-column label="填报总销量" prop="totalSaleNum" min-width="176">
        </el-table-column>
        <el-table-column label="状态" prop="status" min-width="177">
        </el-table-column>
        <el-table-column label="操作" min-width="188" fixed="right">
          <template v-slot="{ row }">
            <el-button
              type="text"
              @click="onView(row)"
              class="btn-icon btn-view"
              >查看详情</el-button
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
  </Container>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { Message, MessageBox } from "element-ui";
import { useRouter, useRoute } from "@/utils/vueApi";
import { useTodo } from "@/composables/todo";
import { useRemoveTodo } from "@/composables/todo";
import { usePagination } from "@/composables/pagination";
import Container from "@/components/Container";

const { pageIndex, pageSize, onPageSizeChange } = usePagination();

const condition = computed(() => {
  return {
    page: pageIndex.value,
    size: pageSize.value,
  };
});

const detailData = ref();

const { getList, list, getDetail, total } = useTodo();

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

const { data, err, request } = useRemoveTodo();
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

const router = useRouter();
const detailDate = ref();
const onView = (row) => {
  detailDate.value = row.date;
  router.value.push({
    query: {
      id: row.id,
    },
  });
};

const route = useRoute();
const detailId = computed(() => route.value.query.id);

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
