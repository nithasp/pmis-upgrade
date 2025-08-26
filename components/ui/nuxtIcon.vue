<template>
    <nuxt-icon :name="`fi-rs-${name}`" 
    :class="[`text-${size ? size : 'md'}`, 
    `${color ? color : 'text-primaryy-500'}`,
    '']" />
</template>

<script setup>
const props = defineProps({
    name: String,
    size: String,
    color: String,
});
</script>

<style>
.nuxt-icon svg {
    margin-bottom: 0;
}
</style>
