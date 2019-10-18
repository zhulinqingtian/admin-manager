<template>
  <div>
    <div class="content">
      <!-- :before-upload="handleUpload" -->
      <Upload
        multiple
        ref="upload"
        enctype="multipart/form-data"
        :headers="{'Content-Type': 'application/json;charset=UTF-8'}"
        :show-upload-list="false"
        :format="['jpg', 'jpeg', 'png', 'gif']"
        :max-size="1024"
        :on-format-error="handleFormatError"
        :on-exceeded-size="handleMaxSize"
        :on-success="uploadSuccess"
        action="/api/test/gxq/upload_imgs">
        <Button type="ghost" icon="ios-cloud-upload-outline">浏览</Button>
      </Upload>
      <div v-for="(item, index) in file" :key="index">
        <p>Upload file: {{ item.name }}</p>
        <a href="javascript:;"  @click="detectFile(item.name)">X</a>
        <Button style="margin-left:30px;"
                size="small"
                v-if="index === 0"
                type="primary"
                @click="upload"
                :loading="loadingStatus">上传</Button>
      </div>

      <Modal title="View Image" v-model="visible">
        <img :src="'c:/java/project/images/' + imgName + '.jpg'" v-if="visible" style="width: 100%">
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
      imgName: '',
      visible: false,
      uploadFile: [],
      file: []
    }
  },
  computed: {},
  created: function () {
  },
  mounted () {

  },
  methods: {
    handleUpload (file) { // 上传文件前的事件钩子
      console.log('---------- handleUpload:', file)
      // 选择文件后 这里判断文件类型 保存文件 自定义一个keyid 值 方便后面删除操作
      let keyID = Math.random().toString().substr(2)
      file['keyID'] = keyID
      // 保存文件到总展示文件数据里
      this.file.push(file)
      // 保存文件到需要上传的文件数组里
      this.uploadFile.push(file)
      // 返回 falsa 停止自动上传 我们需要手动上传
      return false
    },

    detectFile (keyID) { // 删除文件
      // 删除总展示文件里的当前文件
      console.log('---------- detectFile')
      this.file = this.file.filter(item => {
        return item.name !== name
      })
      // 删除需要上传文件数据里的当前文件
      this.uploadFile = this.uploadFile.filter(item => {
        return item.KeyID !== keyID
      })
    },

    handleFormatError () {
      this.$Message.warning('不支持上传该类型文件,支持的类型：gif、jpg、jpeg、png')
    },
    handleMaxSize () {
      this.$Message.warning('最大可上传1MB文件')
    },

    upload () { // 上传文件
      console.log('---------- upload')
      for (let i = 0; i < this.uploadFile.length; i++) {
        let item = this.file[i]
        this.$refs.upload.post(item)
      }
    },

    uploadSuccess (res, file, fileList) { // 文件上传回调 上传成功后删除待上传文件
      console.log('---------- uploadSuccess')
      console.log('res:', res)
      console.log('file:', file)
      console.log('fileList:', fileList)
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
