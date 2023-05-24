<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card>
          <Detail title="总销售额" count="￥ 126560">
            <template slot="charts">
                <span>周同比&nbsp;&nbsp;&nbsp;56.67%</span>
                <span>日同比 19.96%</span>
            </template>
            <template slot="footer">
                <span>日销售额￥ 12423</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="访问量" count="88460">
            <template slot="charts">
                <lineChart/>
            </template>
            <template slot="footer">
                <span>日访问量 1234</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="支付笔数" count="88460">
            <template slot="charts">
                <barChart/>
            </template>
            <template slot="footer">
                <span>转化率 64%</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="运营活动效果" count="78%">
            <template slot="charts">
                <progressChart/>
            </template>
            <template slot="footer">
                <span>周同比 56.67%</span>&nbsp;&nbsp;&nbsp;
                <span>日同比 19.96%</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from "./Detail";
import lineChart from './lineChart';
import barChart from './barChart';
import progressChart from './progressChart';

export default {
  name: "Card",
  components: {
    Detail,
    lineChart,
    barChart,
    progressChart
  },
};
</script>

<style scoped>
span{
    font-size: 14px;
}
</style>