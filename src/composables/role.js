import { computed } from "vue";
import { useApi } from "@/composables/api";
import api from "@/api";
import store from "@/store";

export function useUser() {
  const { data, request: getList } = useApi(api.role.getUserList);

  const list = computed(
    () =>
      data.value?.data?.records?.map(
        ({
          id,
          companyName,
          roleName,
          userName,
          wechatId,
          systemUid,
          email,
          role,
          companyId,
        }) => ({
          id,
          companyName,
          roleName,
          userName,
          wechatId,
          systemUid,
          email,
          role: JSON.parse(role),
          companyId,
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

export async function useGetSeleteUserList() {
  const res = await api.role.getSeleteUserList();
  store.commit("form/SET_USER_LIST", res.data);
}

export async function useGetRoleList() {
  const res = await api.role.getRoleList();

  store.commit("form/SET_ROLE_LIST", res.data);
}

export async function useGetCompanyAll() {
  const res = await api.role.getCompanyAll();

  store.commit("form/SET_COMPANY_LIST", res.data);
}

export function useAddUser() {
  const { err, data, request } = useApi(api.role.addUser);

  return {
    err,
    data,
    request,
  };
}
export function useEditUser() {
  const { err, data, request } = useApi(api.role.updateUser);

  return {
    err,
    data,
    request,
  };
}
export function useRemoveUser() {
  const { err, data, request } = useApi(api.role.deleteUser);

  return {
    err,
    data,
    request,
  };
}
