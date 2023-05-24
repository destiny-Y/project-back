import request from '@/utils/request';
// 主要获取的是品牌管理的数据

// 获取品牌列表数据的接口 
// URL /admin/product/baseTrademark/{page}/{limit}  GET
export const reqTradeMarkList = (page, limit) => {
  return request({
    url: `/dev1-api/admin/product/baseTrademark/${page}/${limit}`,
    method: 'get'
  });
};

// 新增品牌的接口 
// URL /admin/product/baseTrademark/save  POST 携带两个参数：品牌名称、品牌LOGO
// 注意：对于新增的品牌，给服务器传递的参数中不需要传递ID,由服务器生成

// 修改品牌  URL /admin/product/baseTrademark/update  PUT 携带三个参数 id、品牌名称、品牌LOGO
// 注意：对于修改品牌的操作，携带的参数中必须要含有id
export const reqAddOrUpdateTradeMark = (trademark) => {
  if (trademark.id) {  // 带有id，为修改
    return request({
      url: '/dev1-api/admin/product/baseTrademark/update',
      method: "put",
      data: trademark
    });
  } else {  // 新增品牌
    return request({
      url: '/dev1-api/admin/product/baseTrademark/save',
      method: "post",
      data: trademark
    });
  }
};

// 删除品牌的接口
export const reqDeleteTradeMark = (id) => {
  return request({
    url: `/dev1-api/admin/product/baseTrademark/remove/${id}`,
    method: "delete"
  });
};
