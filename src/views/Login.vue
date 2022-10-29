<template>
  <div class="login">
    <div class="box">
      <el-row type="flex" justify="center" class="box-head">
        <img
          src="../assets/login/log.png"
          style="width: 56px; height: 56px"
          class="vam"
        />
        XX集团XXXXXX管理
      </el-row>
      <el-row type="flex" justify="center" style="margin-bottom: 20px"
        >管理后台</el-row
      >
      <el-row type="flex" justify="center">
        <div id="qrCode"></div>
      </el-row>
    </div>
    <span class="banben">版本号：v2022-1.0</span>
  </div>
</template>

<script setup>
import { onMounted } from "vue";

const init = async () => {
  new WwLogin({
    id: "qrCode",
    appid: "wx963179f52abc1968",
    agentid: "1000143",
    redirect_uri: "https://test.com/#/",
    state: "",
    href: "",
    lang: "zh",
  });
};

onMounted(() => {
  init();
});
</script>

<style lang="scss" scope>
.login {
  width: 100vw;
  height: 100vh;
  background: url(../assets/login/login.png) no-repeat center;
  background-size: 100vw 100vh;

  & > .box {
    width: 469px;
    height: 546px;
    background-color: rgba(255, 255, 255, 0.5);
    position: relative;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 20px;
    padding-top: 40px;

    .box-head {
      margin: 0 auto 10px;
      line-height: 56px;
    }

    .box-min {
      margin: 30px auto 16px;
      color: #0082ef;
    }

    iframe {
      width: 242px;
      height: 350px;
      border: none;
    }
  }

  .banben {
    height: 15px;
    line-height: 15px;
    display: inline-block;
    color: #0f0f0f;
    font-size: 12px;
    position: absolute;
    bottom: 10px;
    left: 10px;
  }
}
</style>
