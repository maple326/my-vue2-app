<script>
export default {
  data() {
    return {
      list: [
        {
          id: 1,
          title: "a",
          display_time: Date.parse("2022-10-1"),
        },
        {
          id: 2,
          title: "b",
          display_time: Date.parse("2022-10-28"),
        },
      ],
    };
  },

  methods: {
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
  },

  render(h) {
    function exportCsv() {
      console.log("export");
      const rows = [
        ["name1", "city1", "some other info"],
        ["name2", "city2", "more info"],
      ];

      let csvContent =
        "data:text/csv;charset=utf-8," +
        rows.map((e) => e.join(",")).join("\n");

      var encodedUri = encodeURI(csvContent);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "my_data.csv");
      document.body.appendChild(link); // Required for FF

      link.click(); // This will download the data file named "my_data.csv".
    }

    const exportXlsx = () => {
      require.ensure([], () => {
        // 用 webpack Code Splitting xlsl还是很大的
        const { export_json_to_excel } = require("/src/utils/Export2Excel");
        const tHeader = ["序号", "文章标题", "作者", "阅读数", "发布时间"]; // excel 表格头
        const filterVal = [
          "id",
          "title",
          "author",
          "pageviews",
          "display_time",
        ];
        const list = this.list;
        const data = this.formatJson(filterVal, list); // 自行洗数据 按序排序的一个array数组
        export_json_to_excel({
          header: tHeader,
          data,
        });
      });
    };

    return (
      <h1 level={1}>
        <el-button type="primary" onClick={exportCsv}>
          Export to csv
        </el-button>
        <el-button type="primary" onClick={exportXlsx}>
          Export to xlsx
        </el-button>
      </h1>
    );
  },
};
</script>
