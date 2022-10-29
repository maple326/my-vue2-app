import { ref } from "vue";

export function usePagination() {
  const pageIndex = ref(1);
  const pageSize = ref(10);

  const onPageSizeChange = () => {
    pageIndex.value = 1;
  };

  return {
    pageIndex,
    pageSize,
    onPageSizeChange,
  };
}
