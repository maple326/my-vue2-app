import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";
import Home from "@/views/Home.vue";
import roleEnum from "@/utils/enums/roleEnum";

Vue.use(VueRouter);

const defaultRoutes = [
  {
    path: "/",
    name: "home",
    component: Home,
    meta: {
      hidden: true,
    },
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Login.vue"),
    meta: {
      title: "登录",
      hidden: true,
      isLogin: true,
    },
  },
];
const asyncRoutes = [
  {
    path: "/systemConfig",
    component: () =>
      import(
        /* webpackChunkName: "systemConfig" */ "../views/systemConfig/Index.vue"
      ),
    meta: {
      title: "系统配置",
      roles: [roleEnum.ADMIN],
    },
    children: [
      {
        path: "enterprise",
        name: "enterprise",
        component: () =>
          import(
            /* webpackChunkName: "systemConfig" */ "../views/systemConfig/enterprise/Index.vue"
          ),
        meta: {
          title: "导出",
          roles: [roleEnum.ADMIN],
        },
        children: [
          {
            path: "export",
            component: () =>
              import(
                /* webpackChunkName: "enterprise" */ "../views/systemConfig/enterprise/Export.vue"
              ),
            meta: {
              title: "企业管理",
              roles: [roleEnum.ADMIN],
            },
          },
        ],
      },
      {
        path: "menus",
        component: () =>
          import(
            /* webpackChunkName: "menus" */ "../views/systemConfig/role/Index.vue"
          ),
        meta: {
          title: "多级菜单",
          roles: [roleEnum.ADMIN],
          icon: "menu",
        },
        children: [
          {
            path: "1-1",
            component: () =>
              import(
                /* webpackChunkName: "enterprise" */ "../views/systemConfig/enterprise/Export.vue"
              ),
            meta: {
              title: "1-1",
              roles: [roleEnum.ADMIN],
              icon: "upload",
            },
            children: [
              {
                path: "1-1-1",
                component: () =>
                  import(
                    /* webpackChunkName: "enterprise" */ "../views/systemConfig/enterprise/Export.vue"
                  ),
                meta: {
                  title: "1-1-1",
                  roles: [roleEnum.ADMIN],
                  icon: "upload",
                },
                children: [
                  {
                    path: "1-1-1-1",
                    component: () =>
                      import(
                        /* webpackChunkName: "enterprise" */ "../views/systemConfig/enterprise/Export.vue"
                      ),
                    meta: {
                      title: "1-1-1-1",
                      roles: [roleEnum.ADMIN],
                    },
                  },
                  {
                    path: "1-1-1-2",
                    component: () =>
                      import(
                        /* webpackChunkName: "enterprise" */ "../views/systemConfig/enterprise/Export.vue"
                      ),
                    meta: {
                      title: "1-1-1-2",
                      roles: [roleEnum.ADMIN],
                    },
                  },
                ],
              },
              {
                path: "1-1-2",
                component: () =>
                  import(
                    /* webpackChunkName: "enterprise" */ "../views/systemConfig/enterprise/Export.vue"
                  ),
                meta: {
                  title: "1-1-2",
                  roles: [roleEnum.ADMIN],
                },
                children: [
                  {
                    path: "1-1-2-1",
                    component: () =>
                      import(
                        /* webpackChunkName: "enterprise" */ "../views/systemConfig/enterprise/Export.vue"
                      ),
                    meta: {
                      title: "1-1-2-1",
                      roles: [roleEnum.ADMIN],
                    },
                  },
                  {
                    path: "1-1-2-2",
                    component: () =>
                      import(
                        /* webpackChunkName: "enterprise" */ "../views/systemConfig/enterprise/Export.vue"
                      ),
                    meta: {
                      title: "1-1-2-2",
                      roles: [roleEnum.ADMIN],
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

const router = new VueRouter({
  routes: defaultRoutes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
});

const LOGIN_NAME = "login";

router.beforeEach(async (to, from, next) => {
  if (store.state.user.token) {
    // const roles = await store.dispatch("user/getRole");
    const roles = [1, 2];
    if (!roles) {
      await store.dispatch("user/logout");
    } else if (store.state.user.routes) {
      if (to.name === LOGIN_NAME) {
        store.commit("user/SET_ROUTES", null);
        next("/");
      } else {
        hasRoute(to) ? next() : next("/");
      }
    } else {
      let routes = rescusiveGetRoutes(asyncRoutes, roles);
      routes.forEach((item) => {
        !hasRoute(item) && router.addRoute(item);
      });
      store.commit("user/SET_ROUTES", routes);
      next({ ...to, replace: true });
    }
  } else {
    if (to.path === "/") {
      try {
        store.commit(
          "user/SET_TOKEN",
          await store.dispatch("user/getToken", { diableGetAuth: true })
        );
        next({ path: "/", replace: true });
      } catch (err) {
        console.log(err);
        next({
          name: LOGIN_NAME,
        });
      }
    } else if (to.name === LOGIN_NAME) {
      next();
    } else {
      store.commit("user/SET_ROUTES", defaultRoutes);
      if (hasRoute(to)) {
        next();
      } else {
        next("/");
      }
    }
  }
});

router.afterEach((to, from) => {
  document.title = to.meta?.title;
});

const rescusiveGetRoutes = (routes, roles) => {
  return routes.reduce((pre, cur) => {
    let children = cur.children;
    if (Array.isArray(children)) {
      children = rescusiveGetRoutes(children, roles);
      cur.children = children;
    }
    hasAccess(cur, roles) && pre.push(cur);
    return pre;
  }, []);
};

const hasAccess = (route, roles) => {
  let needRoles = route.meta?.roles;
  if (needRoles?.some((needRole) => roles.includes(needRole))) return true;
  return false;
};

/**
 * 判断当前路由是否存在
 * @param to
 * @returns {boolean}
 */
function hasRoute(to) {
  let find = router
    .getRoutes()
    .find((item) =>
      item.name ? item.name === to.name : item.path === to.path
    );
  return !!find;
}

export default router;
