<template>
<div class="split-lines">
  <span>{{ title }}</span>
</div>
</template>
<script setup>
const props=defineProps({
  title:{
    type:String
  }
})
</script>
<style lang="scss" scoped>
.split-lines{
  border-color: rgb(164, 164, 164);
  display: flex;
  margin: 16px 0;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  font-size: 16px;
  white-space: nowrap;
  text-align: center;
  border-top: 0;
  padding: 0 10px;
  span{
    display: inline-block;
    padding: 0 1em
  }
  &::before{
    position: relative;
    top: 50%;
    width: 50%;
    border-top: 1px solid transparent;
    border-top-color: inherit;
    border-bottom: 0;
    transform: translateY(50%);
    content: '';
    border-style: dashed none none;
  }
  &::after{
    position: relative;
    top: 50%;
    width: 50%;
    border-top: 1px solid transparent;
    border-top-color: inherit;
    border-bottom: 0;
    transform: translateY(50%);
    content: '';
    border-style: dashed none none;
  }
}
</style>