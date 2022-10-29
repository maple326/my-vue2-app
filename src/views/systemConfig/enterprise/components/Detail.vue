<template>
  <Dialog :visible.sync="innerVisible" v-bind="$attrs" class="my-dialog">
    <template #title>
      <el-row type="flex" class="row-title">{{
        `${formData.id ? "编辑" : "新增"}企业`
      }}</el-row>
    </template>
    <el-form
      :model="formData"
      :rules="rules"
      ref="form"
      label-position="left"
      class="my-form"
    >
      <el-form-item label="企业名称" prop="name">
        <el-input
          v-model="formData.name"
          placeholder="请输入企业名称"
          show-word-limit
          maxlength="20"
        ></el-input>
      </el-form-item>
    </el-form>
    <el-row type="flex" justify="center" class="row-btn">
      <el-button @click="onCancel" class="my-btn">返回</el-button>
      <el-button type="primary" @click="onOk" class="my-btn">确定</el-button>
    </el-row>
  </Dialog>
</template>

<script setup>
import { ref, computed, watch, nextTick } from "vue";
import { Message } from "element-ui";
import Dialog from "@/components/Dialog";
import { enterpriseRules as rules } from "@/utils/validator";
import { useAddEnterprise, useEditEnterprise } from "@/composables/enterprise";

const prop = defineProps({
  visible: Boolean,
  data: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["update:visible", "submit"]);

const innerVisible = computed({
  get() {
    return prop.visible;
  },
  set(val) {
    emit("update:visible", val);
  },
});

const formData = ref({
  id: "",
  name: "",
});
watch(innerVisible, async (val) => {
  if (val) {
    if (prop.data) {
      formData.value = prop.data;
    } else {
      formData.value = {};
      await nextTick();
      form.value.clearValidate();
    }
  }
});
const form = ref(null);

const onCancel = async () => {
  innerVisible.value = false;
  formData.value = {};
  await nextTick();
  form.value.clearValidate();
};

let {
  request: addEnterprise,
  data: addEnterpriseData,
  err: addEnterpriseErr,
} = useAddEnterprise();
let {
  request: editEnterprise,
  data: editEnterpriseData,
  err: editEnterpriseErr,
} = useEditEnterprise();

const onOk = () => {
  form.value.validate(async (valid) => {
    if (valid) {
      let { id, name } = formData.value;
      let isEdit = !!id || id === 0;
      isEdit
        ? await editEnterprise({
            id,
            companyName: name,
          })
        : await addEnterprise({
            companyName: name,
          });
      let err = isEdit ? editEnterpriseErr.value : addEnterpriseErr.value;
      let message = isEdit ? editEnterpriseData.value : addEnterpriseData.value;
      if (!err) {
        Message({
          type: "success",
          message: message?.msg,
        });
        onCancel();
        emit("submit");
      }
    }
  });
};
</script>

<style lang="sass" scoped>
.my-dialog
  text-align: left
/deep/ .row
  &-title
    font-weight: 500;
    color: #606266;
  &-btn
    padding: 40px 0 12px;
.delivery-wrapper
  max-height: 400px
  overflow-y: auto
.my-form
  margin: 0 auto
  .el-form-item
    display: flex
    justify-content: center
    &+.el-form-item
      margin-top: 24px
  .el-input,
  .el-select
    width: 234px
    /deep/ .el-input__inner
      height: 40px
</style>
