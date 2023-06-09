// 平台属性管理模块的接口文件
import request from '@/utils/request';

// 获取一级分类的接口 
// /admin/product/getCategory1 GET
export const reqCategory1List = () => {
  return request({
    url: '/dev1-api//admin/product/getCategory1',
    method: 'get'
  });
};

// 获取二级分类的接口
// /admin/product/getCategory2/{category1Id}  get
export const reqCategory2List = (category1Id) => {
  return request({
    url: `/dev1-api/admin/product/getCategory2/${category1Id}`,
    method: 'get'
  });
};

// 获取三级分类的接口
// /admin/product/getCategory3/{category2Id}  get
export const reqCategory3List = (category2Id) => {
  return request({
    url: `/dev1-api/admin/product/getCategory3/${category2Id}`,
    method: 'get'
  });
};

// 获取平台属性的接口
// /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}  get
export const reqAttrList = (category1Id, category2Id, category3Id) => {
  return request({
    url: `/dev1-api/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: 'get'
  });
};

// 添加属性名与属性值的接口
// /admin/product/saveAttrInfo  post
export const reqAddOrUpdateAttr = (data) => {
  return request({
    url: '/dev1-api/admin/product/saveAttrInfo',
    method: 'post',
    data,
  });
};
/*
 {
  "attrName": "string",  // 属性名
  "attrValueList": [   // 属性名中的属性值(可以有多个,所以是数组)
    {
      "attrId": 0,   // 属性名的id
      "valueName": "string"   // 相应的属性值
    }
  ],
  "categoryId": 0,   // category3Id
  "categoryLevel": 3,   // 三级id 
}
 */


