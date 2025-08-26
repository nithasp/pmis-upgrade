<template>
   <div class="flex justify-between items-center mb-8">
      <h1 class="font-bold text-[30px]">{{ $t("manage_warehouse") }}</h1>
      <div><UButton @click="handleClickCreateShipAgent" icon="i-heroicons-plus-circle" size="md" :label="`${t('create')}`" /></div>
   </div>
   <div id="filter-search" class="bg-purple-25 py-4 px-6 rounded-xl mb-6">
      <div class="grid grid-cols-12 gap-4">
         <div class="col-span-3">
            <Input
               :label="`${$t('document_no')}`"
               name="keyword"
               v-model="search"
               :placeholder="$t('search_title_placeholder')"
               icon="i-heroicons-magnifying-glass-20-solid"
            />
         </div>
         <div class="col-span-3">
            <USelect :label="$t('shipname_imo_officialno')" name="personType" :placeholder="$t('port')" />
         </div>
         <div class="col-span-3">
            <UInputMenu custom-icon="search" :label="$t('product_owner')" name="productOwner" :placeholder="$t('search')" />
         </div>

         <div class="col-span-3">
            <div class="flex items-end">
               <div class="w-full">
                  <UFormGroup :label="$t('updated_at')">
                     <UPopover :popper="{ placement: 'bottom-start' }">
                        <Input
                           size="md"
                           variant="outline"
                           color="purple"
                           custom-icon="calendar"
                           :value="dateValue ? `${format(dateValue.start, 'd MMM, yyy')} - ${format(dateValue.end, 'd MMM, yyy')}` : ''"
                           :placeholder="$t('search')"
                           :ui="{
                              wrapper: 'w-full rounded-md bg-white',
                           }"
                        />

                        <template #panel="{ close }">
                           <div class="flex items-center sm:divide-x divide-gray-200 dark:divide-gray-800">
                              <DatePicker v-model="selectedDate" @close="close" />
                           </div>
                        </template>
                     </UPopover>
                  </UFormGroup>
               </div>
               <div class="ml-2 mb-0.5">
                  <UButton @click="handleClickResetFitler" icon="i-heroicons-arrow-path" />
               </div>
            </div>
         </div>
      </div>
   </div>
   <div id="request-form-content" class="bg-white rounded-[20px]">
      <div class="flex items-center justify-between py-4 px-6 bg-primaryy-500 rounded-t-[20px]">
         <div class="flex justify-between">
            <h1 class="font-normal text-lg text-white">{{ $t("warehouse_inventory_list") }}</h1>
            <div v-if="search" class="rounded-full bg-purple-25 text-sm py-1 px-2 ml-2">{{ paginationData.totalItems }} {{ t("warehouse_inventory_total") }}</div>
         </div>
      </div>
      <UTable :columns="columns" :rows="userList">
         <template #id-data="{ index }">
            {{ getNumCountPagination(index, filter.page, filter.limit) }}
         </template>
         <template #updatedAt-data="{ row }">
            {{ row.updatedAt && renderDateFormat(row.updatedAt) }}
            <div class="text-grayy-75">{{ row.updatedAt && renderTimeFormat(row.updatedAt) }}</div>
         </template>
         <template #status-data="{ row }">
            <Badge :label="row.enabled ? $t('activate') : $t('deactivate')" :type="row.enabled ? 'success' : 'error'" />
         </template>
         <template #actions-data="{ row }">
            <ActionMenuTable :items="getMenuTable(row)" />
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
   <DialogConfirm
      :title="$t('reset_password')"
      :desc="$t('confirm_reset_password')"
      icon="warning"
      :labelConfirm="$t('confirm')"
      :labelCancel="$t('cancel')"
      :isDialogOpen="isConfirmDialogResetPasswordOpen"
      :dialogCancel="dialogCancelResetPassword"
      :dialogConfirm="dialogConfirmResetPasword"
   />
   <DialogConfirm
      :title="modalTitleDialog"
      :desc="modalDialogMessage"
      :icon="modalDialogType"
      :labelConfirm="$t('confirm')"
      :labelCancel="$t('cancel')"
      :isDialogOpen="isConfirmActivateDialogOpen"
      :dialogCancel="dialogCloseActivateStatus"
      :dialogConfirm="dialogConfirmActivateUserPermission"
   />
   <DialogConfirm
      :title="$t('cancel_user_account')"
      :desc="$t('confirm_cancel_user_account')"
      icon="danger"
      :labelConfirm="$t('confirm')"
      :labelCancel="$t('cancel')"
      :isDialogOpen="isConfirmCancelDialogOpen"
      :dialogCancel="dialogCloseCancelUserPermission"
      :dialogConfirm="dialogConfirmCancelUser"
      color-confirm="red"
   />
   <DialogAlert
      :isOpen="isAlertDialogActivateOpen"
      :desc="modalAlertMessage"
      :title="modalTitleDialog"
      :type="modalAlertType"
      :setDialog="handleCloseAlertDialogActivate"
   />
   <DialogAlert
      :isOpen="isAlertDialogResetPasswordOpen"
      :desc="modalAlertMessage"
      :title="$t('reset_password')"
      :type="modalAlertType"
      :setDialog="handleCloseAlertDialogResetPassword"
      :btnName="$t('close')"
   />
   <Loading v-if="isLoading" />
</template>
<script setup lang="ts">
import Input from "~/components/form/u-input.vue";

import { onMounted, ref, watch } from "vue";
import CheckIcon from "~/assets/icons/fi-rs-check.svg";
import CrossIcon from "~/assets/icons/fi-rs-cross.svg";
import EditIcon from "~/assets/icons/fi-rs-edit-2.svg";
import ViewIcon from "~/assets/icons/fi-rs-eye.svg";
import RefreshIcon from "~/assets/icons/fi-rs-refresh.svg";
import DeleteIcon from "~/assets/icons/fi-rs-trash.svg";
import UInputMenu from "~/components/form/u-input-menu.vue";

import Badge from "~/components/badge/badge.vue";
import DialogAlert from "~/components/dialog/alert.vue";
import DialogConfirm from "~/components/dialog/confirm.vue";
import USelect from "~/components/form/u-select.vue";
import DatePicker from "~/components/form/v-datepicker.vue";
import Loading from "~/components/loading.vue";
import ActionMenuTable from "~/components/ui/actionMenuTable.vue";
import EmptyNotFoundTable from "~/components/ui/emptyNotFoundTable.vue";
import type { IFilterUserOfficer } from "~/core/interfaces/IFilterUserOfficer";
import type { IUserSystem } from "~/core/interfaces/IUserSystem";
import useAuthService from "~/core/services/authService";
import useUserOfficerService from "~/core/services/userOfficerService";

const { t } = useI18n();

const isLoading = ref(false);
const search = ref("");
const userId = ref();
const userEmail = ref("");
const roleIdSelected = ref(0);
const isStatusActivated = ref(false);
const userOfficerService = useUserOfficerService();
const authService = useAuthService();
const rolesOptionsStore = useRolesOptionsStore();
const enabled = ref("");
const filter = ref<IFilterUserOfficer>({
   page: 1,
   limit: 10,
   search: "",
   enabled: "",
   roleId: 0,
});
const userList = ref<IUserSystem[]>([]);
const paginationData = ref({
   totalItems: 0,
   totalPages: 0,
});

const statusOption = ref([
   {
      id: "true",
      name: t("activate"),
   },
   {
      id: "false",
      name: t("deactivate"),
   },
]);

const isConfirmCancelDialogOpen = ref(false);
const isConfirmActivateDialogOpen = ref(false);
const isAlertDialogActivateOpen = ref(false);
const isConfirmDialogResetPasswordOpen = ref(false);
const isAlertDialogResetPasswordOpen = ref(false);
const modalTitleDialog = ref("");
const modalDialogMessage = ref("");
const modalDialogType = ref("");
const modalAlertMessage = ref("");
const modalAlertType = ref("");
const dateValue = ref<any>("");

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

const getMenuTable = (row: IUserSystem) => {
   const items = [
      [
         {
            label: t("view"),
            avatar: {
               src: ViewIcon,
            },
            click: () => {
               navigateTo(`/users-management/view?id=${row.id}`);
            },
         },
         {
            label: t("edit"),
            avatar: {
               src: EditIcon,
            },
            click: () => {
               navigateTo(`/users-management/edit?id=${row.id}`);
            },
         },
         {
            label: row.enabled ? t("deactivate") : t("activate"),
            avatar: {
               src: row.enabled ? CrossIcon : CheckIcon,
            },
            click: () => {
               isConfirmActivateDialogOpen.value = true;
               modalTitleDialog.value = row.enabled ? t("deactivate_user_account") : t("activate_user_account");
               modalDialogType.value = "warning";
               modalDialogMessage.value = row.enabled ? t("confirm_deactivate_user_account") : t("confirm_activate_user_account");
               userId.value = row.id;
               isStatusActivated.value = row.enabled;
            },
         },
         {
            label: t("reset_password"),
            avatar: {
               src: RefreshIcon,
            },
            click: () => {
               isConfirmDialogResetPasswordOpen.value = true;
               userId.value = row.id;
               userEmail.value = row.email;
            },
         },
         {
            label: t("cancel"),
            avatar: {
               src: DeleteIcon,
            },
            click: () => {
               isConfirmCancelDialogOpen.value = true;
               userId.value = row.id;
            },
         },
      ],
   ];

   if (row.status !== "Approved") {
      items.splice(3, 1);
   }
   return items;
};

const handleClickResetFitler = () => {
   search.value = "";
   filter.value.page = 1;
   filter.value.limit = 10;
   filter.value.search = "";
   filter.value.roleId = 0;
   filter.value.enabled = "";
   getUserList({
      ...filter.value,
   });
};

const handleClickCreateShipAgent = () => {
   navigateTo("/users-management/create");
};

const columns = [
   {
      key: "id",
      label: t("number_no"),
   },
   {
      key: "updatedAt",
      label: t("updated_edit_date"),
   },
   {
      key: "fullName",
      label: t("full_name"),
   },
   {
      key: "roleName",
      label: t("user"),
   },
   {
      key: "phone",
      label: t("telephone_no"),
   },
   {
      key: "mobilePhone",
      label: t("mobile_phone_no"),
   },
   {
      key: "status",
      label: t("status"),
   },
   {
      key: "actions",
      sortable: false,
   },
];

onMounted(() => {
   rolesOptionsStore.getRolesOptions();
   getUserList(filter.value);
});

const getUserList = async (
   filter: IFilterUserOfficer = {
      page: 1,
      limit: 10,
      search: "",
      roleId: 0,
      enabled: "",
   }
) => {
   isLoading.value = true;
   const resp = await userOfficerService.getUserList(filter);
   if (resp.statusCode === 200) {
      userList.value = resp.data.data;
      paginationData.value.totalItems = resp.data.totalItems;
      paginationData.value.totalPages = resp.data.totalPages;
   }
   isLoading.value = false;
};

const performSearch = debounce((query: any) => {
   filter.value.search = query;
   filter.value.page = 1;
   getUserList({ ...filter.value, search: query, page: 1 });
}, 500);

watch(search, (newVal) => {
   performSearch(newVal);
});

watch(
   () => roleIdSelected.value,
   (value) => {
      filter.value.roleId = value;
      filter.value.page = 1;
      getUserList({ ...filter.value, roleId: value, page: 1 });
   }
);

watch(
   () => enabled.value,
   (value) => {
      filter.value.enabled = value;
      filter.value.page = 1;
      getUserList({ ...filter.value, enabled: value, page: 1 });
   }
);

watch(
   () => filter.value.page,
   (value) => {
      getUserList({ ...filter.value, page: value });
   }
);

watch(
   () => filter.value.limit,
   (value) => {
      filter.value.page = 1;
      getUserList({ ...filter.value, limit: value, page: 1 });
   }
);

const dialogConfirmActivateUserPermission = async () => {
   isLoading.value = true;
   if (userId) {
      const resp = await userOfficerService.updateUserStatus(userId.value, !isStatusActivated.value);
      if (resp.statusCode === 200) {
         isAlertDialogActivateOpen.value = true;
         modalAlertMessage.value = isStatusActivated.value ? t("deactivate_user_account_success") : t("activate_user_account_success");
         modalAlertType.value = "success";
      } else {
         isAlertDialogActivateOpen.value = true;
         modalAlertMessage.value = resp.message;
         modalAlertType.value = "error";
      }
   }

   isLoading.value = false;
   isConfirmActivateDialogOpen.value = false;
};

const dialogConfirmCancelUser = async () => {
   isLoading.value = true;
   if (userId) {
      const resp = await userOfficerService.cancelUser(userId.value);
      if (resp.statusCode === 200) {
         isAlertDialogActivateOpen.value = true;
         modalTitleDialog.value = t("cancel_user_account");
         modalAlertMessage.value = t("cancel_user_account_success");
         modalAlertType.value = "success";
      } else {
         isAlertDialogActivateOpen.value = true;
         modalTitleDialog.value = t("cancel_user_account");
         modalAlertMessage.value = resp.message;
         modalAlertType.value = "error";
      }
   }

   isLoading.value = false;
   isConfirmCancelDialogOpen.value = false;
};

const dialogCancelResetPassword = () => {
   isConfirmDialogResetPasswordOpen.value = false;
};

const dialogConfirmResetPasword = async () => {
   isLoading.value = true;
   if (userId.value) {
      const resp = await authService.sendEmailForgetPassword({ email: userEmail.value });
      if (resp.statusCode === 200) {
         isAlertDialogResetPasswordOpen.value = true;
         modalAlertMessage.value = t("reset_password_success");
         modalAlertType.value = "success";
      } else {
         isAlertDialogResetPasswordOpen.value = true;
         modalAlertMessage.value = resp.message;
         modalAlertType.value = "error";
      }
   }

   isLoading.value = false;
   isConfirmDialogResetPasswordOpen.value = false;
};

const handleCloseAlertDialogActivate = () => {
   isAlertDialogActivateOpen.value = false;
   getUserList(filter.value);
};

const dialogCloseActivateStatus = () => {
   isConfirmActivateDialogOpen.value = false;
};

const dialogCloseCancelUserPermission = () => {
   isConfirmCancelDialogOpen.value = false;
   getUserList(filter.value);
};

const handleCloseAlertDialogResetPassword = () => {
   isAlertDialogResetPasswordOpen.value = false;
};
</script>
