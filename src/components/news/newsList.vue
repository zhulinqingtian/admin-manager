<template>
  <div class="hello">
    <div class="news-list-ct">
      <ul>
        <li>新闻列表</li>
        <li v-for="(list, index) in newsListShow" :key="index" :data-id="list.id">
          <a href="">{{list.title}}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import API from './../../axios/api'

export default {
  name: 'news-list',
  data () {
    return {
      newsListShow: []
    }
  },
  computed: {},
  mounted () {
    this.getNewList()
  },
  methods: {
    _getUserInfo () {
      this.$store.dispatch('getUserInfo')
    },
    // 获取新闻列表
    getNewList () {
      API.JH_news('type=top&key=123456')
        .then(res => {
          this.newsListShow = res.data
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
