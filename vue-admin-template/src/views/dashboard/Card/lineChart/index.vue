<template>
  <!-- 容器 -->
  <div class="charts" ref="charts"></div>
</template>

<script>
// 引入echarts
import * as echarts from "echarts";

export default {
  name: "lineChart",
  mounted() {
    let lineCharts = echarts.init(this.$refs.charts);  // 初始化echarts实例
    var option = {  // 配置数据
      xAxis: {
        // 隐藏x轴
        show: false, type: "category",},
      yAxis: {
        show: false,  // 隐藏y轴
      },
      series: [
        { type: "line", data: [10, 4, 17, 12, 10, 27, 18, 10, 23, 19],
          itemStyle: { opacity: 0, },  // 拐点的样式
          lineStyle: { color: "purple", },  // // 线条的样式
          areaStyle: {  // 填充颜色的设置
            color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: "purple", // 0% 处的颜色
                },
                { offset: 1, color: "#fff", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
        },
      ],
      grid: { left: 0, right: 0, bottom: 0, top: 0,},   // 布局调试
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