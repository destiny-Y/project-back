<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="spu名称"> {{spu.spuName}} </el-form-item>
      <el-form-item label="sku名称">
        <el-input placeholder="sku名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input placeholder="价格(元)" type="number" v-model="skuInfo.price"></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea" rows="4" v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item :label="attr.attrName" v-for="(attr) in attrInfoList" :key="attr.id">
            <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
              <el-option :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`" v-for="(attrValue) in attr.attrValueList" :key="attrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item :label="saleAttr.saleAttrName" v-for="(saleAttr) in spuSaleAttrList" :key="saleAttr.id">
            <el-select placeholder="请选择" v-model="saleAttr.attrIdAndValueId">
              <el-option :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`" v-for="(saleAttrValue) in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table style="width: 100%" border :data="spuImageList" @selection-change="handleSelectionChange">
          <el-table-column prop="prop" type="selection" width="80">
          </el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{row}">
              <img :src=row.imgUrl alt="" style="width:100px;height:100px">
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row}">
              <el-button type="primary" v-if="row.isDefault == 0" @click="changeDefault(row)">设置默认</el-button>
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="Cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      spuImageList: [], // 存储spu图片的信息
      spuSaleAttrList: [], // 存储销售属性的信息
      attrInfoList: [], // 存储平台属性的数据
      skuInfo: {   // 收集sku数据的字段
        category3Id: 0,
        price: 0,
        skuAttrValueList: [   // 平台属性
          {
            attrId: 0,
            valueId: 0,
          },
        ],
        skuDefaultImg: "",   // 设置默认图片
        skuDesc: "",
        skuName: "",
        skuImageList: [  // 图片信息
          {
            imgName: "",
            imgUrl: "",
            isDefault: "",
            spuImgId: 0,
          },
        ],   
        skuSaleAttrValueList: [   // sku销售属性列表的数据
          {
            id: 0,
            saleAttrId: 0,
            saleAttrName: "",
            saleAttrValueId: 0,
            saleAttrValueName: "",
            skuId: 0,
            spuId: 0,
          },
        ],
        spuId: 0,
        tmId: 0,
        weight: "",
      },
      spu:{},   // 父组件传过来的数据
      imageList:[]   // 暂时先存储收集的图片信息(缺少isDefault字段),后面再整理
    };
  },
  methods: {
    // 发送请求获取skuForm数据
    async getData(category1Id, category2Id, spu) {
      // 收集父组件传过来的数据
      this.skuInfo.category3Id = spu.category3Id;
      this.skuInfo.spuId = spu.id;
      this.skuInfo.tmId = spu.tmId;
      this.spu = spu;
      // 获取图片的数据
      let result = await this.$API.spu.reqSpuImageList2(spu.id);
      // console.log(result);
      if (result.code == 200) {
        let list = result.data;
        list.forEach(item => {
          item.isDefault = 0;  // 为图片数据添加isDefault字段
        })
        this.spuImageList = list;
      }
      // 获取销售属性的数据
      let result2 = await this.$API.spu.reqSpuSaleAttrList(spu.id);
      // console.log(result2);
      if (result2.code == 200) {
        this.spuSaleAttrList = result2.data;
      }
      // 获取平台属性的数据
      let result3 = await this.$API.spu.reqAttrInfoList(
        category1Id,
        category2Id,
        spu.id
      );
      // console.log(result3);
      if (result3.code == 200) {
        this.attrInfoList = result3.data;
      }
    },
    // table表格复选框按钮的事件
    handleSelectionChange(params){
      // 获取到用户选中的图片信息(缺少isDefault字段)
      this.imageList = params;
    },
    // 排他操作 
    changeDefault(row){
      // 图片列表数据的isDefault字段变为0
      this.spuImageList.forEach(item => {
        item.isDefault = 0;
      });
      // 点击的那个图片的isDefault字段变为1
      row.isDefault = 1;
      // 收集默认图片的地址
      this.skuDefaultImg = row.imgUrl;
    },
    // 取消按钮的回调
    Cancel(){
      // 触发自定义事件,通知父组件切换场景
      this.$emit("changeScenes",0);
      // 清除数据
      Object.assign(this._data,this.$options.data());
    },
    // 保存按钮的回调
    async save(){
      // 整理参数
      // 整理平台属性
      const {attrInfoList,skuInfo,spuSaleAttrList,imageList} = this;
      /* // 新建数组  整理数据方式一：
      let arr = [];
      attrInfoList.forEach(item => {
        // 用户选择了当前的平台属性
        if(item.attrIdAndValueId){
          const [attrId,valueId] = item.attrIdAndValueId.split(":");
          // 带给服务器的参数应该是一个对象
          let obj = {valueId,attrId};
          arr.push(obj);
        }
      });
      // 将整理好的参数赋值
      skuInfo.skuAttrValueList = arr; */
      // 方式二:
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev,item) => {
        if(item.attrIdAndValueId){
          const [attrId,valueId] = item.attrIdAndValueId.split(":");
          prev.push({attrId,valueId});
        }
        return prev;
      },[]);
      // 整理销售属性
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev,item) => {
        if(item.attrIdAndValueId){
          const [saleAttrId,saleAttrValueId] = item.attrIdAndValueId.split(":");
          prev.push({saleAttrId,saleAttrValueId});
        }
        return prev;
      },[]);
      // 整理图片的数据
      skuInfo.skuImageList = imageList.map(item => {
        return{
          imgName:item.imgName,
          imgUrl:item.imgUrl,
          isDefault:item.isDefault,
          spuImgId:item.id
        }
      });
      // 发请求
      let result = await this.$API.spu.reqAddSku(skuInfo);
      // console.log(result);
      if(result.code == 200){
        this.$message({type:"success",message:"添加sku成功!"});
        // 通知父组件切换场景
        this.$emit("changeScenes",0);
      }
    }
  },
};
</script>

<style>
</style>