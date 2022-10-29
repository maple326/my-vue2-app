import { ref, unref } from "vue";

export const useApi = (api) => {
  const data = ref(null);
  const err = ref(null);
  const loading = ref(false);
  const request = async (params) => {
    loading.value = true;
    try {
      const res = await api(unref(params));
      data.value = res;
    } catch (e) {
      err.value = e;
    }
    loading.value = false;
  };

  return {
    loading,
    err,
    data,
    request,
  };
};
