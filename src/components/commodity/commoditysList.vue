<template>
  <div class="hello">
    <div class="goods-list-ct">
      <p>商品列表</p>
      <GoodsDetailC :data="paramList"/>
    </div>
  </div>
</template>

<script>
import API from '../../axios/api'
import GoodsDetailC from '../common-component/common-component'

export default {
  name: 'commodity-list',
  data () {
    return {
      commodityList: [],
      paramList: []
    }
  },
  computed: {},
  mounted () {
    this._getCommodityList()
  },
  watch: {
    commodityList: 'changeCommodityList'
  },
  methods: {
    _getUserInfo () {
      this.$store.dispatch('getUserInfo')
    },
    // 获取商品列表
    _getCommodityList () {
      API.getCommodityList({})
        .then(res => {
          console.log('res.data:', res.data)
          this.commodityList = res.data
        })
        .catch(error => {
          this.$Message.error(error)
        })
    },
    changeCommodityList (list) {
      this.paramList = list
    }
  },
  components: {
    GoodsDetailC
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
</style>
