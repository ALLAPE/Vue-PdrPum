<template>
  <div class="pdr-pum-wrapper">
    <div :class="{ 'reload-placeholder': true, visible: reloading }" :style="{ maxHeight: (reloading ? reloadThreshold : 0) + 'px' }">
      <template v-if="$slots.reload"><slot name="reload" /></template>
      <div v-else class="default">加载中...</div>
    </div>
    <div ref="PdrPumWrapper" class="pdr-pum-scroll-content-wrapper"
         @mousedown="onStart"
         @mouseup="onEnd"
         @mousemove="onMove"
         @touchstart="onStart"
         @touchend="onEnd"
         @touchmove="onMove"
         @scroll="$emit('scroll', $event)">
      <div :class="{ 'slot-wrapper': true, 'no-animation': reloadTriggered || loadMoreTriggered }" :style="slotAnimatedStyle"><slot /></div>
    </div>
    <div ref="LoadMorePlaceholder" :class="{ 'load-more-placeholder': true, visible: loadingMore }" :style="{ maxHeight: (loadingMore ? loadMoreThreshold : 0) + 'px' }">
      <template v-if="$slots.loadMore"><slot name="loadMore" /></template>
      <div v-else class="default">加载中...</div>
    </div>
  </div>
</template>

<script>
/**
 * 下拉刷新、上拉加载更多 / Pull down to reload, pull up to load more.
 * <ul>
 *   <li><b>使用时拖拽的内容的高度必须固定</b></li>
 *   <li><b>如果使用了<code>reload</code>或<code>loadMore</code>的slot, slot的高度不能大于对应的threshold</b></li>
 * </ul>
 */
export default {
  name: 'PdrPum',
  props: {
    /**
     * 下拉触发阈值(px)
     */
    reloadThreshold: {
      type: Number,
      default: 100,
    },
    /**
     * 上拉触发阈值(px)
     */
    loadMoreThreshold: {
      type: Number,
      default: 100,
    },
    /**
     * 是否显示刷新占位内容
     */
    reloading: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否显示加载更多占位内容
     */
    loadingMore: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      // 当前鼠标是否点下
      pressing: false,
      // 是否触发刷新: 需要与阈值判断后才考虑时候发出emit, 这里只是标记用户滑动状态, 下同
      reloadTriggered: false,
      // 是否触发加载更多: 同上
      loadMoreTriggered: false,

      // 上一次需要进行渲染的时间
      slotLastAnimatedTime: Date.now(),
      // 当先标记需要渲染的时间
      slotCurrentAnimationTime: Date.now(),
      // 随着动画改变的样式: 用于优化显示
      slotAnimatedStyle: {},
      // 动画标识符
      slotAnimationFlag: undefined,

      // Y轴上一次鼠标的位置
      lastY: 0,
      // 当前偏移量
      shiftAmount: 0,
    };
  },
  watch: {
    reloading () {
      this.slotCurrentAnimationTime = Date.now();
    },
    loadingMore (value) {
      const wrapper = this.$refs.PdrPumWrapper;
      if (value && wrapper) {
        this.$nextTick(() => {
          wrapper.scrollTop = wrapper.scrollHeight - wrapper.clientHeight;
        });
      }
      this.slotCurrentAnimationTime = Date.now();
    },
  },
  mounted () {
    // 初始化数据
    this.onEnd();
    // 开始刷新
    this.animateSlotStyle();
  },
  beforeDestroy () {
    cancelAnimationFrame(this.slotAnimationFlag);
  },
  methods: {
    /**
     * 计算滑动组件的样式
     */
    animateSlotStyle () {
      this.slotAnimationFlag = requestAnimationFrame(() => {
        if (this.slotLastAnimatedTime !== this.slotCurrentAnimationTime) {
          let y = 0;
          if (this.reloadTriggered || this.loadMoreTriggered) {
            y += (this.reloadTriggered ? 1 : -1) * this.brake(
              Math.abs(this.shiftAmount),
              this.reloadTriggered ? this.reloadThreshold : this.loadMoreThreshold,
              2
            );
          }
          // if (this.reloading) {
          //   y += this.reloadThreshold;
          // }
          this.slotAnimatedStyle = {
            transform: `translateY(${y}px)`,
          };
          this.slotLastAnimatedTime = this.slotCurrentAnimationTime;
        }

        this.animateSlotStyle();
      });
    },
    /**
     * 鼠标点下
     * @param e {MouseEvent || TouchEvent} 鼠标事件
     */
    onStart (e) {
      this.lastY = e.touches ? e.touches[0].clientY : e.clientY;
      this.pressing = true;
    },
    /**
     * 鼠标松开
     */
    onEnd () {
      const absAmount = Math.abs(this.shiftAmount);
      if (!this.reloading && !this.loadingMore) {
        if (this.reloadTriggered && absAmount >= this.reloadThreshold) {
          this.$emit('reload');
        } else if (this.loadMoreTriggered && absAmount >= this.loadMoreThreshold) {
          this.$emit('loadmore');
        }
      }

      this.slotCurrentAnimationTime = Date.now();
      this.pressing = false;
      this.reloadTriggered = false;
      this.loadMoreTriggered = false;
      this.lastY = 0;
      this.shiftAmount = 0;
    },
    /**
     * 鼠标移动
     * @param e {MouseEvent | TouchEvent} 鼠标事件
     */
    onMove (e) {
      const wrapper = this.$refs.PdrPumWrapper;
      const y = e.touches ? e.touches[0].clientY : e.clientY;
      if (wrapper && this.pressing) {
        const mouseMovedStepOnY = y - this.lastY;
        const shiftAmount = this.shiftAmount + mouseMovedStepOnY;
        // 顶部时仍然在向下滑动
        if (wrapper.scrollTop === 0 && shiftAmount > 0) {
          e.preventDefault();
          this.reloadTriggered = true;
          // 如果上一次已经触发了
          if (this.loadMoreTriggered) {
            this.shiftAmount = mouseMovedStepOnY;
            this.loadMoreTriggered = false;
          } else {
            this.shiftAmount = shiftAmount;
          }
          this.slotCurrentAnimationTime = Date.now();
        } else
        // 在底部仍然在向上滑动
        if (wrapper.clientHeight + wrapper.scrollTop === wrapper.scrollHeight && shiftAmount < 0) {
          e.preventDefault();
          this.loadMoreTriggered = true;
          if (this.reloadTriggered) {
            this.shiftAmount = mouseMovedStepOnY;
            this.reloadTriggered = false;
          } else {
            this.shiftAmount = shiftAmount;
          }
          this.slotCurrentAnimationTime = Date.now();
        } else if (mouseMovedStepOnY !== 0) {
          this.reloadTriggered = false;
          this.loadMoreTriggered = false;
          this.shiftAmount = 0;
        }
      }
      this.lastY = y;
    },
    /**
     * 递减
     * @param {number} amount 需要递减的值
     * @param {number} threshold 阈值
     * @param {number} multipler 倍数
     */
    brake (amount, threshold, multipler = 1) {
      return amount <= threshold
        ? amount / multipler
        : (threshold / multipler) +
          this.brake(amount - threshold, threshold * 2, (multipler + 1) * 2);
    },
  },
};
</script>

<style lang="less" scoped>
  @animation-duration-base: .25s;
  .pdr-pum-wrapper {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    overflow: hidden;
    .pdr-pum-scroll-content-wrapper {
      flex: 1 0;
      overflow: hidden auto;
      user-select: none;
      .slot-wrapper {
        transition: @animation-duration-base;
        &.no-animation {
          transition: 0s;
        }
      }
    }
    .reload-placeholder,
    .load-more-placeholder {
      opacity: 0;
      transition: @animation-duration-base;
      overflow: hidden;
      &.visible {
        opacity: 1;
        overflow: auto;
        transition: 0s;
      }
      .default {
        color: #acacac;
        text-align: center;
        padding: 15px 0;
      }
    }
  }
</style>
