import { UserStatusEnum } from "~/utils/enums/UserStatusEnum";

export const renderStatusText = (t: Function, status: any) => {
    const statusTextMap = {
      [UserStatusEnum.WaitingReview]: t("waiting_for_review"),
      [UserStatusEnum.WaitingApproved]: t("waiting_for_approval"),
      [UserStatusEnum.Approved]: t("approve"),
    };
  
    return statusTextMap[status as UserStatusEnum] || "n/a";
  };
  
  export const renderStatusType = (status: any) => {
    const statusTypeMap = {
      [UserStatusEnum.WaitingReview]: "warning",
      [UserStatusEnum.WaitingApproved]: "purple",
      [UserStatusEnum.Approved]: "green",
    };
  
    return statusTypeMap[status as UserStatusEnum] || "gray";
  };