import 'vue'
declare module 'vue' {
  // GlobalComponents for Volar
  export interface GlobalComponents {
    SchemaForm: (typeof import('@formvk/antdv'))['SchemaForm']
    CrudTable: (typeof import('@formvk/antdv'))['CrudTable']
    DataTable: (typeof import('@formvk/antdv'))['DataTable']
    SearchForm: (typeof import('@formvk/antdv'))['SearchForm']
    AddPopup: (typeof import('@formvk/antdv'))['AddPopup']
    EditPopup: (typeof import('@formvk/antdv'))['EditPopup']
    PopupForm: (typeof import('@formvk/antdv'))['PopupForm']
    ModalForm: (typeof import('@formvk/antdv'))['ModalForm']
    DrawerForm: (typeof import('@formvk/antdv'))['DrawerForm']
  }
}

export {}
