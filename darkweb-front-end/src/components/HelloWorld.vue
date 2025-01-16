<template>
  <div class="hello">
    <div class="showPage">
      <div ref="areaChart" style="width: 600px; height: 400px"></div>
      <div ref="heatMap" style="width: 600px; height: 400px"></div>
    </div>
    <div>
      <br />
      <!-- Add a line break for spacing -->
      <p>
        The charts depict the number of captures from dark web marketplaces over
        time.
      </p>
    </div>

    <div v-if="captures">
      <div v-for="capture in captures" :key="capture.id">
        {{ capture }}
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import {
  getCaptures,
  getCapturesById,
  getCaptureNumByTimeRange,
} from "../api/main.js";

export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  methods: {
    async getVirtualData(year) {
      const date = +echarts.time.parse(year + "-01-01");
      const end = +echarts.time.parse(+year + 1 + "-01-01");
      const dayTime = 3600 * 24 * 1000;
      const times = [];
      for (let time = date; time < end; time += dayTime) {
        times.push(echarts.time.format(time, "{yyyy}-{MM}-{dd}", false));
      }

      let timeBefore = new Date(times[0]).getTime();
      let timeAfter = new Date(times[times.length - 1]).getTime();

      console.log(timeBefore, timeAfter);
      let result = await getCaptureNumByTimeRange(timeBefore, timeAfter);
      console.log(result);

      if (!result || typeof result !== "object") {
        return [];
      }
      return Object.entries(result).map(([date, count]) => [date, count]);
    },
    async getRealDataForMultipleYears(startYear, endYear) {
      const years = [];
      for (let year = startYear; year <= endYear; year++) {
        years.push(year);
      }
      const results = await Promise.all(
        years.map((year) => this.getVirtualData(year))
      );
      return results.flat();
    },
    syncCharts(params, areaChart, heatMap, areaOption, heatOption, date) {
      // Update the options of areaChart and heatMap based on params and date
      areaOption.series[0].data = params.data;
      heatOption.series[0].data = date;

      // Apply the updated options to the charts
      areaChart.setOption(areaOption);
      heatMap.setOption(heatOption);
    },
  },
  async mounted() {
    const virtualData2025 = await this.getVirtualData(2025);
    const virtualData2024 = await this.getVirtualData(2024);
    const realData = await this.getRealDataForMultipleYears(2024, 2025);
    console.log("mounted function is being executed"); // Add this line
    const data = await getCaptures();
    console.log(data); // Add this line
    this.$nextTick(async () => {
      if (this.$refs.areaChart && this.$refs.heatMap) {
        // Get data from API
        this.captures = await getCapturesById(1);
        console.log(this.captures); // Add this lin
        let date = [];

        var areaChart = echarts.init(this.$refs.areaChart);
        var heatMap = echarts.init(this.$refs.heatMap);

        areaChart.on("click", (params) => {
          this.syncCharts(
            params,
            areaChart,
            heatMap,
            areaOption,
            heatOption,
            date
          );
        });

        heatMap.on("click", (params) => {
          this.syncCharts(
            params,
            areaChart,
            heatMap,
            areaOption,
            heatOption,
            date
          );
        });

        const syncCharts = (params) => {
          if (params.componentType === "series") {
            if (params.seriesType === "heatmap") {
              var dataIndex = params.dataIndex;
              var date =
                heatOption.series[params.seriesIndex].data[dataIndex][0];
              var index = date.split("-");
              var targetIndex = date.indexOf("2024") === -1 ? 0 : 1;
              var targetChart = targetIndex === 0 ? areaChart : heatMap;
              var targetOption = targetIndex === 0 ? areaOption : heatOption;
              var targetData = targetOption.series[0].data;
              var targetDateIndex = targetData.findIndex(function (item) {
                var itemIndex = item[0].split("-");
                return (
                  itemIndex[0] === index[0] &&
                  itemIndex[1] === index[1] &&
                  itemIndex[2] === index[2]
                );
              });
              if (targetDateIndex !== -1) {
                targetChart.dispatchAction({
                  type: "dataZoom",
                  startValue: targetDateIndex - 5,
                  endValue: targetDateIndex + 5,
                });
              }
            } else if (params.seriesType === "line") {
              let dataIndex = params.dataIndex;
              let targetChart = heatMap;
              let targetOption = heatOption;
              let targetData = targetOption.series[params.seriesIndex].data;
              let targetDate = date[dataIndex];
              let targetDateIndex = targetData.findIndex(function (item) {
                return item[0] === targetDate;
              });
              if (targetDateIndex !== -1) {
                targetChart.dispatchAction({
                  type: "dataZoom",
                  startValue: targetDateIndex - 5,
                  endValue: targetDateIndex + 5,
                });
              }
            }
          }
        };

        var areaOption = {
          tooltip: {
            trigger: "axis",
            position: function (pt) {
              return [pt[0], "10%"];
            },
          },
          legend: {
            data: ["Dark Web Marketplace Activity Peak Diagram"],
            left: "center",
          },
          toolbox: {
            feature: {
              dataZoom: {
                yAxisIndex: "none",
              },
              restore: {},
              saveAsImage: {},
            },
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
            data: realData.map((item) => item[0]),
          },
          yAxis: {
            type: "value",
            boundaryGap: [0, "100%"],
          },
          dataZoom: [
            {
              type: "inside",
              start: 0,
              end: 10,
            },
            {
              start: 0,
              end: 10,
            },
          ],
          series: [
            {
              name: "",
              type: "line",
              symbol: "none",
              sampling: "lttb",
              itemStyle: {
                color: "rgb(255, 70, 131)",
              },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "rgb(255, 158, 68)",
                  },
                  {
                    offset: 1,
                    color: "rgb(255, 70, 131)",
                  },
                ]),
              },
              data: realData.map((item) => item[1]),
            },
          ],
        };

        var heatOption = {
          tooltip: {
            position: "top",
          },
          visualMap: {
            min: 0,
            max: 1000,
            calculable: true,
            orient: "horizontal",
            left: "center",
            top: "top",
          },
          legend: {
            data: ["Dark Web Marketplace Activity for 2024 and 2025"],
            left: "center",
          },
          calendar: [
            {
              range: "2025",
              cellSize: ["auto", 20],
            },
            {
              top: 260,
              range: "2024",
              cellSize: ["auto", 20],
            },
          ],
          series: [
            {
              name: "Dark Web Marketplace Activity",
              type: "heatmap",
              coordinateSystem: "calendar",
              calendarIndex: 0,
              data: virtualData2025,
            },
            {
              name: "Dark Web Marketplace Activity",
              type: "heatmap",
              coordinateSystem: "calendar",
              calendarIndex: 1,
              data: virtualData2024,
            },
          ],
        };

        areaChart.setOption(areaOption);
        heatMap.setOption(heatOption);

        areaChart.on("click", function (params) {
          syncCharts(params);
        });

        heatMap.on("click", function (params) {
          syncCharts(params);
        });
      }
    });
  },
};
</script>

<style scoped>
.showPage {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}
</style>
