<template>
    <VesselInForm v-if="vesselType === 'vessel-in'" />
    <VesselOutForm v-if="vesselType === 'vessel-out'" />
    <VesselShiftForm v-if="vesselType === 'vessel-shift'" />
</template>
<script setup lang="ts">
import VesselInForm from '~/components/vtms/sailing-log/navigation/vessel-form/vessel-in-form.vue';
import VesselOutForm from '~/components/vtms/sailing-log/navigation/vessel-form/vessel-out-form .vue';
import VesselShiftForm from '~/components/vtms/sailing-log/navigation/vessel-form/vessel-shift-form.vue';

const route = useRoute();
const vesselType = ref("");

onMounted(() => {
    const vesselTypes = ["vessel-in", "vessel-out", "vessel-shift"];
    vesselType.value = vesselTypes.find(type => route.path.includes(type)) || "";
})
</script>