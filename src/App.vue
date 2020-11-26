<template>
  <div class="pdr-pum-container-wrapper pdr-pum-demo-wrapper">
    <div class="header">我是标题 / Headline</div>
    <pdr-pum class="pdr-pum-container-content-wrapper"
             :reloading="reloading" :loading-more="loadingMore"
             @reload="onReload" @loadmore="onLoadMore">
      <p v-for="(_, index) of array" :key="index">{{ _ }}{{ index }} 可滚动内容 / blah blah blah</p>
    </pdr-pum>
    <div class="footer">我是jiojio / Something else</div>
  </div>
</template>

<script>
import PdrPum from './components/PdrPum.vue';

export default {
  name: 'App',
  components: {
    PdrPum,
  },
  data () {
    return {
      array: new Array(50),
      reloading: false,
      loadingMore: false,
    };
  },
  methods: {
    onReload () {
      console.log('start reloading');
      this.reloading = true;
      setTimeout(() => {
        this.reloading = false;
      }, 3000);
    },
    onLoadMore () {
      console.log('start laoding more');
      this.loadingMore = true;
      setTimeout(() => {
        this.loadingMore = false;
      }, 3000);
    },
  },
};
</script>

<style lang="less" scoped>
  @import "./assets/less/pdr-pum";
  .pdr-pum-demo-wrapper {
    background-color: #e5e5e5;
    text-align: center;
    .header {
      height: 42px;
      line-height: 42px;
      background-color: #fff;
    }
    .footer {
      height: 60px;
      line-height: 60px;
      background-color: #fff;
    }
  }
</style>
