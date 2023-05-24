<template>
  <div>
    <div class="header">
      <span class="serach-header">搜索用户数</span>
      <i class="el-icon-info"></i>
    </div>
    <div class="main">
      <span class="main-title">12321</span>
      <span class="main-content">17.1</span>
      <i class="el-icon-caret-bottom" style="color: red"></i>
      <i class="el-icon-caret-top" style="color: green"></i>
    </div>
    <div class="footer">
      <div class="charts" ref="charts"></div>
    </div>
  </div>
</template>

<script>
// 引入echarts
import * as echarts from "echarts";

export default {
  name: "lineCharts",
  mounted() {
    // 初始化echarts实例
    let lineCharts = echarts.init(this.$refs.charts);
    // 配置数据
    var option = {
      xAxis: {
        // 隐藏x轴
        show: false,
        type: "category",
      },
      yAxis: {
        // 隐藏y轴
        show: false,
      },
      series: [
        {
          type: "line",
          data: [10, 4, 17, 12, 10, 27, 18, 10, 23, 19],
          // 拐点的样式
          itemStyle: {
            opacity: 0,
          },
          // 线条的样式
          lineStyle: {
            color: "blue",
          },
          // 填充颜色的设置
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "blue", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#fff", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
        },
      ],
      // 布局调试
      grid: {
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
      },
    };
    lineCharts.setOption(option);
  },
  
};
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
}
.serach-header {
  margin: 20px;
}
.main {
  margin: 10px 0px;
}
.main-title {
  margin-right: 20px;
}
.main-content {
  margin-right: 10px;
}
.charts {
  width: 100%;
  height: 50px;
}
</style>