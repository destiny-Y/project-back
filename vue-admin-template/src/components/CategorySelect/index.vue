<template>
  <div>
    <!-- inline 代表的是行内表单,代表一行可以放置多个表单元素 -->
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类">
        <el-select  placeholder="请选择" v-model="cForm.category1Id" @change="handler1" :disabled="show">
          <el-option :label="c1.name" :value="c1.id" v-for="c1 in list1" :key="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select placeholder="请选择" v-model="cForm.category2Id" @change="handler2" :disabled="show">
          <el-option :label="c2.name" :value="c2.id" v-for="c2 in list2" :key="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select placeholder="请选择" v-model="cForm.category3Id" @change="handler3" :disabled="show">
          <el-option :label="c3.name" :value="c3.id" v-for="c3 in list3" :key="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  data() {
    return {
      // 一级分类的数据
      list1: [],
      //  二级分类的数据
      list2: [],
      // 三级分类的数据
      list3: [],
      // 收集相应的一级二级三级分类的id
      cForm: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  props: ["show"],
  mounted() {
    // 组件挂载完毕，需要向服务器发送请求获取一级分类的数据
    this.getCategory1List();
  },
  methods: {
    // 获取一级分类数据的方法
    async getCategory1List() {
      // 获取一级分类的请求不需要带参数
      let result = await this.$API.attr.reqCategory1List();
      // console.log(result);
      if (result.code == 200) {
        // 存储服务器返回的数据
        this.list1 = result.data;
      }
    },
    // 一级分类select事件的回调(当一级分类的option发生变化的时候获取响应的二级分类的数据)
    async handler1() {
      // 清除上一次二级和三级分类残留的数据
      this.list2 = [];
      this.list3 = [];
      this.cForm.category2Id = "";
      this.cForm.category3Id = "";
      // 解构出一级分类的id
      const { category1Id } = this.cForm;
      // 将一级分类的id传递给父组件
      this.$emit("getCategoryId", { categoryId: category1Id, level: 1 });
      // 通过一级分类的id获取二级分类的数据
      let result = await this.$API.attr.reqCategory2List(category1Id);
      // console.log(result);
      if (result.code == 200) {
        this.list2 = result.data;
      }
    },
    // 二级分类select事件的回调(当二级分类的option发生变化的时候获取响应的二级分类的数据)
    async handler2() {
      // 清除上一次三级分类残留的数据
      this.list3 = [];
      this.cForm.category3Id = "";
      // 解构出二级分类的id
      const { category2Id } = this.cForm;
      // 将一级分类的id传递给父组件
      this.$emit("getCategoryId", { categoryId: category2Id, level: 2 });
      // 通过二级分类的id获取三级分类的数据
      let result = await this.$API.attr.reqCategory3List(category2Id);
      // console.log(result);
      if (result.code == 200) {
        this.list3 = result.data;
      }
    },
    // 三级分类的事件回调
    handler3() {
      // 获取三级分类的id
      const { category3Id } = this.cForm;
      // 将三级分类的id传递给父组件
      this.$emit("getCategoryId", { categoryId: category3Id, level: 3 });
    },
  },
};
</script>

<style>
</style>