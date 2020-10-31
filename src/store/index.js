import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// Mutations
const mutations = {
  // 增加  比如 : home添加到cacheList   this.$store.commit('cache',{ name : 'home'})
  cache(state, payload) {
    if (!state.cacheList.includes(payload.name)) {
      state.cacheList.push(payload.name)
    }
  },
  // 删除  比如 : home从cacheList 删除   this.$store.commit('uncache',{ name:'home' })
  uncache(state, payload) {
    if (state.cacheList.includes(payload.name)) {
      // v本身就是数组里面的元素  元素就是名字
      state.cacheList = state.cacheList.filter(v => v != payload.name)
    }
  }
}

const store = new Vuex.Store({
  mutations,
  state: {
    cacheList: ['search'],
  }
})

export default store