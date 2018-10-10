class LazyImage {
  constructor(selector) {
    // 懒加载图片列表，将伪数组转换成数组，以使用数组的方法
    this.imageElements = Array.prototype.slice.call(document.querySelectorAll(selector));
    this.init();
  }
  inViewShow() {
    let len = this.imageElements.length;
    for (let i = 0; i < len; i++) {
      const imageElement = this.imageElements[i];
      const rect = imageElement.getBoundingClientRect();
      // 出现在视野的时候加载图片
      if (rect.top < document.documentElement.clientHeight) {
        imageElement.src = imageElement.dataset.src;
        // 移除掉已经显示的
        this.imageElements.splice(i,1);
        len--;
        i--;
        // 如果全部都加载完 则去掉滚动事件监听 
        if (this.imageElements.length === 0) {
          document.removeEventListener('scroll', this._throttleFn);
        }
      }
    }
  }
  /**
   * 函数节流，让一个函数不要执行的太频繁，减少一些过快的调用来节流
   * 1、获取第一次触发事件的时间戳
   * 2、获取第二次触发事件的时间戳
   * 3、时间差如果大于某个阈值就执行事件，然后重置第一个时间
   *  */
  throttle(fn, delay = 15, mustRun = 30) {
    let t_start = null;
    let timer = null;
    const that = this;
    return (() => {
      let t_current = +new Date();
      let args = Array.prototype.slice.call(arguments);
      clearTimeout(timer);
      if (!t_start) {
        t_start = t_current;
      }
      if (t_current - t_start > mustRun) {
        fn.apply(that, args);
        t_start = t_current;
      } else {
        timer = setTimeout(() => {
          fn.apply(that, args);
        }, delay);
      }
    });
  }
  init() {
    this.inViewShow();
    this.__throttleFn = this.throttle(this.inViewShow);
    document.addEventListener('scroll', this.__throttleFn);
  }
}