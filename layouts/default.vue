<template>
  <div id="pmis-upgrade-dashboard-layout" class="h-screen pt-[75px] md:p-6"
  :class="[!showAside ? 'py-6 md:py-6' : '!py-6', 'h-screen']"
  >
    <nav
    v-if="!showAside"
      id="navbar-mobile"
      class="flex items-center justify-between shadow-[0px_7px_10px_0px_rgba(203,203,203,0.20)] p-[9px_16px] bg-white fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 translate-y-0 md:-translate-y-full"
    >
      <div class="hamburger-menu cursor-pointer" @click="isHamburgerMenuActive = !isHamburgerMenuActive">
        <div :class="['line bg-black w-[20px] h-[2px] transition-all duration-300 origin-center', isHamburgerMenuActive ? 'rotate-45 translate-y-1' : '']"></div>
        <div :class="['line bg-black w-[20px] h-[2px] my-1 transition-all duration-300', isHamburgerMenuActive ? 'opacity-0' : 'opacity-100']"></div>
        <div
          :class="[ 
            'line bg-black w-[20px] h-[2px] transition-all duration-300 origin-center',
            isHamburgerMenuActive ? '-rotate-45 translate-x-0 -translate-y-2' : ''
          ]"
        ></div>
      </div>
      <div class="logo">
        <img :src="Logo" alt="logo" class="w-[120px]" />
      </div>
      <div></div>
    </nav>

    <div
      v-if="!isLoading"
      :class="[ gridClass, isSmallScreen ? 'p-4' : '', 'grid grid-cols-[66px_1fr] sm:grid-cols-[250px_1fr] gap-8 transition-all duration-200 h-full' ]"
    >
      <div
        id="sidebar-wrapper"
        :class="[
          'transition-all duration-300',
          isHamburgerMenuActive && isSmallScreen ? 'translate-x-0 opacity-100 w-full' 
          :!isHamburgerMenuActive && isSmallScreen?  'translate-x-[-100%] opacity-0 w-0' : '',
          'md:opacity-100 md:translate-x-[0%] fixed z-[2000] h-full left-0 top-[7%] md:static md:top-0 md:left-0',
        ]"
      >
        <Sidebar :fullSidebar="fullSidebar" :setNavbar="setNavbar" :isSmallScreen="isSmallScreen"   :closeHamburgerMenu="closeHamburgerMenu"
        />
      </div>

      <main class="h-full overflow-hidden">
        <div class="h-full overflow-auto">
          <slot />
        </div>
      </main>
    </div>
    <Loading v-if="isLoading" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import Sidebar from "../components/sidebar";
import Loading from "~/components/loading";
import Logo from "~/assets/images/logo.png";
import { useRoute } from 'vue-router';

const route = useRoute();
const showAside = computed(() =>
  ["/survey/timeout", "/survey/success", "/survey/answer", "/survey/answer/view"].includes(route.path)
);
const fullSidebar = ref(true);
const setNavbar = (status) => {
  fullSidebar.value = status;
};
const isHamburgerMenuActive = ref(false);
const isLoading = ref(false);
const hamburgerMenuActiveTimeout = ref(null);
const isSmallScreen = ref(window.innerWidth < 768);

onMounted(() => {
  window.addEventListener("resize", onResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", onResize);
  if (hamburgerMenuActiveTimeout.value) {
    clearTimeout(hamburgerMenuActiveTimeout.value);
  }
});

watch(isHamburgerMenuActive, (newVal) => {
  fullSidebar.value = newVal;
});

const gridClass = computed(() => {
  if (isSmallScreen.value) {
    return '!grid-cols-1';
  } else {
    if (fullSidebar.value && !showAside.value) {
      return '!grid-cols-[250px_1fr]';
    } else if ((fullSidebar.value && showAside.value) || (!fullSidebar.value && showAside.value)) {
      return '!grid-cols-1';
    } else {
      return '!grid-cols-[66px_1fr]';
    }
  }
});

const onResize = () => {
  isSmallScreen.value = window.innerWidth < 768;
  if(isSmallScreen.value && !fullSidebar.value) {
    isHamburgerMenuActive.value = false
  }
};

const closeHamburgerMenu = () => {
  clearTimeout(hamburgerMenuActiveTimeout.value);
  hamburgerMenuActiveTimeout.value = setTimeout(() => {
    isHamburgerMenuActive.value = false;
  }, 100);
};
</script>
