import request from '@/utils/request';

// 获取sku列表
// /admin/product/list/{page}/{limit}  get
export const reqSkuList = (page, limit) => {
    return request({
        url: `/dev1-api/admin/product/list/${page}/${limit}`,
        method: "get"
    });
};

// 下架商品
// /admin/product/cancelSale/{skuId}  get
export const reqCancel = (skuId) => {
    return request({
        url: `/dev1-api/admin/product/cancelSale/${skuId}`,
        method: "get"
    });
};

// 上架商品
// /admin/product/onSale/{skuId}  get
export const reqSale = (skuId) => {
    return request({
        url: `/dev1-api/admin/product/onSale/${skuId}`,
        method: "get"
    });
};

// 获取sku详情的接口
// /admin/product/getSkuById/{skuId}   get
export const reqSkuById = (skuId) => {
    return request({
        url:`/dev1-api/admin/product/getSkuById/${skuId}`,
        method:"get"
    });
};