<template>
  <div>
    <el-row
      type="flex"
      :justify="center ? 'center' : ''"
      align="middle"
      @mouseenter.native="isHover = true"
      @mouseleave.native="isHover = false"
    >
      <slot :file="file">
        <div class="left">
          <i
            v-if="file.name"
            :class="{
              file_icon: true,
              'icon-photo': isImageType,
              file_docx: file.name.indexOf('docx') != -1,
              file_doc: file.name.indexOf('doc') != -1,
              'icon-pdf': file.name.indexOf('pdf') != -1,
            }"
          ></i>
          <span
            class="file-name"
            @click="download && handleClickImage(file)"
            :class="{ pointer: download }"
            :title="file.name"
            >{{ decodeURIComponent(file.name) }}</span
          >
          <el-button
            v-if="preview"
            type="text"
            class="el-icon-view preview-btn"
            @click="handleImagePreview(file)"
            >预览</el-button
          >
        </div>
        <div v-if="showBtn" class="icon-suffix">
          <div
            v-if="download"
            class="icon icon-download"
            @click="handleClickImage(file)"
          ></div>
          <div
            v-if="clearable"
            class="icon icon-update"
            @click="handleUpdate(file)"
          >
            更新
          </div>
          <div
            v-if="clearable"
            class="icon icon-remove"
            @click="handleRemove(file)"
          >
            删除
          </div>
        </div>
        <div v-if="$slots.tips" class="tips">
          <slot name="tips"></slot>
        </div>
        <!-- <i v-else class="el-icon-circle-check"></i> -->
        <div style="display: none">
          <el-image
            ref="image"
            :src="absoluteFilePath"
            :preview-src-list="[absoluteFilePath]"
          ></el-image>
        </div>
      </slot>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    file: {
      type: Object,
      default: () => ({}),
    },
    processId: {
      type: String,
      default: "",
    },
    // 是否可清空
    clearable: {
      type: Boolean,
      default: false,
    },
    // 是否可预览
    preview: {
      type: Boolean,
      default: false,
    },
    // 是否可下载
    download: {
      type: Boolean,
      default: false,
    },
    // 是否显示按钮
    showBtn: {
      type: Boolean,
      default: true,
    },
    // 标题是否居中
    center: {
      type: Boolean,
      default: false,
    },
    tips: String,
  },
  data() {
    return {
      isHover: false,
      showEmpty: false,
      absoluteFilePath: "",
    };
  },
  computed: {
    // 是否为图片类型
    isImageType({ file }) {
      if (!file.name) return;
      return (
        file.name.indexOf("png") != -1 ||
        file.name.indexOf("jpg") != -1 ||
        file.name.indexOf("jpeg") != -1
      );
    },
  },
  watch: {
    "file.url": {
      immediate: true,
      async handler(val) {
        this.absoluteFilePath = val;
      },
    },
  },
  methods: {
    async handleClickImage(file) {
      this.$utils.download(this.absoluteFilePath, file.name);
    },
    async handleImagePreview(file) {
      let arr = file.name.split(".");
      switch (arr[arr.length - 1].toLowerCase()) {
        case "png":
        case "jpg":
        case "jpeg":
        case "bmp":
        case "gif":
          this.$refs.image.$el.children[0].click();
          break;
        case "pdf":
          this.$utils.previewPdf(file.url);
          break;
      }
    },
    handleUpdate() {
      this.$emit("update");
    },
    async handleRemove(file) {
      if (file.status !== "success") return; // 因为before-upload不通过也会调用before-remove，所以这里判断file的status是否为success（表示上传成功），为success时才执行删除操作
      this.$emit("remove", true);
    },
  },
};
</script>

<style lang="scss" scoped>
.el-row {
  height: 40px;
  .left {
    display: flex;
    align-items: center;
    padding-left: 4px;
    color: $primary-color;
    .file-name {
      font-size: 18px;
      margin-right: 30px;
      // white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      line-height: normal;
      text-align: left;
    }
  }
  .icon-suffix {
    line-height: normal;
  }
  .icon {
    font-size: 16px;
    cursor: pointer;
    &-update {
      margin-right: 12px;
      color: #409eff;
    }
    &-remove {
      color: #c4c4c4;
      &::before {
        content: "";
        margin-right: 12px;
        width: 1px;
        height: 13px;
        opacity: 1;
        background: #c0c4cc;
      }
    }
  }
  .el-icon-circle-check,
  .el-icon-close {
    font-size: 14px;
    line-height: 30px;
  }
  .el-icon-circle-check {
    position: relative;
    top: 2px;
    right: 5px;
  }
  .el-icon-circle-check {
    color: #67c23a;
  }
  .preview-btn {
    span {
      font-size: 14px;
    }
    // padding: 0;
    // height: 100%;
    &:before {
      margin-right: 2px;
    }
  }
  .empty {
    height: 200px;
    i {
      font-size: 34px;
    }
  }
  .tips {
    margin: 0 0 0 30px;
    color: #c4c4c4;
    line-height: 1;
  }
}
</style>
