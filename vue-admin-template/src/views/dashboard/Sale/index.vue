<template>
  <el-card class="box-card" style="margin: 10px 0px">
    <div slot="header" class="clearfix">
      <!--   @tab-click="handleClick" -->
      <!-- 头部左侧内容 -->
      <el-tabs class="tab" v-model="activeName">
        <el-tab-pane label="销售额" name="sale"></el-tab-pane>
        <el-tab-pane label="访问量" name="visit"></el-tab-pane>
      </el-tabs>
      <!-- 头部右侧内容 -->
      <div class="right">
        <span @click="setDay">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <span @click="setYear">今年</span>
        <!-- v-model="value1" -->
        <el-date-picker
          v-model="date"
          class="date"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="mini"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </div>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="18">
          <!-- 容器 -->
          <div class="charts" ref="charts"></div>
        </el-col>
        <el-col :span="6">
          <h4>门店{{ title }}排名</h4>
          <ul>
            <li>
              <span class="rindex">1</span>
              <span>肯德基</span>
              <span class="rvalue">1245</span>
            </li>
            <li>
              <span class="rindex">2</span>
              <span>麦当劳</span>
              <span class="rvalue">1245</span>
            </li>
            <li>
              <span class="rindex">3</span>
              <span>肯德基</span>
              <span class="rvalue">1245</span>
            </li>
            <li>
              <span class="index">4</span>
              <span>海底捞</span>
              <span class="rvalue">1245</span>
            </li>
            <li>
              <span class="index">5</span>
              <span>火锅</span>
              <span class="rvalue">1245</span>
            </li>
            <li>
              <span class="index">6</span>
              <span>汉堡王</span>
              <span class="rvalue">1245</span>
            </li>
            <li>
              <span class="index">7</span>
              <span>小郡肝</span>
              <span class="rvalue">1245</span>
            </li>
          </ul>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
// 引入echarts
import * as echarts from "echarts";
import dayjs from "dayjs";
import { mapState } from "vuex";

export default {
  name: "Sale",
  data() {
    return {
      activeName: "sale",
      myCharts: null,
      // 收集日历的数据
      date: [],
    };
  },
  mounted() {
    // 初始化echarts实例
    this.myCharts = echarts.init(this.$refs.charts);
    this.myCharts.setOption({
      title: {
        text: this.title + "趋势",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月','八月','九月','十月','十一月','十二月'],
          // data: this.listState.orderFullYearxAxis,
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: [10, 52, 200, 334, 390, 330, 220,129,18,23,83,91,],
          // data: this.listState.orderFullYear,
        },
      ],
    });
  },
  computed: {
    // 标题
    title() {
      return this.activeName == "sale" ? "销售额" : "访问量";
    },
    ...mapState({
      listState: (state) => state.home.list,
    }),
  },
  // 监视属性
  watch: {
    title() {
      // 重新修改图表的配置数据
      // 图表配置的数据可以再次修改，如果有新的数据，就使用新的数据，如果没有新的数据，就使用以前的数据
      this.myCharts.setOption({
        title: {
          text: this.title + "趋势",
        },
        xAxis: {
          data:
            this.title == "销售额"
              ? this.listState.orderFullYearxAxis
              : this.listState.userFullYearxAxis,
        },
        series: [
          {
            name: "Direct",
            type: "bar",
            barWidth: "60%",
            data:this.title == "销售额" ? this.listState.orderFullYear : this.listState.userFullYear
          },
        ],
      });
    },
    listState(){
        
    }
  },
  methods: {
    // 点击"今日"
    setDay() {
      const day = dayjs().format("YYYY-MM-DD");
      this.date = [day, day];
    },
    // 点击"本周"
    setWeek() {
      const start = dayjs().day(1).format("YYYY-MM-DD");
      const end = dayjs().day(7).format("YYYY-MM-DD");
      this.date = [start, end];
    },
    // 点击"本月"
    setMonth() {
      const start = dayjs().startOf("month").format("YYYY-MM-DD");
      const end = dayjs().endOf("month").format("YYYY-MM-DD");
      this.date = [start, end];
    },
    // 点击"今年"
    setYear() {
      const start = dayjs().startOf("year").format("YYYY-MM-DD");
      const end = dayjs().endOf("year").format("YYYY-MM-DD");
      this.date = [start, end];
    },
  },
};
</script>

<style scoped>
.clearfix {
  position: relative;
  display: flex;
  justify-content: space-between;
}
.tab {
  width: 100%;
}
.right {
  position: absolute;
  right: 0px;
}
.date {
  width: 230px;
  margin: 0px 20px;
}
.right span {
  margin: 0px 10px;
  font-size: 14px;
}
.charts {
  width: 100%;
  height: 300px;
}
ul {
  list-style: none;
  width: 100%;
  height: 300px;
  padding: 0px;
}
ul li {
  height: 8%;
  margin: 10px 0px;
}
.rindex {
  float: left;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: black;
  color: white;
  text-align: center;
  margin-right: 12px;
}
.index {
  margin-right: 23px;
  font-size: 13px;
}
.rvalue {
  float: right;
}
</style>