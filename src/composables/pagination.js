import { ref } from "vue";

export function usePagination(initialPageSize = 10) {
  const pageIndex = ref(1);
  const pageSize = ref(initialPageSize);

  const onPageSizeChange = () => {
    pageIndex.value = 1;
  };

  return {
    pageIndex,
    pageSize,
    onPageSizeChange,
  };
}
