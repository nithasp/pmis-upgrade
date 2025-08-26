<template>
   <aside v-if="showAside"
      :class="[isSmallScreen ? '!justify-start' : '', 'bg-white relative h-full flex flex-col justify-between rounded-[20px]']">
      <div
         :class="[fullSidebar ? 'p-4' : 'p-2 pt-4', isSmallScreen ? '!h-[75%]' : '', 'bg-white h-full overflow-y-auto overflow-x-hidden']">
         <div v-if="!isSmallScreen" :class="[
            !fullSidebar ? '!p-0 !justify-center' : '',
            'border-b border-solid border-b-[#EAECF0] flex items-center justify-between pl-2 pr-3 pt-0 pb-2 mb-2',
         ]">
            <img :src="fullSidebar ? Logo : LogoMini" alt="PMIS Logo"
               :class="[!fullSidebar ? '!w-[30px] !h-[30px]' : '', 'w-[94px] h-[46px]']" />
         </div>
         <div id="sidebar-items">
            <div id="main-menu" v-for="(menu, indexMenu) in menus" :key="`menu-${indexMenu}`"
               :class="[!fullSidebar ? 'flex mb-3' : '', 'select-none']">
               <div v-if="menu.topic && fullSidebar" id="topic"
                  class="font-anuphan-semi-bold text-[#9477B6] text-xs pl-3 my-2">{{ menu.topic }}</div>
               <div id="title"
                  class="w-full cursor-pointer rounded-md transition-colors hover:bg-[#E3D4F6] flex justify-between items-center"
                  :class="{ 'bg-[#E3D4F6]': isMainMenuActive(menu) }"
                  @click="openItem === menu.key ? (openItem = '') : (openItem = menu.key), !fullSidebar ? setNavbar(!fullSidebar) : ''">
                  <NuxtLink :to="menu.path" @click="menu.path && isSmallScreen && closeHamburgerMenu()" :class="[
                     menu.subMenus.length === 0 && route.name === menu.key ? 'bg-[#E3D4F6]' : '',
                     'text-white w-full rounded-md flex content-center justify-center',
                  ]">
                     <UTooltip v-if="!fullSidebar" :text="menu.text"
                        :popper="{ placement: 'right', arrow: true, offsetDistance: 20 }" :ui="{
                           ring: 'ring-gray-50',
                           shadow: 'shadow-none',
                           base: 'py-[6px] h-auto text-sm text-primary-500',
                           rounded: 'rounded-md',
                           arrow: {
                              base: 'before:w-4 before:h-4',
                              background: 'before:bg-white',
                              ring: 'ring-0 before:ring-[#eaeaea]',
                              shadow: 'before:shadow-none',
                           },
                        }" class="px-3 py-2">
                        <NuxtIcon :name="menu.icon" size="xl" />
                     </UTooltip>
                     <div v-else :class="[
                        menu.subMenus.length === 0 && route.name === menu.key ? 'bg-[#E3D4F6]' : '',
                        'flex items-center gap-3 transition-colors w-full px-3 py-2 rounded-md',
                     ]">
                        <NuxtIcon :name="menu.icon" size="2xl" color="text-grayy-75" />
                        <div class="flex items-center justify-between w-full">
                           <p :class="[
                              menu.key === 'report_vessel' || menu.key === 'report_vessel_admin' ? 'max-w-[80px] !whitespace-normal' : '',
                              menu.key === 'vessel_awaiting_import_list' ? 'max-w-[130px] !whitespace-normal' : '',
                              'font-anuphan-semi-bold text-sm text-grayy-400 text-nowrap',
                           ]">
                              {{ $t(menu.text) }}
                           </p>
                           <span v-if="menu.count"
                              class="bg-[#F04438] max-w-8 h-8 w-full text-white text-xs text-center content-center font-anuphan-semi-bold rounded-[6px] px-2 py-1">
                              <span>
                                 {{
                                    menu.key === "report_vessel"
                                       ? totals.overall
                                       : menu.key === "document_check"
                                          ? totalsDocumentCheck.overall
                                          : menu.key === "manage_ship_agents"
                                             ? totalsManageShipAgents.overall
                                             : menu.key === "request_form_agency"
                                                ? totalsDocumentCheckAgency.overall
                                                : menu.key === "report_vessel_admin"
                                                ? totals.overall_report_vessel_admin
                                                : 0
                                 }}
                              </span>
                           </span>
                        </div>
                     </div>
                  </NuxtLink>
                  <img v-if="menu.subMenus.length && fullSidebar" :src="ArrowIcon" alt="Arrow Icon"
                     :class="[openItem === menu.key ? '!rotate-0' : '', 'me-3 rotate-[-180deg] transition-transform']" />
               </div>
               <div v-if="menu.subMenus && menu.subMenus.length && fullSidebar"
                  :class="[openItem === menu.key ? 'opacity-1' : 'opacity-0 h-0', '[transition:opacity_0.3s,height_0.3s] relative overflow-hidden']"
                  :style="`height: ${openItem === menu.key ? 45 * menu.subMenus.length + 10 : '0'}px;`" :id="menu.key">
                  <div id="sub-menu" v-for="(subMenu, index) in menu.subMenus" :key="`sub-menu-${index}`"
                     class="my-1 h-10">
                     <NuxtLink :to="subMenu.path" class="text-white" @click="() => {
                        subMenu.path != '' ? (pathname = subMenu.path) : null,
                           isSmallScreen && closeHamburgerMenu()
                     }" @click.native="subMenu.count ? handleCountSubmenu(subMenu) : null">
                        <div :class="[
                           getRouteActiveSubmenu(subMenu.id, subMenu.countType, subMenu.type) ? 'bg-[#E3D4F6]' : '',
                           'flex items-center cursor-pointer transition-colors rounded-md hover:bg-[#E3D4F6] h-10 w-full',
                        ]">
                           <NuxtIcon :name="subMenu.icon" size="2xl" color="text-grayy-75" />

                           <div class="relative w-full grid grid-cols-[1fr_40px] items-center gap-2 pl-3">
                              <span :class="`font-anuphan-semi-bold text-sm 
          ${getRouteActiveSubmenu(subMenu.id, subMenu.countType) ? 'text-primaryy-500' : 'text-grayy-400'} 
          ${!subMenu.count ? 'ml-8 text-nowrap ' : ' relative left-7 max-w-[120px]'}
          `">
                                 {{ $t(subMenu.text) }}
                              </span>
                              <span v-if="subMenu.count && subMenu.type !== 'ship_information_agency'" :class="[
                                 !subMenu.countType || subMenu.countType === 'All' ? 'opacity-0' : '',
                                 'bg-[#F04438] max-w-8 h-8 w-full text-white text-xs text-center content-center font-anuphan-semi-bold rounded-[6px] px-2 py-1',
                              ]">
                                 <span v-if="subMenu.type === 'report_vessel'">
                                    {{
                                       subMenu.countType === "PendingSend"
                                          ? totals.PendingSend
                                          : subMenu.countType === "Send"
                                             ? totals.Send
                                             : subMenu.countType === "PendingApproval"
                                                ? totals.PendingApproval
                                                : subMenu.countType === "Approved"
                                                   ? totals.Approved
                                                   : subMenu.countType === "PendingEdit"
                                                      ? totals.PendingEdit
                                                      : subMenu.countType === "RequestEdit"
                                                         ? totals.RequestEdit
                                                         : 0
                                    }}
                                 </span>

                                 <span v-else-if="subMenu.type === 'request_form_agency'">
                                    {{
                                       subMenu.countType === "PendingEdit"
                                          ? totalsDocumentCheckAgency.PendingEdit
                                          : subMenu.countType === "Approved"
                                             ? totalsDocumentCheckAgency.Approved
                                             : 0
                                    }}
                                 </span>

                                 <span v-else-if="subMenu.type === 'document_check'">
                                    {{
                                       subMenu.countType === "PendingReview"
                                          ? totalsDocumentCheck.PendingReview
                                          : subMenu.countType === "PendingEdit"
                                             ? totalsDocumentCheck.PendingEdit
                                             : subMenu.countType === "PendingConfirmation"
                                                ? totalsDocumentCheck.PendingConfirmation
                                                : subMenu.countType === "PendingApproval"
                                                   ? totalsDocumentCheck.PendingApproval
                                                   : 0
                                    }}
                                 </span>

                                 <span v-else-if="subMenu.type === 'manage_ship_agents'">
                                    {{
                                       subMenu.countType === "WaitingApproved"
                                          ? totalsManageShipAgents.WaitingApproved
                                          : subMenu.countType === "Approved"
                                             ? totalsManageShipAgents.Approved
                                             : 0
                                    }}
                                 </span>

                                 <span v-else>0</span>
                              </span>
                           </div>
                        </div>
                     </NuxtLink>
                  </div>
               </div>
            </div>
         </div>
      </div>
      <div id="sidebar-footer" class="p-4">
         <div class="bottom-menu mb-4">
            <div id="main-menu" v-for="(menu, indexMenu) in bottomMenu" :key="`menu-${indexMenu}`"
               :class="[!fullSidebar ? 'flex' : '', 'select-none']">
               <div id="title"
                  class="w-full cursor-pointer rounded-md transition-colors hover:bg-[#E3D4F6] flex justify-between items-center"
                  @click="openItem === menu.key ? (openItem = '') : (openItem = menu.key), !fullSidebar ? setNavbar(!fullSidebar) : ''">
                  <NuxtLink :to="menu.path" @click="menu.path && isSmallScreen && closeHamburgerMenu()" :class="[
                     menu.subMenus.length === 0 && route.name === menu.key ? 'bg-[#E3D4F6]' : '',
                     !fullSidebar ? 'flex content-center justify-center' : '',

                     'text-white w-full rounded-md',
                  ]">
                     <UTooltip v-if="!fullSidebar" :text="menu.text"
                        :popper="{ placement: 'right', arrow: true, offsetDistance: 20 }" :ui="{
                           ring: 'ring-gray-50',
                           shadow: 'shadow-none',
                           base: 'py-[6px] h-auto text-sm text-primary-500',
                           rounded: 'rounded-md',
                           arrow: {
                              base: 'before:w-4 before:h-4',
                              background: 'before:bg-white',
                              ring: 'ring-0 before:ring-[#eaeaea]',
                              shadow: 'before:shadow-none',
                           },
                        }" class="px-3 py-2">
                        <NuxtIcon :name="menu.icon" size="xl" />
                     </UTooltip>
                     <div v-else :class="[
                        menu.subMenus.length === 0 && route.name === menu.key ? 'bg-[#E3D4F6]' : '',
                        'flex items-center gap-3 transition-colors w-full px-3 py-2 rounded-md',
                     ]">
                        <NuxtIcon :name="menu.icon" size="xl" />
                        <p class="font-anuphan-semi-bold text-sm text-grayy-400 text-nowrap">
                           {{ $t(menu.text) }}
                        </p>
                     </div>
                  </NuxtLink>
               </div>
            </div>
         </div>
         <div v-if="fullSidebar" class="info">
            <div class="version text-center text-[10px] text-[#B7A4CE]">{{ version }}</div>
            <div class="h-[1px] w-full bg-[#EAECF0] mt-[11px] mb-1"></div>
            <div :class="[
               isSmallScreen ? 'justify-between' : '',
               'grid grid-cols-[119px_auto] gap-[25px] items-center px-2',
            ]">
               <div>
                  <div class="text-sm font-anuphan-semi-bold">{{ authStore.profileUser.fullName }}</div>
                  <div class="text-sm">{{ authStore.profileUser.roleName || "-" }}</div>
               </div>
               <div class="mx-auto my-0">
                  <img :src="SignOutIcon" class="w-8 h-8 ml-6 cursor-pointer" @click="setLogoutDialog(true)" />
               </div>
            </div>
         </div>
      </div>

      <UButton v-if="!isSmallScreen" icon="i-heroicons-chevron-double-left" size="lg" color="primary" :class="[
         !fullSidebar ? 'rotate-180 !top-[36px]' : '',
         'flex justify-center bg-[#6F4A9E] w-[38px] h-[38px] absolute top-[50px] right-[-20px] transition-all duration-300',
      ]" square variant="solid" :ui="{ rounded: 'rounded-full' }" @click="setNavbar(!fullSidebar)" />
   </aside>
   <DialogConfirm title="ออกจากระบบ" desc="คุณต้องการออกจากระบบใช่หรือไม่" icon="warning" labelConfirm="ออกจากระบบ"
      :isDialogOpen="isLogoutDialogOpen" :dialogCancel="dialogCancel" :dialogConfirm="dialogConfirm" class="z-[9999]" />
</template>
<script setup>
import ArrowIcon from "~/assets/icons/fi-rs-angle-small-down.svg";
import SignOutIcon from "~/assets/icons/fi-rs-sign-out-alt.svg";
import LogoMini from "~/assets/images/logo-mini.png";
import Logo from "~/assets/images/logo.png";
import DialogConfirm from "~/components/dialog/confirm";
import useRoleService from "~/core/services/roleService";
import { RoleTypeEnum } from "~/utils/enums/RoleTypeEnum";
import { UserTypeEnum } from "~/utils/enums/UserTypeEnum";
import NuxtIcon from "./ui/nuxtIcon.vue";
import { useRuntimeConfig } from "#app";
import useDocumentService from "~/core/services/documentService";
import useVesselImportService from "~/core/services/vesselImport";
import useVesselAgentService from "~/core/services/vesselAgentService";
import { useDocumentStore } from "~/stores/documentStore";
import { is } from "date-fns/locale";

const props = defineProps({
   fullSidebar: Boolean,
   setNavbar: Function,
   isSmallScreen: Boolean,
   closeHamburgerMenu: Function,
});
const authStore = useAuthStore();
const documentStore = useDocumentStore();
const isAgency = authStore.profileUser.roleType === RoleTypeEnum.Agency;
const isStatOfficer = authStore.profileUser.roleType === RoleTypeEnum.StatOfficer;
const isStatApprove = authStore.profileUser.roleType === RoleTypeEnum.StatApprove;
const isDocumentReviewer = authStore.profileUser.roleType === RoleTypeEnum.DocumentReviewer;
const isDocumentApprove = authStore.profileUser.roleType === RoleTypeEnum.DocumentApprove;
const isDocumentBerthOfficer =
   authStore.profileUser.roleType === RoleTypeEnum.DocumentBerthOfficer || authStore.profileUser.roleType === RoleTypeEnum.DocumentBerthOfficerSpacial;
const isDocumentBerthOfficerSpacial = authStore.profileUser.roleType === RoleTypeEnum.DocumentBerthOfficerSpacial;
const isDocumentBerthOfficerMIT = authStore.profileUser.roleType === RoleTypeEnum.DocumentBerthOfficerMIT;
const isDocumentBerthOfficerTCT = authStore.profileUser.roleType === RoleTypeEnum.DocumentBerthOfficerTCT;
const isVTMS = authStore.profileUser.roleType === RoleTypeEnum.VTMS;
const route = useRoute();
const showAside = computed(() => !["/survey/timeout", "/survey/success", "/survey/answer", "/survey/answer/view"].includes(route.path));
const roleService = useRoleService();
const documentService = useDocumentService();
const vesselImportService = useVesselImportService();
const vesselAgentService = useVesselAgentService();
const config = useRuntimeConfig();
const version = config.public.version;
const pathname = ref("");
const openItem = ref("");
const activeSubMenu = ref("");

watch(
   () => documentStore.refreshTrigger,
   () => {
      getDocumentListType();
      getVesselImportListTypeSend();
      getVesselAgentListType();
      getDocumentListTypeAgency();
   }
);

onMounted(async () => {
   pathname.value = window.location.pathname;
   const routeName = route.name.split("-")[0];
   if (routeName === "index") {
      openItem.value = "dashboard";
   } else {
      openItem.value = route.name.split("-")[0];
   }

   getMenu();
   redirectFromRole();

   // if (isStatOfficer || isStatApprove) {
   //    getVesselImportListTypeSend();
   // }
   // if (!isAgency) {
   //    getDocumentListType();
   // }
   // if (isAgency) {
   //    getDocumentListTypeAgency();
   // }
   getVesselImportListTypeSend();
   getDocumentListType();
   getDocumentListTypeAgency();
   getVesselAgentListType();
   getActiveMenuFromQueryStatus();
});

const menus = ref([
   {
      topic: "",
      key: "document_create",
      text: "สร้างใบคำร้อง",
      icon: "document",
      path: "/request-form/create",
      id: ["request-form-create", "request-form-mode"],
      subMenus: [],
   },

   {
      topic: "",
      key: "ship_create",
      text: "เพิ่มเรือใหม่",
      icon: "ship-side",
      path: "/manage-ship/create",
      id: ["manage-ship", "manage-ship-create", "manage-ship-mode"],
      subMenus: [],
   },

   {
      topic: "",
      key: "request_form_agency",
      text: "ใบคำร้อง",
      icon: "document",
      path: "",
      id: [""],
      count: true,
      subMenus: [
         {
            icon: "",
            text: "คำร้องรอแก้ไข",
            path: "",
            id: [""],
            count: true,
            countType: "PendingEdit",
            type: "request_form_agency",
         },
         {
            icon: "",
            text: "คำร้องอนุมัติแล้ว",
            path: "",
            id: [""],
            count: true,
            countType: "Approved",
            type: "request_form_agency",
         },
         {
            icon: "",
            text: "ประวัติยื่นใบคำร้อง",
            path: "",
            id: ["request-form-list"],
            count: true,
            countType: "All",
            type: "request_form_agency",
         },
      ],
   },

   // {
   //    topic: "ตารางเรือ",
   //    key: "ship_table",
   //    text: "",
   //    icon: "home",
   //    path: "",
   //    id: ["ship-table"],
   //    subMenus: [
   //       {
   //          icon: "",
   //          text: "ตารางเรือ MIT",
   //          path: "/ship-table/mit",
   //          id: ["ship-table-mit"],
   //       },
   //       {
   //          icon: "",
   //          text: "ตารางเรือ TCT",
   //          path: "/ship-table/tct",
   //          id: ["ship-table-tct"],
   //       },
   //    ],
   // },

   {
      topic: "ตารางเรือ",
      key: "mit_table",
      text: "ตารางเรือ MIT",
      icon: "ship-side",
      path: "/ship-table/mit",
      id: ["ship-table-mit"],
      subMenus: [],
   },

   {
      topic: "",
      key: "tct_table",
      text: "ตารางเรือ TCT",
      icon: "ship-side",
      path: "/ship-table/tct",
      id: ["ship-table-tct"],
      subMenus: [],
   },

   {
      topic: "ข้อมูล",
      key: "ship_information_agency",
      text: "ข้อมูลเรือ",
      icon: "database",
      path: "",
      id: [""],
      count: false,
      subMenus: [
         {
            icon: "",
            text: "เรือของท่าน",
            path: "/manage-ship/list?status=false",
            id: ["ship-information-agency1"],
            count: true,
            countType: "false",
            type: "ship_information_agency",
         },
         {
            icon: "",
            text: "เรือทั้งหมด",
            path: "/manage-ship/list?status=true",
            id: ["ship-information-agency2"],
            count: true,
            countType: "true",
            type: "ship_information_agency",
         },
      ],
   },

   {
      topic: "เอกสาร",
      key: "view_dashboard_document",
      text: "ยื่นใบคำร้อง",
      icon: "document",
      path: "",
      id: [""],
      subMenus: [
         // {
         //    icon: "",
         //    key: "document_create",
         //    text: "สร้างใบคำร้อง",
         //    path: "/request-form/create",
         //    id: ["request-form-create", "request-form-mode"],
         // },
         {
            icon: "",
            key: "document_list",
            text: "รายการใบคำร้อง",
            path: "/request-form/list",
            id: ["request-form-list", "request-form-view"],
         },
      ],
   },

   {
      topic: "",
      key: "document_check",
      text: "ตรวจคำร้อง",
      icon: "file-check",
      path: "",
      id: [""],
      count: true,
      subMenus: [
         {
            icon: "",
            text: "คำร้องรอตรวจ",
            path: "",
            id: ["document_check1"],
            count: true,
            countType: "PendingReview",
            type: "document_check",
         },
         {
            icon: "",
            text: "คำร้องรออนุมัติ",
            path: "",
            id: ["document_check2"],
            count: true,
            countType: "PendingApproval",
            type: "document_check",
         },
         {
            icon: "",
            text: "คำร้องรอแก้ไข",
            path: "",
            id: ["document_check3"],
            count: true,
            countType: "PendingEdit",
            type: "document_check",
         },
         {
            icon: "",
            text: "คำร้องรอยืนยันท่า",
            path: "",
            id: ["document_check4"],
            count: true,
            countType: "PendingConfirmation",
            type: "document_check",
         },
         {
            icon: "",
            text: "สถานะคำร้อง",
            path: "",
            id: ["request-form-list"],
            count: true,
            countType: "All",
            type: "document_check",
         },
      ],
   },

   {
      topic: "การเดินเรือ",
      key: "vt",
      text: "VT",
      icon: "computer",
      path: "/vt",
      id: ["main"],
      subMenus: [],
   },
   {
      topic: "",
      key: "vtms",
      text: "VTMS",
      icon: "map",
      path: "",
      id: [""],
      subMenus: [
         {
            icon: "",
            text: "บันทึกการเดินเรือ",
            path: "/vtms/sailing-log",
            id: ["vtms-sailing-log", "vtms-sailing-log-type"],
         },
         {
            icon: "",
            text: "เรือทิ้งสมอ",
            path: "/vtms/anchor-ship",
            id: ["vtms-anchor-ship"],
         },
         {
            icon: "",
            text: "Log Book",
            path: "/vtms/log-book",
            id: ["vtms-log-book"],
         },
      ],
   },


   // {
   //    topic: "ท่าเรือ",
   //    key: "view_dashboard_ship_in_out",
   //    text: "เรือเข้า-ออก",
   //    icon: "inbox",
   //    path: "",
   //    id: [""],
   //    subMenus: [
   //       {
   //          icon: "",
   //          text: "นำเข้าข้อมูลเรือเข้า-ออก",
   //          path: "/ship-entry/vessel-import",
   //          id: ["ship-entry-vessel-import"],
   //       },
   //       // {
   //       //    icon: "",
   //       //    text: "รายการรอเรือนำเข้า",
   //       //    path: "/vessel-awaiting-import/list",
   //       //    id: ["vessel-awaiting-import-list", "vessel-awaiting-import-mode", "vessel-awaiting-import-view"],
   //       // },
   //       // {
   //       //    icon: "",
   //       //    text: "รายการเรือเข้า-ออก",
   //       //    path: "/vessel-in-out/list",
   //       //    id: ["vessel-in-out-list", "vessel-in-out-mode", "vessel-in-out-view"],
   //       //    key: "vessel_in_out_list"
   //       // },
   //    ],
   // },

   {
      topic: "ท่าเรือ",
      key: "vessel_import",
      text: "นำเข้าข้อมูลเรือเข้า-ออก",
      icon: "inbox",
      path: "/ship-entry/vessel-import",
      id: ["ship-entry-vessel-import"],
      subMenus: [],
   },

   {
      topic: "",
      key: "report_vessel_admin",
      text: "ข้อมูลเรือเข้า-ออก",
      icon: "stats",
      path: "",
      id: [""],
      count: true,
      subMenus: [
         // {
         //    icon: "",
         //    text: "ตรวจรายงานและเอกสารแนบ",
         //    path: "",
         //    id: [""],
         //    count: true,
         //    countType: "PendingSend",
         // },
         // {
         //    icon: "",
         //    text: "ตรวจรายงานและเอกสารแนบ",
         //    path: "",
         //    id: [""],
         //    count: true,
         //    countType: "Send",
         //    type: "report_vessel",
         // },
         // {
         //    icon: "",
         //    text: "ตรวจรายงานเรือเข้า-ออก",
         //    path: "",
         //    id: [""],
         //    count: true,
         //    countType: "PendingApproval",
         //    type: "report_vessel",
         // },
         // {
         //    icon: "",
         //    text: "รายงานเรือเข้า-ออก ตรวจแล้ว",
         //    path: "",
         //    id: [""],
         //    count: true,
         //    countType: "Approved",
         //    type: "report_vessel",
         // },
         {
            icon: "",
            text: "รายงานเรือเข้า-ออก รอแก้ไข",
            path: "",
            id: [""],
            count: true,
            countType: "PendingEdit",
            type: "report_vessel",
         },
         {
            icon: "",
            text: "รายงานเรือเข้า-ออก ขอแก้ไข",
            path: "",
            id: [""],
            count: true,
            countType: "RequestEdit",
            type: "report_vessel",
         },
         {
            icon: "",
            text: "รายงานนำเข้าเรือเข้า-ออก",
            path: "",
            id: [""],
            count: true,
            countType: "All",
            type: "report_vessel",
         },
      ],
   },

   {
      topic: "สถิติ",
      key: "vessel_awaiting_import_list",
      text: "รายการเรือเข้า-ออก รอนำเข้า",
      icon: "ship",
      path: "/vessel-awaiting-import/list",
      id: ["vessel-awaiting-import-list", "vessel-awaiting-import-mode", "vessel-awaiting-import-view"],
      subMenus: [],
   },

   {
      topic: "",
      key: "report_vessel",
      text: "รายงานเรือเข้า-ออก",
      icon: "stats",
      path: "",
      id: [""],
      count: true,
      subMenus: [
         // {
         //    icon: "",
         //    text: "ตรวจรายงานและเอกสารแนบ",
         //    path: "",
         //    id: [""],
         //    count: true,
         //    countType: "PendingSend",
         // },
         {
            icon: "",
            text: "ตรวจรายงานและเอกสารแนบ",
            path: "",
            id: [""],
            count: true,
            countType: "Send",
            type: "report_vessel",
         },
         {
            icon: "",
            text: "ตรวจรายงานเรือเข้า-ออก",
            path: "",
            id: [""],
            count: true,
            countType: "PendingApproval",
            type: "report_vessel",
         },
         {
            icon: "",
            text: "รายงานเรือเข้า-ออก ตรวจแล้ว",
            path: "",
            id: [""],
            count: true,
            countType: "Approved",
            type: "report_vessel",
         },
         {
            icon: "",
            text: "รายงานเรือเข้า-ออก รอแก้ไข",
            path: "",
            id: [""],
            count: true,
            countType: "PendingEdit",
            type: "report_vessel",
         },
         {
            icon: "",
            text: "รายงานเรือเข้า-ออก ขอแก้ไข",
            path: "",
            id: [""],
            count: true,
            countType: "RequestEdit",
            type: "report_vessel",
         },
         {
            icon: "",
            text: "รายงานนำเข้าเรือเข้า-ออก",
            path: "",
            id: [""],
            count: true,
            countType: "All",
            type: "report_vessel",
         },
      ],
   },

   {
      topic: "บัญชี",
      key: "port_due",
      text: "Port Dues",
      icon: "bank",
      path: "",
      id: [""],
      subMenus: [
         {
            icon: "",
            text: "ใบแจ้งหนี้ Port Dues",
            path: "/port-dues/invoice-list",
            id: ["port-dues-invoice-list", "port-dues-save"],
         },
         {
            icon: "",
            text: "รายการ Port Dues",
            path: "/port-dues/list",
            id: ["port-dues-list", "port-dues-view"],
         },
      ],
   },

   {
      topic: "จัดการ",
      key: "ship",
      text: "ข้อมูลหลัก",
      icon: "ship",
      path: "",
      id: [""],
      subMenus: [
         {
            icon: "",
            text: "ข้อมูลเรือ",
            path: "/manage-ship/list",
            id: ["manage-ship-list", "manage-ship-create", "manage-ship-view"],
         },
         {
            icon: "",
            text: "ข้อมูลเรือราชการ",
            path: "/manage-ship-government/list",
            id: ["manage-ship-government-list", "manage-ship-government-create", "manage-ship-government-view"],
         },
      ],
   },
   // {
   //    topic: "ท่าเรือ",
   //    key: "warehouse",
   //    text: "โกดังสินค้า",
   //    icon: "cube",
   //    path: "",
   //    id: [""],
   //    subMenus: [
   //       {
   //          icon: "",
   //          text: "จัดการโกดังสินค้า",
   //          path: "/manage-warehouse/list",
   //          id: ["manage-warehouse-list"],
   //       },
   //    ],
   // },
   {
      topic: "",
      key: "manage",
      text: "ผู้ใช้งาน",
      icon: "address-book",
      path: "",
      id: [""],
      subMenus: [
         {
            icon: "",
            text: "user_management",
            path: "/users-management/list",
            id: ["users-management-list", "users-management-mode"],
         },
         {
            icon: "",
            text: "permission_management",
            path: "/permission-management/list",
            id: ["permission-management-list", "permission-management-mode"],
         },
         // {
         //    icon: "",
         //    text: "ตัวแทนเรือ",
         //    path: "/manage-ship-agents/list",
         //    id: ["manage-ship-agents-list", "manage-ship-agents-mode", "manage-ship-agents-view"],
         // },
      ],
   },

   {
      topic: "",
      key: "manage_ship_agents",
      text: "ตัวแทนเรือ",
      icon: "ship-side",
      path: "",
      id: [""],
      count: true,
      subMenus: [
         {
            icon: "",
            text: "ตัวแทนเรือรออนุมัติ",
            path: "",
            id: [""],
            count: true,
            countType: "WaitingApproved",
            type: "manage_ship_agents",
         },
         {
            icon: "",
            text: "ตัวแทนเรืออนุมัติ",
            path: "",
            id: [""],
            count: true,
            countType: "Approved",
            type: "manage_ship_agents",
         },
      ],
   },

   {
      topic: "",
      key: "master",
      text: "ข้อมูล",
      icon: "database",
      path: "",
      id: [""],
      subMenus: [
         {
            icon: "",
            text: "เรือ",
            path: "/master-data/vessel",
            id: ["master-data-vessel"],
         },
         {
            icon: "",
            text: "ท่าเรือ",
            path: "/master-data/port",
            id: ["master-data-port"],
         },
         {
            icon: "",
            text: "สินค้า",
            path: "/master-data/products",
            id: ["master-data-products"],
         },
         // {
         //    icon: "",
         //    text: "บัญชี",
         //    path: "/master-data/account",
         //    id: ["master-data-account"],
         // },
      ],
   },
   {
      topic: "",
      key: "ais",
      text: "AIS",
      icon: "marker",
      path: "",
      id: [""],
      subMenus: [
         {
            icon: "",
            text: "แผนที่การจราจรทางน้ำ",
            path: "/ais/water-traffic-map",
            id: ["ais-water-traffic-map"],
         },
         {
            icon: "",
            text: "รายการบันทึกกิจกรรม",
            path: "/ais/log",
            id: ["ais-log"],
         },
      ],
   },
   {
      topic: "",
      key: "contracts",
      text: "สัญญา",
      icon: "notebook",
      path: "/contracts",
      id: [""],
      subMenus: [],
   },
   {
      topic: "รายงาน",
      key: "report_document_list",
      text: "เจ้าหน้าที่ใบคำร้อง",
      icon: "document",
      path: "/report/document/list",
      id: ["report-document-list"],
      subMenus: [],
   },
   {
      topic: "",
      key: "report_document_statistic_list",
      text: "เจ้าหน้าที่สถิติ",
      icon: "dashboard-monitor",
      path: "/report/document-statistic/list",
      id: ["report-document-statistic-list"],
      subMenus: [],
   },
   {
      topic: "จัดการ",
      key: "survey_main",
      text: "แบบสอบถาม",
      icon: "survey",
      path: "",
      id: [""],
      subMenus: [
         {
            icon: "",
            text: "รายการแบบสอบถาม",
            path: "/survey",
            id: ["survey"],
         },
      ],
   },
]);
const bottomMenu = ref([
   {
      topic: "",
      key: "settings",
      text: "ตั้งค่า",
      icon: "settings",
      path: "/settings",
      id: ["settings"],
      subMenus: [],
   },
]);

const updateMenus = (allowedKeys, transformFn = (menu) => menu) => {
  let filteredMenus = menus.value.filter(menu => allowedKeys.includes(menu.key));
  filteredMenus.sort((a, b) => allowedKeys.indexOf(a.key) - allowedKeys.indexOf(b.key));
  filteredMenus = filteredMenus.map(transformFn);
  menus.value = filteredMenus;
  if (!menus.value.some(menu => menu.key === openItem.value)) {
    openItem.value = menus.value[0]?.key;
  }
};

const getMenu = async () => {
  if (!isEmpty(authStore.profileUser)) {
    if (isAgency) {
      updateMenus(
        ["document_create", "ship_create", "request_form_agency", "ship_table", "ship_information_agency"]
      );
      return;
    } else if (isDocumentReviewer) {
      updateMenus(
        ["document_check", "report_document_list", "manage_ship_agents"],
        (menu) => {
          if (menu.key === "document_check" && menu.subMenus) {
            menu.subMenus = menu.subMenus.filter(subMenu => !subMenu.id.includes("document_check2"));
          }
          return menu;
        }
      );
      return;
    } else if (isStatApprove) {
      updateMenus(
        [
          "document_check",
          "ship_information_agency",
          "vessel_awaiting_import_list",
          "report_vessel",
          "report_document_list",
          "manage_ship_agents"
        ],
        (menu) => {
          if (menu.key === "ship_information_agency" && menu.subMenus) {
            menu.subMenus = menu.subMenus.filter(subMenu => !subMenu.id.includes("ship-information-agency1"));
          }
          if (menu.key === "vessel_awaiting_import_list") {
            menu.topic = "";
          }
          return menu;
        }
      );
      return;
    } else if (isVTMS) {
      updateMenus(
        ["vt", "vtms", "ais"],
        (menu) => {
          if (menu.key === "vt") menu.topic = "";
          return menu;
        }
      );
      return;
    } else if (isStatOfficer) {
      updateMenus(["vessel_awaiting_import_list", "report_vessel"]);
      return;
    } else if (isDocumentBerthOfficerMIT || isDocumentBerthOfficerTCT) {
      updateMenus(
        [
          "view_dashboard_document",
          "ship_create",
          "request_form_agency",
          "document_check",
          "vt",
          "vtms",
          "ais",
          "mit_table",
          "tct_table",
          "report_vessel",
          "port_due",
          "contracts",
          "report_document_list",
          "ship_information_agency",
          "manage",
          "manage_ship_agents"
        ]
      );
      return;
    } else if (isDocumentBerthOfficerSpacial) {
      updateMenus(
        [
          "view_dashboard_document",
          "ship_create",
          "request_form_agency",
          "document_check",
          "vt",
          "vtms",
          "ais",
          "mit_table",
          "tct_table",
          "view_dashboard_ship_in_out",
          "port_due",
          "contracts",
          "report_document_list",
          "ship_information_agency",
          "master",
          "manage",
          "manage_ship_agents"
        ]
      );
      return;
    } else {
      updateMenus(
        [
          "view_dashboard_document",
          "ship_create",
          "request_form_agency",
          "document_check",
          "vt",
          "vtms",
          "ais",
          "mit_table",
          "tct_table",
          "vessel_import",
          "report_vessel_admin",
          "view_dashboard_ship_in_out",
          "vessel_awaiting_import_list",
          "report_vessel",
          "port_due",
          "contracts",
          "survey_main",
          "report_document_list",
          "ship_information_agency",
          "master",
          "ship",
          "manage",
          "manage_ship_agents"
        ]
      );
      return;
    }
  }
};


const isMainMenuActive = (menu) => {
   return route.name === menu.key || (menu.path && route.path === menu.path);
};

const getRouteActiveSubmenu = (subMenuId, countType, type) => {
   let active = false;

   if (subMenuId.some((val) => val === route.name)) {
      active = true;
   }

   if (active && route.path === "/request-form/list" && route.fullPath.includes("?")) {
      active = false;
   }

   if (countType && activeSubMenu.value === countType) {
      const currentType = route.path.includes("/request-form")
         ? ["document_check", "request_form_agency"].includes(type)
            ? type
            : "document_check"
         : route.path.includes("/vessel-in-out")
            ? "report_vessel"
            : route.path.includes("/manage-ship-agents")
               ? "manage_ship_agents"
               : route.path.includes("/manage-ship")
                  ? "ship_information_agency"
                  : null;
      active = type === currentType;
   }

   return active;
};

const getActiveMenuFromQueryStatus = () => {
   if (route.query.status) {
      activeSubMenu.value = route.query.status;

      if (route.query.status === "Send,PendingCheck") {
         activeSubMenu.value = "Send";
         openItem.value = "report_vessel";
      }

      const parentMenu = menus.value.find((menu) => menu.subMenus.some((subMenu) => subMenu.countType === route.query.status));

      if (parentMenu) {
         openItem.value = parentMenu.key;
      }

      if (route.path === "/vessel-in-out/list" && route.query.status === "PendingApproval") {
         activeSubMenu.value = "PendingApproval";
         openItem.value = "report_vessel";
      }
      if (route.path === "/vessel-in-out/list" && route.query.status === "PendingEdit") {
         activeSubMenu.value = "PendingEdit";
         openItem.value = "report_vessel";
      }
      if (route.path === "/request-form/list" && route.query.status === "PendingApproval") {
         activeSubMenu.value = "PendingApproval";
         openItem.value = "document_check";
      }
      if (route.path === "/request-form/list" && route.query.status === "PendingConfirmation,PendingConfirmation1,PendingConfirmation2") {
         activeSubMenu.value = "PendingConfirmation";
         openItem.value = "document_check";
      }

      if (route.path === "/manage-ship-agents/list" && route.query.status === "WaitingApproved") {
         activeSubMenu.value = "WaitingApproved";
         openItem.value = "manage_ship_agents";
      }
      if (route.path === "/manage-ship-agents/list" && route.query.status === "Approved") {
         activeSubMenu.value = "Approved";
         openItem.value = "manage_ship_agents";
      }
   } else {
      if (route.path === "/request-form/list" && !route.query.status) {
         activeSubMenu.value = "All";
         openItem.value = "document_check";
      }
      if (route.path === "/vessel-in-out/list" && !route.query.status) {
         activeSubMenu.value = "All";
         openItem.value = "report_vessel";
      }
   }
};

const isLogoutDialogOpen = ref(false);
const setLogoutDialog = (status) => {
   isLogoutDialogOpen.value = status;
};
const dialogCancel = () => {
   setLogoutDialog(false);
};
const dialogConfirm = () => {
   // localStorage.removeItem("access_token");
   // localStorage.removeItem("refresh_token");
   localStorage.clear();
   navigateTo("/login");
   setLogoutDialog(false);
};

const totals = {
   overall: computed(() =>
      Object.keys(totals)
         .filter((key) => key !== "overall")
         .reduce((sum, key) => sum + totals[key].value, 0)
   ),
   overall_report_vessel_admin: computed(() => 
      totals.PendingEdit.value + totals.RequestEdit.value
   ),
   Send: ref(0),
   PendingApproval: ref(0),
   Approved: ref(0),
   PendingEdit: ref(0),
   RequestEdit: ref(0),
};

const totalsDocumentCheckAgency = {
   overall: computed(() =>
      Object.keys(totalsDocumentCheckAgency)
         .filter((key) => key !== "overall")
         .reduce((sum, key) => sum + totalsDocumentCheckAgency[key].value, 0)
   ),
   PendingEdit: ref(0),
   Approved: ref(0),
};

const totalsDocumentCheck = {
   overall: computed(() =>
      Object.keys(totalsDocumentCheck)
         .filter((key) => key !== "overall")
         .reduce((sum, key) => sum + totalsDocumentCheck[key].value, 0)
   ),
   PendingReview: ref(0),
   PendingApproval: ref(0),
   PendingEdit: ref(0),
   PendingConfirmation: ref(0),
};

const totalsManageShipAgents = {
   overall: computed(() =>
      Object.keys(totalsManageShipAgents)
         .filter((key) => key !== "overall")
         .reduce((sum, key) => sum + totalsManageShipAgents[key].value, 0)
   ),
   WaitingApproved: ref(0),
   Approved: ref(0),
};

const getVesselImportListTypeSend = async () => {
   const statusList = ["Send", "PendingApproval", "Approved", "PendingEdit", "RequestEdit"];
   const responses = await Promise.all(statusList.map((status) => vesselImportService.getVesselImportListTypeSend({ limit: 10, page: 1, status })));
   statusList.forEach((status, index) => {
      totals[status].value = responses[index].data.totalItems;
   });
};

const getDocumentListTypeAgency = async () => {
   const statusList = ["PendingEdit", "Approved"];
   const responses = await Promise.all(
      statusList.map((status) =>
         documentService.getDocumentList({
            status,
            berthId: 0,
            begin: "",
            end: "",
            page: 1,
            limit: 10,
            search: "",
            vesselStatus: "",
            vesselFlagId: 0,
            purposeId: 0,
            etaBegin: "",
            etaEnd: "",
         })
      )
   );
   statusList.forEach((status, index) => {
      totalsDocumentCheckAgency[status].value = responses[index].data.totalItems;
   });
};

const getDocumentListType = async () => {
   const statusList = ["PendingReview", "PendingApproval", "PendingEdit", "PendingConfirmation"];
   const responses = await Promise.all(
      statusList.map((status) =>
         documentService.getDocumentList({
            status: status === "PendingConfirmation" ? "PendingConfirmation,PendingConfirmation1,PendingConfirmation2" : status,
            berthId: 0,
            begin: "",
            end: "",
            page: 1,
            limit: 10,
            search: "",
            vesselStatus: "",
            vesselFlagId: 0,
            purposeId: 0,
            etaBegin: "",
            etaEnd: "",
         })
      )
   );
   statusList.forEach((status, index) => {
      totalsDocumentCheck[status].value = responses[index].data.totalItems;
   });
};

const getVesselAgentListType = async () => {
   const statusList = ["WaitingApproved", "Approved"];
   const responses = await Promise.all(statusList.map((status) => vesselAgentService.getVesselAgentList({ limit: 10, page: 1, status })));
   statusList.forEach((status, index) => {
      totalsManageShipAgents[status].value = responses[index].data.totalItems;
   });
};

const handleCountSubmenu = (item) => {
   activeSubMenu.value = item.countType;

   if (item.type === "ship_information_agency") {
      documentStore.setManageShipQueryType(item.countType);
   }

   if (item.type === "document_check" || item.type === "request_form_agency") {
      documentStore.setRequestFormQueryType(item.countType);
      navigateTo({
         path: "/request-form/list",
         query: {
            status:
               item.countType === "PendingConfirmation"
                  ? "PendingConfirmation,PendingConfirmation1,PendingConfirmation2"
                  : item.countType === "All"
                     ? ""
                     : item.countType,
         },
      });
   }

   if (item.type === "report_vessel") {
      documentStore.setVesselInOutQueryType(item.countType);
      navigateTo({
         path: "/vessel-in-out/list",
         query: {
            status: item.countType === "Send" ? "Send,PendingCheck" : item.countType === "All" ? "" : item.countType,
         },
      });
   }

   if (item.type === "manage_ship_agents") {
      documentStore.setManageShipAgentsQueryType(item.countType);
      navigateTo({
         path: "/manage-ship-agents/list",
         query: {
            status: item.countType,
         },
      });
   }

   props.closeHamburgerMenu()
};

const redirectFromRole = () => {
   const firstLogin = localStorage.getItem("firstLogin");
   if (firstLogin === "true" && authStore.profileUser.roleType) {
      if (isDocumentReviewer || isDocumentApprove) {
         openItem.value = "view_dashboard_document";
         pathname.value = "/request-form/list";
         navigateTo("/request-form/list");
      }
      localStorage.removeItem("firstLogin");
   }
};
</script>
