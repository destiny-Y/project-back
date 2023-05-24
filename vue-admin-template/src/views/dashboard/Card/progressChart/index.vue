<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
// 引入echarts
import * as echarts from "echarts";

export default {
  name: "progressChart",
  mounted() {
    let lineCharts = echarts.init(this.$refs.charts);  // 初始化echarts实例
    var option = {  // 配置数据
      xAxis: {
        show: false,  // 隐藏x轴
        min: 0,  // 最大值与最小值的设置
        max: 100,
      },
      yAxis: {
        show: false,  // 隐藏y轴
        type: "category",
      },
      series: [
        { type: "bar", data: [78], color: "skyblue",
          barWidth: 10,  // 设置柱状图的宽度
          showBackground: true,  // 背景颜色的设置
          backgroundStyle: {  // 设置背景颜色
            color: "#eee", },
          label: {  // 文本
            show: true,
            formatter: "|",  // 改变文本内容
            position: "right",  // 设置文本位置
          },
        },
      ],
      grid: { left: 0, right: 0, bottom: 0, top: 0,},  // 布局调试
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