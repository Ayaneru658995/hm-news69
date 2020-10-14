<template>
  <div class="hm-button">
    <slot></slot>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
.hm-button {
  height: 50px;
  margin: 20px;
  background-color: #cc3300;
  display: flex;
  justify-content: center;
  align-items: center;

  color: #fff;
  font-size: 18px;
  border-radius: 25px;
}
</style>
