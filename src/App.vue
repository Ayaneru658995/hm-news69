<template>
  <div>
    <keep-alive :include="cacheList">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less">
.one {
  width: 200px;
  height: 200px;
  background-color: violet;
}
</style>
