<template>
  <div class='container'>
    <el-collapse v-model="formContainerOpen" class="form-container" @change="handleChangeAcitve">
      <el-collapse-item title="筛选条件" name="1">
        <el-form :inline="true" size="small">
          <el-form-item prop="campaignId" label="活动编号：">
            <el-input v-model="req.campaignId" placeholder="活动编号（限长20字符）" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="活动名称:">
            <el-input v-model="req.campaignName" placeholder="活动名称（限长128字符）" maxlength="128"></el-input>
          </el-form-item>
          <el-form-item prop="modifierName" label="操作人：">
            <el-input v-model="req.modifierName" placeholder="操作人（限长50字符）" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="操作时间：">
            <el-date-picker
                v-model="timeValue"
                type="datetimerange"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="req.pageNo=1;searchByCampaign(req)">查询</el-button>
            <el-button @click="timeValue=[],resetReq()">重置</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <el-row class="table-container">
      <el-row class="margin-bottom-20">
        <div class="font14 bold">活动与质检表</div>
      </el-row>
      <el-row>
        <el-table :data="tableData">
          <el-table-column align="center" label="活动编号" prop="campaignId" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column align="center" label="活动名称" prop="activityName" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.activityName }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="质检部门" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{showQmDepart(scope.row.departName)}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="评分表" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{showGradenames(scope.row.gradeNames)}}
            </template>
          </el-table-column>
          <el-table-column align="center" label="名单有效期" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{scope.row.listExpiryDate}}天
            </template>
          </el-table-column>
           <el-table-column align="center" label="操作人" prop="modifierName">
              <template slot-scope="scope">
                  {{ scope.row.modifierName }}
            </template>
          </el-table-column>
           <el-table-column align="center" label="操作时间" prop="modifyTime">
              <template slot-scope="scope">
                  {{ scope.row.modifyTime }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="活动备注" prop="description" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              {{ scope.row.description }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="appoint_qcdept=[];qcdept='';grade=[];assignParams.activityId=scope.row.campaignId;assignParams.activityName=scope.row.activityName;searchByCampaignId(scope.row.campaignId);searchQcDepts();searchGrades(scope.row.campaignId);"  v-if="scope.row.departName === null && scope.row.gradeNames === null">指定</el-button>
              <el-button type="text" @click="assignParams.activityId=scope.row.campaignId;assignParams.activityName=scope.row.activityName;searchByCampaignId(scope.row.campaignId);searchQcDepts();searchGrades(scope.row.campaignId);showQcDeptByCampaignId(scope.row.campaignId);showGradeNamesByCampaignId(scope.row.campaignId)"  v-if="scope.row.departName !== null || scope.row.gradeNames !== null">修改</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
       <!-- 分页信息 -->
      <el-row style="margin-top:20px;">
        <el-pagination
          v-if="pageShow"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page='pageInfo.pageNo'
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size='pageInfo.pageSize'
          layout="total, sizes, prev, pager, next, jumper "
          :total='pageInfo.totalCount' style="text-align: right;float:right;">
        </el-pagination>
      </el-row>
    </el-row>
    <!-- 指定质检部门、评分表的dialog  -->
    <el-dialog
      align:left
      width="30%"
      title="指定质检部门/评分表"
      :visible.sync="appointVisiable"
      append-to-body>
      <el-form label-width="100px" size="small">
        <el-form-item label="活动名称：">
          <div>{{campaignDetail.campaignName}}</div>
        </el-form-item>
        <el-form-item label="名单有效期：">
          <div>{{campaignDetail.listExpiryDate}}天</div>
        </el-form-item>
        <el-form-item label="活动状态：">
            <div v-html="showStatus(campaignDetail.status)"></div>
        </el-form-item>
        <el-form-item label="活动部门：">
          <div>{{campaignDetail.departName}}</div>
        </el-form-item>
        <el-form-item label="话后小结：">
          <div>{{campaignDetail.summaryName}}</div>
        </el-form-item>
        <el-form-item label="质检部门：">
          <el-cascader
            style="width:100%;"
            v-model="appoint_qcdept"
            placeholder="请选择部门"
            :options="qcdepts"
            :props="org_props"
            :show-all-levels='false'
            filterable
            size="small"
            change-on-select
            clearable
          ></el-cascader>
          <!-- <el-select v-model="qcdept" placeholder="请选择质检部门" clearable @change="selectQcDept">
              <el-option
                v-for="qcdepart in qcdepts"
                :label="qcdepart.departName"
                :value="qcdepart.id">
              </el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item label="评分表：">
          <el-select style="width:100%;" v-model="grade" multiple placeholder="请选择评分表" clearable @change="selectMarks">
            <el-option
            v-for="item in grades"
            :key="item.gradeId"
            :label="item.gradeName"
            :value="item.gradeId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动备注：">
          <div>{{campaignDetail.description}}</div>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center;">
        <el-button @click="completeAssign();" type="primary">确定</el-button>
        <el-button @click="appointVisiable = false" type="primary" plain>取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang='scss' scoped>
</style>

<script>
import {
  queryByCampaign,
  queryByCampaignId,
  queryDeptById,
  queryNodulesById,
  queryallQcdepts,
  quertyAllMarks,
  queryQcDeptByCampaignId,
  queryGradeNamesByCampaignId,
  completeAssignGroupsAndGrades
} from '@/api/qm_charge_selectgroup'
import { list2Tree } from '@/utils/tools'
export default {
  name: 'qm_charge_selectgroup',

  data() {
    return {
      formContainerOpen: '1',
      formContainer: this.$store.state.app.formContainer,
      appoint_qcdept: [], // 级联选中的
      org_props: {
        label: 'name',
        value: 'id',
        children: 'children'
      },
      tableData: [], // 表格数据
      pageShow: false, // 分页显示与否
      pageInfo: {}, // 分页信息
      appointVisiable: false, // 指定部门/评分表的dialog
      beforeTransfer_qcdepts: [], // 转换为树结构之前的下属所有质检部门
      qcdepts: [], // 下属所有质检部门
      grades: [], // 所有的评分表
      qcdept: '', // 选中的或回显的质检部门
      qcdeptId: '', // 选中的或回显的质检部门id
      grade: [], //  选中的或回显的评分表
      gradeIds: [], // 选中的或回显的评分表id
      timeValue: [],
      req: {
        campaignId: '',
        campaignName: '',
        modifierName: '',
        modifyTimeStart: '',
        modifyTimeEnd: '',
        pageSize: 10,
        pageNo: 1
      },
      // 活动详情信息
      campaignDetail: {
        departName: '',
        summaryName: ''
      },

      // 需要指定或修改的参数
      assignParams: {
        qcdeptId: '',
        qcdeptName: '',
        grades: [],
        activityId: '',
        activityName: ''
      }
    }
  },

  methods: {
    handleChangeAcitve(active = ['1']) {
      if (active.length) {
        $('.form-more').text('收起')
      } else {
        $('.form-more').text('更多')
      }
    },
    // 质检部门显示
    showQmDepart(departName) {
      if (departName) {
        return departName
      } else {
        return '未指定'
      }
    },
    resetReq() {
      this.req = {
        campaignId: '',
        campaignName: '',
        modifierName: '',
        modifyTimeStart: '',
        modifyTimeEnd: '',
        pageSize: 10,
        pageNo: 1
      }
    },
    // 评分表显示
    showGradenames(gradeNames) {
      if (gradeNames !== null && gradeNames.length > 0) {
        var name = ''
        for (var i = 0; i < gradeNames.length; i++) {
          name += gradeNames[i] + '/'
        }
        name = name.substr(0, (name.length - 1))
        return name
      } else {
        return '未指定'
      }
    },
    // 展示活动名称
    showDept() {
      var deptName = localStorage.getItem('departName')
      localStorage.removeItem('departName')
      return deptName
    },
    // 展示小结名称
    showNodules() {
      var summaryName = localStorage.getItem('summaryName')
      localStorage.removeItem('summaryName')
      return summaryName
    },
    // 综合查询
    searchByCampaign(req) {
      req.modifyTimeStart = this.timeValue ? this.timeValue[0] : null
      req.modifyTimeEnd = this.timeValue ? this.timeValue[1] : null
      queryByCampaign(req)
        .then(response => {
          if (response.data.code === 0) {
            this.tableData = response.data.data
            this.pageShow = true
            this.pageInfo = response.data.pageInfo
          } else {
            this.tableData = response.data.data
            this.pageShow = false
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 根据活动id查找活动
    searchByCampaignId(campaignId) {
      queryByCampaignId(campaignId)
        .then(response => {
          if (response.data.code === 0) {
            this.campaignDetail = response.data.data
            var summaryId = response.data.data.summaryId
            // 通过部门id显示部门
            queryDeptById(response.data.data.departId)
              .then(response => {
                if (response.data.code === 1) {
                  this.campaignDetail.departName = response.data.data.departName
                  // 通过小结id显示小结名称
                  queryNodulesById(summaryId)
                    .then(response => {
                      if (response.data.code === 0) {
                        this.campaignDetail.summaryName = response.data.data.summaryName
                        this.appointVisiable = true
                      }
                    })
                }
              })
          } else {
            this.$message.error = response.data.message
          }
        })
    },
    // 查询下属质检部门
    searchQcDepts() {
      queryallQcdepts(localStorage.getItem('departId'))
        .then(response => {
          if (response.data.code === 1) {
            this.beforeTransfer_qcdepts = response.data.data
            const map = {
              data: response.data.data,
              rootId: parseInt(localStorage.getItem('departId')),
              idFieldName: 'id',
              parentIdFielName: 'upId'
            }
            this.qcdepts = list2Tree(map)
          }
        })
    },
    // 根据活动id查询评分表
    searchGrades(campaignId) {
      quertyAllMarks()
        .then(response => {
          if (response.data.code === 0) {
            this.grades = response.data.data
          }
        })
    },
    // 显示活动状态
    showStatus(status) {
      if (status === '0') {
        return "<span style='color:green'>有效</span>"
      } else {
        return "<span style='color:red'>无效</span>"
      }
    },
    // 页面显示条数
    handleSizeChange(val) {
      this.req.pageNo = 1
      this.req.pageSize = val
      this.pageInfo.pageNo = 1
      this.searchByCampaign(this.req)
    },
    // 翻页功能
    handleCurrentChange(val) {
      this.req.pageNo = val
      this.searchByCampaign(this.req)
    },
    // 根据活动id显示当前活动的质检部门
    showQcDeptByCampaignId(campaignId) {
      queryQcDeptByCampaignId(campaignId)
        .then(response => {
          if (response.data.code === 0) {
            const departId = parseInt(response.data.data[0].departId)
            let arr = []
            for (var i = 0; i < this.beforeTransfer_qcdepts.length; i++) {
              if (departId === this.beforeTransfer_qcdepts[i].id) {
                arr = this.beforeTransfer_qcdepts[i].idPath.split('/')
              }
            }
            for (var j = 0; j < arr.length; j++) {
              if (arr[j] === null || arr[j] === '') {
                arr.splice(j, 1)
                j = j - 1
              }
            }
            for (var k = 0; k < arr.length; k++) {
              arr[k] = parseInt(arr[k])
            }
            this.appoint_qcdept = arr
          }
        })
    },
    // 根据活动id显示当前活动采用的评分表
    showGradeNamesByCampaignId(campaignId) {
      this.grade = []
      this.gradeIds = []
      queryGradeNamesByCampaignId(campaignId)
        .then(response => {
          if (response.data.code === 0 && response.data.data.length > 0) {
            for (var i = 0; i < response.data.data.length; i++) {
              this.grade.push(response.data.data[i].gradeId)
              this.gradeIds.push(response.data.data[i].gradeId)
            }
          }
        })
    },
    // 将选择的质检部门id和名称传参
    selectQcDept(value) {
      this.qcdeptId = value
      let obj = {}
      obj = this.qcdepts.find((qcdepart) => {
        return qcdepart.id === value
      })
      if (obj) {
        this.qcdept = obj.departName
      } else {
        this.qcdept = ''
      }
    },
    //
    selectMarks(value) {
      this.gradeIds = []
      this.gradeIds = this.grade
    },
    // 完成指定或修改
    completeAssign() {
      if (this.appoint_qcdept.length === 0) {
        this.$message.error('请选择质检部门！')
        return
      }
      this.assignParams.qcdeptId = this.appoint_qcdept[this.appoint_qcdept.length - 1]
      for (var i = 0; i < this.beforeTransfer_qcdepts.length; i++) {
        if (this.assignParams.qcdeptId === this.beforeTransfer_qcdepts[i].id) {
          this.assignParams.qcdeptName = this.beforeTransfer_qcdepts[i].departName
        }
      }
      this.assignParams.grades = []
      this.assignParams.grades = this.gradeIds
      if (this.assignParams.grades.length === 0) {
        this.$message.error('未选中任何评分表！')
        return false
      }
      completeAssignGroupsAndGrades(this.assignParams)
        .then(response => {
          if (response.data.code === 0) {
            this.$message.success = response.data.message
            this.appointVisiable = false
            this.searchByCampaign(this.req)
          } else {
            this.$message.error = response.data.message
          }
        })
    }
  },

  mounted() {
    this.formContainer()
    this.handleChangeAcitve()
    this.searchByCampaign(this.req)
  }

}

</script>
