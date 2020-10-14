
<template>
  <div>
    <!-- 头部 -->
    <hm-header>编辑资料</hm-header>
    <!-- 头像 -->
    <div class="avatar">
      <img :src="$axios.defaults.baseURL + info.head_img" alt="">
      <van-uploader class="uploader" :before-read="beforeRead" :after-read="afterRead" />
    </div>
    <!-- cell单元格 -->
    <van-cell-group>
      <van-cell @click='showNickname' title="昵称" is-link :value="info.nickname" />
      <van-cell title="密码" is-link value="******" />
      <van-cell @click='showGender' title="性别" is-link :value="info.gender === 0? '男':'女'" />
    </van-cell-group>
    <!-- 修改昵称的弹框 -->
    <van-dialog v-model="isShowNickname" @confirm='confirmNickname' title="修改昵称" show-cancel-button>
      <van-field v-model="nickname"  placeholder="请输入用户昵称" />
    </van-dialog>
    <!-- 修改性别的弹框 -->
    <van-dialog v-model="isShowGender" @confirm='confirmGender' title="修改性别" show-cancel-button>
      <van-radio-group v-model="gender">
        <van-cell-group>
          <van-cell title="男" clickable @click="gender = 0 ">
            <template #right-icon>
              <van-radio :name="0" />
            </template>
          </van-cell>
          <van-cell title="女" clickable @click="gender = 1 ">
            <template #right-icon>
              <van-radio :name="1" />
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </van-dialog>

  </div>
</template>

<script>
export default {
  data(){
    return {
      info: {}, //页面数据
      isShowNickname : false, //是否显示昵称弹框
      nickname: '', //输入框信息
      isShowGender: false, //是否显示性别弹框
      gender: ''
    }
  },
  created(){
    this.getInfo()
  },
  methods: {
    // 获取个人信息
    async getInfo(){
      let user_id = localStorage.getItem('user_id') 
      let res = await this.$axios.get(`/user/${user_id}`)
        const { statusCode, data, message } = res.data
        if(statusCode === 200) {
          this.info = data
        }else {
          this.$toast.fail(message)
        }
    },
    // 点击显示昵称弹框
    showNickname(){
      this.isShowNickname = true,
      this.nickname = this.info.nickname
    },
    // 点击确定修改昵称
    confirmNickname(){
      // 1.判断是否修改
      if(this.nickname === this.info.nickname){
        return
      }
      // 2.发送请求修改昵称
      this.ml_editUser({
        nickname: this.nickname
      })

      
    },
    // 显示性别弹框
    showGender(){
      this.isShowGender = true,
      this.gender = this.info.gender
    },
    // 点击修改性别
    confirmGender(){
      // 1.判断是否需要修改
      if(this.gender === this.info.gender) {
        return
      }
      // 2.发送请求修改昵称
      this.ml_editUser({
        gender: this.gender
      })
    },
    // 读取图片前的回调函数
    beforeRead(data){
      console.log('读取图片前', data);
      // 限制图片大小
      if(data.size/1024 > 1024) {
        this.$toast.fail('图片不能超过1mb')
        return false
      }
      // 限制图片类型
      // if(data.type !== 'image/png') {
      //   this.$toast.fail('图片必须为png格式')
      //   return false
      // }
      return true
    },  

    // 读取图片后的回调函数
    async afterRead(data){
      // 1.借助formdata帮我们上传
      let formdata = new FormData()
      formdata.append('file', data.file)

      // 2. 上传
      let res = await this.$axios.post('/upload', formdata)
        this.ml_editUser({
          head_img : res.data.data.url
        })
    },
    // 封装函数-编辑资料
    async ml_editUser(data) {
      let user_id = localStorage.getItem('user_id')
      let res = await this.$axios.post(`/user_update/${user_id}`, data)
        // 1. 获取最新的数据
        this.getInfo()
        // 2. 弹框
        this.$toast.success(res.data.message)
    }

  }
}
</script>

<style lang='less' scoped>
  .avatar {
    text-align: center;
    position: relative;
    img {
      margin: 20px 0;
      width: 70px;
      height: 70px;
      border-radius: 50%;
      object-fit: cover;
    }
    .uploader {
      // width: 70px;
      // height: 70px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      opacity: 0;
    }
  }
</style>