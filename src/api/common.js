import qs from "qs";
import axios from "@/utils/axios";

/**
 * 获取登录二维码
 * @returns
 */
const getWxUrl = () =>
  axios.get("/login/wxUrl", null, {
    requireAuth: false,
  });

/**
 * 获取Token
 * @returns
 */
const getToken = (data) =>
  axios.post("/login/pc", qs.stringify(data), {
    requireAuth: false,
  });

/**
 * 获取Token
 * @returns
 */
const logout = () =>
  axios.get("/login/out", null, {
    requireAuth: false,
  });

export default {
  getWxUrl,
  getToken,
  logout,
};
