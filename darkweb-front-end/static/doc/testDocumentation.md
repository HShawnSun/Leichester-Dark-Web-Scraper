## Unit Test

### Manage.vue

| item                                                         | data                            | return                       | pass or not |
| ------------------------------------------------------------ | ------------------------------- | ---------------------------- | ----------- |
| computedPlaceholder should return selectedWebsite if it is not empty | selectedWebsite: "example.com", | "example.com"                | pass        |
| computedPlaceholder should return "Please select website" if selectedWebsite is empty | selectedWebsite: "",            | "Please select website"      | pass        |
| 'computedPlaceholder should return "Please select website" if selectedWebsite is undefined' | selectedWebsite: undefined,     | "Please select website"      | pass        |
| images should be computed by pagesize and current page       | pagesize: 6,currentPage: 2,     | startIndex=6 & endIndex = 12 | pass        |
| selectAllFunc should select all images that marked           | imgs                            | all imgs has been selected   | pass        |

### TreeSearch.vue

| item                                                         | data                                            | return                                                       | pass or not |
| ------------------------------------------------------------ | ----------------------------------------------- | ------------------------------------------------------------ | ----------- |
| convertOptions function should convert original options to select options format | ["Option 1", "Option 2", "Option 3"] [1, 2, 3]; | { value: 1, label: "Option 1" }, { value: 2, label: "Option 2" },   { value: 3, label: "Option 3" }, | pass        |
| convertOptions function should return an empty array when original options are empty | [] []                                           | []                                                           | pass        |

### WebsiteSearch.vue

| item                                                         | data                                            | return                                                       | pass or not |
| ------------------------------------------------------------ | ----------------------------------------------- | ------------------------------------------------------------ | ----------- |
| editNoteFunc method should set editNote to true and set NoteId and NoteText | 1, "Sample Note"                                | NoteId=1, NoteText="Sample Note"                             | pass        |
| convertOptions function should convert original options to select options format | ["Option 1", "Option 2", "Option 3"] [1, 2, 3]; | { value: 1, label: "Option 1" }, { value: 2, label: "Option 2" },   { value: 3, label: "Option 3" }, | pass        |
| convertOptions function should return an empty array when original options are empty | [] []                                           | []                                                           | pass        |

## Integration Test

### MainPage

| item                              | parameter | display                                  | pass or not |
| --------------------------------- | --------- | ---------------------------------------- | ----------- |
| download number of captures graph | None      | the browser download a png automatically | pass        |
| two graph can display normally    | None      | two graph                                | pass        |



### Manage

| item                                                         | parameter                                    | display  | pass or not |
| ------------------------------------------------------------ | -------------------------------------------- | -------- | ----------- |
| The page can display all captures upon initial opening.      | None                                         | captures | pass        |
| delete, show pictures, show notes and edit notes             | None                                         | None     | pass        |
| change date range, the display items will also change        | None                                         | None     | pass        |
| change website, the display items will also change           | None                                         | None     | pass        |
| input keywords"Nottingham", return all captures related to Nottingham | Nottingham                                   | None     | pass        |
| input no keywords, items unchanged                           | None or blank                                | None     | pass        |
| select multiple items and delete                             | None                                         | None     | pass        |
| select time range, website and keywords, check whether it can search all of them | 2024-3-4 to 2-24-3-30 nottingham.ac.uk Study | 1 item   | pass        |

### Tree Search

| item                                                         | parameter        | display            | pass or not |
| ------------------------------------------------------------ | ---------------- | ------------------ | ----------- |
| select a website, show its first page                        | Nottingham.ac.uk | Postgraduate study | pass        |
| show capture card after input the website                    | None             | None               | pass        |
| the basic function in capture card(delete, show pictures, show notes and edit notes) | None             | None               | pass        |
| click the child node, it  will become the head node and show its child pages | None             | None               | pass        |

### Time Search

| item                                                         | parameter | display                 | pass or not |
| ------------------------------------------------------------ | --------- | ----------------------- | ----------- |
| Show yeaar, month and date                                   | None      | 2024 2024-03 2024-03-14 | pass        |
| click the date node, show all captures related to that date  | None      | show items              | pass        |
| the basic function in capture card(show pictures, show notes) | None      | None                    | pass        |

### Website Search

| item                                                         | parameter        | display                             | pass or not |
| ------------------------------------------------------------ | ---------------- | ----------------------------------- | ----------- |
| choose website, show website name and their pages            | nottingham.ac.uk | pages                               | pass        |
| clike page, show their captures                              | None             | None                                | Pass        |
| the basic function in capture card(show pictures, show notes, edit notes) | None             | None                                | pass        |
| display and input website note                               | This is a test   | update and display `This is a test` | pass        |
