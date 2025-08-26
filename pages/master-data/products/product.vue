<template>
   <div>
      <div id="filter-search" class="bg-purple-25 py-4 px-6 rounded-xl mb-6">
         <div class="grid grid-cols-9 gap-4">
            <div class="col-span-3">
               <Input
                  :label="'ชื่อสินค้า'"
                  name="keyword"
                  v-model="filter.keyword"
                  :placeholder="$t('search_title_placeholder')"
                  icon="i-heroicons-magnifying-glass-20-solid"
               />
            </div>
            <div class="col-span-2">
               <UFormGroup :label="$t('search_status')">
                  <USelectMenu
                     class="max-w-[512px]"
                     color="purple"
                     variant="outline"
                     v-model="filter.status"
                     value-attribute="status"
                     option-attribute="text"
                     :options="statusList"
                     :placeholder="$t('search_status_placeholder')"
                     :ui="{
                        base: 'h-[36px] bg-white',
                        wrapper: 'rounded-md bg-white',
                     }"
                     @change="() => getProductList()"
                  />
               </UFormGroup>
            </div>
            <div class="col-span-4 flex justify-end h-full">
               <div class="mt-6">
                  <UButton @click="handleClickResetFitler" icon="i-heroicons-arrow-path" />
               </div>
            </div>
         </div>
      </div>
      <div id="request-form-content" class="bg-white rounded-[20px]">
         <div class="flex items-center justify-between py-5 px-6 bg-primaryy-500 rounded-t-[20px]">
            <div class="flex justify-between">
               <h1 class="font-normal text-lg text-white">{{ $t("product_topic") }}</h1>
               <div class="rounded-full bg-purple-25 text-sm py-1 px-2 ml-2">{{ total }} {{ $t("product_total") }}</div>
            </div>
            <div>
               <ProductDialog @fetch="getProductList">
                  <template #activator="{ on }">
                     <UButton
                        class="bg-white hover:bg-white text-grayy-400 [&_span]:font-anuphan-semi-bold"
                        outlined
                        icon="i-heroicons-plus-circle"
                        size="md"
                        label="เพิ่ม"
                        v-on="on"
                     />
                  </template>
               </ProductDialog>
            </div>
         </div>
         <UTable
            @select="selectRow"
            :columns="columns"
            :rows="productList"
            :ui="{
               base: 'u-table-list',
            }"
         >
            <template v-for="column in filteredColumns" :key="column.key" v-slot:[`${column.key}-header`]>
               <div @click="toggleSort(column.key)" class="cursor-pointer flex items-center">
                  <span>{{ column.label }}</span>
                  <span v-if="sortField === column.key && sortOrder === 'asc'">
                     <span class="i-heroicons-bars-arrow-up-20-solid ml-2 w-5 h-5"></span>
                  </span>
                  <span v-else-if="sortField === column.key && sortOrder === 'desc'">
                     <span class="i-heroicons-bars-arrow-down-20-solid ml-2 w-5 h-5"></span>
                  </span>
                  <span v-else>
                     <span class="i-heroicons-arrows-up-down-20-solid ml-2 w-5 h-5"></span>
                  </span>
               </div>
            </template>

            <template #id-data="{ index }">
               <div class="text-center">
                  {{ getNumCountPagination(index, filter.page, filter.limit) }}
               </div>
            </template>
            <template #status-data="{ row }">
               <Badge
                  :label="row.status === true ? $t('product_table_status_activate') : $t('product_table_status_disable')"
                  :type="row.status === true ? 'success' : 'error'"
               />
            </template>
            <template #updated_at-data="{ row }">
               <div>
                  {{ renderDateFormat(row.updated_at) }}
                  <div class="text-grayy-75">{{ renderTimeFormat(row.updated_at) }}</div>
               </div>
            </template>
            <template #actions-data="{ row }">
               <div class="text-right">
                  <UDropdown
                     @click.stop
                     :items="getMenuTable(row)"
                     :ui="{
                        rounded: 'rounded-lg',
                        width: 'max-w-[158px]',
                        item: {
                           base: 'hover:bg-grayy-50',
                           label: 'font-anuphan-medium text-grayy-400 ml-1',
                           size: 'text-sm',
                           avatar: {
                              base: '[&_img]:rounded-none [&_img]:w-4 [&_img]:h-4',
                           },
                           padding: 'p-[8px_6px_8px_12px]',
                        },
                     }"
                  >
                     <NuxtIcon name="menu-dots-vertical" size="lg" color="text-[#374957]" />
                  </UDropdown>
               </div>
            </template>
            <template #empty-state>
               <EmptyNotFoundTable />
            </template>
         </UTable>
         <div class="flex justify-between px-6 py-3">
            <div class="flex items-center">
               <span class="text-sm text-grayy-75 mr-3.5">แสดง</span>
               <USelect :options="limitRowTable" v-model="filter.limit" />
            </div>

            <UPagination
               :prev-button="{ icon: 'i-heroicons-arrow-small-left-20-solid', label: 'Prev', color: 'gray' }"
               :next-button="{ icon: 'i-heroicons-arrow-small-right-20-solid', trailing: true, label: 'Next', color: 'gray' }"
               v-model="filter.page"
               :total="paginationData.totalItems"
               :page-count="filter.limit"
            />
         </div>
      </div>
      <ProductDialog
         edit-mode
         @fetch="getProductList"
         class="flex justify-center"
         hide-button
         :product-id="rowId"
         :data="rowData"
         :set-open="isOpenForm"
         @close="setDialogEdit(false)"
      />
      <DialogConfirm
         :title="`${rowData?.status ? 'ปิด' : 'เปิด'}การใช้งาน`"
         :desc="`คุณต้องการ${rowData?.status ? 'ปิด' : 'เปิด'}ใช่หรือไม่`"
         icon="warning"
         :isDialogOpen="isOpenStatus"
         :dialogCancel="dialogCancel"
         :dialogConfirm="() => activateProduct(rowData?.status)"
      />
      <DialogAlert title="บันทึกข้อมูล" desc="ข้อมูลนี้ถูกบันทึกแล้ว" type="success" :isOpen="isDialogSuccessOpen" :setDialog="handleCloseSuccessDialog" />
      <Loading v-if="isLoading" />
   </div>
</template>
<script setup lang="ts">
import Input from "~/components/form/u-input.vue";

import { format, isSameDay, sub } from "date-fns";
import USelect from "~/components/form/u-select.vue";
import Loading from "~/components/loading";
import ProductDialog from "~/components/dialog/master-data/product/product-form.vue";
import DialogConfirm from "~/components/dialog/confirm";
import DialogAlert from "~/components/dialog/alert.vue";
import Badge from "~/components/badge/badge.vue";
import NuxtIcon from "~/components/ui/nuxtIcon.vue";
import EditIcon from "~/assets/icons/fi-rs-edit-2.svg";
import CrossIcon from "~/assets/icons/fi-rs-cross.svg";
import CheckIcon from "~/assets/icons/fi-rs-check.svg";
import EmptyNotFoundTable from "~/components/ui/emptyNotFoundTable.vue";

import { convertObjToQueryString, renderDateFormat, renderTimeFormat } from "~/utils/function.js";
import masterDataShipService from "~/core/services/masterDataShipService/product/productService.ts";
import { watch } from "vue";
const { t } = useI18n();
const toast = useToast();
const { getProduct, updateProduct } = masterDataShipService();
const sortField = ref("");
const sortOrder = ref("");
const columns = [
   {
      key: "id",
      label: t("product_table_order"),
      class: "w-[60px] text-center",
   },
   {
      key: "status",
      label: t("product_table_status"),
      class: "w-[97px] text-center",
   },

   {
      key: "name",
      label: t("product_table_name"),
   },
   {
      key: "product_group_name",
      label: t("product_group_name"),
      class: "w-[70px] text-center",
   },
   {
      key: "product_type_name",
      label: t("product_table_type_name"),
      class: "w-[70px] text-center",
   },
   {
      key: "updated_at",
      label: t("product_table_update_date"),
   },
   {
      key: "updated_by",
      label: t("product_table_update_by"),
   },
   {
      key: "actions",
      sortable: false,
   },
];
const filter = ref({ keyword: "", status: "", offset: 0, page: 1, limit: 10, Order: [{ column: sortField.value, dir: sortOrder.value }] });
const statusList = ref([
   { status: "", text: "ทุกประเภท" },
   { status: "true", text: "เปิดใช้งาน" },
   { status: "false", text: "ปิดใช้งาน" },
]);
const isLoading = ref(false);
let debounceTimer;
watch(
   () => filter.value.keyword,
   (newKeyword) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
         filter.value.offset = 0;
         filter.value.page = 1;
         getProductList();
      }, 800);
   }
);
watch(
   () => filter.value.page,
   (value) => {
      getProductList();
   }
);

watch(
   () => filter.value.limit,
   (value) => {
      filter.value.page = 1;
      getProductList();
   }
);
const rowData = ref(null);
const rowId = ref(0);
const getMenuTable = (row) => {
   const { status, name, path, created_at, created_by, id, updated_at, updated_by } = row;
   const items = [
      [
         {
            label: "แก้ไข",
            avatar: {
               src: EditIcon,
            },
            click: () => {
               rowData.value = { name: name, filePath: path, status: status };
               rowId.value = row.id;
               setDialogEdit(true);
            },
         },
         {
            label: `${status ? "ปิดการใช้งาน" : "เปิดการใช้งาน"}`,
            avatar: {
               src: `${status ? CrossIcon : CheckIcon}`,
            },
            click: () => {
               rowData.value = { ...row };
               rowId.value = row.id;
               setDialogStatus(true);
            },
         },
      ],
   ];
   return items;
};
const productList = ref([]);
const total = ref(0);
const isDialogProductOpen = ref(false);

onMounted(() => {
   getProductList();
});
const getProductList = async () => {
   try {
      isLoading.value = true;
      let queryString = convertObjToQueryString({
         limit: filter.value.limit,
         page: filter.value.page,
         search: filter.value.keyword,
         status: filter.value.status,
         Order: filter.value.Order,
      });
      const resp = await getProduct(queryString);
      if (resp.statusCode === 200) {
         const { data, totalItems, totalPages } = resp.data;
         productList.value = data;
         total.value = totalItems;
         paginationData.value.totalItems = totalItems;
         paginationData.value.totalPages = totalPages;
      }
   } catch (error) {
      console.error(error);
   } finally {
      isLoading.value = false;
   }
};
const handleClickResetFitler = () => {
   filter.value.keyword = "";
   filter.value.status = "";
   filter.value.offset = 0;
   filter.value.page = 1;
   filter.value.Order = [{ column: sortField.value, dir: sortOrder.value }];
   getProductList();
};
const paginationData = ref({
   totalItems: 0,
   totalPages: 0,
});
const limitRowTable = ref([
   {
      id: 10,
      name: 10,
   },
   {
      id: 20,
      name: 20,
   },
   {
      id: 50,
      name: 50,
   },
   {
      id: 100,
      name: 100,
   },
]);
const openProductFlagDialog = async () => {
   isDialogProductOpen.value = true;
};
const activateProduct = async (status) => {
   try {
      isLoading.value = true;
      let resp = await updateProduct(rowId.value, { ...rowData.value, status: !status });
      if (resp.statusCode === 200) {
         isDialogSuccessOpen.value = true;
         dialogCancel();
         getProductList();
      } else {
         toast.add({ title: resp?.message, color: "red" });
      }
   } catch (error) {
      console.error(error);
   } finally {
      isLoading.value = false;
   }
};

const isOpenForm = ref(false);
const setDialogEdit = (status: boolean) => {
   // console.log("setDialogEdit", status);
   isOpenForm.value = status;
};
const isOpenStatus = ref(false);
const setDialogStatus = (status) => {
   isOpenStatus.value = status;
};
const isDialogSuccessOpen = ref(false);
const handleCloseSuccessDialog = (status: boolean) => {
   isDialogSuccessOpen.value = status;
};
const dialogCancel = () => {
   setDialogStatus(false);
};

const selectRow = (row: any) => {
   const menuItems = getMenuTable(row);
   if (menuItems.length > 0 && menuItems[0].length > 0) {
      const firstAction = menuItems[0][0];
      if (firstAction.click) {
         firstAction.click();
      }
   }
};

const filteredColumns = computed(() => columns.filter((column) => !["id", "actions"].includes(column.key)));
const toggleSort = (column: string) => {
   if (sortField.value !== column) {
      sortField.value = column;
      sortOrder.value = "asc";
   } else {
      if (sortOrder.value === "asc") {
         sortOrder.value = "desc";
      } else if (sortOrder.value === "desc") {
         sortField.value = "";
         sortOrder.value = "";
      } else {
         sortOrder.value = "asc";
      }
   }
   filter.value.Order = [{ column: sortField.value, dir: sortOrder.value }];
   filter.value.page = 1;
   getProductList();
};
</script>
