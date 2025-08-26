// services/auth.ts

import { useNuxtApp } from '#app'
import type { AxiosResponse } from 'axios'
export default function useReportService() {
    const { $api } = useNuxtApp()

    const downloadExcelReport = async (endpoint: string, filename: string, filter = {}) => {
        try {
            const filterParams = convertObjToQueryString(filter);
            const response: AxiosResponse<Blob> = await $api.get(
                `${endpoint}?${filterParams}`,
                { responseType: 'blob' }
            );
    
            // Step 1: Create a Blob URL
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
    
            // Step 2: Trigger a download
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
    
            // Step 3: Revoke the Blob URL to release memory
            window.URL.revokeObjectURL(url);
    
            return {
                statusCode: 200,
                message: "success",
                data: 'File downloaded successfully',
                translation: "",
            };
        } catch (error) {
            console.error('Error downloading Excel report:', error);
            return {
                statusCode: 500,
                message: "error",
                data: 'File download error',
                translation: "",
            };
        }
    };
    
    const previewExcelReport = async (endpoint: string, filter = {}) => {
        try {
            const config = useRuntimeConfig();
            const baseUrl = config.public.apiBaseUrl;
            const filterParams = convertObjToQueryString(filter);
            const excelUrl = `${baseUrl}${endpoint}?${filterParams}`;
            return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(excelUrl)}`;
        } catch (error) {
            console.error('Error previewing Excel report:', error);
            return '';
        }
    };

    const getPdfData = async (url: string = "", filter: any = {}) => {
        try {
          const filterParams = convertObjToQueryString(filter);
          const response: AxiosResponse = await $api.get(`/reports/${url}/pdf?${filterParams}`);
          return response.data;
        } catch (error) {
          console.error('Download failed:', error);
          throw error;
        }
      };
      
    // Download Reports
    const downloadExcelReport1 = (filter = {}) => downloadExcelReport('/reports/sum-submit-late-order', 'sum_submit_late_order.xlsx', filter);
    const downloadExcelReport2 = (filter = {}) => downloadExcelReport('/reports/sum-submit-late-list', 'sum_submit_late_list.xlsx', filter);

    const downloadExcelReport6 = (filter = {}) => downloadExcelReport('/reports/document-count', 'document_count_report.xlsx', filter);
    const downloadExcelReport7 = (filter = {}) => downloadExcelReport('/reports/approved-agency', 'approved_agency_report.xlsx', filter);
    const downloadExcelReport3 = (filter = {}) => downloadExcelReport('/reports/user-document-count', 'count_document_user_report.xlsx', filter);

    const downloadExcelReportPortDues4_1 = (filter = {}) => downloadExcelReport('/reports/sum-vessel-agency', 'sum_vessel_by_agent_report.xlsx', filter);
    const downloadExcelReportPortDues4 = (filter = {}) => downloadExcelReport('/reports/sum-port-due-agency', 'sum_port_due_by_agent_report.xlsx', filter);
    const downloadExcelReportPortDues4_3 = (filter = {}) => downloadExcelReport('/reports/sum-cargo-value-port-agency', 'sum_cargo_value_port_by_agent_report.xlsx', filter);


    const downloadExcelReportPortDues5_1 = (filter = {}) => downloadExcelReport('/reports/sum-foreigner-agency', 'sum_foreigner_agency_by_agent.xlsx', filter);
    const downloadExcelReportPortDues5 = (filter = {}) => downloadExcelReport('/reports/sum-foreigner-port-due-agency', 'sum_foreigner_port_due_by_agent.xlsx', filter);
    const downloadExcelReportPortDues5_3 = (filter = {}) => downloadExcelReport('/reports/sum-foreigner-cargo-value-port-agency', 'sum_foreigner_cargo_value_port_by_agent.xlsx', filter);



    // Preview Reports
    const previewExcelReport1 = (filter = {}) => previewExcelReport('/reports/sum-submit-late-order', filter);
    const previewExcelReport2 = (filter = {}) => previewExcelReport('/reports/sum-submit-late-list', filter);

    const previewExcelReport6 = (filter = {}) => previewExcelReport('/reports/document-count', filter);
    const previewExcelReport7 = (filter = {}) => previewExcelReport('/reports/approved-agency', filter);
    const previewExcelReport3 = (filter = {}) => previewExcelReport('/reports/user-document-count', filter);

    const previewExcelReportPortDues4_1 = (filter = {}) => previewExcelReport('/reports/sum-vessel-agency', filter);
    const previewExcelReportPortDues4 = (filter = {}) => previewExcelReport('/reports/sum-port-due-agency', filter);
    const previewExcelReportPortDues4_3 = (filter = {}) => previewExcelReport('/reports/sum-cargo-value-port-agency', filter);

    const previewExcelReportPortDues5_1 = (filter = {}) => previewExcelReport('/reports/sum-foreigner-agency', filter);
    const previewExcelReportPortDues5 = (filter = {}) => previewExcelReport('/reports/sum-foreigner-port-due-agency', filter);
    const previewExcelReportPortDues5_3 = (filter = {}) => previewExcelReport('/reports/sum-foreigner-cargo-value-port-agency', filter);



    return {
        downloadExcelReport1,
        downloadExcelReport2,
        downloadExcelReport6,
        downloadExcelReport7,
        downloadExcelReport3,

        downloadExcelReportPortDues4_1,
        downloadExcelReportPortDues4,
        downloadExcelReportPortDues4_3,

        downloadExcelReportPortDues5_1,
        downloadExcelReportPortDues5,
        downloadExcelReportPortDues5_3,

        previewExcelReport6,
        previewExcelReport7,
        previewExcelReport3,
        
        previewExcelReportPortDues4_1,
        previewExcelReportPortDues4,
        previewExcelReportPortDues4_3,

        previewExcelReportPortDues5_1,
        previewExcelReportPortDues5,
        previewExcelReportPortDues5_3,

        previewExcelReport1,
        previewExcelReport2,

        getPdfData
    }
}
