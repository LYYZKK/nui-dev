<template>
  <div class="app-container work-bench">
    <div>
      <el-row :gutter="5">
        <el-col :span="8">
          <el-card shadow="never" class="card-container">
            <div slot="header" class="clearfix">
              <div>
                <b>质检任务情况</b>
              </div>
              <!-- <div style="display: inline-block;line-height: 50px;cursor: pointer" >
                <font style="font-size:large;color:#fff;padding-right: 5px">质检任务情况</font>
                <font style="font-size:large;color:rgb(255,255,0);"></font>
              </div> -->
              <div class="font12" style="line-height: 50px;cursor: pointer" @click="checkNum('0')">
                <font style="padding-right: 5px">未开始: </font>
                <font class="bold under-line">{{noCompleteNum}}</font>
              </div>
            </div>
            <div class="text item">
              <el-row>
                <el-col :span="8">
                  <el-card shadow="never" class="no-border">
                    <div class="item-content">
                      <a class="bold" @click="checkNum('2')">
                        <font class="line-center font30 under-line">{{temporaryNum}}</font>
                      </a>
                    </div>
                    <div style="text-align: center">
                      <font class="font12" style="height:40px;">未完成</font>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="8">
                  <el-card shadow="never" class="no-border">
                    <div class="item-content">
                      <a class="bold" @click="checkNum('1')">
                        <font class="line-center font30 under-line">{{completeNum}}</font>
                      </a>
                    </div>
                    <div style="text-align: center">
                      <font class="font12" style="height:40px;">已完成</font>
                    </div>
                  </el-card>
                </el-col>
                <el-col :span="8">
                  <el-card shadow="never" class="no-border">
                    <div class="item-content">
                      <a class="bold" @click="checkNum('4')">
                        <font class="line-center font30 under-line">{{todayCompleteNum}}</font>
                      </a>
                    </div>
                    <div style="text-align: center">
                      <font class="font12" style="height:40px;">当日完成</font>
                    </div>
                  </el-card>
                </el-col>

              </el-row>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="never" class="card-container">
            <div slot="header" class="clearfix">
              <div>
                <b>质检任务数</b>
              </div>
              <div style="display: inline-block;height:48px;line-height: 50px;cursor: pointer">
                <!-- <font style="font-size:large;color:#fff;padding-right: 5px">质检任务数</font>
                <font style="font-size:large;color:rgb(255,255,0);"></font> -->
              </div>
            </div>
            <div class="text item">
                <el-row>
                  <el-col :span="10">
                    <el-card shadow="never" class="no-border">
                      <div class="item-content">
                        <a @click="checkNum('3')">
                          <font class="line-center font30 under-line">{{totalNum}}</font>
                        </a>
                      </div>
                      <div style="text-align: center">
                        <font class="font12">总任务</font>
                      </div>
                    </el-card>
                  </el-col>
                </el-row>
              </div>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>

</template>

<script>
import { findQCTaskByQCId, findQualityTaskByInfo } from '@/api/ord_qc_workingset'
// import { formatDateTime } from '@/utils/tools'
export default {
  name: 'ord_qc_workingset',
  data() {
    return {
      staffId: '', // 质检员工号
      completeNum: 0, // 已完成
      noCompleteNum: 0, // 未开始
      temporaryNum: 0, // 未完成
      todayCompleteNum: 0, // 当天完成
      totalNum: 0// 总任务
    }
  },
  mounted() {
    this.staffId = localStorage.getItem('agentId')
    if (this.staffId) {
      const staff = {}
      staff.staffId = this.staffId
      findQCTaskByQCId(staff).then(res => {
        if (res.data.code === 0) {
          this.todayCompleteNum = res.data.data.completeNum
          this.noCompleteNum = res.data.data.noCompleteNum
          this.temporaryNum = res.data.data.temporaryNum
        } else {
          this.$message('查询当天任务情况失败，请稍后重试！')
        }
      }).catch(error => {
        console.log(error, '无法连接到服务器')
      })
      const obj = {}
      obj.status = '1'
      obj.staffId = this.staffId
      // obj.doneStart = formatDateTime(new Date().setHours(0, 0, 0, 0))
      // obj.doneStop = formatDateTime(new Date().setHours(23, 59, 59, 0))
      // obj.pageSize = 1000
      findQualityTaskByInfo(obj).then(res => {
        if (res.data.code === 0) {
          this.completeNum = res.data.pageInfo.totalCount
        } else {
          this.$message('查询历史完成情况失败，请稍后重试！')
        }
      }).catch(error => {
        console.log(error, '无法连接服务器')
      })
      const totalObj = {}
      totalObj.status = ''
      totalObj.staffId = this.staffId
      findQualityTaskByInfo(totalObj).then(res => {
        if (res.data.code === 0) {
          this.totalNum = res.data.pageInfo.totalCount
        } else {
          this.$message('查询总任务失败，请稍后重试！')
        }
      }).catch(error => {
        console.log(error, '无法连接服务器')
      })
    }
  },
  methods: {
    checkNum(value) {
      this.$router.push({
        path: process.env.BUILT_IN_ROUTERS.qualityChecking,
        query: { 'status': value, 'staffId': localStorage.getItem('agentId') }
      })
    }
  }

}
</script>
<style>
.el-card__body{
  padding: 2%
}
.circle{
  width:6em;
  height:40px;
  border-radius:40px;
  /*float:left;*/
  margin: 0 auto;
  text-align:center;
}
.line-center{
  line-height:40px;
  font-size:14px;
  font-weight:bold;
}
.p-item{
  margin-top:23%;
  margin-left:-4%;
  float:left
}
.text-align-center{
  font-size:large;
  color:#fff;
  margin-top:1%;
  line-height:50px;
}
.squash-item{
  width: 80px;
  height: 25px;
  border-bottom-right-radius:10px;
  border-top-right-radius:10px;
  border:solid #36a9ce 1px;
  line-height: 25px;
  font-weight:500;
  background-color:#36a9ce;
}
</style>
