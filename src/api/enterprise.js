import axios from "@/utils/axios";

const getEnterpriseList = (params) => axios.get("/company/list", params);
const addEnterprise = (params) => axios.get("/company/add", params);
const editEnterprise = (params) => axios.get("/company/update", params);
const removeEnterprise = (params) => axios.get("/company/delete", params);

export default {
  getEnterpriseList,
  addEnterprise,
  editEnterprise,
  removeEnterprise,
};
