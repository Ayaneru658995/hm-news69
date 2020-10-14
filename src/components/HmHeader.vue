<template>
  <div class="hm-header">
    <div class="m">
      <div class="left" @click="$router.back()">
        <i class="iconfont iconjiantou2"></i>
      </div>
      <div class="center">
        <slot></slot>
      </div>
      <div class="right"></div>
    </div> 
  </div>
</template>

<script>
export default {}
</script>

<style lang="less">
.hm-header {
  height: 40px;
  .m {
    background-color: #f4f4f4;
    height: 40px;
    width: 100%;
    border-bottom: 1px solid #ccc;
    display: flex;
    text-align: center;
    align-items: center;
    position: fixed;
    z-index: 999;
    .left,
    .right {
      width: 30px;
    }
    .center {
      flex: 1;
      font-weight: 700;
      font-size: 18px;
    }
  }
}
</style>
