import request from '@/utils/request';

// 获取spu列表数据的接口 
// /admin/product/{page}/{limit}    get  page limit category3Id
export const reqSpuList = (page, limit, category3Id) => {
  return request({
    url: `/dev1-api/admin/product/${page}/${limit}`,
    method: 'get',
    params: { category3Id }
  });
};

// 获取spu信息
// /admin/product/getSpuById/{spuId}  get 
export const reqSpu = (spuId) => {
  return request({
    url: `/dev1-api/admin/product/getSpuById/${spuId}`,
    method: "get"
  });
};

// 获取品牌信息
// /admin/product/baseTrademark/getTrademarkList  get
export const reqTradeMarkList = () => {
  return request({
    url: "/dev1-api/admin/product/baseTrademark/getTrademarkList",
    method: "get"
  });
};

// 获取spu图片的接口
// /admin/product/spuImageList/{spuId}   get
export const reqSpuImageList = (spuId) => {
  return request({
    url: `/dev1-api/admin/product/spuImageList/${spuId}`,
    method: "get"
  });
};

// 获取平台全部的销售属性----整个平台销售属性一共三个
// /admin/product/baseSaleAttrList  get
export const reqBaseSaleAttrList = () => {
  return request({
    url: "/dev1-api/admin/product/baseSaleAttrList",
    method: "get"
  });
};

// /admin/product/saveSpuInfo  post
/*
"category3Id": 0,
    "tmId":0
  "description": "string",
  "spuImageList": [
    {
      "id": 0,
      "imgName": "string",
      "imgUrl": "string",
      "spuId": 0
    }
  ],
  "spuName": "string",
  "spuSaleAttrList": [
    {
      "baseSaleAttrId": 0,
      "id": 0,
      "saleAttrName": "string",
      "spuId": 0,
      "spuSaleAttrValueList": [
        {
          "baseSaleAttrId": 0,
          "id": 0,
          "isChecked": "string",
          "saleAttrName": "string",
          "saleAttrValueName": "string",
          "spuId": 0
        }
      ]
    }
  ],
  "tmId": 0

 */
// 修改或者添加spu，修改或者添加，带给服务器的数据大致相同，唯一的区别就是是否携带id
export const reqAddOrUpdateSpu = (spuInfo) => {
  // 携带的参数中含有id(修改spu)
  if (spuInfo.id) {
    return request({
      url: "/dev1-api/admin/product/updateSpuInfo",
      method: "post",
      data: spuInfo
    });
  } else {
    // 携带的参数中没有id(添加spu)
    return request({
      url: "dev1-api/admin/product/saveSpuInfo",
      method: "post",
      data: spuInfo
    });
  }
};

// 删除spu
// /admin/product/deleteSpu/{spuId}  delete
export const reqDeleteSpu = (spuId) => {
  return request({
    url:`/dev1-api/admin/product/deleteSpu/${spuId}`,
    method:"delete"
  });
};
// 获取图片的接口
// /admin/product/spuImageList/{spuId}   get
export const reqSpuImageList2 = (spuId) => {
  return request({
      url:`/dev1-api/admin/product/spuImageList/${spuId}`,
      method:"get"
  });
};

// 获取销售属性的数据
// /admin/product/spuSaleAttrList/{spuId}   get
export const reqSpuSaleAttrList = (spuId) => {
  return request({
      url:`/dev1-api/admin/product/spuSaleAttrList/${spuId}`,
      method:"get"
  });
};

// 获取平台属性的数据
// /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}   get
export const reqAttrInfoList = (category1Id,category2Id,category3Id) => {
  return request({
      url:`/dev1-api/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
      method:"get"
  });
};

// 添加sku
// /admin/product/saveSkuInfo  post
export const reqAddSku = (skuInfo) => {
  return request({
    url:"/dev1-api/admin/product/saveSkuInfo",
    method:"post",
    data:skuInfo
  });
};

// 获取sku列表数据的接口
// /admin/product/findBySpuId/{spuId}   get
export const reqSkuList = (spuId) => {
  return request({
    url:`/dev1-api/admin/product/findBySpuId/${spuId}`,
    method:"get"
  });
};


