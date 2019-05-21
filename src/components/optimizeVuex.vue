<template>
  <div class="hello">
    <p>优化过后store的使用</p>
    <div class="info-block">
      <p>click {{count}} times</p>
      <button @click="increment">增加</button>
      <button @click="decrement">减少</button>
      <button @click="incrementIfOdd">是奇数是增加</button>

      <button @click="getUserInfo">获取用户信息</button>
      <button @click="getPlatInfo">获取平台信息</button>
    </div>

    <div class="info-block">
      用户名：{{currentUser.name}}
      角色： {{currentUser.role || ''}}
      <br>
      平台名称：{{plat && plat.name || ''}}
      版本：{{plat && plat.version}}
      更新时间： {{plat && plat.updateTime}}
    </div>
  </div>
</template>
<script>
import commonMethods from '../assets/utils/commonMethods.js'
import { mapActions, mapGetters, mapState, mapMutations } from 'vuex'

export default {
  name: 'OptimizeVuex',
  data () {
    return {
      currentUser: {
        name: 'test',
        role: 'test01'
      }
    }
  },
  computed: {
    ...mapState(['count']),
    ...mapGetters(['user', 'plat'])
  },
  watch: {
    user: 'changeUser' // 检测user对象变化，检测方法：changeUser
  },
  methods: {
    ...mapActions(['incrementIfOdd', 'getUserInfo', 'getPlatInfo']), // 触发的方法要和action里的方法名一致才可以这样写
    ...mapMutations(['increment', 'decrement']),
    changeUser (user) {
      if (user && !commonMethods.isEmptyObject(user)) {
        this.currentUser = user
      }
    }
  }
}
</script>

<style scoped>
  .info-block{
    margin: 20px;
    padding: 10px;
    border: 1px solid #d8d8d8;
    color: #333;
  }
</style>
