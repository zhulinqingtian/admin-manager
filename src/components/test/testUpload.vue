<template>
  <div>
    <ul class="demo-upload-list" v-for="(item,index) in uploadList" :key="index">
      <li v-if="item.status === 'finished'">
        <img :src="item.url">
        <div class="demo-upload-list-cover">
          <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
          <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
          <Button @click="upload(item)">选择文件</Button>
        </div>
      </li>
      <li v-else>
        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
      </li>
    </ul>
    <div class="content">
      <!-- /api/upload/uploadImage -->
      <Upload
        ref="upload"
        multiple
        action="/api/test/gxq/upload_imgs"
        :show-upload-list="false"
        :default-file-list="defaultList"
        :on-success="handleSuccess"
        :format="['jpg','jpeg','png']"
        :max-size="2048"
        :on-format-error="handleFormatError"
        :on-exceeded-size="handleMaxSize"
        :before-upload="handleBeforeUpload"
      >
        <Button icon="ios-cloud-upload-outline">选择文件</Button>
      </Upload>

      <Modal title="View Image" v-model="visible">
        <img :src="'https://o5wwk8baw.qnssl.com/' + imgName + '/large'" v-if="visible" style="width: 100%">
      </Modal>
    </div>
  </div>
</template>

<script>

export default {
  name: 'TestUpload',
  data () {
    return {
      loadingStatus: false,
      defaultList: [
        {
          'name': 'a42bdcc1178e62b4694c830f028db5c0',
          'url': 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
        },
        {
          'name': 'bc7521e033abdd1e92222d733590f104',
          'url': 'https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar'
        }
      ],
      imgName: '',
      visible: false,
      uploadList: [],
      imgList: []
    }
  },
  computed: {},
  created: function () {
  },
  mounted () {
    this.uploadList = this.$refs.upload.fileList
  },
  methods: {
    upload () {
      this.loadingStatus = true
      setTimeout(() => {
        this.uploadList = []
        this.loadingStatus = false
        this.$Message.success('Success')
      }, 1500)
    },

    handleView (name) {
      this.imgName = name
      this.visible = true
    },
    handleRemove (file) {
      const fileList = this.$refs.upload.fileList
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
    },
    handleSuccess (response, file) {
      // file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar'
      // file.name = '7eb99afb9d5f317c912f08b5212fd69a'

      if (response.status === 'OK') {
        // this.img = response.data
        this.$Message.success('上传成功')
        console.log('response.data:', response.data);
      } else {
        this.$Message.error('上传失败')
      }
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: '文件格式错误',
        desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
      })
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: '超出文件大小限制',
        desc: 'File  ' + file.name + ' is too large, no more than 2M.'
      })
    },
    handleBeforeUpload (file) {
      this.uploadList.push(file)
      console.log('file:', this.uploadList)
      const check = this.uploadList.length < 5
      if (!check) {
        return this.$Notice.warning({title: '最多上传5个文件.'})
      }
      return false // 取消自动上传,手动控制上传
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
