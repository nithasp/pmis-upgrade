<template>
    <UDropdown :items="filteredItems" :ui="{
        rounded: 'rounded-lg',
        width: 'max-w-[158px]',
        item: {
            base: 'hover:bg-grayy-50 font-anuphan-medium',
            label: 'font-anuphan-medium text-grayy-400 ml-1',
            size: 'text-sm',
            avatar: {
                base: '[&_img]:rounded-none [&_img]:w-4 [&_img]:h-4',
            },
            padding: 'p-[8px_6px_8px_12px]',
        },
    }">
        <NuxtIcon name="menu-dots-vertical" size="lg" color="text-[#374957]" />
    </UDropdown>
</template>

<script setup>
import NuxtIcon from './nuxtIcon.vue';

const props = defineProps({
    items: {
        type: null,
        default: null
    }
});

// Filter items to show only those without "visible" or where visible is not false
const filteredItems = computed(() => {
    const items = props.items
        .flat()
        .filter((menuItem) => {
            return menuItem.visible === undefined || menuItem.visible !== false;
        });
    return [items];
});


</script>

<style></style>
