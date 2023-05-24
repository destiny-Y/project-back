<template>
  <div>
    <!-- 按钮 -->
    <el-button type="primary" icon="el-icon-plus" style="margin: 10px 0px" @click="showDialog"
      >添加</el-button
    >
    <!-- 
      表格组件
      data: 表格组件将来需要展示的数据----数据类型
      border: 给表格添加边框
      label: 显示的标题
      width: 对应列的宽度 
      align: 标题的对齐方式
      prop: 对应列表内容的字段名
      注意事项：
        elementUI 当中的table组件，展示的数据是一列一列进行展示的
     -->
    <el-table style="width: 100%" border :data="list">
      <el-table-column type="index" label="序号" width="80px" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="logoUrl" label="品牌LOGO" width="width">
        <template slot-scope="{ row }">
          <img :src="row.logoUrl" alt="" style="width: 100px; height: 70px" />
        </template>
      </el-table-column>
      <el-table-column props="props" label="操作" width="width">
        <template slot-scope="{ row }">
          <el-button type="warning" icon="el-icon-edit"
            size="mini"
            @click="updateTradeMark(row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete"
            size="mini"
            @click="deleteTradeMark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 
      分页器
      当前页码、数据总条数、每一页展示的数据数目、连续页码数
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      current-page: 当前第几页
      total: 分页器一共需要展示数据的条数
      page-size: 每一页需要展示多少条数据
      page-sizes: 代表可以设置每一页展示多少条数据
      layout: 可以实现分页器的布局
      :pager-count: 按钮的数量(连续的页码 = :pager-count - 2)
     -->
    <el-pagination @size-change="handleSizeChange"
      @current-change="getPageList"
      style="margin-top: 20px; textAlign: center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :pager-count="7"
      :page-size="limit"
      layout="prev, pager, next, jumper,->, total, sizes"
      :total="total">
    </el-pagination>
    <!-- 
      对话框
      visible.sync: 控制对话框显示与隐藏用的 
     -->
    <el-dialog :model="ruleForm" :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible">
      <!-- 
        from 表单
        model属性: 这个属性的作用是：将表单的数据收集到哪个对象身上,将来要进行表单验证，也需要这个属性
       -->
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload" -->
          <!-- 这里收集数据不能使用v-model，因为不是表单元素 -->
          <!-- 
            action: 设置图片上传的地址
            on-success: 可以检测到图片上传成功，当图片上传成功会执行一次
            before-upload: 可以在上传图片之前，执行一次
           -->
          <el-upload class="avatar-uploader" action="/dev1-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    // 自定义校验规则
    var validatetmName = (rule, value, callback) => {
      // 自定义校验
      if (value.length < 2 || value.length > 10) {
        callback(new Error("品牌名称必须在2-10位"));
      } else {
        callback();
      }
    };
    return {
      // 代表当前的页码
      page: 1,
      // 当前页码展示的数据条数
      limit: 3,
      // 数据总数目
      total: 0,
      // 列表展示的数据
      list: [],
      // 控制对话框显示与隐藏的属性
      dialogFormVisible: false,
      // 上传图片使用的属性
      imageUrl: "",
      // 收集的品牌信息,对象身上的属性不可以瞎写，需要看文档，否则会出现key-value不匹配的现象
      tmForm: {
        tmName: "",
        logoUrl: "",
      },
      // 表单验证规则
      rules: {
        // 品牌名称的验证规则
        // required: 必须要校验的字段
        // message: 提示信息
        // trigger: 用户行为设置(事件的设置:blur、change)
        // min-max: 文本的长度
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          /* {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "change",
          }, */
          // 自定义校验规则
          { validator: validatetmName, trigger: "change" },
        ],
        // 品牌logo的验证规则
        logoUrl: [{ required: true, message: "请上传图片" }],
      },
    };
  },
  mounted() {
    // 组件挂载完毕之后发请求
    this.getPageList();
  },
  methods: {
    // 获取品牌列表的数据
    async getPageList(pager = 1) {
      this.page = pager;
      // 结构参数
      const { page, limit } = this;
      let result = await this.$API.trademark.reqTradeMarkList(page, limit);
      // console.log(result);
      if (result.code == 200) {
        // 分别是展示的数据总数目与列表展示的数据
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    //
    /* handleCurrentChange(pager){
      // 修改参数
      this.page = pager;
      this.getPageList();
    } */
    // 当分页器某一页需要展示数据的数目数目发生变化时触发
    handleSizeChange(limit) {
      // 整理参数
      this.limit = limit;
      this.getPageList();
    },
    // 点击添加品牌的按钮
    showDialog() {
      // 显示对话框
      this.dialogFormVisible = true;
      // 清除数据
      this.tmForm = { tmName: "", logoUrl: "" };
    },
    // 修改某一个品牌
    updateTradeMark(row) {
      // row: 当前用户选中的品牌的信息
      // console.log(row);
      // 显示对话框
      this.dialogFormVisible = true;
      // 将已有的品牌信息赋值给tmForm进行展示
      // this.tmForm = row;
      this.tmForm = {...row};  // 浅拷贝数据
    },
    // 图片上传成功的回调
    handleAvatarSuccess(res, file) {
      // res: 上传成功之后返回前端数据
      // file: 上传成功之后服务器返回前端数据
      // this.imageUrl = URL.createObjectURL(file.raw);
      // 收集品牌图片数据,因为以后需要带给服务器
      this.tmForm.logoUrl = res.data;
    },
    // 图片上传之前的回调
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 添加按钮(添加品牌或者修改品牌)
    addOrUpdateTradeMark() {
      // 当全部的字段通过验证，再书写逻辑
      this.$refs.ruleForm.validate(async (success) => {
        // 如果全部的字段通过验证
        if (success) {
          this.dialogFormVisible = false;
          // 发请求(添加品牌|修改品牌)
          let result = await this.$API.trademark.reqAddOrUpdateTradeMark(this.tmForm);
          if (result.code == 200) {
            // 弹出信息: 添加品牌成功、修改品牌成功
            this.$message({
              type: "success",
              message: this.tmForm.id ? "修改品牌成功" : "添加品牌成功",
            });
            // 再次发送请求获取品牌列表
            // 如果是修改品牌，修改完毕后应该留在当前页面
            this.getPageList(this.tmForm.id ? this.page : 1);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 删除品牌的回调
    deleteTradeMark(row) {
      // 弹框
      this.$confirm(`确定要删除${row.tmName}吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 当用户点击"确定"按钮时触发
          // 向服务器发请求
          let result = await this.$API.trademark.reqDeleteTradeMark(row.id);
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            // 再次发送请求获取数据
            this.getPageList(this.list.length>1?this.page:this.page-1);
          }
        })
        .catch(() => {
          // 当用户点击"取消"按钮时触发
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>