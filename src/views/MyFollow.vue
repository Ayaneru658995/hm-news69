<template>
  <div>
    <hm-header>我的关注</hm-header>
    <div class="list">
      <div class="item" v-for="item in list" :key="item.id">
        <div class="left">
          <img :src="$axios.defaults.baseURL + item.head_img" alt="" />
        </div>
        <div class="center">
          <div class="nickname">{{ item.nickname }}</div>
          <div class="date">{{ item.create_date | date }}</div>
        </div>
        <div class="right" @click="unfollow(item.id)">取消关注</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      list: [] //关注列表
    }
  },
  created (){

    this.follow()

  },
  methods: {
    // 获取关注的用户列表
    async getFollowsList() {
      let res = await this.$axios.get('/user_follows')
      console.log(res);
      this.list = res.data.data
    },
    // 点击取消关注
    async unfollow(id) {
      await this.$dialog.confirm({
        title: '提示',
        message: '您确定要取消关注吗',
      })
      let res = await this.$axios.get(`/user_unfollow/${id}`)
      console.log('取消关注', res);
      const { statusCode, message } = res.data
      if( statusCode === 200) {
        // 1. 弹框
        this.$toast.success(message)
        // 2. 再次获取最新的列表
        this.getFollowsList()
      }

    },

    // 关注用户-模拟
    async follow(){
      let res = await this.$axios.get('/user_follows/7')
      console.log('关注的', res.data);
      this.getFollowsList()
    }
  }
}
</script>

<style lang='less' scoped>
  .list {
    .item {
      height: 90px;
      border-bottom: 1px solid #ccc;
      display: flex;
      align-items: center;
      padding: 0 10px;
      .left {
        img {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          object-fit: cover;
        }
      }
      .center {
        flex: 1;
        padding-left: 20px;
        height: 50px;
        line-height: 25px;
        .nickname {
          font-size: 14px;
        }
        .date {
          color: #999;
          font-size: 12px;
        }
      }
      .right {
        height: 30px;
        line-height: 30px;
        padding: 0 20px;
        font-size: 10px;
        background-color: #999;
        color: #000;
        border-radius: 15px;
      }
    }
  }
</style>