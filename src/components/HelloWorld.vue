<template>
  <div class="hello">
    <div class="info-block">
      <p>click {{count}} times</p>
      <button @click="increment">增加</button>
      <button @click="decrement">减少</button>
      <button @click="incrementIfOdd">是奇数是增加</button>

      <button @click="_getUserInfo">获取用户信息</button>
      <button @click="_getPlatInfo">获取平台信息</button>
    </div>

    <div class="info-block">
      用户名：{{currentUser.name}}
      角色： {{currentUser.role || ''}}
      <br>
      平台名称：{{plat && plat.name || ''}}
      版本：{{plat && plat.version}}
      更新时间： {{plat && plat.updateTime}}
    </div>

    <router-link to="/view/optimizeVuex">优化过后的vuex的使用</router-link>
    <router-link to="/view/testUpload">测试上传</router-link>

    <div>

      <Select v-model="specialModel" multiple @on-change='specialChange'>
        <Option v-for="(item, index) in opt" :value="index" :key="index" >{{ item }}</Option>
      </Select>
    </div>
  </div>
</template>

<script>
import commonMethods from '../assets/utils/commonMethods'
import MultiSelect from './common-component/mutil-select.vue'

export default {
  name: 'HelloWorld',
  data () {
    return {
      currentUser: {
        name: 'test',
        role: 'test01'
      },
      value: [],
      opt: {
        '': '全选',
        'FW_GOODS-1000998284-1': '会员数量50万以下',
        'FW_GOODS-1000998284-v2': '会员数量50万-200万',
        'FW_GOODS-1000998284-v3': '会员数量200万以上'
      },
      columnSpecialList: [],
      specialModel: []
    }
  },
  computed: {
    count () {
      return this.$store.state.count
    },
    user () {
      return this.$store.state.user
    },
    plat () {
      return this.$store.state.plat
    }
  },
  watch: {
    user: 'changeUser' // 检测user对象变化，检测方法：changeUser
  },
  mounted () {},
  methods: {
    changeUser (user) {
      if (user && !commonMethods.isEmptyObject(user)) {
        this.currentUser = user
      }
    },
    increment () {
      this.$store.commit('INCREMENT')
    },
    decrement () {
      this.$store.commit('DECREMENT')
    },
    // 只有是奇数才加1
    incrementIfOdd () {
      this.$store.dispatch('incrementIfOdd') // 触发store中对应的action调用
    },
    _getUserInfo () {
      this.$store.dispatch('getUserInfo')
    },
    _getPlatInfo () {
      this.$store.dispatch('getPlatInfo')
    },
    specialChange (val) {
      let columnSpecialList = this.columnSpecialList
      if (val[val.length - 1] === 0) { // 点击全选或只剩全选
        if (val.length === 1) { // 只剩全选
          this.specialModel = []
        } else { // 点击全选
          this.specialModel = columnSpecialList.map(i => {
            return i.id
          })
        }
        this.specialModelTmp = this.specialModel
        this.specialNum = 1
      } else if (this.specialNum === 0) { // specialNum 点击时进入
        let tmp = true
        val.map((item, j) => {
          if (item === 0) { // 含有全选
            tmp = false
            this.specialModel.splice(j, 1)
            this.specialNum = 1
          }
        })
        // 选择数==总长度-1  且没有全选
        if (val.length === columnSpecialList.length - 1 && tmp && this.specialModelTmp.indexOf(0) === -1) {
          this.specialModel = columnSpecialList.map(i => {
            return i.id
          })
          this.specialNum = 1
          // 选择数==总长度-1  且有全选
        } else if (val.length === columnSpecialList.length - 1 && tmp && this.specialModelTmp.indexOf(0) >= 0) {
          let list = []
          // specialModelTmp 临存列表像
          this.specialModelTmp.map(i => {
            let tmp = true
            val.map(j => { // 过滤相同项
              if (i === j) {
                tmp = false
              }
            })
            if (tmp) {
              list.push(i)
            }
          })
          // 仅一个且全选
          if (list.length === 1 && list[0] === 0) {
            this.specialModel = []
            this.specialNum = 1
          } else {
            this.specialNum = 0
          }
        } else {
          this.specialNum = 0
        }
        this.specialModelTmp = this.specialModel
      } else {
        this.specialNum = 0
      }
    }
  },
  components: {
    MultiSelect
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
