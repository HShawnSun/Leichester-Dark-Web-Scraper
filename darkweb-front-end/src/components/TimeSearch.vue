<script setup>
import { Search, Comment, Edit } from "@element-plus/icons-vue";
import {
  getCaptures,
  getPageNamePromisebyID,
  getNoteByCaptureId,
  updateNotesById,
} from "../api/main";
import { toRaw } from "vue";
</script>
<template>
  <div>
    <el-tree
      class="filter-tree"
      :data="data"
      :props="defaultProps"
      :node-key="(node) => node.id"
      :default-expanded-keys="[0]"
      accordion
      @node-click="handleNodeClick"
    >
      <template v-slot="{ node, data }">
        <div>
          <span v-if="!node.isLeaf">{{ node.label }}</span>
          <span v-else :style="{ '--el-checkbox-height': '50px' }">
            <div v-if="node.isLeaf" class="card">
              <!-- Your card content goes here -->
              <el-col :span="23">
                <el-card shadow="hover">
                  <!-- Your card content -->
                  <el-row :gutter="20" class="content">
                    <el-col :span="1">
                      <div class="thumbnail-container">
                        <el-image
                          class="thumbnail-image"
                          style="width: 100%; height: 100%"
                          :src="data.url"
                          fit="contain"
                          @click="
                            showImg = true;
                            showImgUrl = data.url;
                            showImgHashValue = data.contentHash;
                          "
                        ></el-image>
                      </div>
                    </el-col>
                    <el-col :span="6"
                      ><div class="grid-content ep-bg-purple" />
                      <span
                        >Date:
                        {{
                          data.date.toLocaleString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                            second: "numeric",
                            timeZoneName: "short",
                          })
                        }}</span
                      ></el-col
                    >
                    <el-col :span="12"
                      ><div class="grid-content ep-bg-purple" />
                      <span class="website-tooltip" ref="websiteSpan"
                        >Website: {{ data.website }}</span
                      ></el-col
                    >
                    <el-col :span="1"
                      ><el-button
                        :icon="Search"
                        circle
                        @click="
                          showImg = true;
                          showImgUrl = data.url;
                          showImgHashValue = data.contentHash;
                        "
                      />
                      <div class="grid-content ep-bg-purple" />
                    </el-col>
                    <el-col :span="1"
                      ><el-button
                        type="primary"
                        :icon="Comment"
                        circle
                        @click="getNote(data.id)"
                      />
                      <div class="grid-content ep-bg-purple" />
                    </el-col>
                    <el-col :span="1"
                      ><el-button
                        type="info"
                        :icon="Edit"
                        circle
                        @click="editNoteFunc(data.id)"
                      />
                      <div class="grid-content ep-bg-purple" />
                    </el-col>
                  </el-row>
                </el-card>
              </el-col>
            </div>
          </span>
        </div>
      </template>
    </el-tree>
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
      {{ Cardnote }}
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showNote = false">Cancel</el-button>
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
// import { ref } from "vue";

/**
 * @vue-data {Array} data - The data to be displayed in the tree
 * @vue-data {Object} defaultProps - The default properties for the tree
 * @vue-data {String} showImgUrl - The URL of the image to be displayed
 * @vue-data {String} Cardnote - The note to be displayed
 * @vue-data {Boolean} showNote - Whether to show the note
 * @vue-data {Boolean} showImg - Whether to show the image
 * @vue-data {Array} imgs - The images to be displayed
 *
 * @vue-event {Null} mainFunc - The main function to be executed, including getting the captures, inserting the websites, and formatting the data
 * @vue-event {Object} handleNodeClick - Handles the node click event. If the node has a card, it shows the card; otherwise, it hides the card
 * @vue-event {Null} formatData - Formats the data, transforming the captures into a tree structure by its time
 * @vue-event {Array} generateList - Generates a list of numbers from 0 to n, sub function of formatData
 * @vue-event {Null} insertWebsites - Inserts the websites into the images
 */

export default {
  data() {
    return {
      data: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      showImgUrl: "",
      Cardnote: "",
      showNote: false,
      editNote: false,
      showImg: false,
      imgs: [],
      showImgHashValue: "",
      test: false,
      NoteText: "",
      NoteId: 0,
    };
  },
  mounted() {
    if (!this.test) this.mainFunc();
  },
  computed: {},
  methods: {
    async mainFunc() {
      const data = await getCaptures();
      this.imgs = toRaw(data._embedded.captures);
      await this.insertWebsites();
      this.formatData();
    },
    handleNodeClick(data) {
      console.log(data);
      if (data.showCard) {
        this.showCard = true;
        this.Carddate = data.date;
        this.Cardnote = data.note;
        this.Cardurl = data.url;
        this.Cardwebsite = data.website;
      } else {
        this.showCard = false;
      }
    },
    formatData() {
      function getDate(node) {
        var combinedDateTimeStr = node.capDate + "T" + node.capTime;
        return new Date(combinedDateTimeStr);
      }

      function findOrCreateNode(arr, label) {
        const foundNode = arr.find((node) => node.label === label);
        if (foundNode) {
          return foundNode;
        } else {
          const newNode = {
            id: -1,
            label: label,
            children: [],
          };
          arr.push(newNode);
          return newNode;
        }
      }

      console.log(this.imgs);

      this.imgs.sort((a, b) => getDate(a) - getDate(b));

      this.imgs.forEach((img) => {
        const date = getDate(toRaw(img));
        const yearLabel = date.getFullYear().toString();
        const monthLabel = `${yearLabel}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}`;
        const dayLabel = monthLabel + "-" + date.getDate().toString();

        const yearNode = findOrCreateNode(this.data, yearLabel);
        const monthNode = findOrCreateNode(yearNode.children, monthLabel);
        const dayNode = findOrCreateNode(monthNode.children, dayLabel);

        if (img.website.length > 60) {
          img.website = img.website.substring(0, 60) + "...";
        }

        dayNode.children.push({
          url: img._links.self.href,
          website: img.website,
          contentHash: img.contentHash,
          note: img.notes,
          id: img.id,
          date: getDate(img),
          showCard: true,
        });
      });
    },
    generateList(n) {
      const result = [];
      for (let i = 0; i <= n; i++) {
        result.push(i);
      }
      return result;
    },
    async insertWebsites() {
      for (var i = 0; i < this.imgs.length; i++) {
        const data = await getPageNamePromisebyID(this.imgs[i].id);
        this.imgs[i].website = data;
        console.log(this.imgs[i].website);
      }
    },
    async getNote(id) {
      const note = await getNoteByCaptureId(id);
      this.Cardnote = note;
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
.el-tree {
  --el-tree-node-content-height: auto;
}
.thumbnail-container {
  width: 20px;
  height: 50px;
}
.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.filter-tree {
  font-size: 18px;
}

.el-tree-node__content {
  height: auto !important;
}

.el-card {
  --el-card-padding: 12px;
}

.card {
  margin-bottom: 10px;
  width: 1400px;
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
