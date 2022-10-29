<template>
  <Dialog :visible.sync="innerVisible" width="977px" class="my-dialog">
    <template #title>
      <el-row type="flex" class="row-title">{{
        `${formData.id ? "编辑" : "新增"}`
      }}</el-row>
    </template>
    <el-form
      :model="formData"
      :rules="rules"
      ref="form"
      label-position="right"
      label-width="120px"
      class="my-form"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="品牌" prop="brand">
            <el-input
              v-model="formData.brand"
              placeholder="请输入品牌"
              show-word-limit
              maxlength="20"
            ></el-input>
          </el-form-item>
          <el-form-item label="轿车/SUV/MPV" prop="type">
            <el-select v-model="formData.type">
              <el-option
                v-for="val in vehicleTypeEnum"
                :key="val"
                :label="getText(val)"
                :value="val"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="含混动/纯电" prop="useElectricity">
            <el-select v-model="formData.useElectricity">
              <el-option
                v-for="val in useElectricityEnum"
                :key="val"
                :label="getUseElectricityEnumText(val)"
                :value="val"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="细分市场" prop="market">
            <el-input
              v-model="formData.market"
              placeholder="请输入细分市场"
              show-word-limit
              maxlength="20"
            ></el-input>
          </el-form-item>
          <el-form-item label="车型名称" prop="name">
            <el-input
              v-model="formData.name"
              placeholder="请输入车型名称"
              show-word-limit
              maxlength="20"
            ></el-input>
          </el-form-item>
          <el-form-item label="制造地" prop="madePlace">
            <el-input
              v-model="formData.madePlace"
              placeholder="请输入制造地"
              show-word-limit
              maxlength="20"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车型代号" prop="code">
            <el-input
              v-model="formData.code"
              placeholder="请输入车型代号"
              show-word-limit
              maxlength="20"
            ></el-input>
          </el-form-item>
          <el-form-item label="平台/架构" prop="platform">
            <el-input
              v-model="formData.platform"
              placeholder="请输入平台/架构"
              show-word-limit
              maxlength="20"
            ></el-input>
          </el-form-item>
          <el-form-item label="SOP" prop="sop">
            <el-input
              v-model="formData.sop"
              placeholder="请输入SOP"
              show-word-limit
              maxlength="20"
            ></el-input>
          </el-form-item>
          <el-form-item label="总销量" prop="totalSaleNum">
            <el-input
              v-model="formData.totalSaleNum"
              placeholder="请输入总销量"
              show-word-limit
              maxlength="20"
            ></el-input>
          </el-form-item>
          <el-form-item label="驱动系统" prop="driveSystem">
            <el-input
              v-model="formData.driveSystem"
              placeholder="请输入驱动系统"
              show-word-limit
              maxlength="20"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12"> </el-col>
        <el-col :span="12"> </el-col>
      </el-row>
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
import vehicleTypeEnum, { getText } from "@/utils/enums/vehicleTypeEnum";
import useElectricityEnum, {
  getText as getUseElectricityEnumText,
} from "@/utils/enums/useElectricityEnum";
import { typeMaintenanceRules as rules } from "@/utils/validator";
import {
  useAddTypeMaintenance,
  useEditTypeMaintenance,
} from "@/composables/typeMaintenance";

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
  request: addTypeMaintenance,
  data: addTypeMaintenanceData,
  err: addTypeMaintenanceErr,
} = useAddTypeMaintenance();
let {
  request: editTypeMaintenance,
  data: editTypeMaintenanceData,
  err: editTypeMaintenanceErr,
} = useEditTypeMaintenance();

const onOk = () => {
  form.value.validate(async (valid) => {
    if (valid) {
      let {
        id,
        brand,
        type,
        useElectricity,
        market,
        name,
        code,
        platform,
        sop,
        totalSaleNum,
        driveSystem,
        madePlace,
      } = formData.value;
      let isEdit = !!id || id === 0;
      let params = {
        id,
        brand,
        carType: type,
        electric: useElectricity,
        market,
        carName: name,
        carCode: code,
        framework: platform,
        sop,
        totalSales: totalSaleNum,
        driveSystem,
        production: madePlace,
      };
      isEdit
        ? await editTypeMaintenance({
            id,
            ...params,
          })
        : await addTypeMaintenance({
            ...params,
          });
      let err = isEdit
        ? editTypeMaintenanceErr.value
        : addTypeMaintenanceErr.value;
      let message = isEdit
        ? editTypeMaintenanceData.value
        : addTypeMaintenanceData.value;
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
    /deep/ &__label
      //white-space: nowrap
    &+.el-form-item
      margin-top: 24px
  .el-input,
  .el-select
    width: 234px
    /deep/ .el-input__inner
      height: 40px
</style>
