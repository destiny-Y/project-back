<template>
  <div>
    <el-card style="margin: 20px 0px">
      <!-- 三级联动已经注册为全局组件了 -->
      <CategorySelect @getCategoryId="getCategoryId" :show="scene != 0" />
    </el-card>
    <el-card>
      <!-- 将来这里是有三部分进行切换的 -->
      <div v-show="scene == 0">
        <!-- 展示spu列表的结构 -->
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addSpu">添加spu</el-button>
        <el-table style="width: 100%" border :data="records">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="spu名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="spu描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row }">
              <!-- 这里的按钮以后会用封装好的hintButton替换 -->
              <HintButton type="success" icon="el-icon-plus" size="mini" title="添加sku" @click="addSKu(row)"></HintButton>
              <HintButton type="warning" icon="el-icon-edit" size="mini" title="修改spu" @click="updateSpu(row)"></HintButton>
              <HintButton type="info" icon="el-icon-info" size="mini" title="查看当前spu全部sku列表" @click="handler(row)"></HintButton>
              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteSpu(row)">
                <HintButton type="danger" icon="el-icon-delete" size="mini" title="删除spu" slot="reference"></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination style="text-align: center" :current-page="page" :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout="prev, pager, next, jumper,->, sizes,total"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
          :total="total">
        </el-pagination>
      </div>
      <SpuForm v-show="scene == 1" @changeScene="changeScene" ref="spu"></SpuForm>
      <SkuForm v-show="scene == 2" ref="sku" @changeScenes="changeScenes">添加sku</SkuForm>
    </el-card>
    <el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible" :before-close="close">
      <!-- table展示sku列表的数据 -->
      <el-table :data="skuList" style="width: 100%" border v-loading="loading">
        <el-table-column prop="skuName" label="名称" width="width">
        </el-table-column>
        <el-table-column prop="price" label="价格" width="width">
        </el-table-column>
        <el-table-column prop="weight" label="重量" width="width">
        </el-table-column>
        <el-table-column label="默认图片" width="width">
          <template slot-scope="{row}">
            <img :src="row.skuDefaultImg" alt="" style="width:100px;height:100px">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
// 引入子组件
import SpuForm from "./SpuForm";
import SkuForm from "./SkuForm";

export default {
  name: "Spu",
  data() {
    return {
      // 一级分类的id
      category1Id: "",
      // 二级分类的id
      category2Id: "",
      // 三级分类的id
      category3Id: "",
      // 当前页码
      page: 1,
      // 每一页展示的数据数量
      limit: 3,
      // spu列表的数据
      records: [],
      // 数据总数  0 展示spu列表数据  1 添加spu|修改spu  2 添加sku
      total: 0,
      // 控制切换
      scene: 0,
      dialogTableVisible:false,  // 控制对话框的显示与隐藏
      spu:{},  // 存储spu
      skuList:[],  // 存储sku列表的数据
      loading: true  // 加载
    };
  },
  methods: {
    // 三级联动的自定义事件,可以将子组件三级联动的id传递给父组件
    getCategoryId({ categoryId, level }) {
      // 获取一、二、三、级分类的id,并区分是几级id
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        // 三级分类的id有了，可以发请求获取数据了
        this.getSpuList();
      }
    },
    // 发送请求, 获取spu列表数据的方法
    async getSpuList(pages = 1) {
      this.page = pages;
      // 带参数: page: 第几页 limit: 每一页展示多少数据 category3Id: 三级分类的id
      const { page, limit, category3Id } = this;
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      // console.log(result);
      if (result.code == 200) {
        this.records = result.data.records;
        this.total = result.data.total;
      }
    },
    // 当分页器的每一页展示数据的数目发生变化的回调
    handleSizeChange(limit) {
      // 修改参数
      this.limit = limit;
      // 再次发请求获取数据
      this.getSpuList();
    },
    // 添加spu的回调
    addSpu() {
      this.scene = 1;
      // 通知子组件spuForm发请求
      this.$refs.spu.addSpuData(this.category3Id);
    },
    // 修改某一个spu
    updateSpu(row) {
      this.scene = 1;
      // 获取子组件SpuForm
      this.$refs.spu.initSpuData(row);
    },
    // 自定义事件的回调(SpuForm)
    changeScene({ scene, flag }) {
      // flag为区分保存按钮是添加还是修改
      // 切换结构
      this.scene = scene;
      if (flag == "修改") {
        this.getSpuList(this.page);
      } else {
        this.getSpuList();
      }
    },
    // 删除按钮的回调
    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id);
      // console.log(result);
      if (result.code == 200) {
        this.$message({ type: "success", message: "删除成功！" });
        // 再次发送请求获取最新的数据
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1);
      }
    },
    // 添加sku按钮的回调
    addSKu(row) {
      // 切换场景
      this.scene = 2;
      // 父组件调用子组件中的方法，发送请求获取数据
      this.$refs.sku.getData(this.category1Id, this.category2Id, row);
    },
    // 自定义事件2(传递给skuForm子组件的)
    changeScenes(scene) {
      this.scene = scene;
    },
    // 查看sku按钮的回调
    async handler(spu){
      this.dialogTableVisible = true;  // 显示对话框
      this.spu = spu;
      // 发送请求获取sku列表的数据进行展示
      let result = await this.$API.spu.reqSkuList(spu.id);
      // console.log(result);
      if(result.code == 200){
        this.skuList = result.data;
        this.loading = false;
      }
    },
    // 对话框关闭的回调
    close(done){
      // loading属性再次变为真
      this.loading = true;
      // 清除数据
      this.skuList = [];
      // 关闭对话框
      done();
    }
  },
  components: {
    SpuForm,
    SkuForm,
  },
};
</script>

<style>
</style>