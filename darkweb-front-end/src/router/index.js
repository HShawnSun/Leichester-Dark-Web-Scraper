import { createRouter, createWebHashHistory } from "vue-router";
import HelloWorld from "../components/HelloWorld.vue";
import TreeSearch from "../components/TreeSearch.vue";
import Manage from "../components/Manage.vue";
import TimeSearch from "../components/TimeSearch.vue";
import WebsiteSearch from "../components/WebsiteSearch.vue";

const routes = [
  { path: "/", component: HelloWorld, name: "HelloWorld" },
  { path: "/treeSearch", component: TreeSearch, name: "TreeSearch" },
  { path: "/manage", component: Manage, name: "Manage" },
  { path: "/timeSearch", component: TimeSearch, name: "TimeSearch" },
  { path: "/websiteSearch", component: WebsiteSearch, name: "WebsiteSearch" },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
