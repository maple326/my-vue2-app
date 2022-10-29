<template>
  <Dialog :visible.sync="innerVisible" v-bind="$attrs" class="my-dialog">
    <template #title>
      <el-row type="flex" class="row-title">{{
        `${formData.id ? "编辑" : "新增"}用户`
      }}</el-row>
    </template>
    <el-form
      :model="formData"
      :rules="rules"
      ref="form"
      label-width="100px"
      label-position="left"
      class="my-form"
    >
      <el-form-item label="用户组名称" prop="name">
        <el-input
          v-model="formData.name"
          placeholder="请输入用户组名称"
          show-word-limit
          maxlength="20"
          :disabled="Boolean(formData.id)"
        ></el-input>
      </el-form-item>
      <el-form-item label="用户姓名" prop="systemUid">
        <el-select
          v-model="formData.systemUid"
          placeholder="请选择用户姓名"
          multiple
        >
          <el-option
            v-for="item in $store.state.form.userList"
            :key="item.systemUid"
            multiple
            :label="item.userName"
            :value="item.systemUid"
          />
        </el-select>
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
import { groupingRules as rules } from "@/utils/validator";
import { useAddUser, useEditUser } from "@/composables/role";
import { useStore } from "@/utils/vueApi";
const prop = defineProps({
  visible: Boolean,
  data: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["update:visible", "submit"]);
const Store = useStore();
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
  systemUid: [],
  role: [],
  companyId: "",
  userName: "",
  wechatId: "",
  email: "",
  companyName: "",
});
watch(innerVisible, async (val) => {
  if (val) {
    if (prop.data) {
      formData.value = prop.data;
    } else {
      formData.value = {
        id: "",
        systemUid: [],
        role: [],
        companyId: "",
        userName: "",
        wechatId: "",
        email: "",
        companyName: "",
      };
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

let { request: addUser, data: addUserData, err: addUserErr } = useAddUser();
let { request: editUser, data: editUserData, err: editUserErr } = useEditUser();

const onOk = () => {
  form.value.validate(async (valid) => {
    if (valid) {
      let {
        id,
        systemUid,
        role,
        companyId,
        userName,
        wechatId,
        email,
        companyName,
      } = formData.value;
      let isEdit = !!id || id === 0;
      isEdit
        ? await editUser({
            id,
            systemUid,
            role: JSON.stringify(role),
            companyId,
            userName,
            wechatId,
            email,
            companyName,
          })
        : await addUser({
            systemUid,
            role: JSON.stringify(role),
            companyId,
            userName,
            wechatId,
            email,
            companyName,
          });
      let err = isEdit ? editUserErr.value : addUserErr.value;
      let message = isEdit ? editUserData.value : addUserData.value;
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
my-form
.my-dialog
  text-align: left
  .row-btn
    padding: 40px 0 12px
    height: 85px
  /deep/.el-form-item__content
    margin-left: 0px !important
  /deep/ .row
  &-title
    font-weight: 500
    color: #606266
    &-btn
      padding: 40px 0 12px
  .my-form
    margin: 0 auto
    .el-form-item
      display: flex
      justify-content: center
      &+.el-form-item
        margin-top: 24px
    .el-input,
    .el-select
      width: 360px
      /deep/ .el-input__inner
      min-height: 40px
      border-color: rgb(220, 223, 230)
</style>
