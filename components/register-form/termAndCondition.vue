<template>
    <div class="lex items-center justify-center">
        <div class="rounded-[20px] bg-white">
            <div class="text-center flex flex-col items-center">
                <h1 class="font-anuphan-semi-bold text-[24px] my-6">{{ $t('terms_and_conditions') }}</h1>
                <p class="mb-10">{{ $t('last_updated') }} {{ termsData.createAt &&
                    renderDateFormatTH(termsData.createAt)
                    }}</p>
                <div ref="termRef" @scroll="handleScroll" v-html="termsData.content"
                    class="border-[#9477B6] p-5 border rounded-[20px] w-full h-[266px] overflow-auto">
                </div>
            </div>
            <Checkbox :disabled="disabledAcceptTerm" class="mt-[24px]" name="notifications"
                :label="$t('agree_accept_term')" :modelValue="isAcceptTermCheck"
                @update:modelValue="isAcceptTermCheck = $event" />
        </div>
    </div>
</template>
<script setup>
import Checkbox from "~/components/form/checkbox.vue";
import useMasterDataService from "~/core/services/masterDataService";
const masterDataService = useMasterDataService()
const disabledAcceptTerm = ref(true)
const isAcceptTermCheck = ref(false)
const termRef = ref(null)
const termsData = ref({
    content: '',
    createAt: '',
    id: 0,
    version: ''
})
const props = defineProps({
    onChangeAcceptTerm: {
        type: Function,
        required: true
    }
});

onMounted(() => {
    getTermsAndContent()
})

const getTermsAndContent = async () => {
    const resp = await masterDataService.getTermsContent()
    if (resp.statusCode === 200) {
        termsData.value = resp.data
    }
}

const handleScroll = () => {
    if (termRef.value) {
        const termsDiv = termRef.value;
        const bottomReached =
            termsDiv.scrollHeight - termsDiv.scrollTop <= (termsDiv.clientHeight + 3);

        if (bottomReached) {
            disabledAcceptTerm.value = false;
        }
    }
}

watch(isAcceptTermCheck, (newValue) => {
    props.onChangeAcceptTerm(newValue)
});

</script>
