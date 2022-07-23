<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加按钮区域 -->
      <el-row>
        <el-button type="primary" @click="showAddCateDialog"
          >添加分类</el-button
        >
      </el-row>

      <!-- 表格区域 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        class="treeTable"
      >
        <template slot="iso" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_name === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <!-- 排 序 -->
          <el-tag size="min" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            size="min"
            type="success"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag size="min" type="warning" v-else>三级</el-tag>
        </template>
        <template slot="opt">
          <!-- slot-scope="scope" -->
          <!-- 操作 -->
          <el-button type="primary" size="min">编辑</el-button>
          <el-button type="danger" size="min">删除</el-button>
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 3, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- //添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="40%"
      @close="addCateDialogClosed"
    >
      <!-- 添加分类的表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <!-- options 用来指定数据源 -->
        <!-- props 用来指定配置对象 -->
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectKeys"
            :options="ParentCateList"
            :props="cascaderProps"
            expand-trigger="hover"
            @change="ParentCateChange"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      // 商品分类的数据,默认为空
      cateList: [],
      //总数据条数
      total: 0,
      //为table 制定列的定义
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          // 表示将当前列定义为模板列
          type: "template",
          //表示当前这一列 使用模板名称
          template: "iso",
        },
        {
          label: "排序",
          type: "template",
          template: "order",
        },
        {
          label: "操作",
          type: "template",
          template: "opt",
        },
      ],
      //控制 添加分类对话框的 显示与隐藏
      addCateDialogVisible: false,
      //   添加分类的表单数据对象
      addCateForm: {
        // 将要添加的分类的名称
        cat_name: "",
        // 分类层级,默认要添加的是一级分类
        cat_level: 0,
        // 分类父 ID
        cat_pid: 0,
      },
      //添加验证表单的规则对象
      addCateFormRules: {
        // 分类名称
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      //父级分类的列表
      ParentCateList: [],
      //指定级联选择器的配置对象
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      //选中的父级分类的id 数组
      selectKeys: [],
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    //获取商品数据
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败！");
      }
      //把数据列表，赋值给cateList
      this.cateList = res.data.result;
      this.total = res.data.total;
    },
    //监听 pagesize 改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    //监听 pagenum 改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCateList();
    },
    //点击按钮，展示添加分类对话框
    showAddCateDialog() {
      //先获取数据
      this.getParentCateList();
      //再展示对话框
      this.addCateDialogVisible = true;
    },
    //获取父级分类的一级 二级数据
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: {
          type: 2,
        },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取父级分类数据失败！");
      }
      this.ParentCateList = res.data;
    },
    //选择项发生变化出发这个函数
    ParentCateChange() {
      //   console.log(this.selectKeys);

      //如果 selectKeys 数据中的 length 大于0 ，证明选中了 父级
      //反之， 就说明没有选中 任何父级分类
      if (this.selectKeys.length > 0) {
        //父级分类的id
        this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1];
        //为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectKeys.length;
      } else {
        //父级分类的id
        this.addCateForm.cat_pid = 0;
        //为当前分类的等级赋值
        this.addCateForm.cat_level = 0;
      }
    },
    //点击按钮，添加新的分类
    addCate() {
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          `categories`,
          this.addCateForm
        );
        // console.log(res.meta);
        if (res.meta.status !== 201) {
          return this.$message.error("添加分类失败！");
        }
        this.$message.success("添加分类成功！");
        this.getCateList();
        this.addCateDialogVisible = false;
      });
    },
    //监听对话框的关闭事件
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields();
      (this.selectKeys = []),
        (this.addCateForm.cat_level = 0),
        (this.addCateForm.cat_pid = 0);
    },
  },
};
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>