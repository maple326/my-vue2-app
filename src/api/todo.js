// 待办

import axios from "@/utils/axios";

const getTodoList = (params) => axios.get("/todo/list", params);
const addTodo = (params) => axios.get("/todo/add", params);
const editTodo = (params) => axios.get("/todo/update", params);
const removeTodo = (params) => axios.get("/todo/delete", params);

export default {
  getTodoList,
  addTodo,
  editTodo,
  removeTodo,
};
