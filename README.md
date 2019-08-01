# admin-manager-3

> A Vue.js project

[token验证](https://www.cnblogs.com/chenwenhao/p/10466774.html)

# Velocity插件
[原文地址](https://github.com/julianshapiro/velocity/wiki)
##1.插件介绍
Velocity是一个动画引擎，其API类似于jQuery的$.animate()。
它没有依赖关系，但是可以扩展jQuery、Zepto，甚至原生DOM。
它非常快，并且具有`彩色动画、转换、循环、缩放、SVG支持和滚动`。

##2.使用介绍
Velocity的设置主要分为两部分：基础设置部分和可选设置部分

##3.可设置部分（options）
Begin: 传递开始在动画开始之前触发的函数 <br>
```
begin: function(elements， activeCall){
  // activeCall: {}, 最有用的成员是.element成员，它是元素数组中动画的第一个元素
}
```

Complete: 一个动画完成后要触发的函数 <br>

Delay: 指定延迟选项（以毫秒为单位）以在动画开始之前插入暂停 <br>
```
delay: - 400 （正数和负数都可以）
```

Drag： true|false

Duration: 以毫秒为单位指定的持续时间以及命名持续时间 ("slow", "normal", and "fast")

Easing
```
ease", "ease-in", "ease-out", and "ease-in-out"
spring
CSS3的贝塞尔曲线：通过一个四项贝塞尔点阵列


/* Use one of the jQuery UI easings.  使用jQuery UI缓动之一 */
element.velocity({ width: 50 }, "easeInSine");

/* Use a custom bezier curve. 使用自定义贝塞尔曲线 */
element.velocity({ width: 50 }, [ 0.17, 0.67, 0.83, 0.67 ]);

/* Use spring physics. 使用弹簧物理 */
element.velocity({ width: 50 }, [ 250, 15 ]);

/* Use step easing. 使用弹簧物理 */
element.velocity({ width: 50 }, [ 8 ]);

easing: "easeInSine"
```

FPS Limit
```
Velocity.defaults.fpsLimit = 30; // 更改Velocity更新动画的每秒的最大次数（默认是60）
```

Loop：以指定动画应在调用的属性映射中的值与调用之前的元素值之间交替的次数
```
// Alternate the height between 5em and 10em twice.( 在5em和10em之间交替高度两次)
element.velocity({ height: ["10em", "5em"] }, { loop: 2 });

// loop的值如果设为true,表示无限循环
```

Progress: 在整个动画期间重复触发回调函数。回调函数传递有关调用状态的数据
```
progress: function(elements, percentComplete, remaining, tweenValue, activeCall) {
    console.log("当前元素:", activeCall.element);
    console.log('进度:', (percentComplete * 100) + "%");
    console.log("Started at", new Date(Date.now() - activeCall.ellapsedTime));
    console.log('剩余毫秒：', remaining);
    console.log("当前补间值为：", tweenValue);
}
```

Queue

Repeat

Speed: 更改动画运行的速度
默认速度是1.0，意味着1ms的动画持续时间需要1ms才能显示。
```
speed: 2
```

##4.command
1.finish: 要过早地跳转到动画的结尾，请使用finish命令，将“finish”作为Velocity的第一个参数传入。
ps: 只是跳转到动画的最后一帧，不会阻止调用的完整回调发生
```
element.velocity("finish");
```

2.pause: 暂停正在运行的动画或队列。您可以稍后再次启用它"resume"

3.stop: 立即停止所有当前Velocity调用,“stop”作为Velocity的第一个参数传入
如果要停止自定义队列，请将队列名称作为第二个参数传递
```
element.velocity("stop"); // Normal stop
element.velocity("stop", "myQueue"); // 自定义队列

// 可以传递一个附加值true来停止`指定队列上`的元素上的所有排队动画
element.velocity("stop", true);
```
4.resume: 这允许您恢复暂停的动画或队列。您可以稍后再次暂停"pause"

Velocity(el, {
  opacity: 1
}, {
  duration: 1000,
  complete: done
})


## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
