const toast = useToast();
import { format, parseISO } from "date-fns";
import { th } from "date-fns/locale";
import { UserTypeEnum } from "./enums/UserTypeEnum";

export const wrapperSuccessResp = (resp) => {
   return {
      statusCode: 200,
      message: "success",
      data: resp.data,
      translation: "",
   };
};

export const wrapperErrorResp = (error) => {
   return {
      statusCode: error.response.status,
      message: typeof error.response.data === "object" ? error.response.data.error.message : "",
      data: {},
      translation: typeof error.response.data === "object" ? error.response.data.error.translation : "",
   };
};

export const formatFileSize = (size) => {
   const units = ["bytes", "KB", "MB", "GB", "TB"];
   let index = 0;
   let formattedSize = size;

   while (formattedSize >= 1024 && index < units.length - 1) {
      formattedSize /= 1024;
      index++;
   }

   return `${formattedSize?.toFixed(2)} ${units[index]}`;
};

export const convertObjToQueryString = (params) => {
   const queryString = Object.keys(params)
     .filter((key) => params[key] !== "" && params[key] !== 0)
     .map((key) => {
       let value = params[key];
       if (typeof value === "object") {
         value = JSON.stringify(value);
       }
       return encodeURIComponent(key) + "=" + encodeURIComponent(value);
     })
     .join("&");
 
   return queryString;
 };
 
export const getNumCountPagination = (index, currentPage, pageSize) => {
   const baseIndex = (currentPage - 1) * pageSize;
   const rowNumber = baseIndex + index + 1;
   return rowNumber;
};

export const debounce = (fn, delay) => {
   let timeout;
   return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), delay);
   };
};

export const debounceFilterSearch = (fn) => {
   let timeout;
   return function (delay, ...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), delay);
   };
};

export const renderDateFormat = (date, pattern = DATE_FORMAT_MAIN) => {
   if (date) {
      return format(parseISO(date), pattern);
   } else {
      return "";
   }
};

export const renderTimeFormat = (date, pattern = TIME_FORMAT_MAIN) => {
   if (date) {
      return format(parseISO(date), pattern);
   } else {
      return "";
   }
};

export const renderDateFormatTH = (date) => {
   return format(new Date(date), "d MMMM yyyy", { locale: th });
};

export const renderPersonType = (personType) => {
   const findPersonType = personTypeOption.find((e) => e.id === personType);
   if (findPersonType) {
      return findPersonType.name;
   }
   return "";
};

export const adjustToUTC = (dateString) => {
   const date = new Date(dateString);
   return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString();
};

export const personTypeOption = [
   {
      id: "corporate",
      name: "นิติบุคคล",
   },
   {
      id: "personal",
      name: "บุคคลธรรมดา",
   },
];

export const statusOption = [
   // {
   //    id: "WaitingReview",
   //    name: "รอตรวจ",
   // },
   {
      id: "WaitingApproved",
      name: "รออนุมัติ",
   },
   {
      id: "Approved",
      name: "เปิดใช้งาน",
   },
];

export const formatNumber = (num, decimal = 2) => {
   return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: decimal,
      maximumFractionDigits: decimal,
   }).format(num);
};

export const isEmpty = (obj) => {
   return Object.keys(obj).length === 0;
};
export const getVtmsStatus = (status, type = "type") => {
   let result = { label: "", type: "" };
   switch (status.trim().toLowerCase()) {
      case "waitinspection":
      case "anchor":
      case "pendingreview":
         result = { label: status, type: "orange" };
         break;
      case "waitcorrection":
      case "departure":
      case "pendingedit":
      case "pendingberth":
         result = { label: status, type: "red" };
         break;
      case "waitportconfirm":
      case "pendingconfirmation":
      case "pendingconfirmation1":
      case "pendingconfirmation2":
         result = { label: status, type: "blue" };
         break;
      case "waitapprove":
      case "pendingapproval":
         result = { label: status, type: "purple" };
         break;
      case "approve":
      case "arrival":
      case "approved":
      case "berth":
         result = { label: status, type: "green" };
         break;
      case "aweigh":
      case "wait":
      case "draft":
      case "canceled":
      case "admincanceled":
      case "unknown":
         result = { label: status, type: "gray" };
         break;

      default:
         result = { label: status, type: "gray" };
         break;
   }
   return result[type];
};

export const allowPermission = (permission) => {
   const profileJSON = localStorage.getItem("profileUser") || "{}";
   const profileUser = JSON.parse(profileJSON);
   const storedPermissions = localStorage.getItem("permissions");
   if (profileUser.type === UserTypeEnum.User) {
      const decodedPermissions = storedPermissions ? atob(storedPermissions).split(",") : [];
      return decodedPermissions.includes(permission);
   }
   return true;
};

export const formatISOToCustomDate = (isoString, includeTime = false) => {
   const date = new Date(isoString);

   const day = String(date.getDate()).padStart(2, "0");
   const month = String(date.getMonth() + 1).padStart(2, "0");
   const year = date.getFullYear();
   const hours = String(date.getHours()).padStart(2, "0");
   const minutes = String(date.getMinutes()).padStart(2, "0");

   if (includeTime) {
      return `${day}/${month}/${year} ${hours}:${minutes}`;
   } else {
      return `${day}/${month}/${year}`;
   }
};

export const convertTimezone = (date, offsetHours, includeMilliseconds = true) => {
   const localDate = new Date(date.getTime() + offsetHours * 60 * 60 * 1000);
   const year = localDate.getUTCFullYear();
   const month = String(localDate.getUTCMonth() + 1).padStart(2, "0");
   const day = String(localDate.getUTCDate()).padStart(2, "0");
   const hours = String(localDate.getUTCHours()).padStart(2, "0");
   const minutes = String(localDate.getUTCMinutes()).padStart(2, "0");
   const seconds = String(localDate.getUTCSeconds()).padStart(2, "0");
   const milliseconds = String(localDate.getUTCMilliseconds()).padStart(3, "0");

   const offset = `+${String(offsetHours).padStart(2, "0")}:00`;
   let formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
   if (includeMilliseconds) {
      formattedDate += `.${milliseconds}`;
   }

   formattedDate += offset;
   return formattedDate;
};

export const generateDateTimeOffset = () => {
   return convertTimezone(new Date(), 7, false);
};

export const convertDateAndTimeStringFormat = (dateString) => {
   const dateObj = new Date(dateString);

   const day = String(dateObj.getDate()).padStart(2, "0");
   const month = String(dateObj.getMonth() + 1).padStart(2, "0");
   const year = dateObj.getFullYear();
   const formattedDate = `${day}/${month}/${year}`;

   const hours = String(dateObj.getHours()).padStart(2, "0");
   const minutes = String(dateObj.getMinutes()).padStart(2, "0");
   const formattedTime = `${hours}:${minutes}`;

   return {
      date: formattedDate,
      time: formattedTime,
   };
};

export const compareDateWithToday = (dateString, resetTime = false) => {
   const normalizeDate = (date) => (resetTime ? new Date(date).setHours(0, 0, 0, 0) : new Date(date).getTime());

   const givenDate = normalizeDate(dateString);
   const today = normalizeDate(new Date());

   return givenDate > today ? "ahead" : givenDate < today ? "behind" : "sameDay";
};

export const isDate1BeforeDate2 = (date1, date2) => {
   const d1 = new Date(date1);
   const d2 = new Date(date2);

   return d1 < d2;
};

export const generateInputDecimal = (event, type) => {
   const ele = event.target;
   const decimal = parseInt(ele.getAttribute("data-decimal")) || 0;
   let val = ele.value;

   if (type === "inputEvent") {
      val = val.replace(/[^0-9.]/g, "");
      const parts = val.split(".");
      if (parts.length > 2) {
         val = parts[0] + "." + parts.slice(1).join("");
      }

      if (!isNaN(decimal)) {
         if (decimal > 0) {
            const splitVal = val.split(".");
            if (splitVal.length === 2 && splitVal[1].length > decimal) {
               ele.value = splitVal[0] + "." + splitVal[1].substring(0, decimal);
            } else {
               ele.value = val;
            }
         } else if (decimal === 0) {
            ele.value = val.split(".")[0];
         }
      } else {
         ele.value = val;
      }
   }

   if (type === "blurEvent") {
      if (!val) return;
      val = val.replace(/,/g, "");
      const [integerPart, decimalPart = ""] = val.split(".");
      const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      const fixedDecimals = decimalPart.padEnd(decimal, "0");
      ele.value = `${formattedInteger}.${fixedDecimals}`;
   }
};

export const getInputDecimal = (val, decimalValue) => {
   if (!val) return;
   val = val.replace(/,/g, "");
   const [integerPart, decimalPart = ""] = val.split(".");
   const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
   if (decimalValue === 0) {
      return formattedInteger;
   }
   const fixedDecimals = decimalPart.padEnd(decimalValue, "0");
   return `${formattedInteger}.${fixedDecimals}`;
};

export const removeCommaAndConvertToNumber = (value) => {
   if (typeof value === 'number') return value;
   if (typeof value === 'string') {
     const noCommaString = value.replace(/,/g, "");
     return Number(noCommaString);
   }
   return 0;
 };

export const generateRandomId = () => {
   return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
   });
};

export const convertToThaiDateString = (dateStr, era = 'buddhist') => {
   const thaiMonths = [
     "มกราคม",
     "กุมภาพันธ์",
     "มีนาคม",
     "เมษายน",
     "พฤษภาคม",
     "มิถุนายน",
     "กรกฎาคม",
     "สิงหาคม",
     "กันยายน",
     "ตุลาคม",
     "พฤศจิกายน",
     "ธันวาคม"
   ];

   const [yearStr, monthStr, dayStr] = dateStr.split('-');
   const year = parseInt(yearStr, 10);
   const month = parseInt(monthStr, 10);
   const day = parseInt(dayStr, 10);
   const convertedYear = era === 'buddhist' ? year + 543 : year;
   const thaiMonth = thaiMonths[month - 1];
   return `${day} ${thaiMonth} ${convertedYear}`;
};