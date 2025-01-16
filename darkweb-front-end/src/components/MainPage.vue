<template>
  <el-container>
    <el-header height="80px">
      <div class="headText">
        <h1>Dark Web Marketplace Evidential Scraper</h1>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-row class="tac">
          <el-col :span="24">
            <!-- <h5 class="mb-2">Side bar</h5> -->
            <el-menu
              active-text-color="#ffd04b"
              background-color="#545c64"
              class="el-menu-vertical-demo"
              :default-active="activateIndex"
              text-color="#fff"
              @open="handleOpen"
              @close="handleClose"
            >
              <el-menu-item index="1" @click="MainMenu">
                <el-icon><icon-menu /></el-icon>
                <span> Main Menu </span>
              </el-menu-item>

              <el-menu-item index="2" @click="Manage">
                <el-icon><icon-menu /></el-icon>
                <span>Manage</span>
              </el-menu-item>
              <el-sub-menu index="3">
                <template #title>
                  <el-icon><location /></el-icon>
                  <span>Search</span>
                </template>

                <el-menu-item index="1-1" @click="TreeSearch">
                  Tree Search
                </el-menu-item>
                <el-menu-item index="1-2" @click="TimeSearch"
                  >Time Search</el-menu-item
                >
                <el-menu-item index="1-3" @click="WebsiteSearch"
                  >Website Search</el-menu-item
                >
              </el-sub-menu>
            </el-menu>
          </el-col>
        </el-row>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
/**
 * @vue-event {Null} MainMenu - Redirects to the main menu page
 * @vue-event {Null} TreeSearch - Redirects to the tree search page
 * @vue-event {Null} SelectSearch - Redirects to the select search page
 * @vue-event {Null} Manage - Redirects to the manage page
 * @vue-event {Null} TimeSearch - Redirects to the time search page
 * @vue-event {Null} WebsiteSearch - Redirects to the website search page
 * @vue-event {Null} Settings - Redirects to the settings page
 *
 */
export default {
  name: "MainPage",
  data() {
    return {
      dialogVisibleEdit: false,
      dialogVisibleChangeUser: false,
      activateIndex: "1",
    };
  },
  mounted() {},
  methods: {
    MainMenu() {
      this.$router.push("/");
    },
    TreeSearch() {
      this.$router.push("/treeSearch");
    },
    Manage() {
      this.$router.push("/manage");
    },
    TimeSearch() {
      this.$router.push("/timeSearch");
    },
    WebsiteSearch() {
      this.$router.push("/websiteSearch");
    },
  },
};
</script>

<style scoped>
.el-container {
  height: 100%;
}

.el-aside {
  background-color: #8faab8;
}

.el-header {
  background-color: #a2bbc5;
  color: #333;
  line-height: 60px;
  display: flex;
  align-items: center;
}

.el-card {
  --el-card-padding: 10px;
}

.headText {
  font-size: 25px;
  font-weight: bold;
}

h1 {
  margin: 0 auto;
}

.name {
  margin-left: auto;
  margin-right: 20px;
  display: flex;
  align-items: center;
}

.el-dropdown-link {
  font-size: 18px;
}

.el-icon--right {
  margin-top: 0px;
}

.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
}

.username {
  display: flex;
  align-items: center;
}

.headImg {
  margin-right: 20px;
  margin-top: 24px;
}

.demo-basic {
  text-align: center;
}
.demo-basic .sub-title {
  margin-bottom: 10px;
  font-size: 14px;
  color: var(--el-text-color-secondary);
}
.demo-basic .demo-basic--circle,
.demo-basic .demo-basic--square {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.demo-basic .block:not(:last-child) {
  border-right: 1px solid var(--el-border-color);
}
.demo-basic .block {
  flex: 1;
}
.demo-basic .el-col:not(:last-child) {
  border-right: 1px solid var(--el-border-color);
}
</style>
