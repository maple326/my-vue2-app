import { getCurrentInstance, computed } from "vue";

// 访问vuex
export const useStore = () => {
  const vm = getCurrentInstance();
  if (!vm) throw new Error("must be called in setup");
  return computed(() => vm.proxy.$store);
};
// 访问router
export const useRouter = () => {
  const vm = getCurrentInstance();
  if (!vm) throw new Error("must be called in setup");
  return computed(() => vm.proxy.$router);
};
// 访问route
export const useRoute = () => {
  const vm = getCurrentInstance();
  if (!vm) throw new Error("must be called in setup");
  return computed(() => vm.proxy.$route);
};
