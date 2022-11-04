/**
 *
 * @param {String} key
 * @param {ref} data
 * @param {Function} api
 * @returns
 */
export const useCache = (key, data, api) => {
  let val = store.state.user.cache[key];
  if (val) {
    return computed(() => val);
  } else {
    api();
    watch(data, () => {
      store.commit("user/SET_CACHE", {
        key,
        val: data.value,
      });
    });
    return data;
  }
};
