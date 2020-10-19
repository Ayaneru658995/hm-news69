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
import Home from '../views/Home.vue'
import Detail from '../views/Detail.vue'

// 注册
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/home' }, //重定向
    { path: '/login', name: 'login', component: Login },
    { path: '/register', name: 'register', component: Register },
    { path: '/user', name: 'user', component: User },
    { path: '/edit', name: 'edit', component: Edit },
    { path: '/my-follow', name: 'my-follow', component: MyFollow},
    { path: '/my-comment', name: 'my-comment', component: MyComment},
    { path: '/my-star', name: 'my-star', component: MyStar },
    { path: '/home', name: 'home', component: Home },
    { path: '/detail/:id', name: 'detail', component: Detail}
  ],
})

// 异常提示: 重写push
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

// 全局前置守卫
router.beforeEach((to, from, next) => {
  const authPath =  ['/user','/my-follow','/my-comment','/my-star','/edit']
  if (authPath.includes(to.path)) {
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
