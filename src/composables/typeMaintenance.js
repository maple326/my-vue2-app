import { computed } from "vue";
import { useApi } from "@/composables/api";
import api from "@/api";

export function useTypeMaintenance() {
  const { data, request: getList } = useApi(
    api.typeMaintenance.getTypeMaintenanceList
  );

  const list = computed(
    () =>
      data.value?.data?.records?.map(
        ({
          id,
          brand,
          carType,
          electric,
          market,
          carName,
          carCode,
          framework,
          sop,
          totalSales,
          driveSystem,
          production,
        }) => ({
          id,
          brand,
          type: carType,
          useElectricity: electric,
          market,
          name: carName,
          code: carCode,
          platform: framework,
          sop,
          totalSaleNum: totalSales,
          driveSystem,
          madePlace: production,
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

export function useAddTypeMaintenance() {
  const { err, data, request } = useApi(api.typeMaintenance.addTypeMaintenance);

  return {
    err,
    data,
    request,
  };
}
export function useEditTypeMaintenance() {
  const { err, data, request } = useApi(
    api.typeMaintenance.editTypeMaintenance
  );

  return {
    err,
    data,
    request,
  };
}
export function useRemoveTypeMaintenance() {
  const { err, data, request } = useApi(
    api.typeMaintenance.removeTypeMaintenance
  );

  return {
    err,
    data,
    request,
  };
}
