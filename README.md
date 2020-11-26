# vue-pdrpum / Pull down to reload, pull up to load more / 下拉刷新、上拉加载更多

## 使用方式 / Usage
```vue
<pdr-pum class="pdr-pum-container-content-wrapper"
         :reloading="reloading" :loading-more="loadingMore"
         @reload="onReload" @loadmore="onLoadMore">
  可滚动内容 / Something to scroll
</pdr-pum>
```
