<template>
  <div class="app-container">
    <!-- 功能区 -->
    <div class="filter-container">
      <el-select v-model="pageQuery.cleanStatus" :placeholder="$t('trackingRecord.cleanStatus')" clearable style="width: 150px; margin-right: 15px;" class="filter-item">
        <el-option v-for="(item, index) in cleanStatusOptions" :key="index" :label="item.display_name" :value="item.value" />
      </el-select>
      <el-date-picker
        v-model="pageQuery.startTime"
        class="filter-item"
        style="margin-right: 15px;"
        type="datetime"
        placeholder="开始时间"
        default-time="00:00:00"
        value-format="yyyy-MM-dd HH:mm:ss"
      />
      <el-date-picker
        v-model="pageQuery.endTime"
        class="filter-item"
        style="margin-right: 15px;"
        type="datetime"
        placeholder="结束时间"
        default-time="00:00:00"
        value-format="yyyy-MM-dd HH:mm:ss"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        {{ $t('table.add') }}
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        {{ $t('table.export') }}
      </el-button>
    </div>
    <!-- 展示列表 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="trackingRecordList"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column :label="$t('trackingRecord.id')" prop="id" sortable="custom" align="center" width="170" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('trackingRecord.data')" min-width="600px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.data }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('trackingRecord.startTime')" min-width="170px">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.startTime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('trackingRecord.endTime')" min-width="170px">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.endTime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('trackingRecord.cleanStatus')" min-width="320px">
        <template slot-scope="{row}">
          <span class="link-type">{{ cleanStatusKeyValue[row.cleanStatus] }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('trackingRecord.cleanResult')" min-width="300px">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.cleanResult }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            {{ $t('table.clean') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页栏 -->
    <pagination v-if="total>0" :total="total" :page.sync="pageQuery.current" :limit.sync="pageQuery.limit" @pagination="pageTrackingRecord" />
  </div>
</template>

<script>
import { pageTrackingRecord, listTrackingElement, createTrackingElement, deleteTrackingElement, updateTrackingElement } from '@/api/tracking-original-data'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const cleanStatusOptions = [
  { display_name: '未清洗', value: 0 },
  { display_name: '清洗失败', value: -1 },
  { display_name: '清洗成功', value: 1 }
]

const elementTypeOptions = [
  { display_name: '页面', value: 'page' },
  { display_name: '按钮', value: 'button' },
  { display_name: '输入框', value: 'input' },
  { display_name: '下拉框', value: 'select' }
]

const elementEvenOptions = [
  { display_name: '点击', value: 'click' },
  { display_name: '浏览', value: 'visit' }
]

const disableStatusOptions = [
  { display_name: '启用', value: 0 },
  { display_name: '禁用', value: 1 }
]

// arr to obj, such as { CN : "China", US : "USA" }
const cleanStatusKeyValue = cleanStatusOptions.reduce((acc, cur) => {
  acc[cur.value] = cur.display_name
  return acc
}, {})

// arr to obj, such as { CN : "China", US : "USA" }
const elementTypeKeyValue = elementTypeOptions.reduce((acc, cur) => {
  acc[cur.value] = cur.display_name
  return acc
}, {})

// arr to obj, such as { CN : "China", US : "USA" }
const elementEvenKeyValue = elementEvenOptions.reduce((acc, cur) => {
  acc[cur.value] = cur.display_name
  return acc
}, {})

// arr to obj, such as { CN : "China", US : "USA" }
const disableStatusKeyValue = disableStatusOptions.reduce((acc, cur) => {
  acc[cur.value] = cur.display_name
  return acc
}, {})

export default {
  name: 'TrackingOriginalData',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return elementEvenKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      trackingRecordList: [],
      belongTrackingElementList: [],
      total: 0,
      listLoading: true,
      pageQuery: {
        current: 1,
        limit: 10,
        sort: '+id',
        cleanStatus: '',
        startTime: '',
        endTime: ''
      },
      listQuery: {
        elementName: '',
        elementType: '',
        elementEven: ''
      },
      elementTypeOptions,
      elementEvenOptions,
      elementTypeKeyValue,
      elementEvenKeyValue,
      disableStatusKeyValue,
      cleanStatusOptions,
      cleanStatusKeyValue,
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      trackingElementTemp: {
        id: '',
        elementCode: '',
        elementName: '',
        belongElementCode: '',
        elementType: 'page',
        elementRoute: '',
        elementEven: 'visit',
        elementEvenResult: '',
        elementDescribe: '',
        disableStatus: 0
      },
      trackingRecord: {
        id: '',
        data: '',
        startTime: '',
        endTime: '',
        cleanStatus: '',
        cleanResult: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      dialogPvVisible: false,
      rules: {
        belongElementCode: [{ required: true, message: '元素代号不能为空！', trigger: 'change' }],
        elementCode: [{ required: true, message: '元素代号不能为空！', trigger: 'blur' }],
        elementName: [{ required: true, message: '元素名称不能为空', trigger: 'blur' }],
        elementType: [{ required: true, message: '元素类型不能为空！', trigger: 'blur' }],
        elementRoute: [{ required: true, message: '元素路由不能为空！', trigger: 'blur' }],
        elementEven: [{ required: true, message: '元素事件不能为空！', trigger: 'blur' }],
        elementEvenResult: [{ required: true, message: '元素事件结果不能为空！', trigger: 'blur' }],
        elementDescribe: [{ required: true, message: '元素描述不能为空！', trigger: 'blur' }],
        disableStatus: [{ required: true, message: '元素类型不能为空！', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.pageTrackingRecord()
  },
  methods: {
    pageTrackingRecord() {
      this.listLoading = true
      pageTrackingRecord(this.pageQuery).then(response => {
        this.trackingRecordList = response.data.records
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.1 * 1000)
      })
    },
    listTrackingElement() {
      this.listLoading = false
      this.listQuery.elementType = 'page'
      listTrackingElement(this.listQuery).then(response => {
        this.belongTrackingElementList = response.data
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.1 * 1000)
      })
    },
    handlerBelongElementCode(e) {
      this.trackingElementTemp.elementCode = e + '_'
    },
    handlerElementCode(e) {
      if (this.trackingElementTemp.elementType === 'page') {
        this.trackingElementTemp.belongElementCode = e
      }
      const index = e.indexOf(this.trackingElementTemp.belongElementCode)
      if (index === -1 || index !== 0) {
        this.$message.error('元素代号必须以归属埋点代号为前缀！')
        this.trackingElementTemp.elementCode = this.trackingElementTemp.belongElementCode + '_'
      }
    },
    handlerElementType(e) {
      this.trackingElementTemp = {}
      this.trackingElementTemp.elementType = e
      this.trackingElementTemp.elementEven = e === 'page' ? 'visit' : 'click'
    },
    handleFilter() {
      console.log(this.pageQuery.startTime)
      this.pageQuery.page = 1
      this.pageTrackingRecord()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.pageQuery.sort = '+id'
      } else {
        this.pageQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.trackingElementTemp = {
        id: '',
        elementCode: '',
        elementName: '',
        belongElementCode: '',
        elementType: 'page',
        elementRoute: '',
        elementEven: 'visit',
        elementEvenResult: '',
        elementDescribe: '',
        disableStatus: 0
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createTrackingElement(this.trackingElementTemp).then((response) => {
            console.log(response.data)
            this.trackingRecordList.unshift(response.data)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 1000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.trackingElementTemp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.trackingElementTemp)
          updateTrackingElement(tempData).then((response) => {
            const index = this.trackingRecordList.findIndex(v => v.id === this.trackingElementTemp.id)
            this.trackingRecordList.splice(index, 1, response.data)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      deleteTrackingElement(row.id).then(() => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.trackingRecordList.splice(index, 1)
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '埋点元素列表'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.trackingRecordList.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.pageQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
