<template>
  <!-- 容器 -->
  <div class="charts" ref="charts"></div>
</template>
<script>
// 引入echarts
import * as echarts from "echarts";

export default {
  name: "barChart",
  mounted() {
    // 初始化echarts实例
    let lineCharts = echarts.init(this.$refs.charts);
    // 配置数据
    var option = {
      xAxis: {
        // 隐藏x轴
        show: false, type: "category",
      },
      yAxis: {
        show: false,  // 隐藏y轴
      },
      series: [
        { type: "bar", data: [10, 4, 17, 12, 10, 27, 18, 10, 23, 19, 24, 27, 38, 29],},
      ],
      // 布局调试
      grid: { left: 0, right: 0, bottom: 0, top: 0, },
      tooltip: {},
    };
    lineCharts.setOption(option);
  },
};
</script>
<style scoped>
.charts {
  width: 100%;
  height: 100%;
}
</style>