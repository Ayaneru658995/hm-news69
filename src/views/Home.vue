<template>
  <div>
    <!-- 头部 -->
    <div class="header">
      <div class="left">
        <i class="iconfont iconnew"></i>
      </div>
      <div class="center">
        <i class="iconfont iconsearch"></i>
        <span>搜索新闻</span>
      </div>
      <div class="right" >
        <i @click="$router.push('/user')" class="iconfont iconwode"></i>
      </div>
    </div>
    <!-- 小三角 -->
    <van-sticky z-index=999>
      <div  @click="$router.push('/tabsedit')" class="container">
        <i class="iconfont iconjiantou1"></i>
      </div>
    </van-sticky>

    <!-- tab栏 -->
    <van-tabs v-model="active" sticky>
      <van-tab :title="tab.name" v-for="tab in tabsList" :key="tab.id">
        <van-pull-refresh v-model="isRefreshing" @refresh="onRefresh">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多数据了"
            @load="onLoad"
            :immediate-check="false"
          >
            <hm-post
              @click.native="$router.push(`/detail/${post.id}`)"
              v-for="(post, index) in postList"
              :key="index"
              :post="post"
            ></hm-post>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
      active: 1, // 初始tab页码
      tabsList: [], //tab栏数据
      postList: [], //文章数据
      loading: false,
      finished: false,
      pageIndex: 1,
      pageSize: 10,
      isRefreshing: false,
    }
  },
  watch: {
    active(newActive) {
      console.log('切换tab')
      // 1. 处理之前的数据
      this.postList = []
      this.pageIndex = 1
      // 2. 处理加载的
      this.finished = false
      this.loading = true
      this.getPostList(this.tabsList[newActive].id)
    },
  },
  created() {
    this.getTabsList()
  },

  methods: {
    // 获取tab列表
    async getTabsList() {
      let res = await this.$axios.get('/category')
      // console.log("tab栏", res.data.data);
      this.tabsList = res.data.data
      this.getPostList(this.tabsList[this.active].id)
    },
    //获取文章内容
    async getPostList(id) {
      let res = await this.$axios.get('/post', {
        params: {
          category: id,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
        },
      })
      console.log('文章列表', res.data.data)
      this.postList = [...this.postList, ...res.data.data]
      this.loading = false
      this.isRefreshing = false
      if (res.data.data.length < this.pageSize) {
        this.finished = true
      }
    },
    // 触底触发
    onLoad() {
      console.log('触发触底')
      this.pageIndex++
      this.getPostList(this.tabsList[this.active].id)
    },
    //下拉刷新
    onRefresh() {
      console.log('下拉刷新')
      this.postList = []
      this.pageIndex = 1
      this.finished = false
      this.loading = true
      this.getPostList(this.tabsList[this.active].id)
    },
  },
}
</script>

<style lang="less" scoped>
/deep/ .van-tabs__nav {
  background: #ddd;
  margin-right: 40px;
}
//小三角
.container {
  width: 40px;
  height: 44px;
  background: #ddd;
  line-height: 44px;
  text-align: center;
  color: #000;
  position: absolute;
  z-index: 999;
  right: 0;
}
.header {
  height: 40px;
  background: #f00;
  display: flex;
  line-height: 40px;
  text-align: center;
  color: #fff;
  // align-items: center;
  .left,
  .right {
    width: 60px;
  }
  .iconnew {
    font-size: 50px;
  }
  .iconwode {
    font-size: 26px;
  }
  .iconsearch {
    margin-right: 10px;
  }
  .center {
    margin-top: 5px;
    flex: 1;
    background: rgba(255, 255, 255, 0.5);
    height: 30px;
    line-height: 30px;
    border-radius: 15px;
  }
}
</style>
