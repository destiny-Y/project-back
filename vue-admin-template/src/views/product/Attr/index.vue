<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable" />
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <!-- 没有选择三级分类的时候,"添加属性"的按钮是无法使用的 -->
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addAttr">添加属性</el-button>
        <!-- 表格: 展示平台属性 -->
        <el-table style="width: 100%" border :data="attrList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{ row }">
              <el-tag type="success" v-for="attrValue in row.attrValueList" :key="attrValue.id" style="margin: 5px 10px">
                {{ attrValue.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row }">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加或修改属性的结构 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" @click="addAttrValue" :disabled="!attrInfo.attrName">添加属性值</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table style="width: 100%; margin: 20px 0px" border :data="attrInfo.attrValueList">
          <el-table-column align="center" type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 这里需要span和input进行来回切换 -->
              <el-input placeholder="请输入属性值名称" v-model="row.valueName" size="mini" v-if="row.flag"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
                :ref="$index"></el-input>
              <span v-else @click="toEdit(row, $index)" style="display: block">{{ row.valueName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 气泡确认框 -->
              <el-popconfirm :title="`确定删除${row.valueName}吗?`" @onConfirm="deleteAttrValue($index)">
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="addOrUpdateAttr"
          :disabled="attrInfo.attrValueList.length < 1">保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 引入lodash当中的深拷贝
import cloneDeep from "lodash/cloneDeep";

export default {
  name: "Attr",
  data() {
    return {
      // 一级分类的id
      category1Id: "",
      // 二级分类的id
      category2Id: "",
      // 三级分类的id
      category3Id: "",
      // 存储平台属性的数据
      attrList: [],
      // 是否显示table(默认是展示的)
      isShowTable: true,
      // 收集新增属性|或者修改属性
      attrInfo: {
        attrName: "", // 属性名
        attrValueList: [
          // 属性名中的属性值(可以有多个,所以是数组),每一个属性值都是一个对象，需要两个字段，attrId和 valueName
        ],
        categoryId: 0, // category3Id(注意: 不能在data中收集category3Id)
        categoryLevel: 3, // 三级分类的id
      },
    };
  },
  methods: {
    // 获取商品的id(自定义事件的回调)
    getCategoryId({ categoryId, level }) {
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
        this.getAttrList();
      }
    },
    // 发请求获取平台属性数据的方法
    // 当用户确定三级分类的id时，可以向服务器发请求获取平台属性进行展示
    async getAttrList() {
      // 获取分类的id
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      // console.log(result);
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },
    // 添加属性值的回调
    addAttrValue() {
      // 向属性值的数组中添加元素
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id, // 修改某一个属性时，可以在已有属性的基础上新增属性值(新增属性值的时候要把属性名的id带上)
        valueName: "", // 相应的属性值的名称
        // 控制input和span切换(信号量),切换查看模式与编辑模式,这样每一个属性值可以控制自己的模式切换
        flag: true, // 当前的flag属性是响应式数据
      });
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    // 添加属性的回调
    addAttr() {
      // 切换table的显示与隐藏
      this.isShowTable = false;
      // 清除数据并收集三级分类的id
      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3,
      };
    },
    // 修改某一个属性
    updateAttr(row) {
      this.isShowTable = false;
      // 将选中的属性赋值给attrInfo
      // 由于数据结构比较复杂，出现了对象和数组互相嵌套，因此需要使用深拷贝来解决这个问题
      // this.attrInfo = row;
      this.attrInfo = cloneDeep(row); // 深拷贝和浅拷贝在面试时出现的频率很高
      // 在修改某一个属性时，将相应的属性值元素添加上flag信号量
      // 使用$set追加flag属性,使之成为响应式属性
      this.attrInfo.attrValueList.forEach((item) => {
        this.$set(item, "flag", false);
      });
    },
    // 失去焦点，切换为查看模式(展示span)
    toLook(row) {
      // 形参是当前用户添加的属性值
      // 如果输入为空，则不能作为属性值
      if (row.valueName.trim() == "") {
        this.$message("请输入有效的属性值!");
        return;
      }
      // 新增属性值不能与已有的属性值重复
      let isRepeat = this.attrInfo.attrValueList.some((item) => {
        // 将row(最新添加的属性值)去除,不参与比较
        if (row !== item) {
          return row.valueName == item.valueName;
        }
      });
      if (isRepeat) {
        this.$message("该属性值已经存在!");
        return;
      }
      row.flag = false; // 编辑模式变为查看模式
    },
    // 点击span的回调，变为编辑模式
    toEdit(row, index) {
      row.flag = true;
      // 获取input节点，实现自动聚焦
      // 点击span的时候,切换为input变为编辑模式，但是需要注意，对于浏览器而言
      // 页面重绘与重排是需要消耗时间的，因此我们不可能一点击span就立马获取到input
      // $nextTick,当节点渲染完毕了，会执行一次
      this.$nextTick(() => {
        // 获取相应的input元素并自动聚焦
        this.$refs[index].focus();
      });
    },
    // 气泡确认框确定按钮的回调
    // 有版本误差，事件绑定方法:@onCo...
    deleteAttrValue(index) {
      // 当前删除属性值的操作不需要发请求
      this.attrInfo.attrValueList.splice(index, 1);
    },
    // 保存按钮，进行添加属性或者修改属性的操作
    async addOrUpdateAttr() {
      // 整理参数(1. 用户添加了空白的属性，不应该提交给服务器 2. 提交给服务器的数据不应该包含flag字段)
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          // 过滤掉属性值不为空的
          if (item.valueName != "") {
            // 删除掉flag
            delete item.flag;
            return true;
          }
        }
      );
      try {
        // 发送请求
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
        // 展示平台属性
        this.isShowTable = true;
        this.$message({ type: "success", message: "保存成功" });
        // 再次发送请求获取最新的数据
        this.getAttrList();
      } catch (e) {
        alert(e.message);
      }
    },
  },
};
</script>

<style>
</style>