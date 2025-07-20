import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import axios from 'axios';

// Define the base URL for your reports API. Adjust if necessary.
const API_URL = 'http://localhost:5000/api/transactions';

// Define the initial state for the store
const initialState = {
  // State for Dashboard Summary
  dashboardSummary: null,
  isSummaryLoading: false,
  summaryError: null,

  // State for Report Generation
  reportData: null,
  isReportLoading: false,
  reportError: null,
  isReportModalOpen: false,
};

// Define the types for the store (optional but recommended)
/*
  interface DashboardSummary {
    totalIncome: number;
    totalExpense: number;
    netBalance: number;
    // ... any other fields from your summary endpoint
  }

  interface ReportData {
    // ... shape of your generated report
  }

  interface ReportState {
    dashboardSummary: DashboardSummary | null;
    isSummaryLoading: boolean;
    summaryError: string | null;
    reportData: ReportData | null;
    isReportLoading: boolean;
    reportError: string | null;
    isReportModalOpen: boolean;
    fetchDashboardSummary: (token: string) => Promise<void>;
    generateReport: (options: { type: string; dateRange: [Date, Date] }, token: string) => Promise<void>;
    openReportModal: () => void;
    closeReportModal: () => void;
  }
*/


export const useReportStore = create(
  immer((set) => ({
    ...initialState,

    /**
     * Fetches the dashboard summary data from the backend.
     * @param {string} token - The Auth0 access token for authorization.
     */
    fetchDashboardSummary: async (token) => {
      set({ isSummaryLoading: true, summaryError: null });
      try {
          const response = await axios.get(`${API_URL}`, {
              headers: {
                  Authorization: `Bearer ${token}`,
                },
            });
            console.log(response)
        set({ dashboardSummary: response.data, isSummaryLoading: false });
      } catch (err) {
        const error = err.response?.data?.message || err.message || 'Failed to fetch dashboard summary';
        set({ isSummaryLoading: false, summaryError: error });
        console.error("Error fetching dashboard summary:", error);
      }
    },

    /**
     * Generates a report based on the provided options.
     * @param {object} options - The parameters for the report (e.g., type, dateRange).
     * @param {string} token - The Auth0 access token for authorization.
     */
    generateReport: async (options, token) => {
      set({ isReportLoading: true, reportError: null, reportData: null });
      try {
        // Assuming a POST endpoint for generating reports
        const response = await axios.post(`${API_URL}/generate`, options, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        set({ reportData: response.data, isReportLoading: false });
      } catch (err) {
        const error = err.response?.data?.message || err.message || 'Failed to generate report';
        set({ isReportLoading: false, reportError: error });
        console.error("Error generating report:", error);
      }
    },

    /**
     * Opens the report generation modal.
     */
    openReportModal: () => {
      set({ isReportModalOpen: true });
    },

    /**
     * Closes the report generation modal and clears any previous report data/errors.
     */
    closeReportModal: () => {
      set({ 
        isReportModalOpen: false, 
        reportData: null, 
        reportError: null 
      });
    },
  }))
);