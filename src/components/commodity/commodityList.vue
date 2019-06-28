<template>
  <div class="hello">
    <div class="news-list-ct">
      <ul>
        <li>商品列表</li>
        <li v-for="(list, index) in commodityList" :key="index" :data-id="list.id">
          <a href="">{{list.title}}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import API from './../../axios/api'

export default {
  name: 'commodity-list',
  data () {
    return {
      commodityList: []
    }
  },
  computed: {},
  mounted () {
    this._getCommodityList()
  },
  methods: {
    _getUserInfo () {
      this.$store.dispatch('getUserInfo')
    },
    // 获取商品列表
    _getCommodityList () {
      API.getCommodityList({})
        .then(res => {
          console.log('res.data:', res.data);
          this.commodityList = res.data
        })
        .catch(error => {
          this.$Message.error(error)
        })
    }
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
  .news-list-ct{
    width: 1200px;
    padding: 24px;
  }
  .news-list-ct li{
    display: block;
    line-height: 40px;
  }
</style>
