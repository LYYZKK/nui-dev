<template>
  <div class="container">
    <el-collapse v-model="formContainerOpen" class="form-container" @change="handleChangeAcitve">
      <el-collapse-item title="筛选条件" name="1">
        <el-form :inline="true" size="small" :model="req" ref="searchForm">
          <el-form-item prop="campaignId" label="质检活动:">
            <el-select v-model="req.campaignId" placeholder="质检活动">
              <el-option label="全部" value="">全部</el-option>
              <el-option
                v-for="item in campData"
                :key="item.campaignId"
                :label="item.campaignName"
                :value="item.campaignId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="gradeRate" label="评分等级">
            <el-radio-group v-model="req.gradeRate">
              <el-radio-button label="4">最优</el-radio-button>
              <el-radio-button label="1">最差</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="req.pageNo=1;getGradeRecordList(req);req2=clone(req);">查询</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <el-row class="table-container">
      <el-row class="margin-bottom-20">
        <div class="font14 bold">案例表</div>
      </el-row>
      <el-row>
        <el-table
          :data="tableData">
          <el-table-column
            align="center"
            label="质检活动"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{scope.row.campaignId == null ? '' : camps[scope.row.campaignId]}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="评分等级"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{getGradeRate(scope.row.gradeRate)}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="contactRecordUrl"
            label="录音">
            <template slot-scope="scope">
              <a v-if="scope.row.contactRecordUrl" style="color:#63B0FF" :title="scope.row.contactRecordUrl" @click="recodingContent=scope.row.contactRecordUrl;recodeVisible=true">查看</a>
              <div v-if="!scope.row.contactRecordUrl">无</div>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row style="margin-top:20px;">
        <el-pagination
          v-if="pageShow"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageInfo.pageNo"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="pageInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper "
          :total="pageInfo.totalCount" style="text-align: right;float:right;">
        </el-pagination>
      </el-row>
    </el-row>
    <el-dialog
        width="30%"
        title="录音详情"
        :visible.sync="recodeVisible"
        append-to-body>
      <div>
        <audio 
          controls="controls"
          :src="recodingContent">
        </audio>
      </div>
      <div slot="footer" class="dialog-footer" style="text-align: right;">
        <el-button type="primary" plain @click="recodeVisible = false;">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

import {
  findAllCampaign,
  getGradeRecordList
} from '@/api/quality_case'
import { clone } from '@/utils/tools'

export default {
  name: 'quality_case',
  data() {
    return {
      formContainerOpen: '1',
      formContainer: this.$store.state.app.formContainer,
      recodingContent: '',
      recodeVisible: false,
      campData: [], // 质检活动
      camps: {},
      tableData: [], // 表格数据
      pageShow: false, // 分页显示隐藏
      // 查询 发送请求参数
      req: {
        pageNo: 1,
        pageSize: 10,
        campaignId: '',
        gradeRate: '4'
      },
      req2: {
        pageNo: 1,
        pageSize: 10,
        campaignId: '',
        gradeRate: '4'
      },
      // 分页数据
      pageInfo: {}
    }
  },
  mounted() {
    this.formContainer()
    this.handleChangeAcitve()
    this.findAllCampaign()
    this.getGradeRecordList(this.req)
  },
  methods: {
    handleChangeAcitve(active = ['1']) {
      if (active.length) {
        $('.form-more').text('收起')
      } else {
        $('.form-more').text('更多')
      }
    },
    // 深度克隆
    clone: clone,
    resetForm() {
      this.req = {
        pageNo: this.pageInfo.pageNo,
        pageSize: this.pageInfo.pageSize,
        campaignId: '',
        gradeRate: '4'
      }
    },
    // 查询质检活动
    findAllCampaign() {
      findAllCampaign().then(response => {
        if (response.data.code === 0) {
          this.campData = response.data.data
          for (var i in this.campData) {
            this.$set(this.camps, this.campData[i].campaignId, this.campData[i].campaignName)
          }
        } else {
          this.$message(response.data.message)
        }
      })
    },
    // 查询案例
    getGradeRecordList(req) {
      getGradeRecordList(req).then(response => {
        if (response.data.code === 0) {
          this.pageShow = true
          this.tableData = response.data.data
          this.pageInfo = response.data.pageInfo
        } else {
          this.$message(response.data.message)
          this.pageShow = false
        }
      }).catch(error => {
        this.pageShow = false
        throw error
      })
    },
    // 显示评分等级
    getGradeRate(rate) {
      switch (rate) {
        case '1' :
          return '差'
        case '2' :
          return '中'
        case '3' :
          return '良'
        case '4' :
          return '优'
        default:break
      }
    },
    // 页面显示条数
    handleSizeChange(val) {
      this.req2.pageSize = val
      this.req.pageSize = val
      this.req2.pageNo = 1
      this.req.pageNo = 1
      this.pageInfo.pageNo = 1
      this.getGradeRecordList(this.req2)
    },
    // 分页翻页功能
    handleCurrentChange(val) {
      this.req2.pageNo = val
      this.getGradeRecordList(this.req2)
    }
  }
}
</script>
