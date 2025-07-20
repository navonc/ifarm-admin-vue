import { createRouter, createWebHistory } from 'vue-router'

// 静态路由配置
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login/index.vue'),
    meta: {
      title: '登录',
      requiresAuth: false,
      hideInMenu: true,
      hideInBreadcrumb: true
    }
  },
  {
    path: '/403',
    name: 'Forbidden',
    component: () => import('@/views/Error/403.vue'),
    meta: {
      title: '权限不足',
      requiresAuth: false,
      hideInMenu: true,
      hideInBreadcrumb: true
    }
  },
  {
    path: '/',
    component: () => import('@/components/Layout/index.vue'),
    redirect: '/dashboard',
    meta: {
      title: '主页',
      requiresAuth: true,
      allowedRoles: ['admin', 'farmer']
    },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard/index.vue'),
        meta: {
          title: '首页',
          icon: 'House',
          requiresAuth: true,
          allowedRoles: ['admin', 'farmer']
        }
      },
      {
        path: 'adoption',
        name: 'Adoption',
        redirect: 'adoption/projects',
        meta: {
          title: '认养管理',
          icon: 'Crop',
          requiresAuth: true,
          allowedRoles: ['admin', 'farmer']
        },
        children: [
          {
            path: 'projects',
            name: 'AdoptionProjects',
            component: () => import('@/views/Adoption/Projects.vue'),
            meta: {
              title: '认养项目',
              requiresAuth: true,
              allowedRoles: ['admin', 'farmer']
            }
          },
          {
            path: 'records',
            name: 'AdoptionRecords',
            component: () => import('@/views/Adoption/Records.vue'),
            meta: {
              title: '认养记录',
              requiresAuth: true,
              allowedRoles: ['admin', 'farmer']
            }
          },
          {
            path: 'orders',
            name: 'AdoptionOrders',
            component: () => import('@/views/Adoption/Orders.vue'),
            meta: {
              title: '认养订单',
              requiresAuth: true,
              allowedRoles: ['admin', 'farmer']
            }
          }
        ]
      },
      {
        path: 'farms',
        name: 'Farms',
        redirect: 'farms/list',
        meta: {
          title: '农场管理',
          icon: 'MapLocation',
          requiresAuth: true,
          allowedRoles: ['admin', 'farmer']
        },
        children: [
          {
            path: 'list',
            name: 'FarmList',
            component: () => import('@/views/Farm/List.vue'),
            meta: {
              title: '农场列表',
              requiresAuth: true,
              allowedRoles: ['admin', 'farmer']
            }
          },
          {
            path: 'plots',
            name: 'FarmPlots',
            component: () => import('@/views/Farm/Plots.vue'),
            meta: {
              title: '地块管理',
              requiresAuth: true,
              allowedRoles: ['admin', 'farmer']
            }
          }
        ]
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/views/User/index.vue'),
        meta: {
          title: '用户管理',
          icon: 'User',
          requiresAuth: true,
          allowedRoles: ['admin'] // 仅管理员可访问
        }
      },
      {
        path: 'system',
        name: 'System',
        redirect: 'system/config',
        meta: {
          title: '系统设置',
          icon: 'Setting',
          requiresAuth: true,
          allowedRoles: ['admin'] // 仅管理员可访问
        },
        children: [
          {
            path: 'config',
            name: 'SystemConfig',
            component: () => import('@/views/System/Config.vue'),
            meta: {
              title: '系统配置',
              requiresAuth: true,
              allowedRoles: ['admin']
            }
          },
          {
            path: 'categories',
            name: 'Categories',
            component: () => import('@/views/System/Categories.vue'),
            meta: {
              title: '分类管理',
              requiresAuth: true,
              allowedRoles: ['admin']
            }
          }
        ]
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/Profile/index.vue'),
        meta: {
          title: '个人中心',
          requiresAuth: true,
          allowedRoles: ['admin', 'farmer'],
          hideInMenu: true
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/Error/404.vue'),
    meta: {
      title: '页面不存在',
      hideInMenu: true,
      hideInBreadcrumb: true
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router
