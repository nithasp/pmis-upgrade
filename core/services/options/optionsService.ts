import { useNuxtApp } from "#app";

export default function useOptionsService() {
    const { $api } = useNuxtApp();

    const getBerthsOptions = async () => {
        try {
            const response = await $api.get(`/options/berths`);
            return wrapperSuccessResp(response.data);
        } catch (error) {
            console.error("get berths option failed:", error);
            return wrapperErrorResp(error);
        }
    };

    const getBerthTypesOptions = async () => {
        try {
            const response = await $api.get(`/options/berth-types`);
            return wrapperSuccessResp(response.data);
        } catch (error) {
            console.error("get berth types option failed:", error);
            return wrapperErrorResp(error);
        }
    };

    const getPurposesOptions = async () => {
        try {
            const response = await $api.get(`/options/purposes`);
            return wrapperSuccessResp(response.data);
        } catch (error) {
            console.error("get purposes option failed:", error);
            return wrapperErrorResp(error);
        }
    };

    const getPurposeTypeOptions = async () => {
        try {
            const response = await $api.get(`/options/purpose-types`);
            return wrapperSuccessResp(response.data);
        } catch (error) {
            console.error("get purpose type option failed:", error);
            return wrapperErrorResp(error);
        }
    };

    const getLocationsOptions = async () => {
        try {
            const response = await $api.get(`/options/locations`);
            return wrapperSuccessResp(response.data);
        } catch (error) {
            console.error("get locations option failed:", error);
            return wrapperErrorResp(error);
        }
    };

    const getProductOptions = async () => {
        try {
            const response = await $api.get(`/options/products`);
            return wrapperSuccessResp(response.data);
        } catch (error) {
            console.error("get product option failed:", error);
            return wrapperErrorResp(error);
        }
    };

    const getProductGroupsOptions = async () => {
        try {
            const response = await $api.get(`/options/product-groups`);
            return wrapperSuccessResp(response.data);
        } catch (error) {
            console.error("get product types option failed:", error);
            return wrapperErrorResp(error);
        }
    };

    const getProductTypesOptions = async () => {
        try {
            const response = await $api.get(`/options/product-types`);
            return wrapperSuccessResp(response.data);
        } catch (error) {
            console.error("get product sub types option failed:", error);
            return wrapperErrorResp(error);
        }
    };

    const getProductGroupOptions = async () => {
        try {
            const response = await $api.get(`/admin/master-data/product-group/list`);
            return wrapperSuccessResp(response.data);
        } catch (error) {
            console.error("get product group option failed:", error);
            return wrapperErrorResp(error);
        }
    };

    const getCargoTypesOptions = async () => {
        try {
            const response = await $api.get(`/options/cargo-types`);
            return wrapperSuccessResp(response.data);
        } catch (error) {
            console.error("get cargo types option failed:", error);
            return wrapperErrorResp(error);
        }
    };

    const getCargoWharfageOptions = async () => {
        try {
            const response = await $api.get(`/options/cargo-wharfage`);
            return wrapperSuccessResp(response.data);
        } catch (error) {
            console.error("get cargo wharfage option failed:", error);
            return wrapperErrorResp(error);
        }
    };

    const getPaymentMethodOptions = async () => {
        try {
            const response = await $api.get(`/options/payment-methods`);
            return wrapperSuccessResp(response.data);
        } catch (error) {
            console.error("get cargo wharfage option failed:", error);
            return wrapperErrorResp(error);
        }
    };

    const getPaymentTermsOptions = async () => {
        try {
            const response = await $api.get(`/options/payment-terms`);
            return wrapperSuccessResp(response.data);
        } catch (error) {
            console.error("get cargo wharfage option failed:", error);
            return wrapperErrorResp(error);
        }
    };

    const getDocumentStatusOptions = async () => {
        try {
            const response = await $api.get(`/options/document-status`);
            return wrapperSuccessResp(response.data);
        } catch (error) {
            console.error("get document status option failed:", error);
            return wrapperErrorResp(error);
        }
    };

    const getVesselTypeOptions = async () => {
        try {
            const response = await $api.get(`/options/vessel-types`);
            return wrapperSuccessResp(response.data);
        } catch (error) {
            console.error("get vessel type option failed:", error);
            return wrapperErrorResp(error);
        }
    };

    const getVesselStatusOptions = async () => {
        try {
            const response = await $api.get(`/options/vessel-status`);
            return wrapperSuccessResp(response.data);
        } catch (error) {
            console.error("get vessel status option failed:", error);
            return wrapperErrorResp(error);
        }
    };

    const getVesselFlagOptions = async () => {
        try {
            const response = await $api.get(`/options/vessel-flags`);
            return wrapperSuccessResp(response.data);
        } catch (error) {
            console.error("get vessel flag option failed:", error);
            return wrapperErrorResp(error);
        }
    };

    const getJettiesOptions = async () => {
        try {
            const response = await $api.get(`/options/jetties`);
            return wrapperSuccessResp(response.data);
        } catch (error) {
            console.error("get vessel status option failed:", error);
            return wrapperErrorResp(error);
        }
    };


    const getBerthJettiesOptions = async (berthId: number) => {
        try {
            const response = await $api.get(`/options/berth-jetties/${berthId}`);
            return wrapperSuccessResp(response.data);
        } catch (error) {
            console.error("get berth jetties option failed:", error);
            return wrapperErrorResp(error);
        }
    };

    const getAcencyDocumentStatusOptions = async () => {
        try {
            const response = await $api.get(`/options/agency-document-status`);
            return wrapperSuccessResp(response.data);
        } catch (error) {
            console.error("get vessel status option failed:", error);
            return wrapperErrorResp(error);
        }
    };

    const getCargoOwnerOptions = async () => {
        try {
            const response = await $api.get(`/options/cargo-owners`);
            return wrapperSuccessResp(response.data);
        } catch (error) {
            console.error("get cargo owner option failed:", error);
            return wrapperErrorResp(error);
        }
    };

    const getVesselImportNewStatusOptions = async () => {
        try {
           const response = await $api.get(`/options/vessel-import-status`);
           return wrapperSuccessResp(response.data);
        } catch (error) {
           console.error("get vessel import new status options failed:", error);
           return wrapperErrorResp(error);
        }
     };
  

    return {
        getBerthsOptions,
        getBerthTypesOptions,
        getPurposesOptions,
        getPurposeTypeOptions,
        getLocationsOptions,
        getProductOptions,
        getProductGroupsOptions,
        getProductTypesOptions,
        getProductGroupOptions,
        getCargoTypesOptions,
        getCargoWharfageOptions,
        getPaymentMethodOptions,
        getPaymentTermsOptions,
        getDocumentStatusOptions,
        getVesselTypeOptions,
        getVesselStatusOptions,
        getVesselFlagOptions,
        getJettiesOptions,
        getBerthJettiesOptions,
        getAcencyDocumentStatusOptions,
        getCargoOwnerOptions,
        getVesselImportNewStatusOptions
    };
}
