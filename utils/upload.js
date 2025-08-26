const toast = useToast();
export const uploadFile = async (file) => {
   const types = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
   ];
   if (types.includes(file.type)) {
      const size = file.size / 1024 / 1000;
      if (size > 20) {
         toast.add({ title: "ไฟล์ต้องมีขนาดไม่เกิน 20MB", color: "red" });
         return;
      }
      const formData = new FormData();
      formData.append("file", file);

      const config = useRuntimeConfig();
      try {
         const res = await $fetch("/fileupload", {
            baseURL: config.public.apiBaseUrl,
            method: "POST",
            body: formData,
            headers: {},
         });
         if (res.code === 20000) {
            return { fileName: res.responseObject.filename, fileId: res.responseObject.fileId };
         } else {
            handleResponseError(res);
            return res;
         }
      } catch (error) {
         if (error.response && error.response._data) {
            handleResponseError(error.response._data);
         } else {
            toast.add({ title: "An unexpected error occurred", color: "red" });
         }
         return null;
      }
   } else {
      toast.add({ title: "Invalid file type", color: "red" });
      return null;
   }
};

export const uploadFileCV = async (file, personnelId) => {
   const types = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
   ];
   if (types.includes(file.type)) {
      const size = file.size / 1024 / 1000;
      if (size > 20) {
         toast.add({ title: "ไฟล์ต้องมีขนาดไม่เกิน 20MB", color: "red" });
         return;
      }
      const formData = new FormData();
      formData.append("file", file);

      const config = useRuntimeConfig();
      try {
         const res = await $fetch(`/personnel/${personnelId}/cv`, {
            baseURL: config.public.apiBaseUrl,
            method: "POST",
            body: formData,
            headers: {},
         });
         if (res.code === 20000) {
            toast.add({ title: res.message, color: "green" });
            return { fileName: res.responseObject.filename, fileId: res.responseObject.fileId };
         } else {
            handleResponseError(res);
            return res;
         }
      } catch (error) {
         if (error.response && error.response._data) {
            handleResponseError(error.response._data);
         } else {
            toast.add({ title: "An unexpected error occurred", color: "red" });
         }
         return null;
      }
   } else {
      toast.add({ title: "Invalid file type", color: "red" });
      return null;
   }
};

const handleResponseError = (res) => {
   if (res.code === 40100) {
      if (token.value) {
         token.value = null;
         toast.add({ title: res.message, color: "red" });
         navigateTo("/login");
      }
   } else {
      toast.add({ title: res.message || "An error occurred", color: "red" });
   }
};
