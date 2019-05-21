<template>
  <div>
    <Row>
      <Col span="8" :width="headerWidth">
        <Menu :open-names="['1']" accordion id="left-menu" :width="headerWidth">
          <div class="layout-logo-left">
            <h3 class="title">AA系统</h3>
          </div>
          <MenuItem name="1-1" class="homepage-menu single-menu-item">
            <router-link to="/view"><p>首页</p></router-link>
          </MenuItem>
          <Submenu name="3" class="taobao">
            <template slot="title">淘宝</template>
            <MenuGroup title="管理1" class="slide-toggle-parent">
              <Icon type="ios-arrow-forward" class="slidedown-icon" @click.native="_toggleSubItems($event)"/>
              <Icon type="ios-arrow-down" class="slideup-icon hide" @click.native="_toggleSubItems($event)"/>
              <MenuItem name="3-1">
                <router-link to="/view/salesSystem/settingRecharge"><p>自定义充值价格</p></router-link>
              </MenuItem>
              <MenuItem name="3-2" v-if="tbClientSearchShow">
                <router-link to="/view/salesSystem/clientSearch"><p>客户查询</p></router-link>
              </MenuItem>
            </MenuGroup>
            <MenuGroup title="管理2" v-if="checkShow" class="check-block-menu slide-toggle-parent">
              <Badge :count="signatureVerificationCount + templateVerificationCount + smsVerificationCount + invoiceVerificationCount + videoTemplateVerificationCount"
                     overflow-count="99"
                     class="statistic-icon"
              ></Badge>
              <Icon type="ios-arrow-forward" class="slidedown-icon" @click.native="_toggleSubItems($event)"/>
              <Icon type="ios-arrow-down" class="slideup-icon hide" @click.native="_toggleSubItems($event)"/>
              <MenuItem name="3-4">
                <router-link to="/view/reviewManage/signatureReview">
                  <p>审核1<Badge count="2" overflow-count="99"></Badge></p>
                </router-link>
              </MenuItem>
              <MenuItem name="3-5">
                <router-link to="/view/reviewManage/signatureRecord"><p>审核2</p></router-link>
              </MenuItem>
              <MenuItem name="3-6">
                <router-link to="/view/reviewManage/templateReview">
                  <p>审核3<Badge count="5" overflow-count="99"></Badge></p>
                </router-link>
              </MenuItem>
            </MenuGroup>
            <MenuGroup title="管理3" v-if="memberInteShow" class="slide-toggle-parent">
              <Icon type="ios-arrow-forward" class="slidedown-icon" @click.native="_toggleSubItems($event)"/>
              <Icon type="ios-arrow-down" class="slideup-icon hide" @click.native="_toggleSubItems($event)"/>
              <MenuItem name="4-1">
                <router-link to="/view/member"><p>资料</p></router-link>
              </MenuItem>
              <MenuItem name="4-2">
                <router-link to="/view/member/creditsExchange"><p>资料1</p></router-link>
              </MenuItem>
              <MenuItem name="4-3">
                <router-link to="/view/member/exchangeGoods"><p>资料2</p></router-link>
              </MenuItem>
              <MenuItem name="4-4">
                <router-link to="/view/member/exchangeRecord"><p>资料3</p></router-link>
              </MenuItem>
            </MenuGroup>
            <MenuItem name="5-1" v-if="noticeManageShow">
              <router-link to="/view/notice/noticeManagement"><p>公告管理</p></router-link>
            </MenuItem>
          </Submenu>
          <Submenu name="4" class="finance">
            <template slot="title">财务</template>
            <MenuItem name="2-1">
              <router-link to="/view/finance/salesPerformanceStatistics"><p>财务1</p></router-link>
            </MenuItem>
            <MenuItem name="2-2">
              <router-link to="/view/finance/prerechargeRecord"><p>财务2</p></router-link>
            </MenuItem>
            <MenuItem name="2-3">
              <router-link to="/view/finance/rebateRecord"><p>财务3</p></router-link>
            </MenuItem>
          </Submenu>
          <Submenu name="2" class="setting">
            <template slot="title">
              设置
            </template>
            <MenuItem name="2-1">
              <a href="http://console.account.shomop.com/view/setting/accountManage"><p>账号管理</p></a>
            </MenuItem>
            <MenuItem name="2-2">
              <a href="http://console.account.shomop.com/view/setting/updateLoginPass"><p>修改登录密码</p></a>
            </MenuItem>
          </Submenu>
        </Menu>
      </Col>
      <Col :style="{left: rightLeft}" class="main" id="right-main-content">
        <div>
          <div class="top-content tool-bar" :style="{left: topBarLeft}">
            <Button type="text" @click="toggleNavClick" id="btnToggleNav">
              <Icon type="navicon" size="32"></Icon>
            </Button>
            <div class="account-right">
              <span>{{username}}</span>
              <a title="退出" @click="_logout">
                <Icon type="power"></Icon>
              </a>
            </div>
          </div>
          <router-view></router-view>
        </div>
      </Col>
    </Row>
  </div>
</template>
<script>
import $ from 'jquery'

export default {
  name: 'abc',
  data () {
    return {
      username: '张三',
      headerWidth: '200',
      topBarLeft: '0px',
      rightLeft: '208px',
      signatureVerificationCount: 0, // 签名审核
      templateVerificationCount: 0, // 模板审核
      smsVerificationCount: 0, // 短信审核
      videoTemplateVerificationCount: 0, // 视频短信模板审核
      invoiceVerificationCount: 0, // 发票审核
      permissionList: [],
      countTimeID: null,
      checkShow: true,
      memberInteShow: true,
      noticeManageShow: true,
      clientManageShow: true,
      tbClientSearchShow: true
    }
  },
  created: function () {},
  mounted () {},
  watch: {
    permissionList: 'watchPermissions'
  },
  updated: function () {
    this.permissionList = []
  },
  methods: {
    toggleNavClick () {
      const leftMenuBar = document.querySelector('#left-menu') // 左侧菜单
      const btnToggleNav = document.querySelector('#btnToggleNav i')
      const ivuMenus = document.querySelectorAll('.ivu-menu-submenu .ivu-menu')

      this.headerWidth = this.headerWidth >= 200 ? '60' : '200'
      this.topBarLeft = this.headerWidth >= 200 ? '0px' : '0px'
      this.rightLeft = this.headerWidth >= 200 ? '208px' : '76px'

      leftMenuBar.style.width = this.headerWidth + 'px'

      if (ivuMenus && ivuMenus.length) {
        ivuMenus.forEach(function (menu) {
          menu.classList.toggle('none')
        })
      }
      leftMenuBar.classList.toggle('small-bar')
      btnToggleNav.classList.toggle('rotate90')
    },

    _toggleSubItems (e) {
      const target = e.target
      $(target).toggleClass('hide')
      $(target).siblings('.ivu-icon').toggleClass('hide')
      $(target).parent('ul').toggleClass('show')
    },

    watchPermissions (newList, oldList) {
      if (oldList === newList) return

      const p = this.permissionList
      this.tbClientSearchShow = p && (p.indexOf('shomop_user_getUserByUsername') > -1 && p.indexOf('shomop_admin_countShomopPaymentAndSmsRecord') > -1 && p.indexOf('shomop_admin_listShomopPaymentAndSmsRecord') > -1 && p.indexOf('shomop_admin_listShomopPaymentAndSmsDetail') > -1 && p.indexOf('shomop_admin_saveShomopSmsDetail') > -1)
      this.checkShow = p && (p.indexOf('shomop_signature_list') > -1 || p.indexOf('shomop_signature_audit') > -1 || p.indexOf('shomop_template_get') > -1 || p.indexOf('shomop_message_approve') > -1 || p.indexOf('shomop_crm_videoReview') > -1 || p.indexOf('shomop_invoice_check') > -1)
      this.memberInteShow = p && (p.indexOf('shomop_user_info') > -1 || p.indexOf('shomop_points_listRecordBackstage') > -1 || p.indexOf('shomop_merchandise_list') > -1 || p.indexOf('shomop_exchangeRecord_count') > -1)
      this.noticeManageShow = p && (p.indexOf('shomop_crm_noticeManagement') > -1)
      this.clientManageShow = p && (p.indexOf('shomop_recharge_listCustomPriceByNick') > -1)
    },

    _logout () {}
  },
  computed: {}
}
</script>

<style lang="stylus" scoped>
  body
    background-color #f5f7f9
  #left-menu
    position fixed
    left 0
    top 0
    bottom 0
    background-color #515a6e
    color #fff
    overflow-y scroll
    z-index 100
    overflow visible
  .layout-logo-left
    position: relative;
    height: 60px;
    margin-bottom: 5px;
    overflow hidden
    img
      position: absolute;
      height: 30px;
      left: 10px;
      top: 15px;
    h3
      margin-left: 50px;
      padding-left: 20px;
      color: #fff;
      line-height: 60px;
      width: 140px;
      white-space nowrap
      text-overflow ellipsis

  .main
    padding-top 76px
    padding-bottom 40px
    transition padding-left .5s
    position absolute
    right 0
    z-index 10
    &.header-text-hide
      left 208px
  .top-content
    position:absolute;
    top:0;
    left:0px;
    right:0;
    height:60px;
    line-height: 50px;
    box-shadow: 0 2px 1px 0 #ccc;
    background-color:#fff;
    z-index:100;
    transition left .5s
  .account-right
    width: 300px;
    height: 60px;
    float: right;
    font-size: 16px;
    line-height: 60px;
    text-align: right;
    padding-right: 22px;
  .account-right span
    font-size: 16px;
  .account-right ivu-icon-power
    font-size: 24px !important;
</style>
<style lang="stylus">
  .special-input{
    width 200px;
    height:32px;
    border-radius 4px;
    padding-left 10px;
    outline:none;
    border:1px solid #ccc;
    margin-right: 12px;
  }
  .special-input:focus{
    border:1px solid dodgerblue;
  }
  .ivu-input-wrapper .ivu-input {
    background-color: rgb(250, 255, 189)!important;
  }
  .ivu-badge
    display inline-block
    margin-left 8px
  .check-block-menu
    position relative
    .statistic-icon
      position absolute
      left 105px
      top 10px
  .ivu-badge-count
    background-color transparent
</style>

<!--左侧菜单样式-->
<style lang="stylus">
  @import "../../common/css/common.styl";
  .none
    display none
  .rotate90
    transform rotate(90deg)

  .ivu-menu-vertical
    .ivu-menu-item:hover, .ivu-menu-submenu-title:hover
      background-color #3596fc!important
    color #fff
    .ivu-menu-item, .ivu-menu-submenu-title, .ivu-menu-submenu .ivu-menu-item
      padding 0
      a
        display block
        line-height 40px
        padding-left 48px
        color #fff
        text-align left
    .ivu-menu-submenu-title-icon
      top 14px
      right 18px
    .ivu-menu-submenu-title
      line-height 40px
      padding-left 13px
    .ivu-menu-item-group-title
      padding-left 48px
      background-color: #495060;
      color #fff
      height 40px
      line-height 40px
      text-overflow ellipsis
      white-space nowrap
    .ivu-menu
      color #fff
      .ivu-menu-item
        line-height 40px
        padding-left 32px
        background-color #363e4f
      .ivu-menu-item-active.ivu-menu-item-selected
        background-color: #3596fc;
        color #fff
        border-right-width 0px
    .homepage-menu
      &.single-menu-item
        &.ivu-menu-item-active.ivu-menu-item-selected
          background-color: #3596fc;
          color #fff
          border-right-width 0px
      a
        padding-left 13px
  .ivu-menu-item, .ivu-menu-submenu-title
    height 40px
    .router-link-active, a
      overflow hidden
    a
      height 40px
      text-overflow ellipsis
      white-space nowrap
      text-align left
      p
        height 40px
  .ivu-menu-submenu-title
    white-space: nowrap;
    text-overflow: ellipsis;
  .taobao, .setting, .finance
    .ivu-menu
      .ivu-menu-item
        padding-left 0px
  .setting
    .ivu-menu-submenu-title
      padding-left 13px

  .small-bar
    .taobao, .setting, .finance
      position relative
      &:hover
        .ivu-menu-submenu-title
          &+.ivu-menu
            display block!important
            position: absolute;
            left: 60px;
            top: 0px;
            z-index: 100;
            width: 200px;
            height 0
</style>

<style lang="stylus">
  .slide-toggle-parent
    position relative
    .ivu-icon
      position: absolute;
      right: 0px;
      top: 0px;
      width: 100%;
      text-align: right;
      padding-right: 26px;
      transition all 0.2s linear
      cursor: pointer;
      line-height: 40px;
    .ivu-icon
      &.hide
        display none
    >ul
      height 0
      overflow hidden
      transition height 0.5s linear
      &.show
        height auto
</style>
