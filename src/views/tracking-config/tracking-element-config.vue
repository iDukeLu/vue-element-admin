<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.elementName" :placeholder="$t('trackingElement.elementName')" clearable style="width: 200px; margin-right: 15px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.elementType" :placeholder="$t('trackingElement.elementType')" clearable style="width: 150px; margin-right: 15px;" class="filter-item">
        <el-option v-for="(item, index) in elementTypeOptions" :key="index" :label="item.display_name" :value="item.value" />
      </el-select>
      <el-select v-model="listQuery.elementEven" :placeholder="$t('trackingElement.elementEven')" clearable class="filter-item" style="width: 150px; margin-right: 15px;">
        <el-option v-for="(item, index) in elementEvenOptions" :key="index" :label="item.display_name" :value="item.value" />
      </el-select>
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

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="trackingElementList"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column :label="$t('trackingElement.id')" prop="id" sortable="custom" align="center" width="170" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('trackingElement.elementCode')" min-width="400px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.elementCode }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('trackingElement.belongElementCode')" min-width="320px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.belongElementCode }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('trackingElement.elementName')" min-width="270px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.elementName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('trackingElement.elementType')" min-width="80px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ elementTypeKeyValue[row.elementType] }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('trackingElement.elementRoute')" min-width="320px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.elementRoute }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('trackingElement.elementEven')" min-width="80px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ elementEvenKeyValue[row.elementEven] }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('trackingElement.elementEvenResult')" min-width="320px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.elementEvenResult }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('trackingElement.elementDescribe')" min-width="270px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.elementDescribe }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('trackingElement.disableStatus')" min-width="80px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ disableStatusKeyValue[row.disableStatus] }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('trackingElement.createTime')" min-width="170px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('trackingElement.updateTime')" min-width="170px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            {{ $t('table.edit') }}
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            {{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.limit" @pagination="pageTrackingElement" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="trackingElementTemp" label-position="left" label-width="100px" style="width: 800px; margin-left:50px;">
        <el-form-item :label="$t('trackingElement.elementType')">
          <el-select v-model="trackingElementTemp.elementType" style="width: 700px;" class="filter-item" placeholder="请选择埋点元素类型" @change="handlerElementEven">
            <el-option v-for="(item, index) in elementTypeOptions" :key="index" :label="item.display_name" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-show="trackingElementTemp.elementType !== 'page'" :label="$t('trackingElement.belongElementCode')">
          <el-select v-model="trackingElementTemp.belongElementCode" style="width: 700px;" class="filter-item" placeholder="请选择归属的埋点元素">
            <el-option v-for="(item, index) in elementTypeOptions" :key="index" :label="item.display_name" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('trackingElement.elementCode')" prop="elementCode">
          <el-input v-model="trackingElementTemp.elementCode" placeholder="埋点元素的唯一编号" />
        </el-form-item>
        <el-form-item :label="$t('trackingElement.elementName')" prop="elementName">
          <el-input v-model="trackingElementTemp.elementName" placeholder="埋点元素的名称" />
        </el-form-item>
        <el-form-item v-show="trackingElementTemp.elementType === 'page'" :label="$t('trackingElement.elementRoute')" prop="elementRoute">
          <el-input v-model="trackingElementTemp.elementRoute" placeholder="埋点元素的路由" />
        </el-form-item>

        <el-form-item :label="$t('trackingElement.elementEven')">
          <el-select v-model="trackingElementTemp.elementEven" disabled style="width: 700px;" class="filter-item" placeholder="请选择埋点元素触发的事件">
            <el-option v-for="(item, index) in elementEvenOptions" :key="index" :label="item.display_name" :value="item.value" />
          </el-select>
        </el-form-item>

        <!-- <el-form-item :label="$t('trackingElement.elementEven')" prop="elementEven">
          <el-input v-model="trackingElementTemp.elementEven" placeholder="埋点元素触发的事件" />
        </el-form-item> -->

        <el-form-item :label="$t('trackingElement.elementEvenResult')" prop="elementEvenResult">
          <el-input v-model="trackingElementTemp.elementEvenResult" placeholder="埋点元素触发事件的结果" />
        </el-form-item>
        <el-form-item :label="$t('trackingElement.elementDescribe')">
          <el-input v-model="trackingElementTemp.elementDescribe" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入对埋点元素的相关描述" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { pageTrackingElement, fetchPv, createArticle, updateArticle } from '@/api/tracking-element'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

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
  name: 'TrackingElementConfig',
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
      trackingElementList: [],
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id',
        elementName: '',
        elementType: '',
        elementEven: ''
      },
      elementTypeOptions,
      elementEvenOptions,
      elementTypeKeyValue,
      elementEvenKeyValue,
      disableStatusKeyValue,
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
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
      trackingElement: {
        id: '',
        elementCode: '',
        elementName: '',
        belongElementCode: '',
        elementType: '',
        elementRoute: '',
        elementEven: '',
        elementEvenResult: '',
        elementDescribe: '',
        disableStatus: '',
        createTime: '',
        updateTime: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.pageTrackingElement()
  },
  methods: {
    pageTrackingElement() {
      this.listLoading = true
      pageTrackingElement(this.listQuery).then(response => {
        console.log(response)
        this.trackingElementList = response.data.records
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0.1 * 1000)
      })
    },
    handlerElementEven(e) {
      this.trackingElementTemp.elementEven = e === 'page' ? 'visit' : 'click'
    },
    handleFilter() {
      this.listQuery.page = 1
      this.pageTrackingElement()
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
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
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
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.trackingElementList.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            const index = this.trackingElementList.findIndex(v => v.id === this.temp.id)
            this.trackingElementList.splice(index, 1, this.temp)
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
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      this.trackingElementList.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
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
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.trackingElementList.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
