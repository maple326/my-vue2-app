import axios from "@/utils/axios";

const getRoleList = () => axios.get("/user/roleList");
const getSeleteUserList = () => axios.get("/user/userList");
const getCompanyAll = () => axios.get("/company/all");
const addUser = (params) => axios.post("/user/add", params);
const updateUser = (params) => axios.post("/user/update", params);
const deleteUser = (params) => axios.post("/user/delete", params);
const getUserList = (params) => axios.get("/user/list", params);

export default {
  getRoleList,
  getSeleteUserList,
  getUserList,
  getCompanyAll,
  addUser,
  updateUser,
  deleteUser,
};
