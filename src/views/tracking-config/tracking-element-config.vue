<template>
  <div class="app-container">
    <!-- 功能区 -->
    <div class="filter-container">
      <el-input v-model="pageQuery.elementName" :placeholder="$t('trackingElement.elementName')" clearable style="width: 200px; margin-right: 15px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="pageQuery.elementType" :placeholder="$t('trackingElement.elementType')" clearable style="width: 150px; margin-right: 15px;" class="filter-item">
        <el-option v-for="(item, index) in elementTypeOptions" :key="index" :label="item.display_name" :value="item.value" />
      </el-select>
      <el-select v-model="pageQuery.elementEven" :placeholder="$t('trackingElement.elementEven')" clearable class="filter-item" style="width: 150px; margin-right: 15px;">
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
    <!-- 展示列表 -->
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
      <el-table-column :label="$t('trackingElement.elementName')" min-width="300px">
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
          <span class="link-type" @click="handleUpdate(row)">{{ row.createTime | dateTimeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('trackingElement.updateTime')" min-width="170px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.updateTime | dateTimeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            {{ $t('table.edit') }}
          </el-button>
          <el-popconfirm title="确定删除该元素吗？" @onConfirm="handleDelete(row,$index)">
            <el-button v-if="row.status!='deleted'" slot="reference" size="mini" type="danger">
              {{ $t('table.delete') }}
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页栏 -->
    <pagination v-if="total>0" :total="total" :page.sync="pageQuery.current" :limit.sync="pageQuery.limit" @pagination="pageTrackingElement" />

    <!-- 添加/修改表单 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="trackingElementTemp" label-position="left" label-width="120px" style="width: 800px; margin-left:50px;">
        <el-form-item :label="$t('trackingElement.elementType')" prop="elementType">
          <el-select v-model="trackingElementTemp.elementType" style="width: 680px;" class="filter-item" placeholder="请选择埋点元素类型" @change="handlerElementType">
            <el-option v-for="(item, index) in elementTypeOptions" :key="index" :label="item.display_name" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="trackingElementTemp.elementType !== 'page'" :label="$t('trackingElement.belongElementCode')" prop="belongElementCode">
          <el-select v-model="trackingElementTemp.belongElementCode" style="width: 680px;" class="filter-item" placeholder="请选择归属的埋点元素" @focus="listTrackingElement" @change="handlerBelongElementCode">
            <el-option v-for="(item, index) in belongTrackingElementList" :key="index" :label="item.elementName" :value="item.elementCode" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('trackingElement.elementCode')" prop="elementCode">
          <el-input v-model="trackingElementTemp.elementCode" placeholder="埋点元素的唯一编号" @change="handlerElementCode" />
        </el-form-item>
        <el-form-item :label="$t('trackingElement.elementName')" prop="elementName">
          <el-input v-model="trackingElementTemp.elementName" placeholder="埋点元素的名称" />
        </el-form-item>
        <el-form-item v-if="trackingElementTemp.elementType === 'page'" :label="$t('trackingElement.elementRoute')" prop="elementRoute">
          <el-input v-model="trackingElementTemp.elementRoute" placeholder="埋点元素的路由" />
        </el-form-item>
        <el-form-item :label="$t('trackingElement.elementEven')" prop="elementEven">
          <el-select v-model="trackingElementTemp.elementEven" disabled style="width: 680px;" class="filter-item" placeholder="请选择埋点元素触发的事件">
            <el-option v-for="(item, index) in elementEvenOptions" :key="index" :label="item.display_name" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('trackingElement.elementEvenResult')" prop="elementEvenResult">
          <el-input v-model="trackingElementTemp.elementEvenResult" placeholder="埋点元素触发事件的结果" />
        </el-form-item>
        <el-form-item :label="$t('trackingElement.elementDescribe')" prop="elementDescribe">
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
  </div>
</template>

<script>
import { pageTrackingElement, listTrackingElement, createTrackingElement, deleteTrackingElement, updateTrackingElement } from '@/api/tracking-element-config'
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
      belongTrackingElementList: [],
      total: 0,
      listLoading: true,
      pageQuery: {
        current: 1,
        limit: 10,
        sort: '+id',
        elementName: '',
        elementType: '',
        elementEven: ''
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
    this.pageTrackingElement()
  },
  methods: {
    pageTrackingElement() {
      this.listLoading = true
      pageTrackingElement(this.pageQuery).then(response => {
        this.trackingElementList = response.data.records
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
      this.pageQuery.page = 1
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
            this.trackingElementList.unshift(response.data)
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
            const index = this.trackingElementList.findIndex(v => v.id === this.trackingElementTemp.id)
            this.trackingElementList.splice(index, 1, response.data)
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
        this.trackingElementList.splice(index, 1)
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
      return this.trackingElementList.map(v => filterVal.map(j => {
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
