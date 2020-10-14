
<template>
  <div>
    <!-- 头部 -->
    <hm-header>个人中心</hm-header>
    <!-- 个人信息 -->
    <div class="info">
      <div class="left">
        <img :src="$axios.defaults.baseURL + info.head_img" alt="">
      </div>
      <div class="center">
        <div class="nickname"><i v-if='info.gender === 0' class="iconfont iconxingbienan"></i><i v-else class="iconfont iconxingbienv"></i> {{ info.nickname }}</div>
        <div class="date">{{ info.create_date | date }}</div>
      </div>
    </div>
    <!-- 表格部分 -->
    <van-cell-group>
      <van-cell @click="$router.push('/my-follow')" title="我的关注" is-link value="关注的用户" />
      <van-cell @click="$router.push('/my-comment')" title="我的跟帖" is-link value="跟帖/回复" />
      <van-cell @click="$router.push('/my-star')" title="我的收藏" is-link value="文档/视频" />
      <van-cell @click="$router.push('/edit')" title="设置" is-link  />
      <van-cell @click='logout' title="退出" is-link  />
    </van-cell-group>

  </div>
</template>

<script>
export default {
  data(){
    return {
      info: ''
    }
  },
  async created(){
    let user_id = localStorage.getItem('user_id')
    let token = localStorage.getItem('token')
    let res = await this.$axios.get(`/user/${user_id}`)
      console.log(res);
      const { statusCode, data, message } = res.data
      if(statusCode === 200) {
        this.info = data
      }else {
        this.$toast.fail(message)
      }
  },
  methods: {
    async logout(){
      try {
        await this.$dialog.confirm({
          title: '温馨提示',
          message: '你确定要退出登录吗?',
        })
        console.log('确定');
        // 删除token + id
        localStorage.removeItem('token')
        localStorage.removeItem('user_id')
        // 提示
        this.$toast.success('退出成功')
        // 跳转login
        this.$router.push('/login')
      }catch(error){
        console.log('取消');
      }
    }
  }
}
</script>

<style lang='less' scoped>
  .info {
    height: 100px;
    border-bottom: 2px solid #cccccc;
    display: flex;
    align-items: center;
    padding: 0 20px;
    .left {
      img {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        object-fit: cover;
      }
    }
    .center {
      // background-color: pink;
      flex:1;
      font-size: 14px;
      height: 50px;
      line-height: 25px;
      padding-left: 20px;
    }
  }

</style>