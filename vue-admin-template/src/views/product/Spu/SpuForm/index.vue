<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input placeholder="spu名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" value="" v-model="spu.tmId">
          <el-option :label="tm.tmName" :value="tm.id" v-for="tm in tradeMarkList" :key="tm.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input type="textarea" rows="4" placeholder="描述" v-model="spu.description"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- 上传图片 -->
        <!-- 
          file-list: 照片墙需要展示的数据(数组中必须含有name和url字段)
          on-preview: 图片预览功能
          :on-remove: 删除图片的时候会触发
         -->
        <el-upload action="/dev1-api/admin/product/fileUpload" list-type="picture-card"
          :file-list="spuImgList" :on-preview="handlePictureCardPreview"
          :on-success="handlerSuccess"
          :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select :placeholder="`还有${unSelectSaleAttr.length}项未选择`"
          v-model="attrIdAndName">
          <el-option :label="unSelect.name" :value="`${unSelect.id}:${unSelect.name}`"
            v-for="unSelect in unSelectSaleAttr"
            :key="unSelect.id"></el-option>
        </el-select>
        <el-button type="primary" icon="el-inco-plus" :disabled="!attrIdAndName" @click="addSaleAttr">添加销售属性</el-button>
        <!-- 展示的是当前spu自己的销售属性 -->
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{ row }">
              <!-- el-tag: 展示已有的属性值 -->
              <el-tag :key="tag.id" v-for="(tag, index) in row.spuSaleAttrValueList" closable
                :disable-transitions="false" @close="row.spuSaleAttrValueList.splice(index, 1)"
                style="margin: 5px 3px">
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!-- 这里的结构可以类比当时input和span的切换 -->
              <el-input class="input-new-tag" v-if="row.inputVisible" v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm(row)">
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ $index }">
              <el-button type="danger" icon="el-icon-delete" size="mini"
                @click="spu.spuSaleAttrList.splice($index, 1)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      // spu属性初始化的时候是一个空对象(在修改时，会向服务器发请求返回spu的信息)
      // 但是在添加时，并没有向服务器发请求,收集数据的时候就会比较麻烦
      spu: {
        category3Id: "", // 三级分类的id
        description: "", // 描述
        spuName: "", // spu的名称
        tmId: "", // 平台的id
        spuImageList: [
          // spu图片的信息
          {
            id: 0,
            imgName: "",
            imgUrl: "",
            spuId: 0,
          },
        ],
        spuSaleAttrList: [
          // 平台属性与属性值的收集
          /* {
            baseSaleAttrId: 0,
            id: 0,
            saleAttrName: "string",
            spuId: 0,
            spuSaleAttrValueList: [
              {
                baseSaleAttrId: 0,
                id: 0,
                isChecked: "string",
                saleAttrName: "string",
                saleAttrValueName: "string",
                spuId: 0,
              },
            ],
          }, */
        ],
      }, // 存储spu的信息
      tradeMarkList: [], // 存储品牌的信息
      spuImgList: [], // 存储spu图片的信息
      saleAttrList: [], // 存储销售属性的信息
      attrIdAndName: "", // 收集未选择的属性的id
    };
  },
  methods: {
    // 照片墙删除某一张图片时触发
    handleRemove(file, fileList) {
      // file: 删除的是哪一张图片
      // fileList: 删除某一张图片后剩余的图片
      // console.log(file, fileList);
      // 收集照片墙图片的数据  对于已有的图片,有name和url字段，但是服务器不需要这两个字段，需要处理
      this.spuImgList = fileList;
    },
    // 照片墙图片预览的回调
    handlePictureCardPreview(file) {
      // 将数据中图片的地址赋值给url
      this.dialogImageUrl = file.url;
      // 对话框显示
      this.dialogVisible = true;
    },
    // 照片墙图片上传成功的回调
    handlerSuccess(response, file, fileList) {
      // 收集图片的信息
      this.spuImgList = fileList;
    },
    // 初始化SpuForm的数据
    async initSpuData(spu) {
      // 获取spu信息的数据
      let result = await this.$API.spu.reqSpu(spu.id);
      // console.log(result);
      if (result.code == 200) {
        this.spu = result.data;
      }
      // 获取品牌的信息
      let tmR = await this.$API.spu.reqTradeMarkList();
      // console.log(tmR);
      if (tmR.code == 200) {
        this.tradeMarkList = tmR.data;
      }
      // 获取spu图片的数据
      let spuImgResult = await this.$API.spu.reqSpuImageList(spu.id);
      // console.log(spuImgResult);
      if (spuImgResult.code == 200) {
        let listArr = spuImgResult.data; // 数据需要先经过处理再赋值
        listArr.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        // 把整理好的数据赋值给spuImageList
        this.spuImgList = listArr;
      }
      // 获取平台销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      // console.log(saleResult);
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    // 添加新的销售属性
    addSaleAttr() {
      // 已经收集到了数据(还未分割整理)
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndName.split(":");
      this.attrIdAndName = ""; // 清空数据
      // 向SPU对象的spuSaleAttrList属性值添加值
      let newSaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      };
      // 添加新的销售属性值
      this.spu.spuSaleAttrList.push(newSaleAttr);
    },
    // 添加按钮的回调
    addSaleAttrValue(row) {
      // 点击添加按钮时，button变为input
      this.$set(row, "inputVisible", true); // 实现数据响应式,控制input与button的切换
      this.$set(row, "inputValue", ""); //
    },
    // el-input
    handleInputConfirm(row) {
      // 解构出销售属性值中新增的数据
      const { baseSaleAttrId, inputValue } = row;
      // 新增的销售属性值(名称不能为空)
      if (inputValue.trim() == "") {
        this.$message("属性值不能为空！");
        return;
      }
      // 属性值不能有重复
      let result = row.spuSaleAttrValueList.every((item) => {
        return item.saleAttrValueName != inputValue;
      });
      if (!result) {
        // 重复了
        this.$message("该属性值已经存在！");
        return;
      }
      let newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue };
      // 新增
      row.spuSaleAttrValueList.push(newSaleAttrValue);
      row.inputVisible = false;
    },
    // 保存按钮的回调
    async addOrUpdateSpu() {
      // 整理参数(整理照片墙的数据),对于图片来说，要有imgName和imgUrl字段
      this.spu.spuImageList = this.spuImgList.map((item) => {
        return {
          imgName: item.name,
          imgUrl: (item.response && item.response.data) || item.url,
        };
      });
      // 发送请求
      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu);
      // console.log(result);
      if (result.code == 200) {
        // 提示框
        this.$message({ type: "success", message: "保存成功!" });
        // 通知父组件切换场景
        this.$emit("changeScene", {scene:0,flag:this.spu.id?"修改":"添加"});
        // 再次通知父组件发送请求获取最新的数据
      }
      // 清除数据
      Object.assign(this._data,this.$options.data());
    },
    // 点击添加spu按钮的时候，发送请求
    async addSpuData(category3Id) {
      // 添加spu的时候收集三级分类的id
      this.spu.category3Id = category3Id;
      // 获取品牌的信息
      let tmR = await this.$API.spu.reqTradeMarkList();
      // console.log(tmR);
      if (tmR.code == 200) {
        this.tradeMarkList = tmR.data;
      }
      // 获取平台销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      // console.log(saleResult);
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    // 取消按钮的回调
    cancel(){
      // 通知父组件切换场景
      this.$emit("changeScene",{scene:0,flag:''});
      // 清除数据
      // Object.assign: 合并对象(es6中新增的方法)
      // 
      Object.assign(this._data,this.$options.data());
    }
  },
  computed: {
    // 计算出未被选择的销售属性
    unSelectSaleAttr() {
      // 整个平台的销售属性只有三个: 颜色、尺寸、版本---saleAttrList
      // 当前spu拥有的属于自己的销售属性spu.spuspuSaleAttrList---颜色
      // 过滤
      let result = this.saleAttrList.filter((item) => {
        // every是数组的方法，会返回一个布尔值
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name != item1.saleAttrName;
        });
      });
      return result;
    },
  },
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>