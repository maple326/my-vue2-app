// 型谱维护

import axios from "@/utils/axios";

const getTypeMaintenanceList = (params) => axios.get("/spectrum/list", params);
const addTypeMaintenance = (params) => axios.post("/spectrum/add", params);
const editTypeMaintenance = (params) => axios.post("/spectrum/update", params);
const removeTypeMaintenance = (params) =>
  axios.post("/spectrum/delete", params);

export default {
  getTypeMaintenanceList,
  addTypeMaintenance,
  editTypeMaintenance,
  removeTypeMaintenance,
};
