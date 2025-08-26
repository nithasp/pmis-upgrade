<template>
   <div id="ship-agent-address">
      <header class="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-6 mb-5">
         <div>
            <h1 class="font-anuphan-semi-bold text-lg text-gray-400">{{ $t("vessel_agent_address") }}</h1>
            <div class="mt-1 text-[#667085] text-sm">{{ $t("settings_invoice_address_subtitle") }}</div>
         </div>
         <div class="flex gap-3">
            <UButton class="mt-4 sm:mt-0" icon="i-heroicons-plus-circle" size="md" :label="$t('add_address')" @click="() => {
               navigateTo(`/settings/ship-agent-address/create`);
            }" />
         </div>
      </header>
      <div class="mt-6">
         <div class="border-y-[#E4E7EC] border-t border-solid py-5">
            <UTable :columns="[
               {
                  key: 'id',
                  label: t('order'),
                  class: 'w-[60px] text-center',
               },
               {
                  key: 'company',
                  label: t('ccn'),
                  class: 'text-center',
               },
               {
                  key: 'tax',
                  label: t('taxpayer_identification_no'),
               },
               {
                  key: 'fullName',
                  label: t('contact_name_agent_address'),
               },
               {
                  key: 'paymentMethodDes',
                  label: t('payment_method'),
               },
               {
                  key: 'paymentTermDes',
                  label: t('payment_term'),
               },
               {
                  key: 'address',
                  label: t('address'),
               },
               {
                  key: 'actions',
                  sortable: false,
               },
            ]" :rows="shipAgentAddressItem" :ui="{
               wrapper: 'border rounded-lg border-solid border-[#D0D5DD] mt-6',
               thead: 'bg-primary-50',
               tbody: 'border-none',
            }">
               <template #id-data="{ index }">
                  <div class="text-center">
                     {{ index + 1 }}
                  </div>
               </template>

               <template #actions-data="{ row }">
                  <UDropdown :items="getMenuTable(row)">
                     <NuxtIcon name="menu-dots-vertical" size="lg" color="text-[#374957]" />
                  </UDropdown>
               </template>
            </UTable>
         </div>
      </div>
   </div>
   <DialogConfirm :icon="dialogConfirmProps.icon" :title="dialogConfirmProps.title" :desc="dialogConfirmProps.desc"
      :labelCancel="$t('cancel')"
      :labelConfirm="$t('confirm')" :isDialogOpen="isDialogConfirmOpen" :dialogCancel="dialogCancel"
      :dialogConfirm="dialogConfirm" colorConfirm="red" />
   <DialogAlert :title="dialogAlertProps.title" :desc="dialogAlertProps.desc" :type="dialogAlertProps.type"
      :isOpen="isDialogAlertOpen" :setDialog="handleCloseDialogAlert" />
   <Loading v-if="isLoading" />
</template>

<script setup lang="ts">
const { locale, t } = useI18n();
import DialogConfirm from "~/components/dialog/confirm.vue";
import DialogAlert from "~/components/dialog/alert.vue";
import Loading from "~/components/loading.vue";

import ViewIcon from "~/assets/icons/fi-rs-eye.svg";
import NuxtIcon from "~/components/ui/nuxtIcon.vue";
import EditIcon from "~/assets/icons/fi-rs-edit-2.svg";
import CrossCircleIcon from "~/assets/icons/fi-rs-cross-circle.svg";

import useSettingService from "~/core/services/settingService";
import type { IUserAddressList } from "~/core/interfaces/ISetting";
const settingService = useSettingService();

const isLoading = ref<boolean>(false);
const shipAgentAddressItem = ref<IUserAddressList[]>([]);
const dialogAlertProps = ref({
   title: "",
   desc: "",
   type: "",
});
const dialogConfirmProps = ref({
   title: "",
   desc: "",
   icon: "",
});
const authStore = useAuthStore();
const profileUser = ref<any>(null);
const userAddressId = ref<number>(0);

onMounted(() => {
   getProfileUser();
   getUserAddressList();
});

const getUserAddressList = async () => {
   isLoading.value = true;
   const res = await settingService.getUserAddressList(profileUser.value?.id);
   if (res.statusCode === 200) {
      shipAgentAddressItem.value = res.data;
   }
   isLoading.value = false;
};

const deleteUserAddressList = async () => {
   isLoading.value = true;
   const res = await settingService.deleteAddressUser(userAddressId.value);
   if (res.statusCode === 200) {
      getUserAddressList();
      userAddressId.value = 0;
      isDialogConfirmOpen.value = false;
   } else {
      dialogAlertProps.value = {
         title: t("error"),
         desc: locale.value === "th" ? res.message : res.translation,
         type: "danger",
      };
      isDialogAlertOpen.value = true;
   }
   isLoading.value = false;
};

const isDialogAlertOpen = ref<boolean>(false);
const handleCloseDialogAlert = (status: boolean) => {
   isDialogAlertOpen.value = status;
};

const isDialogConfirmOpen = ref<boolean>(false);
const dialogCancel = () => {
   isDialogConfirmOpen.value = false;
};
const dialogConfirm = () => {
   deleteUserAddressList();
};

const getMenuTable = (row: IUserAddressList) => {
   const items = [
      [
         {
            label: t("view"),
            avatar: {
               src: ViewIcon,
            },
            click: () => {
               navigateTo(`/settings/ship-agent-address/view?id=${row.id}`);
            },
         },
         {
            label: t("edit"),
            avatar: {
               src: EditIcon,
            },
            click: () => {
               navigateTo(`/settings/ship-agent-address/edit?id=${row.id}`);
            },
         },
         {
            label: t("delete"),
            avatar: {
               src: CrossCircleIcon,
            },
            click: () => {
               userAddressId.value = row.id;
               dialogConfirmProps.value = {
                  title: t('delete_ship_address_agent_title'),
                  desc: t('delete_ship_address_agent_desc'),
                  icon: "danger",
               };
               isDialogConfirmOpen.value = true;
            },
         },
      ],
   ];
   return items;
};
const getProfileUser = () => {
   profileUser.value = typeof authStore.profileUser === "string" ? JSON.parse(authStore.profileUser) : authStore.profileUser;
};
</script>
