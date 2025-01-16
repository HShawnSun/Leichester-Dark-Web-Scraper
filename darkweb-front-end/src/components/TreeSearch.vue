<script setup>
import { Search, Edit, Comment } from "@element-plus/icons-vue";
import {
  getAllWebsitesName,
  getAllWebsitesId,
  getWebsiteNameByWebsiteId,
  getChildrenPagesByParentId,
  getFirstPageIdByWebsiteId,
  getPagePathByPageId,
  getPageTitleByPageId,
  getCapturesBypageId,
  getNoteByCaptureId,
  updateNotesById,
} from "../api/main";
import { toRaw } from "vue";
</script>
<template>
  <div>
    <el-select
      v-model="selectedWebsiteId"
      placeholder="select a website"
      @change="selectWebsite"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <div class="tree">
      <div ref="chart" style="width: 100%; height: 400px"></div>
    </div>

    <div class="showBar">
      <div v-for="img in imgs" :key="toRaw(img).id">
        <div class="card">
          <el-col :span="23">
            <el-card shadow="hover">
              <el-row :gutter="20" class="content">
                <el-col :span="0.5">
                  <el-checkbox
                    v-model="checked1"
                    size="default"
                    :checked="img.selected"
                    @change="img.selected = !img.selected"
                  />
                </el-col>
                <el-col :span="1">
                  <div class="thumbnail-container">
                    <el-image
                      class="thumbnail-image"
                      style="width: 100%; height: 100%"
                      :src="img._links.self.href"
                      fit="contain"
                      @click="
                        showImg = true;
                        showImgUrl = img._links.self.href;
                        showImgHashValue = img.contentHash;
                      "
                    ></el-image>
                  </div>
                </el-col>
                <el-col :span="6"
                  ><div class="grid-content ep-bg-purple" />
                  <span
                    >Date: {{ img.capTime + " " + img.capDate }}</span
                  ></el-col
                >
                <el-col :span="2"></el-col>
                <el-col :span="9"
                  ><div class="grid-content ep-bg-purple" />
                  <span>Path: {{ img.pagePath }}</span></el-col
                >
                <el-col :span="1"
                  ><el-button
                    :icon="Search"
                    circle
                    @click="
                      showImg = true;
                      showImgUrl = img._links.self.href;
                      showImgHashValue = img.contentHash;
                    "
                  />
                  <div class="grid-content ep-bg-purple" />
                </el-col>
                <el-col :span="1"
                  ><el-button
                    type="primary"
                    :icon="Comment"
                    circle
                    @click="getNote(img.id)"
                  />
                  <div class="grid-content ep-bg-purple" />
                </el-col>
                <el-col :span="1"
                  ><el-button
                    type="info"
                    :icon="Edit"
                    circle
                    @click="editNoteFunc(img.id)"
                  />
                  <div class="grid-content ep-bg-purple" />
                </el-col>
                <el-col :span="1"
                  ><el-popconfirm
                    title="Are you sure to delete this?"
                    @confirm="handleDelete(img.id)"
                  >
                    <template #reference>
                      <el-button>Delete</el-button>
                    </template>
                  </el-popconfirm>
                  <div class="grid-content ep-bg-purple" />
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </div>
      </div>
    </div>
    <!-- show image -->
    <el-dialog v-model="showImg" title="Image" width="80%">
      <div class="hashValue">contentHash: {{ showImgHashValue }}</div>
      <img :src="showImgUrl" alt="image" id="bigImg" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showImg = false">Cancel</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- show notes -->
    <el-dialog v-model="showNote" title="Notes" width="50%">
      {{ note }}
      <template #footer>
        <span class="dialog-footer">
          <el-button
            @click="
              showNote = false;
              note = '';
            "
            >Cancel</el-button
          >
        </span>
      </template>
    </el-dialog>

    <!-- Edit Note -->
    <el-dialog v-model="editNote" title="Edit Note" width="50%">
      <el-input
        v-model="NoteText"
        :rows="4"
        type="textarea"
        placeholder="please input"
      />
      <template #footer>
        <span class="dialog-footer" id="confirmBtn">
          <el-button type="primary" @click="updateNote">Confirm</el-button>
        </span>
        <span class="dialog-footer">
          <el-button
            @click="
              editNote = false;
              NoteId = 0;
              NoteText = '';
            "
            >Cancel</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import * as echarts from "echarts";

/**
 * @vue-data {Boolean} showCard - Whether to show the card
 * @vue-data {Boolean} showImg - Whether to show the image
 * @vue-data {Boolean} showNote - Whether to show the note
 * @vue-data {String} note - The note to be displayed
 * @vue-data {String} showImgUrl - The URL of the image to be displayed
 * @vue-data {Object} img - The image to be displayed
 * @vue-data {Array} options - The options for the select
 * @vue-data {String} selectedWebsite - The selected website
 * @vue-data {String} selectedWebsiteId - The selected website id
 * @vue-data {Array} imgs - The images to be displayed
 * @vue-data {Object} treeData - The data for the tree, including the name and children
 *
 * @vue-event {Null} selectWebsite - Selects the website to the images
 * @vue-event {Null} getWebsites - Gets the websites by the select bar
 * @vue-event {Null} convertOptions - Converts the options to the select bar
 * @vue-event {Null} generateTreeData - Generates the tree data by the page id and its children and parents
 * @vue-event {Null} initChart - Initializes the chart, including the default properties and the tree data
 * @vue-event {Null} generateImgsByPageId - Generates the images by the page id
 */

export default {
  name: "HTreeSearch",
  data() {
    return {
      showCard: false,
      showImg: false,
      showNote: false,
      note: "",
      editNote: false,
      showImgUrl: "",
      img: {
        date: new Date(),
      },
      options: [],
      selectedWebsite: "",
      selectedWebsiteId: "",
      showImgHashValue: "",
      imgs: [],
      treeData: {},
      test: false,
      NoteText: "",
    };
  },
  mounted() {
    if (!this.test) this.getWebsites();
  },
  methods: {
    async selectWebsite() {
      this.selectedWebsite = await getWebsiteNameByWebsiteId(
        this.selectedWebsiteId
      );
      var firstId = await getFirstPageIdByWebsiteId(this.selectedWebsiteId);
      if (firstId === -1) {
        this.treeData = {
          name: "NO DATA",
          children: [],
        };
        this.initChart();
        return;
      }
      this.generateTreeData(firstId);
    },
    async getWebsites() {
      const optionsList = await getAllWebsitesName();
      const optionsIdList = await getAllWebsitesId();
      this.options = this.convertOptions(optionsList, optionsIdList);
    },
    convertOptions(originalOptions, originalOptionsId) {
      const convertedOptions = [];
      for (let i = 0; i < originalOptions.length; i++) {
        convertedOptions.push({
          value: originalOptionsId[i],
          label: originalOptions[i],
        });
      }
      return convertedOptions;
    },
    async generateSubTree(pgId) {
      console.log(pgId);
      const pageName = await getPageTitleByPageId(pgId);
      var treeData = {
        name: pageName,
        value: pgId,
        children: [],
      };
      const children = await getChildrenPagesByParentId(pgId);
      if (children.length === 0) {
        return treeData;
      }
      for (const child of children) {
        treeData.children.push(await this.generateSubTree(child.id));
      }
      return treeData;
    },
    async generateTreeData(id) {
      this.treeData = await this.generateSubTree(id);
      this.initChart();
    },
    initChart() {
      const chartContainer = this.$refs.chart;

      const chart = echarts.init(chartContainer);

      const option = {
        series: [
          {
            type: "tree",
            data: [this.treeData],
            top: "1%",
            left: "7%",
            bottom: "1%",
            right: "30%",
            symbolSize: 7,
            label: {
              position: "left",
              verticalAlign: "middle",
              align: "right",
            },
            leaves: {
              label: {
                position: "right",
                verticalAlign: "middle",
                align: "left",
              },
            },
            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750,
          },
        ],
      };

      chart.setOption(option);
      chart.on("click", (params) => {
        this.generateImgsByPageId(params.data.value);
      });
    },
    async generateImgsByPageId(id) {
      this.imgs = await getCapturesBypageId(id);
      const pagePath = await getPagePathByPageId(id);
      this.imgs = this.imgs.map((img) => {
        img.pagePath = pagePath;
        return img;
      });
      console.log(this.imgs);
    },
    async getNote(id) {
      const note = await getNoteByCaptureId(id);
      this.note = note;
      this.showNote = true;
    },
    async editNoteFunc(id) {
      this.editNote = true;
      this.NoteId = id;
      this.NoteText = await getNoteByCaptureId(id);
    },
    async updateNote() {
      if (this.NoteId == 0) return;
      await updateNotesById(this.NoteId, this.NoteText);
      this.NoteId = 0;
      this.NoteText = "";
      this.editNote = false;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.choose-bar {
  margin-right: 1000px;
}
.tree {
  margin: 0;
  padding: 0;
}

.choose-bar {
  margin-right: 100px;
}

.thumbnail-container {
  width: 20px;
  height: 50px;
}

.hashValue {
  font-size: 16px;
  margin-bottom: 10px;
}

#bigImg {
  width: 100%;
  height: 100%;
}
</style>
