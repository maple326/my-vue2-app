<template>
  <div class="upload-wrapper">
    <el-upload
      action
      :before-upload="handleBeforeUpload"
      :http-request="handleHttpRequest"
      :on-success="handleSuccess"
      :on-preview="handlePreview"
      :file-list="fileList"
      :disabled="!isEdit"
      :show-file-list="false"
      :class="{ 'hide-btn-upload': !showBtnUpload }"
      ref="upload"
    >
      <el-row slot="trigger" type="flex" align="middle">
        <slot>
          <el-row type="flex" align="middle">
            <el-row
              type="flex"
              class="upload-btn pointer"
              :class="{ disabled: !isEdit }"
              ref="btn-upload"
            >
              <i></i>
              <div>上传</div>
            </el-row>
          </el-row>
        </slot>
      </el-row>
      <ImageDetail
        v-if="showFileList && fileList[0]"
        :file="fileList[0]"
        @update="handleImageDetailUpdate"
        @remove="(res) => handleImageDetailRemove(res)"
        :tableName="tableName"
        :fieldName="fieldName"
        v-bind="$attrs"
        :clearable="isEdit"
        class="image-detail"
      >
        <template #tips>{{ rightTipsText }}</template>
      </ImageDetail>
      <div v-if="$slots.tips" class="tips">
        <slot name="tips"></slot>
      </div>
    </el-upload>
  </div>
</template>

<script>
import ImageDetail from "@/components/ImageDetail.vue";

export default {
  components: { ImageDetail },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
    fileList: {
      type: Array,
      default: () => [],
    },
    // 允许上传的文件格式
    fileType: {
      type: Array,
      default: () => [
        // "application/pdf",
        // "application/msword", // doc
        // "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
        // "application/vnd.ms-powerpoint", // ppt
        // "application/vnd.openxmlformats-officedocument.presentationml.presentation", // pptx
        "png",
        "jpg",
        "jpeg",
        "zip",
        // "gif",
        // "tif",
        // "bmp",
        // "application/x-tar", // tar
        // "application/zip",
        // "7z",
        // "rar",
        // "text/plain", // txt
        // "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
        // "application/vnd.ms-excel", // xls
      ],
    },
    // 文件格式错误的提示消息
    fileTypeErrorMsg: {
      type: String,
      default: "只能上传图片和压缩包",
    },
    // 允许上传的文件大小（单位M）
    fileSize: {
      type: Number,
      default: 15,
    },
    // 所在数据库表的表名
    tableName: {
      type: String,
      default: "",
    },
    // 字段名
    fieldName: {
      type: String,
      default: "",
    },
    // 文件对应数据的id
    id: {
      type: String,
      default: "",
    },
    // 是否显示提示
    showTips: {
      type: Boolean,
      default: false,
    },
    // 提示文本
    tipsText: {
      type: String,
      default: "",
    },
    // 是否显示已上传文件列表
    showFileList: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    rightTipsText({ $slots }) {
      let rightTips = $slots["right-tips"];
      return rightTips && rightTips[0] && rightTips[0].text;
    },
    // 是否显示上传按钮
    showBtnUpload({ isEdit, fileList }) {
      return isEdit && !fileList[0];
    },
  },

  methods: {
    handleBeforeUpload(file) {
      const { fileList, fileType, fileTypeErrorMsg, fileSize } = this;
      for (let i = 0; i < fileList.length; i++) {
        if (fileList[i].name === file.name) {
          this.$message.error("已存在相同文件名，无法重复上传");
          return false;
        }
      }
      if (file.name.split(".")[0].length > 50) {
        this.$message.error("上传文件的文件名长度不能超过50个字符");
        return false;
      }
      console.log(file);
      const isAllowType =
        fileType.includes(file.type) ||
        fileType.includes(
          file.name.slice(file.name.lastIndexOf(".") + 1).toLowerCase()
        );
      const isAllowSize = file.size / 1024 / 1024 < fileSize;

      if (!isAllowType) {
        this.$message.error(fileTypeErrorMsg);
      } else if (!isAllowSize) {
        this.$message.error(`上传文件大小不能超过 ${fileSize}MB`);
      }
      return isAllowType && isAllowSize;
    },
    async handleHttpRequest({ file, onSuccess, onError }) {
      const now = new Date();
      const paddingZero = this.$utils.paddingZero;
      const formData = new FormData();
      formData.append("file", file);
      try {
        const groupValue = "xyg";
        const fileValue = Date.now();
        let { data } = await this.$api.uploadFile(formData, {
          params: {
            sid: await this.$store.dispatch("user/getSid"),
            groupValue,
            fileValue,
          },
        });
        console.log("上传结果", data);
        let { fileName, fileUrl, fileId } = (data.infos && data.infos[0]) || {};
        return Promise.resolve({
          name: fileName,
          url: fileUrl,
          groupValue,
          fileValue,
          fileId,
        });
      } catch (err) {
        console.error(err);
        onError();
      }
    },
    async handleSuccess(response, file, fileList) {
      let { fileId: id, name, url } = response;
      try {
        let { tableName, fieldName } = this;
        this.$emit("update:fileList", [
          {
            url,
            name,
            tableName, // 所在数据库表的表名
            fieldName, // 字段名
            id, // 文件对应数据的id
          },
        ]);
        this.$utils.log(
          `上传附件成功<br />文件名称：${name}<br />文件URL：${url}`
        );
      } catch (err) {
        console.log(err);
        this.$utils.log(
          `上传附件失败<br />文件名称：${name}<br />文件URL：${url}<br />错误信息：${err.toString()}`,
          "error"
        );
      }
    },
    async handlePreview(file) {
      let { name, url } = file.response;
      let sid = this.$utils.getQuery("sid", url);
      url = url.replace(`sid=${sid}`, "");
      url = path.resolve("/portal/r", url);
      url = `${
        (process.env.NODE_ENV === "development"
          ? "https://test.com"
          : process.env.VUE_APP_BASE_URL) + url
      }&sid=${await this.$store.dispatch("user/getSid")}`;
      this.$utils.download(url, name);
    },
    handleImageDetailUpdate() {
      this.$refs["btn-upload"].$el.click();
    },
    handleImageDetailRemove(res) {
      if (!res) return;
      this.$emit("update:fileList", []);
    },
  },
};
</script>

<style lang="scss" scoped>
.upload-wrapper {
  .hide-btn-upload {
    /deep/ .el-upload {
      display: none;
    }
  }
  /deep/ .el-upload {
    // width: 100%;
    max-width: 100%;
    height: 100%;
    vertical-align: middle;
    cursor: default;
  }
}

.upload-btn {
  padding: 0 16px;
  height: 30px;
  line-height: 30px;
  border-radius: $border-radius;
  border: 1px dashed #409eff;
  color: $primary-color;
  &.disabled {
    cursor: not-allowed;
  }
  i {
    float: left;
    margin-right: 5px;
    width: 16px;
    background: url("~@/assets/icon/upload.png") center no-repeat;
    background-size: 100%;
  }
}
.tips {
  margin: 8px 0 0;
  color: #fa5151;
  line-height: 1;
}
/deep/ [class*=" el-icon-"],
[class^="el-icon-"] {
  span {
    font-family: $font-family;
  }
}
</style>
