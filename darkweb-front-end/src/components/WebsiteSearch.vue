<script setup>
import { Search, Edit, Comment } from "@element-plus/icons-vue";
import {
  getAllWebsitesName,
  getAllWebsitesId,
  getPagesByWebsiteId,
  getCapturesBypageId,
  getWebsiteNameByWebsiteId,
  updateWebsiteNoteById,
  getWebsiteNoteByWebsiteId,
  getNoteByCaptureId,
  updateNotesById,
} from "../api/main";
import { toRaw } from "vue";
</script>
<template>
  <div>
    <div class="searchBar">
      <el-row :gutter="20">
        <el-col :span="8"></el-col>
        <el-col :span="6">
          <el-select
            v-model="selectedWebsiteId"
            placeholder="select websites"
            @change="loadWebsite"
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
      </el-row>
    </div>
    <div class="showBar"></div>

    <div class="noteText" v-if="selectedWebsiteId != ''">
      <el-input
        v-model="websiteNoteText"
        class="noteText-input"
        :rows="4"
        type="textarea"
        :placeholder="websiteNoteText"
      />
      <span id="confirmBtn">
        <el-button type="primary" @click="updateNote" class="noteText-footer"
          >Confirm</el-button
        >
      </span>
    </div>

    <el-collapse @change="handleChange">
      <el-collapse-item
        v-for="page in pagesList"
        v-model="activateNames"
        :name="page.id"
        :key="page.id"
      >
        <template #title>
          <div class="text-box">
            <div class="left-part">{{ page.pgTitle }}</div>
            <div class="right-part">
              {{ selectedWebsite + page.pgURL }}
            </div>
          </div>
        </template>
        <div class="showBar">
          <div v-for="img in capturesList[page.id]" :key="toRaw(img).id">
            <div class="card">
              <el-col :span="23">
                <el-card shadow="hover">
                  <el-row :gutter="20" class="content">
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
                    <el-col :span="7"></el-col>
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
                  </el-row>
                </el-card>
              </el-col>
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>

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
    <el-dialog v-model="showNote" title="Notes" width="80%">
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
          <el-button type="primary" @click="updateCaptureNote"
            >Confirm</el-button
          >
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
import {} from "vue";

/**
 * @vue-data {Object} optionsList - The list of websites
 * @vue-data {String} selectedWebsiteId - The selected website id
 * @vue-data {String} selectedWebsite - The selected website name
 * @vue-data {Array} pagesList - The list of pages
 * @vue-data {Array} capturesList - The list of captures
 * @vue-data {Array} activateNames - The list of activated names, default is ["1"]
 * @vue-data {Boolean} isCradDataLoaded - The flag to indicate if the card data is loaded
 * @vue-data {Boolean} showImg - The flag to indicate if the image is shown
 * @vue-data {String} showImgUrl - The image url
 * @vue-data {Boolean} showNote - The flag to indicate if the note is shown
 * @vue-data {String} note - The note content
 * @vue-data {String} NoteText - The note text to be shown in the image box
 * @vue-data {String} websiteNote - The note of the website
 *
 * @vue-event {Function} getWebsites - Get the list of websites
 * @vue-event {Function} convertOptions - Convert the original options to the converted options(insert the value and label)
 * @vue-event {Function} loadWebsite - Load the website by the selected website id
 * @vue-event {Function} localGetCapturesBypageId - Get the captures by the page id and return the images
 * @vue-event {Function} editNoteFunc - Edit the note function, set the editNote flag to true, set the NoteId and NoteText
 * @vue-event {Function} updateNote - Update the note to the backend
 *
 */

export default {
  name: "HTreeSearch",
  data() {
    return {
      optionsList: [],
      options: [],
      selectedWebsiteId: "",
      selectedWebsite: "",
      pagesList: [],
      capturesList: [],
      activateNames: ["1"],
      isCradDataLoaded: false,

      showImg: false,
      showImgUrl: "",
      showImgHashValue: "",
      showNote: false,
      editNote: false,
      note: "",

      NoteText: "",
      websiteNoteText: "Please Input website note",

      test: false,
    };
  },
  mounted() {},
  created() {
    if (!this.test) this.getWebsites();
  },
  computed: {},
  methods: {
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
    async loadWebsite() {
      this.selectedWebsite = await getWebsiteNameByWebsiteId(
        this.selectedWebsiteId
      );
      this.pagesList = await getPagesByWebsiteId(this.selectedWebsiteId);
      this.capturesList = [];
      for (let i = 0; i < this.pagesList.length; i++) {
        this.capturesList[this.pagesList[i].id] =
          await this.localGetCapturesBypageId(this.pagesList[i].id);
      }

      this.websiteNoteText = await getWebsiteNoteByWebsiteId(
        this.selectedWebsiteId
      );

      if (this.websiteNoteText == null || this.websiteNoteText == "") {
        this.websiteNoteText = "Please Input website note";
      }
    },
    async localGetCapturesBypageId(pageId) {
      const imgs = await getCapturesBypageId(pageId);
      return imgs;
    },
    async editNoteFunc(id) {
      this.editNote = true;
      this.NoteId = id;
      this.NoteText = await getNoteByCaptureId(id);
    },
    updateNote() {
      updateWebsiteNoteById(this.websiteNoteText, this.selectedWebsiteId);
    },
    async getNote(id) {
      const note = await getNoteByCaptureId(id);
      this.note = note;
      this.showNote = true;
    },
    async updateCaptureNote() {
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
.noteText-footer {
  margin: 20px;
}

.noteText-input {
  width: 70%;
}

.noteText {
  display: flex;
  justify-content: center;
  margin: 20px;
}

.text-box {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.left-part {
  text-align: left;
}

.right-part {
  text-align: right;
}

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
  height: 80%;
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

.thumbnail-container {
  width: 20px;
  height: 30px;
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.el-card {
  --el-card-padding: 18px;
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
