<template>
  <div class="header">
    <div class="header_left">
      <img src="../assets/header/more.png" alt="" class="more" />
      <img src="../assets/header/clogo.jpg" alt="" class="Slice" width="100" />
    </div>
    <img
      src="../assets/header/exit.png"
      alt=""
      class="header_right"
      @click="dialogVisible = true"
    />
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      class="dialog"
    >
      <span>是否确认退出？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="exit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
    };
  },
  methods: {
    async exit() {
      this.dialogVisible = false;
      await this.$store.dispatch("user/logout");
    },
  },
};
</script>
<style scoped lang="scss">
.header {
  height: 58px;
  width: 100vw;
  box-shadow: 0px 4px 4px 1px rgba(0, 0, 0, 0.1);

  .header_left {
    float: left;
    line-height: 58px;

    .more {
      width: 18px;
      height: 15px;
      margin: 0 20px;
    }

    .Slice {
      // width: 130px;
      height: auto;
      vertical-align: middle;
    }
  }

  .header_right {
    float: right;
    margin-right: 20px;
    width: 16px;
    vertical-align: middle;
    margin-top: 20px;
    cursor: pointer;
  }

  .dialog {
    /deep/ .el-dialog__header,
    /deep/ .el-dialog__body {
      text-align: center;
    }
  }
}
</style>
