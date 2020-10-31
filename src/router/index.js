import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入组件
import Home from '../views/Home.vue'
// 把组件分别打包
const Login = () => import('../views/Login.vue')
const Register = () => import('../views/Register.vue')
const User = () => import('../views/User.vue')
const Edit = () => import('../views/Edit.vue')
const MyFollow = () => import('../views/MyFollow.vue')
const MyComment = () => import('../views/MyComment.vue')
const MyStar = () => import('../views/MyStar.vue')
const Detail = () => import('../views/Detail.vue')
// 把 TabsEdit 和 Search一起打包
const TabsEdit = () => import(/* webpackChunkName: "mg" */'../views/TabsEdit.vue')
const Search = () => import(/* webpackChunkName: "mg" */'../views/Search.vue')


// 注册
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/home' }, //重定向
    { path: '/login', name: 'login', component: Login },
    { path: '/register', name: 'register', component: Register },
    { path: '/user', name: 'user', component: User },
    { path: '/edit', name: 'edit', component: Edit },
    { path: '/my-follow', name: 'my-follow', component: MyFollow },
    { path: '/my-comment', name: 'my-comment', component: MyComment },
    { path: '/my-star', name: 'my-star', component: MyStar },
    { path: '/home', name: 'home', component: Home },
    { path: '/detail/:id', name: 'detail', component: Detail },
    { path: '/tabsedit', name: 'tabsedit', component: TabsEdit },
    { path: '/search', name: 'search', component: Search }
  ],
})

// 异常提示: 重写push
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

// 全局前置守卫
router.beforeEach((to, from, next) => {
  const authPath = ['/user', '/my-follow', '/my-comment', '/my-star', '/edit']
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
