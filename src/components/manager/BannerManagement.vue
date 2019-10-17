<template>
  <div class="content">
    <Button type="primary" @click="_addModal" class="addBtn">
      <Icon type="plus-round" style="margin-right:4px"></Icon>添加</Button>

    <Table :border="false"
           id="banner-management-list-table"
           :columns="modalkey"
           :data="modalData"
    ></Table>

    <Modal
      v-model="addShow"
      :title="modalTitle"
      class="banner-management-modal"
      :mask-closable="false"
    >
      <div class="modal-area">
        <template>
          <Form :model="formItem" :label-width="110" ref="formModal">
            <FormItem label="展示顺序：">
              <Row>
                <Col span="12">
                  <Select v-model="formItem.rank">
                    <Option v-for="item in sortList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </Col>
                <Col span='8'>
                  <Tooltip content="选择指定顺序后原有的banner往后顺延" class="sortIcon" placement="top">
                    <Icon type="information-circled" size="16" color="#1890ff"></Icon>
                  </Tooltip>
                </Col>
              </Row>
            </FormItem>
            <FormItem label="上传图片：" :required="true">
              <Row>
                <Col span="4">
                  <Upload
                    action="/api/admin/uploadFile/uploadImageReadable"
                    :format="['jpg', 'jpeg', 'png', 'gif']"
                    :max-size="1024"
                    :on-format-error="handleFormatError"
                    :on-exceeded-size="handleMaxSize"
                    :on-success="onUploadSuccess"
                    :show-upload-list="false"
                    :on-progress="onUploadProgress"
                  >
                    <Button icon="ios-cloud-upload-outline">点击上传</Button>
                  </Upload>
                </Col>
                <Col span="4">
                  <span>{{this.formItem.image ? '已上传' : '点击左侧上传图片'}}</span>
                </Col>
                <Col span="6">
                  <span>请选择438*200及同比例图片，支持.jpg .jpeg .png .gif，最大不超过1M。</span>
                </Col>
                <Spin size="large" fix v-if="spinShow">
                  <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                  <div>上传中...</div>
                </Spin>
              </Row>
            </FormItem>
            <FormItem label="点击跳转：" :required="true">
              <RadioGroup v-model="linkType">
                <Row><Radio label='0'>无跳转</Radio></Row>
                <Row>
                  <Col span="4"><Radio label='1'>跳转至指定外链</Radio></Col>
                  <Col span="10">
                    <Input v-model="formItem.href" placeholder="请输入外链地址" :disabled="linkType === '0'" style="width: 300px"></Input>
                  </Col>
                  <Col span="10">
                    <span>跳转链接如果是外链：需要以http://或者https://开头，如果是站内跳转（功能链接），只用填域名.com以后的地址即可</span>
                  </Col>
                </Row>
              </RadioGroup>
            </FormItem>
          </Form>
        </template>
      </div>
      <div slot="footer">
        <Button @click="addShow=false">取消</Button>
        <Button type="primary" @click="_saveBannerInfo">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import API from './../../axios/api'
// import Utils from '../../assets/utils/date-format'

export default {
  name: 'BannerManagement',
  data () {
    return {
      modalData: [],
      modalkey: [
        {
          type: 'index',
          width: 80,
          title: '顺序'
        },
        {
          title: '图片',
          key: 'image',
          width: 200,
          render: (h, params) => {
            return h('img', {attrs: {src: params.row.image}})
          }
        },
        {
          title: '点击跳转',
          key: 'href',
          width: 400
        },
        {
          title: '点击次数',
          key: 'hitTimes',
          width: 100
        },
        {
          title: '添加时间',
          render: (h, params) => {
            return h('span', {}, params.row.createTime)
          }
        },
        {
          title: '添加人',
          key: 'createUser',
          width: 150
        },
        {
          title: '操作',
          render: (h, params) => {
            return h('div', [
              h('a', {
                attrs: {
                  class: 'operation_span'
                },
                style: {
                  display: params.index === 0 ? 'none' : 'inline'
                },
                on: {
                  click: () => {
                    this._moveBanner(params.row.id, this.modalData[params.index - 1].id)
                  }
                }
              }, '向上'),
              h('a', {
                attrs: {
                  class: 'operation_span'
                },
                style: {
                  display: params.index === this.modalData.length - 1 ? 'none' : 'inline'
                },
                on: {
                  click: () => {
                    this._moveBanner(params.row.id, this.modalData[params.index + 1].id)
                  }
                }
              }, '向下'),
              h('a', {
                attrs: {
                  class: 'operation_span'
                },
                on: {
                  click: () => {
                    this.modalTitle = '编辑banner'
                    this.currentItem = JSON.parse(JSON.stringify(params.row))
                    this.formItem = this.currentItem
                    this.formItem.href ? this.linkType = '1' : this.linkType = '0'
                    this.addShow = true
                  }
                }
              }, '编辑'),
              h('a', {
                attrs: {
                  class: 'operation_span'
                },
                on: {
                  click: () => {
                    this._delBanner(params.row.id)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      modalTitle: '添加banner',
      addShow: false,
      linkType: '0',
      formItem: {
        rank: '',
        href: '',
        image: ''
      },
      currentItem: {},
      sortList: [],
      spinShow: false
    }
  },
  computed: {},
  created: function () {
    this._getBannerList()
  },
  methods: {
    _getBannerList () {
      const param = {
        isIncludeDeleted: 0
      }
      API.getBannerList(param)
        .then(result => {
          this.modalData = result
          const sortList = []
          for (let i = 0; i < result.length; i = i + 1) {
            sortList.push({value: result[i].rank, label: i + 1})
          }
          this.sortList = sortList
        })
        .catch(error => {
          this.$Message.error(error.message)
        })
    },
    _addModal () {
      this.modalTitle = '添加banner'
      this.formItem = {
        rank: '',
        href: '',
        image: ''
      }
      this.linkType = '0'
      this.addShow = true
    },
    onUploadProgress () {
      this.spinShow = true
    },
    onUploadSuccess (response) {
      this.spinShow = false
      if (response.status === 'OK') {
        this.formItem.image = response.data
        this.$Message.success('上传成功')
      } else {
        this.$Message.error('上传失败')
      }
    },
    onUploadSuccessIcon (response) {
      this.spinShow = false
      if (response.status === 'OK') {
        this.formItem.iconImage = response.data
        this.$Message.success('上传成功')
      } else {
        this.$Message.error('上传失败')
      }
    },
    handleFormatError () {
      this.$Message.warning('不支持上传该类型文件,支持的类型：gif、jpg、jpeg、png')
    },
    handleMaxSize () {
      this.$Message.warning('最大可上传1MB文件')
    },
    _delBanner (id) {
      API.delBannerInfo({id: id})
        .then(() => {
          this.$Message.info('删除成功')
          this._getBannerList()
        })
        .catch(error => {
          this.$Message.error(error.message)
        })
    },
    // 移动顺序
    _moveBanner (id, toBeRankId) {
      const params = {
        id: id,
        toBeRankId: toBeRankId
      }
      API.moveBanner(params)
        .then(() => {
          this.$Message.info('移动成功')
          this._getBannerList()
        })
        .catch(error => {
          this.$Message.error(error.message)
        })
    },
    _saveBannerInfo () {
      const param = {
        ...this.formItem
      }
      this.linkType === '0' ? param.href = '' : ''
      param.status = 0
      if (param.rank === '') param.rank = null
      if (this.linkType === '1' && !param.href) {
        this.$Message.warning('请填写外链地址!')
      } else if (!param.image) {
        this.$Message.warning('请上传图片!')
      } else {
        const {id} = this.formItem
        if (id) { // 编辑
          delete param._index
          delete param._rowKey
          delete param.deleted
          delete param.createTime
          delete param.hitTimes
          delete param.createUser
          API.updateBannerInfo(param)
            .then(() => {
              this.$Message.info('编辑成功')
              this.addShow = false
              this._getBannerList()
            })
            .catch(error => {
              this.$Message.error(error.message)
            })
        } else { // 新增
          param.title = `banner${new Date().getTime()}`
          param.createUser = this.$store.state.user.username
          API.addBannerInfo(param)
            .then(() => {
              this.$Message.info('添加成功')
              this.addShow = false
              this._getBannerList()
            })
            .catch(error => {
              this.$Message.error(error.message)
            })
        }
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  .addBtn{
    margin-bottom 12px
  }
</style>
<style>
  #banner-management-list-table a.operation_span{
    margin-right: 5px;
    cursor: pointer;
  }
  .banner-management-modal .ivu-modal{
    width: 960px!important
  }
  #banner-management-list-table td img{
    width: 100%;
  }
  .sortIcon {
    margin-left: 10px;
  }
</style>
