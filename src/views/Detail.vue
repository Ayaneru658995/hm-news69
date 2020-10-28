
<template>
  <div>
    <div class="header">
      <div class="left" @click="$router.back()">
        <i class="iconfont iconjiantou2"></i>
      </div>
      <div class="center">
        <i class="iconfont iconnew"></i>
      </div>
      <div class="right">
        <div @click="unfollow" v-if="detail.has_follow" class="follow">
          已关注
        </div>
        <div @click="follow" v-else class="follow">关注</div>
      </div>
    </div>
    <!-- 内容 -->
    <div class="container">
      <div class="title line2">{{ detail.title }}</div>
      <div class="name">
        <span>{{ detail.user.nickname }}</span>
        <span>{{ detail.create_date | date }}</span>
      </div>
      <!-- 内容部分 -->
      <!-- 1. 文本内容(图片 + 文字) -->
      <div
        v-if="detail.type == 1"
        class="content"
        v-html="detail.content"
      ></div>
      <!-- 2. 视频内容 -->
      <video v-else :src="detail.content" controls></video>

      <!-- 点赞 -->
      <div class="bottom">
        <div @click="like" class="like" :class="{ active: detail.has_like }">
          <i class="iconfont icondianzan"></i>
          <i>{{ detail.like_length }}</i>
        </div>
      </div>
      <!-- 添加空盒子,以便跳转到该位置 -->
      <div ref="box"></div>
      <!-- 评论 -->
      <div class="comments">
        <!-- 评论组件 -->
        <hm-comment
          v-for="comment in commentsList"
          :key="comment.id"
          :comment="comment"
        ></hm-comment>
      </div>
      <!-- 底部 -->
      <div class="footer">
        <!-- input -->
        <div class="input" v-if="!isShow">
          <div class="left">
            <input
              ref="input"
              @focus="handleFocus"
              type="text"
              placeholder="写跟帖"
            />
          </div>
          <div class="center">
            <van-icon name="chat-o" :badge="detail.comment_length"></van-icon>
          </div>
          <div class="right">
            <van-icon
              name="star-o"
              @click="star"
              :class="{ active: detail.has_star }"
            ></van-icon>
          </div>
        </div>
        <!-- textarea -->
        <div class="textarea" v-else>
          <div class="left">
            <textarea
              v-model="content"
              ref="textarea"
              @blur="handleBlur"
              :placeholder="replyName ? '回复 : ' + replyName : '请输入内容'"
            ></textarea>
          </div>
          <div class="right">
            <div class="send" @touchstart="send">发送</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      detail: {
        user: {},
      },
      commentsList: [],
      isShow: false, // 控制textarea显示与否
      replyId: "", //回复id
      replyName: "", //回复昵称
      content: "", //textarea内容
    };
  },
  created() {
    console.log("详情页", this.$route.params.id);
    this.getDetail();
    this.getComments();

    //注册事件
    this.$bus.$on("reply", async (replyId, replyName) => {
      //保存
      this.replyId = replyId; //用来发送
      this.replyName = replyName; // 它的作用仅仅就是为了显示在 textarea 里面
      //显示textarea
      this.isShow = true;
      await this.$nextTick();
      this.$refs.textarea.focus();
    });
  },
  mounted() {
    // ref 绑定
    console.log("11111", this.$refs);
  },
  methods: {
    // 获取文章详情
    async getDetail() {
      let res = await this.$axios.get(`/post/${this.$route.params.id}`);
      console.log("详情页信息", res.data.data);
      this.detail = res.data.data;
    },
    //取消关注
    async unfollow() {
      // 1. 请求
      let res = await this.$axios.get(`/user_unfollow/${this.detail.user.id}`);
      console.log("取消关注", res);
      // 2. 提示
      this.$toast.success(res.data.message);
      // 3.重新获取
      this.getDetail();
    },
    async follow() {
      //手动拦截
      let token = localStorage.getItem("token");
      if (!token) {
        this.$toast.fail("请先登录");
        this.$router.push({
          name: "login",
          params: {
            back: true,
          },
        });
        return;
      }
      //注意, 当前的id 不是文章id, 而是用户id
      // 1. 请求
      let res = await this.$axios.get(`/user_follows/${this.detail.user.id}`);
      console.log("关注", res);
      const { message, statusCode } = res.data;
      if (statusCode === 200) {
        // 2. 提示
        this.$toast.success(message);
        // 3. 重新获取
        this.getDetail();
      }
    },
    //点赞
    async like() {
      let token = localStorage.getItem("token");
      if (!token) {
        this.$toast("请登录");
        this.$router.push({
          name: "login",
          params: {
            back: true,
          },
        });
        return;
      }

      //请求
      let res = await this.$axios.get(`/post_like/${this.detail.id}`);
      console.log("点赞", res.data);
      //提示
      this.$toast.success(res.data.message);
      //重新加载
      this.getDetail();
    },
    //获取评论列表
    async getComments() {
      let res = await this.$axios.get(`/post_comment/${this.$route.params.id}`);
      console.log("评论列表", res.data.data);
      this.commentsList = res.data.data;
    },
    //聚焦
    async handleFocus() {
      // 1.textarea显示 => 数据更新, 更新视图是异步的
      this.isShow = true;
      // 2.聚焦
      await this.$nextTick();
      this.$refs.textarea.focus();
    },
    //失焦
    handleBlur() {
      this.isShow = false;
      if (!this.content) {
        this.replyId = "";
        this.replyName = "";
      }
    },
    //发布评论
    async send() {
      console.log("点击发送");
      let res = await this.$axios.post(
        `/post_comment/${this.$route.params.id}`,
        {
          content: this.content,
          parent_id: this.replyId,
        }
      );
      console.log("评论结果", res.data);
      const { statusCode, message } = res.data;
      if (statusCode == 200) {
        // 1. 提示
        this.$toast.success(message);
        // 2. 重新请求评论
        this.getComments();
        // 3. 清空
        this.content = "";
        this.replyId = "";
        this.replyName = "";

        // 4. textarea隐藏
        this.isShow = false;
        // 5. 发表评论成功, 跳转
        let element = this.$refs.box;
        element.scrollIntoView();
      }
    },
    //收藏
    async star() {
      let res = await this.$axios.get(`/post_star/${this.$route.params.id}`);
      this.$toast.success(res.data.message);
      this.getDetail();
    },
  },
};
</script>

<style lang="less" scoped>
.header {
  height: 50px;
  display: flex;
  border-bottom: 1px solid #cccccc;
  align-items: center;
  .left {
    width: 40px;
    text-align: center;
    i {
      font-size: 20px;
    }
  }
  .center {
    flex: 1;
    padding-left: 10px;
    i {
      font-size: 50px;
    }
  }
  .right {
    width: 60px;
    margin-right: 20px;
    text-align: center;
    .follow {
      border: 1px solid #999;
      height: 20px;
      line-height: 20px;
      border-radius: 10px;
    }
  }
}
.container {
  padding: 10px;
  .title {
    font-size: 20px;
    font-weight: 700;
    margin: 10px 0;
  }
  .name {
    color: #999;
    span {
      margin-right: 20px;
    }
  }
  .content {
    margin-top: 20px;
  }
  /deep/ img {
    width: 100%;
  }
  video {
    width: 100%;
    margin-top: 10px;
  }
  // 点赞
  .bottom {
    display: flex;
    justify-content: flex-end;
    margin: 10px 0;
    .like {
      height: 24px;
      width: 60px;
      border: 1px solid #000;
      line-height: 24px;
      text-align: center;
      border-radius: 12px;
      i {
        margin: 0 5px;
      }
    }
    .like.active {
      border: 1px solid #f00;
      i {
        color: red;
      }
    }
  }
  //评论部分
  .comments {
    border-top: 3px solid #ccc;
    padding-bottom: 40px;
  }
  // 底部
  .footer {
    background: #fff;
    border-top: 1px solid #ccc;
    position: fixed;
    bottom: 0;
    width: 100%;
    .input {
      height: 40px;
      display: flex;
      .left {
        flex: 1;
        // background: red;
        display: flex;
        justify-content: center;
        align-items: center;
        input {
          height: 30px;
          width: 80%;
          border: none;
          border-radius: 15px;
          background: #ddd;
          text-indent: 1em;
        }
      }
      .center,
      .right {
        width: 60px;
        font-size: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
        .active {
          color: #f00;
        }
      }
    }
  }
  .textarea {
    height: 70px;
    display: flex;
    .left {
      flex: 1;
      // background: pink;
      display: flex;
      justify-content: center;
      align-items: center;
      textarea {
        border: none;
        width: 90%;
        height: 75%;
        border-radius: 8px;
        resize: none;
        background: #ddd;
        text-indent: 1em;
        padding-top: 5px;
      }
    }
    .right {
      width: 80px;
      display: flex;
      justify-content: center;
      align-items: center;
      .send {
        background: #f00;
        color: #fff;
        width: 40px;
        height: 30px;
        border-radius: 5px;
        line-height: 30px;
        text-align: center;
      }
    }
  }
}
</style>