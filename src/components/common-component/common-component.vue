<template>
  <div class="ct">
    <ul class="cd-items cd-container">
      <li class="cd-item" v-for="(good, index) in c_list" :key="index" :data-id="good.id">
        <img :src="good.src" alt="pic">
        <a href="javascript:void(0)" class="cd-trigger" @click="toPreview(good, index)">点击预览</a>
      </li>
    </ul>

    <div class="cd-quick-view">
      <div class="cd-slider-wrapper">
        <ul class="cd-slider">
          <li class="selected"><img src="/static/img/g.png" alt="Product 1"></li>
          <li><img src="/static/img/g2.png" alt="Product 2"></li>
          <li><img src="/static/img/g3.png" alt="Product 3"></li>
        </ul>
        <ul class="cd-slider-navigation">
          <li>
            <a class="cd-next" href="#0" @click="updateSlider('cd-next')"> ←</a>
          </li>
          <li>
            <a class="cd-prev" href="#0" @click="updateSlider('cd-prev')"> →</a>
          </li>
        </ul>
      </div>
      <div class="cd-item-info">
        <h2>{{detail_title}}</h2>
        <p >{{detail_desc}}</p>
        <ul class="cd-item-action">
          <li>
            <button class="add-to-cart">添加到购物车</button>
          </li>
          <li><a href="#0">了解更多</a></li>
        </ul>
      </div>
      <a href="javascript:void(0)" class="cd-close" @click="closeQuickView()">关闭</a>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import Velocity from 'velocity-animate' // 在组件中引入
import 'velocity-animate/velocity.ui.js' // 同时引入velocity.ui.js插件，velocity.ui.js

export default {
  name: 'common-component',
  props: {
    data: Array
  },
  data () {
    return {
      c_list: [],
      sliderFinalWidth: 400,
      maxQuickWidth: 900,
      detail_title: '',
      detail_desc: '',
      $detailCt: null
    }
  },
  watch: {
    data (data) {
      this.c_list = data
    }
  },
  mounted () {
    this.$detailCt = $('.cd-quick-view').eq(0)

    const _this = this
    $('body').on('click', function (event) {
      if ($(event.target).is('body.overlay-layer')) {
        _this.closeQuickView()
      }
    })

    $(document).keyup(function (event) {
      if (event.which === '27') {
        _this.closeQuickView()
      }
    })

    $(window).on('resize', function () {
      if (_this.$detailCt.hasClass('is-visible')) {
        window.requestAnimationFrame(_this.resizeQuickView)
      }
    })
  },
  methods: {
    // 点击预览
    toPreview (good, index) {
      let selectedImage = $('.cd-item').eq(index).children('img').eq(0)
      let selectedImageUrl = good.src

      $('body').addClass('overlay-layer')
      this.animateQuickView(selectedImage, 'open') // 展示详情modal
      this.updateQuickView(selectedImageUrl, good.name, good.summary)
    },

    updateSlider (operate) {
      let sliderConatiner = $('.' + operate).parents('.cd-slider-wrapper').find('.cd-slider')
      let activeSlider = sliderConatiner.children('.selected').removeClass('selected')
      if (operate === 'cd-next') {
        (!activeSlider.is(':last-child')) ? activeSlider.next().addClass('selected')
          : sliderConatiner.children('li').eq(0).addClass('selected')
      } else {
        (!activeSlider.is(':first-child')) ? activeSlider.prev().addClass('selected')
          : sliderConatiner.children('li').last().addClass('selected')
      }
    },

    updateQuickView (url, name, summary) {
      this.detail_title = name
      this.detail_desc = summary
      $('.cd-quick-view .cd-slider li').removeClass('selected').find('img[src="' + url + '"]').parent('li').addClass('selected')
    },

    resizeQuickView () {
      let quickViewLeft = ($(window).width() - this.$detailCt.width()) / 2
      let quickViewTop = ($(window).height() - this.$detailCt.height()) / 2
      this.$detailCt.css({'top': quickViewTop, 'left': quickViewLeft})
    },

    closeQuickView () {
      let close = $('.cd-close').eq(0)
      let activeSliderUrl = close.siblings('.cd-slider-wrapper').find('.selected img').eq(0).attr('src')
      let selectedImage = $('.empty-box').find('img').eq(0)
      if (!this.$detailCt.hasClass('velocity-animating') && this.$detailCt.hasClass('add-content')) {
        selectedImage.attr('src', activeSliderUrl)
        this.animateQuickView(selectedImage, 'close')
      } else {
        this.closeNoAnimation(selectedImage)
      }
    },

    animateQuickView (image, animationType) {
      let parentListItem = image.parent('.cd-item')
      let topSelected = image.offset().top - $(window).scrollTop()
      let leftSelected = image.offset().left
      let widthSelected = image.width()
      let heightSelected = image.height()
      let windowWidth = $(window).width()
      let windowHeight = $(window).height()
      let finalWidth = this.sliderFinalWidth
      let finalLeft = (windowWidth - finalWidth) / 2
      let finalHeight = finalWidth * heightSelected / widthSelected
      let finalTop = (windowHeight - finalHeight) / 2
      let quickViewWidth = (windowWidth * 0.8 < this.maxQuickWidth) ? windowWidth * 0.8 : this.maxQuickWidth
      let quickViewLeft = (windowWidth - quickViewWidth) / 2

      const _this = this

      if (animationType === 'open') {
        parentListItem.addClass('empty-box')

        Velocity(_this.$detailCt, {
          'top': topSelected,
          'left': leftSelected,
          'width': widthSelected
        }, {
          duration: 1000,
          complete: function () {
            _this.$detailCt.addClass('animate-width')

            Velocity(_this.$detailCt, {
              'left': quickViewLeft + 'px',
              'width': quickViewWidth + 'px'
            }, {
              duration: 300,
              complete: function () {
                console.log('finish')
                _this.$detailCt.addClass('add-content')
                _this.$detailCt.addClass('is-visible')
              }
            })
          }
        })
      } else {
        _this.$detailCt.removeClass('add-content')

        Velocity(_this.$detailCt, {
          'top': finalTop + 'px',
          'left': finalLeft + 'px',
          'width': finalWidth + 'px'
        }, {
          duration: 300,
          complete: function () {
            console.log('finish close animateQuickView')
            $('body').removeClass('overlay-layer')

            Velocity(_this.$detailCt, {
              'top': topSelected,
              'left': leftSelected,
              'width': widthSelected
            }, {
              duration: 500,
              complete: function () {
                _this.$detailCt.removeClass('is-visible')
                parentListItem.removeClass('empty-box')
              }
            })
          }
        })
      }
    },

    closeNoAnimation (image) {
      let parentListItem = image.parent('.cd-item')
      let topSelected = image.offset().top - $(window).scrollTop()
      let leftSelected = image.offset().left
      let widthSelected = image.width()
      let _this = this

      $('body').removeClass('overlay-layer')
      parentListItem.removeClass('empty-box')

      Velocity(_this.$detailCt, 'stop', {}, {
        complete: function () {
          console.log('finish close closeNoAnimation')
          $('.cd-quick-view').removeClass('add-content animate-width is-visible')
            .css({
              'top': topSelected,
              'left': leftSelected,
              'width': widthSelected
            })
        }
      })
    }
  }
}
</script>

<style scoped>
  @import '../../common/css/reset.css';
  @import '../../common/css/style.css';

  .cd-item:hover .cd-trigger{
    opacity: 1!important;
  }
</style>
