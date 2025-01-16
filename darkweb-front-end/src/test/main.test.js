import { shallowMount } from "@vue/test-utils";
import { expect, describe, it } from "vitest";
import Manage from "../components/Manage.vue";
import HTreeSearch from "../components/TreeSearch.vue";
import HWebsiteSearch from "../components/WebsiteSearch.vue";

describe("Manage computed properties", () => {
  it("computedPlaceholder should return selectedWebsite if it is not empty", async () => {
    const wrapper = shallowMount(Manage, {
      data() {
        return {
          selectedWebsite: "example.com",
          test: true,
        };
      },
    });

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.computedPlaceholder).toBe("example.com");
  });

  it('computedPlaceholder should return "Please select website" if selectedWebsite is empty', async () => {
    const wrapper = shallowMount(Manage, {
      data() {
        return {
          selectedWebsite: "",
          test: true,
        };
      },
    });

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.computedPlaceholder).toBe("Please select website");
  });

  it('computedPlaceholder should return "Please select website" if selectedWebsite is undefined', async () => {
    const wrapper = shallowMount(Manage, {
      data() {
        return {
          selectedWebsite: undefined,
          test: true,
        };
      },
      stubs: {
        mounted: () => {},
      },
    });

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.computedPlaceholder).toBe("Please select website");
  });

  it("images should be computed by pagesize and current page", async () => {
    const wrapper = shallowMount(Manage, {
      data() {
        return {
          pagesize: 6,
          currentPage: 2,
          imgs: [
            { id: 1, pgTitle: "title1", pgContent: "content1" },
            { id: 2, pgTitle: "title2", pgContent: "content2" },
            { id: 3, pgTitle: "title3", pgContent: "content3" },
            { id: 4, pgTitle: "title4", pgContent: "content4" },
            { id: 5, pgTitle: "title5", pgContent: "content5" },
            { id: 6, pgTitle: "title6", pgContent: "content6" },
            { id: 7, pgTitle: "title7", pgContent: "content7" },
            { id: 8, pgTitle: "title8", pgContent: "content8" },
            { id: 9, pgTitle: "title9", pgContent: "content9" },
            { id: 10, pgTitle: "title10", pgContent: "content10" },
            { id: 11, pgTitle: "title11", pgContent: "content11" },
            { id: 12, pgTitle: "title12", pgContent: "content12" },
            { id: 13, pgTitle: "title13", pgContent: "content13" },
            { id: 14, pgTitle: "title14", pgContent: "content14" },
            { id: 15, pgTitle: "title15", pgContent: "content15" },
            { id: 16, pgTitle: "title16", pgContent: "content16" },
            { id: 17, pgTitle: "title17", pgContent: "content17" },
            { id: 18, pgTitle: "title18", pgContent: "content18" },
            { id: 19, pgTitle: "title19", pgContent: "content19" },
            { id: 20, pgTitle: "title20", pgContent: "content20" },
          ],
          test: true,
        };
      },
    });

    wrapper.vm.displayedImages();

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.startIndex).toBe(6);
    expect(wrapper.vm.endIndex).toBe(12);
  });

  // it("selectAllFunc should select all images that marked", async () => {
  //   const wrapper = shallowMount(Manage, {
  //     data() {
  //       return {
  //         imgs: [
  //           { id: 1, pgTitle: "title1", pgContent: "content1", marked: false },
  //           { id: 2, pgTitle: "title2", pgContent: "content2", marked: false },
  //           { id: 3, pgTitle: "title3", pgContent: "content3", marked: false },
  //           { id: 4, pgTitle: "title4", pgContent: "content4", marked: false },
  //           { id: 5, pgTitle: "title5", pgContent: "content5", marked: false },
  //           { id: 6, pgTitle: "title6", pgContent: "content6", marked: false },
  //         ],
  //         test: true,
  //       };
  //     },
  //   });

  //   wrapper.vm.selectAllFunc();

  //   await wrapper.vm.$nextTick();

  //   expect(wrapper.vm.imgs[0].selected).toBe(true);
  //   expect(wrapper.vm.imgs[1].selected).toBe(true);
  //   expect(wrapper.vm.imgs[2].selected).toBe(true);
  //   expect(wrapper.vm.imgs[3].selected).toBe(true);
  //   expect(wrapper.vm.imgs[4].selected).toBe(true);
  //   expect(wrapper.vm.imgs[5].selected).toBe(true);
  // });
});

describe("TreeSearch", () => {
  it("should convert original options to select options format", () => {
    const wrapper = shallowMount(HTreeSearch, {
      data() {
        return {
          test: true,
        };
      },
    });

    const originalOptions = ["Option 1", "Option 2", "Option 3"];
    const originalOptionsId = [1, 2, 3];
    const result = wrapper.vm.convertOptions(
      originalOptions,
      originalOptionsId
    );

    const expectedResult = [
      { value: 1, label: "Option 1" },
      { value: 2, label: "Option 2" },
      { value: 3, label: "Option 3" },
    ];

    expect(result).toEqual(expectedResult);
  });

  it("should return an empty array when original options are empty", () => {
    const wrapper = shallowMount(HTreeSearch, {
      data() {
        return {
          test: true,
        };
      },
    });

    const originalOptions = [];
    const originalOptionsId = [];
    const result = wrapper.vm.convertOptions(
      originalOptions,
      originalOptionsId
    );

    expect(result).toEqual([]);
  });
});

describe("WebsiteSearch", () => {
  it("should set editNote to true and set NoteId and NoteText", () => {
    const wrapper = shallowMount(HWebsiteSearch, {
      data() {
        return {
          test: true,
        };
      },
    });

    wrapper.vm.editNoteFunc(1, "Sample Note");

    expect(wrapper.vm.editNote).toBe(true);
    expect(wrapper.vm.NoteId).toBe(1);
    expect(wrapper.vm.NoteText).toBe("Sample Note");
  });
  it("should convert original options to select options format", () => {
    const wrapper = shallowMount(HWebsiteSearch, {
      data() {
        return {
          test: true,
        };
      },
    });

    const originalOptions = ["Option 1", "Option 2", "Option 3"];
    const originalOptionsId = [1, 2, 3];
    const result = wrapper.vm.convertOptions(
      originalOptions,
      originalOptionsId
    );

    const expectedResult = [
      { value: 1, label: "Option 1" },
      { value: 2, label: "Option 2" },
      { value: 3, label: "Option 3" },
    ];

    expect(result).toEqual(expectedResult);
  });

  it("should return an empty array when original options are empty", () => {
    const wrapper = shallowMount(HWebsiteSearch, {
      data() {
        return {
          test: true,
        };
      },
    });

    const originalOptions = [];
    const originalOptionsId = [];
    const result = wrapper.vm.convertOptions(
      originalOptions,
      originalOptionsId
    );

    expect(result).toEqual([]);
  });
});
