import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入组件
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import User from '../views/User.vue'
import Edit from '../views/Edit.vue'
import MyFollow from '../views/MyFollow.vue'
import MyComment from '../views/MyComment.vue'
import MyStar from '../views/MyStar.vue'

// 注册
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' }, //重定向
    { path: '/login', name: 'login', component: Login },
    { path: '/register', name: 'register', component: Register },
    { path: '/user', name: 'user', component: User },
    { path: '/edit', name: 'edit', component: Edit },
    { path: '/my-follow', name: 'my-follow', component: MyFollow},
    { path: '/my-comment', name: 'my-comment', component: MyComment},
    { path: '/my-star', name: 'my-star', component: MyStar}
  ],
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/user') {
    let token = localStorage.getItem('token')
    if (token) {
      next()
    } else {
      next('/login')
    }
  } else {
    //放行
    next()
  }
})
export default router
