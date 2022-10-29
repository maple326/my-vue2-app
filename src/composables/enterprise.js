import { computed } from "vue";
import { useApi } from "@/composables/api";
import api from "@/api";

export function useEnterprise() {
  const { data, request: getList } = useApi(api.enterprise.getEnterpriseList);

  const list = computed(
    () =>
      data.value?.data?.records?.map(({ id, companyName, display_time }) => ({
        id,
        name: companyName,
        date: display_time,
      })) || []
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

export function useAddEnterprise() {
  const { err, data, request } = useApi(api.enterprise.addEnterprise);

  return {
    err,
    data,
    request,
  };
}
export function useEditEnterprise() {
  const { err, data, request } = useApi(api.enterprise.editEnterprise);

  return {
    err,
    data,
    request,
  };
}
export function useRemoveEnterprise() {
  const { err, data, request } = useApi(api.enterprise.removeEnterprise);

  return {
    err,
    data,
    request,
  };
}
