<template>
  <Select v-model="selectValue" multiple @on-change="change()"  v-bind:style="styleObject" >
    <Option v-for="(value, key) in optionArr" :key="key" :value="key">{{ value }}</Option>
  </Select>
</template>

<script>
export default {
  name: 'MultiSelect',
  data () {
    return {
      selectValue: this.selectValueProp,
      optionArr: this.optionArrProp,
      lastSelectValue: [],
      ALL_SELECT: 'ALL_SELECT',
      styleObject: {
        'width': this.widthProp + 'px'
      }
    }
  },
  props: {
    selectValueProp: {
      type: Array,
      default: function () {
        return []
      }
    },
    optionArrProp: {
      type: Object,
      default: function () {
        return {}
      }
    },
    widthProp: {
      type: Number,
      default: function () {
        return 100
      }
    }
  },
  watch: {
    optionArrProp () {
      this.optionArr = this.optionArrProp
    }
  },
  mounted () {
    console.log('created')
  },
  methods: {
    change () {
      var curLength = this.selectValue.length
      var lastLength = this.lastSelectValue.length
      var curSelect = this.subCollection(this.selectValue, this.lastSelectValue)
      // 1、如果全选，则全部选中
      // 2、如果反选，则全部取消
      // 3、如果其它项全部选择，则默认勾选全选
      // 4、如果其它项全部未选，则默认取消全选
      if (curLength > lastLength) { // 增加选项
        if (curSelect === this.ALL_SELECT) {
          var keys = []
          for (var key in this.optionArr) {
            keys.push(key)
          }
          this.selectValue = keys
        } else { // 判断是否已全部选中
          if (this.selectValue.length === this.jsonLength(this.optionArr) - 1) {
            this.selectValue.push(this.ALL_SELECT)
          }
        }
      } else { // 取消选项
        if (curSelect === this.ALL_SELECT) {
          this.selectValue = []
        } else if (this.selectValue.length === this.jsonLength(this.optionArr) - 1) {
          this.removeArrValue(this.selectValue, this.ALL_SELECT)
        }
      }
      this.lastSelectValue = []
      for (var i = 0; i < this.selectValue.length; i++) {
        this.lastSelectValue.push(this.selectValue[i])
      }
    },
    jsonLength (json) {
      return Object.keys(json).length
    },
    removeArrValue (arr, val) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] === val) {
          arr.splice(i, 1)
          break
        }
      }
    },
    subCollection (src, dest) {
      var min = src
      var max = dest
      if (src.length > dest.length) {
        min = dest
        max = src
      }
      for (var i = 0; i < max.length; i++) {
        var exists = false
        for (var j = min.length - 1; j >= 0; j--) {
          if (max[i] === min[j]) {
            exists = true
            break
          }
        }
        if (!exists) {
          return max[i]
        }
      }
    }
  }
}
</script>
