import { computed } from "vue";
import { useApi } from "@/composables/api";
import api from "@/api";

export function useTodo() {
  const { data, request: getList } = useApi(api.todo.getTodoList);

  const list = computed(
    () =>
      data.value?.data?.records?.map(
        ({ id, date, company, writer, totalSaleNum, status }) => ({
          id,
          date,
          company,
          writer,
          totalSaleNum,
          status,
        })
      ) || []
  );

  const total = computed(() => data.value?.data?.total);

  const getDetail = (id) => list.value.find((item) => item.id === id);

  return {
    getList,
    list,
    getDetail,
    total,
  };
}

export function useAddTodo() {
  const { err, data, request } = useApi(api.todo.addTodo);

  return {
    err,
    data,
    request,
  };
}
export function useEditTodo() {
  const { err, data, request } = useApi(api.todo.editTodo);

  return {
    err,
    data,
    request,
  };
}
export function useRemoveTodo() {
  const { err, data, request } = useApi(api.todo.removeTodo);

  return {
    err,
    data,
    request,
  };
}
