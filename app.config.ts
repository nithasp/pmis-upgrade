export default defineAppConfig({
   ui: {
      primary: "primaryy",
      gray: "grayy",
      purple: "purple",
      notifications: {
         position: "top-0 bottom-auto",
      },
      formGroup: {
         label: {
            base: "font-anuphan-medium text-grayy-400",
         },
      },
      input: {
         default: {
            variant: "outline",
            color: "white",
         },
         base: "px-3.5 py-2.5",
         placeholder: "placeholder-text-grayy-75",
      },
      select: {
         placeholder: "text-grayy-75",
      },
      table: {
         th: {
            base: "text-left rtl:text-right",
            padding: "px-4 py-3.5",
            color: "text-grayy-75 dark:text-white bg-purple-25",
            font: "font-semibold",
            size: "text-sm",
         },
         td: {
            color: "text-grayy-400",
         },
         default: {
            sortButton: {
               class: '[&:nth-child(1)]:[&_span]:font-anuphan-medium [&_span]:!text-grayy-75 px-0 hover:bg-transparent',
            },
         },
      },
      dropdown: {
         rounded: "rounded-lg",
         width: "",
         item: {
            base: "hover:bg-grayy-50",
            label: "font-anuphan-medium text-grayy-400 ml-1",
            size: "text-sm",
            avatar: {
               base: "[&_img]:rounded-none [&_img]:w-4 [&_img]:h-4",
            },
            padding: "p-[8px_6px_8px_12px]",
         },
      },
      button: {
         base: "[&_span]:font-anuphan-semi-bold",
      },
   },
});
