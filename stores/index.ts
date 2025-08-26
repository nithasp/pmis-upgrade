export const useProfileStore = defineStore("profile", () => {
   const profileUser = ref({
      firstname: "",
      lastname: "",
      email: "",
      selectedRoleId: 0,
   });
   const setProfile = (data: { firstname: string; lastname: string; email: string; selectedRoleId: number }) => {
      const { firstname, lastname, email, selectedRoleId } = data;
      profileUser.value.firstname = firstname;
      profileUser.value.lastname = lastname;
      profileUser.value.email = email;
      profileUser.value.selectedRoleId = selectedRoleId;
   };
   return { profileUser, setProfile };
});
