# vue-pdrpum / Pull down to reload, pull up to load more / 下拉刷新、上拉加载更多

## 安装 / Installation
```shell script
yarn add vue-pdrpum
```
或者
```shell script
npm i -s vue-pdrpum
```

## 使用方式 / Usage, see src/App.vue
```javascript
import PdrPum from 'vue-pdrpum/src/components/PdrPum.vue';
export default {
  components: { PdrPum },
};
```
```vue
<pdr-pum class="pdr-pum-container-content-wrapper"
         :reloading="reloading" :loading-more="loadingMore"
         @reload="onReload" @loadmore="onLoadMore">
  可滚动内容 / Something to scroll
</pdr-pum>
```
