<script setup>
import { Search, Edit, Comment } from "@element-plus/icons-vue";
import {
  getCaptureByTimeRange,
  getCaptures,
  getPageNamePromisebyID,
  getCapturesByKeyword,
  getPagesByURL,
  getCapturesByURL,
  getAllWebsitesName,
  updateNotesById,
  deleteById,
  getNoteByCaptureId,
} from "../api/main";
import { toRaw } from "vue";
</script>
<template>
  <div>
    <div class="searchBar">
      <el-row :gutter="20">
        <el-col :span="2"></el-col>
        <el-col :span="7"
          ><div class="grid-content ep-bg-purple" />
          <div class="demo-date-picker">
            <div class="block">
              <el-date-picker
                v-model="selectedDateRange"
                type="daterange"
                unlink-panels
                range-separator="To"
                start-placeholder="Start date"
                end-placeholder="End date"
                :shortcuts="shortcuts"
                :size="size"
                @change="selectImgs"
              />
            </div></div
        ></el-col>
        <el-col :span="6">
          <el-select
            v-model="selectedWebsite"
            :placeholder="websitePlaceholder"
            @change="selectImgs"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6"
          ><div class="grid-content ep-bg-purple" />
          <el-input
            v-model="inputKeyword"
            placeholder="Please input keywords"
            @change="selectImgs"
        /></el-col>
        <el-col :span="1">
          <el-checkbox
            v-model="checked1"
            label="select all"
            size="large"
            id="selectAll"
            @change="selectAllFunc()"
          />
        </el-col>
      </el-row>
    </div>
    <div class="showBar">
      <div v-for="img in showedImgs" :key="toRaw(img).id">
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
                <el-col :span="5"></el-col>
                <el-col :span="6"
                  ><div class="grid-content ep-bg-purple" />
                  <span>Website: {{ img.website }}</span></el-col
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

    <div class="btns">
      <el-button type="danger" @click="deleteAllSelected" plain
        >Delete</el-button
      >
    </div>
    <div class="foot">
      <el-pagination
        :page-size="pageSize"
        :pager-count="11"
        layout="prev, pager, next"
        :total="imgs.length"
        @current-change="handleCurrentChange"
      />
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
import { ref } from "vue";

/**
 * @vue-data {Boolean} showImg - decide whether to show the image dialog
 * @vue-data {Boolean} showNote - decide whether to show the note dialog
 * @vue-data {Boolean} editNote - decide whether to show the edit note dialog
 * @vue-data {String} note - the note to show
 * @vue-data {String} NoteText - the note to edit
 * @vue-data {Number} NoteId - the id of the note to edit (actually the id of the image)
 * @vue-data {Number} pageSize - the number of images to show in one page
 * @vue-data {Number} currentPage - the current page number
 * @vue-data {Array} options - the options for the website select
 * @vue-data {Array} shortcuts - the shortcuts for the date picker
 * @vue-data {String} size - the size of the date picker
 * @vue-data {String} NameValue - the name of the website
 * @vue-data {Array} imgs - the images to show
 * @vue-data {Array} showedImgs - the images to show in the current page
 * @vue-data {Array} selectedDateRange - the selected date range
 * @vue-data {String} selectedKeywords - the selected keywords
 * @vue-data {String} inputKeyword - the input keywords
 * @vue-data {Boolean} test - a flag for testing
 *
 * @vue-event {Null} displayedImages - display the images in the current page
 * @vue-event {Null} editNoteFunc - edit the note of an image
 * @vue-event {Null} deleteDataFunc - delete the data of an image
 * @vue-event {Null} selectAllFunc - select all images
 * @vue-event {Null} handlekeyWordsInput - handle the input of keywords( return the captures with the keyword)
 * @vue-event {Null} handleWebsiteChange - handle the change of the website( return the captures of the website)
 */

export default {
  name: "HTreeSearch",
  data() {
    return {
      value: ref(""),
      showImg: false,
      showImgUrl: "",
      showNote: false,
      editNote: false,
      note: "",
      pageSize: 6,
      currentPage: 1,
      options: [],
      NoteText: "",
      NoteId: 0,
      websitePlaceholder: "Please select website",
      shortcuts: [
        {
          text: "Last week",
          value: () => {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            return [start, end];
          },
        },
        {
          text: "Last month",
          value: () => {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            return [start, end];
          },
        },
        {
          text: "Last 3 months",
          value: () => {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            return [start, end];
          },
        },
      ],
      size: "default",
      NameValue: ref(""),
      imgs: [],
      showedImgs: [],
      selectedDateRange: null,
      selectedKeywords: "",
      inputKeyword: "",
      Note2update: "",
      test: false,
      showImgHashValue: "",

      // for test
      startIndex: 0,
      endIndex: 0,
    };
  },
  mounted() {
    if (!this.test) {
      if (this.selectedDateRange == null) {
        this.imgs = getCaptures().then((data) => {
          this.imgs = toRaw(data._embedded.captures);
          this.displayedImages();
        });
      }
      this.getWebsites();
    }
  },
  computed: {
    computedPlaceholder() {
      return this.selectedWebsite !== "" && this.selectedWebsite !== undefined
        ? this.selectedWebsite
        : "Please select website";
    },
  },
  methods: {
    displayedImages() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      var list = [];
      for (var i = startIndex; i <= endIndex; i++) {
        if (i < this.imgs.length) list.push(this.imgs[i]);
      }
      this.startIndex = startIndex;
      this.endIndex = endIndex;
      console.log(this.imgs);
      if (!this.test) this.insertwebsite(list);
    },
    async insertwebsite(list) {
      for (var i = 0; i < list.length; i++) {
        const pageName = await getPageNamePromisebyID(list[i].id);
        list[i].website = pageName;
      }
      this.showedImgs = list;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.displayedImages();
    },
    async editNoteFunc(id) {
      this.editNote = true;
      this.NoteId = id;
      this.NoteText = await getNoteByCaptureId(id);
    },
    deleteDataFunc() {
      this.deleteData = true;
    },
    selectAllFunc() {
      if (document.getElementById("selectAll").checked) {
        for (let i = 0; i < this.imgs.length; i++) {
          this.imgs[i].selected = true;
        }
      } else {
        for (let i = 0; i < this.imgs.length; i++) {
          this.imgs[i].selected = false;
        }
      }
    },
    async getWebsites() {
      const optionsList = await getAllWebsitesName();
      this.options = this.convertOptions(optionsList);
      console.log(this.options);
    },
    async selectImgs() {
      if (this.selectedWebsite == "") {
        this.websitePlaceholder = "Please select website";
      } else {
        this.websitePlaceholder = this.selectedWebsite;
      }
      var tempImgs = [];
      if (this.selectedDateRange != null) {
        console.log(this.selectedDateRange[0], this.selectedDateRange[1]);
        var timeData = await getCaptureByTimeRange(
          this.selectedDateRange[0],
          this.selectedDateRange[1]
        );

        if (timeData.length == 0) {
          this.imgs = [];
          this.displayedImages();
          return;
        } else {
          tempImgs = timeData;
        }
      } else {
        getCaptures().then((data) => {
          tempImgs = toRaw(data._embedded.captures);
        });
      }

      if (this.selectedWebsite != "" && this.selectedWebsite != undefined) {
        console.log(this.selectedWebsite);
        const pages = await getPagesByURL(this.selectedWebsite);
        var websiteImgs = [];
        for (var i = 0; i < pages.length; i++) {
          const captures = await getCapturesByURL(
            pages[i]._links.captures.href
          );
          for (var j = 0; j < captures.length; j++) {
            websiteImgs.push(captures[j]);
          }
        }
        tempImgs = tempImgs.filter((item) => {
          return websiteImgs.some((item2) => {
            return item.id === item2.id;
          });
        });
        console.log(tempImgs);
      }

      if (this.inputKeyword != "") {
        console.log(this.inputKeyword);
        console.log(tempImgs);
        var KeywordsImgs = await getCapturesByKeyword(this.inputKeyword);
        console.log(KeywordsImgs);
        tempImgs = tempImgs.filter((item) => {
          return KeywordsImgs.some((item2) => {
            return item.id === item2.id;
          });
        });
      }

      this.imgs = tempImgs;
      this.displayedImages();
    },
    convertOptions(originalOptions) {
      const convertedOptions = originalOptions.map((item) => {
        return {
          value: item,
          label: item,
        };
      });
      return convertedOptions;
    },
    async updateNote() {
      if (this.NoteId == 0) return;
      await updateNotesById(this.NoteId, this.NoteText);
      this.NoteId = 0;
      this.NoteText = "";
      this.editNote = false;
    },
    handleDelete(id) {
      deleteById(id).then(() => {
        this.imgs = getCaptures().then((data) => {
          this.imgs = toRaw(data._embedded.captures);
          this.displayedImages();
        });
        this.getWebsites();
      });
    },
    deleteAllSelected() {
      for (var i = 0; i < this.imgs.length; i++) {
        if (this.imgs[i].selected) {
          deleteById(this.imgs[i].id);
          //reload
          this.imgs = getCaptures().then((data) => {
            this.imgs = toRaw(data._embedded.captures);
            this.displayedImages();
          });
        }
      }
      this.getWebsites();
    },
    async getNote(id) {
      const note = await getNoteByCaptureId(id);
      this.note = note;
      this.showNote = true;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.demo-date-picker {
  display: flex;
  width: 100%;
  padding: 0;
  flex-wrap: wrap;
}

.demo-date-picker .block {
  padding: 15px 0;
  text-align: left;
  border-right: solid 1px var(--el-border-color);
}

.demo-date-picker .block:last-child {
  border-right: none;
}

.demo-date-picker .demonstration {
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
  width: 340px;
}

.searchBar {
  width: 100%;
  height: 80px;
}

.el-select {
  padding: 15px;
}

.el-input {
  height: 32px;
  width: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.showBar {
  width: 100%;
  height: 75%;
}

.foot {
  width: 100%;
  height: 5%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card {
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: left;
  align-items: center;
  margin: 24px;
}

.el-card__body {
  padding: 5px;
}

#confirmBtn {
  margin-right: 20px;
}

.el-checkbox {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.btns {
  height: 5%;
  display: flex;
  justify-content: left;
  align-items: left;
  padding-left: 50px;
}

.thumbnail-container {
  width: 20px;
  height: 30px;
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
