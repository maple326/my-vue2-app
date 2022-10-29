<template>
  <el-dialog
    ref="dialog"
    :visible.sync="innerVisible"
    @close="innerVisible = false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :width="width"
  >
    <template #title>
      <slot name="title"></slot>
    </template>
    <template>
      <div>
        <slot></slot>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, watchEffect } from "vue";
import { useToggle } from "@vueuse/core";
import { Loading } from "element-ui";

const prop = defineProps({
  visible: Boolean,
  loading: Boolean,
  width: {
    type: String,
    default: "600px",
  },
  hideTitle: Boolean,
});

const emit = defineEmits(["update:visible"]);

const dialog = ref();

const [innerVisible] = useToggle();

watchEffect(() => {
  innerVisible.value = prop.visible;
});

watch(innerVisible, () => {
  emit("update:visible", innerVisible.value);
});

let loadingInstance = null;
watch(
  () => prop.loading,
  (val) => {
    if (val) {
      loadingInstance = Loading.service({
        target: dialog.value.$el.children[0],
      });
    } else {
      loadingInstance.close();
    }
  }
);
</script>
