// API service for timesheet operations
// Communicates with save-service (port 3000) and submit-service (port 3001)

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
const SAVE_SERVICE_URL = `${BASE_URL}`;
const SUBMIT_SERVICE_URL = `${BASE_URL.replace('3000', '3001')}`;

export interface TimesheetRecord {
  date: string | Date;
  hours: number;
  employeeId: string;
  projectId: string;
  taskId: string;
  recordType: string;
}

export interface TimesheetResponse {
  message: string;
  data: any;
  action: string;
}

export interface WeeklyTimesheetRequest {
  startDate: string;
  endDate: string;
  hours: number;
  employeeId: string;
  projectId: string;
  recordType: string;
  taskId: string;
}

/**
 * Check the health status of save-service
 */
export const checkSaveServiceHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${SAVE_SERVICE_URL}/save-service/health`);
    return response.ok;
  } catch (error) {
    console.error('Save service health check failed:', error);
    return false;
  }
};

/**
 * Check the health status of submit-service
 */
export const checkSubmitServiceHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${SUBMIT_SERVICE_URL}/submit-service/health`);
    return response.ok;
  } catch (error) {
    console.error('Submit service health check failed:', error);
    return false;
  }
};

/**
 * Fetch timesheets from save-service with optional filters
 */
export const getSavedTimesheets = async (
  employeeId?: string,
  startDate?: string,
  endDate?: string
): Promise<TimesheetResponse> => {
  try {
    const params = new URLSearchParams();
    if (employeeId) params.append('employeeId', employeeId);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await fetch(`${SAVE_SERVICE_URL}/save-service/timesheets${query}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching saved timesheets:', error);
    throw error;
  }
};

/**
 * Fetch a single saved timesheet by ID
 */
export const getSavedTimesheetById = async (id: string): Promise<TimesheetResponse> => {
  try {
    const response = await fetch(`${SAVE_SERVICE_URL}/save-service/timesheets/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching saved timesheet:', error);
    throw error;
  }
};

/**
 * Save a single timesheet record to the save-service
 */
export const saveTimesheet = async (record: TimesheetRecord): Promise<TimesheetResponse> => {
  try {
    const response = await fetch(`${SAVE_SERVICE_URL}/save-service/timesheets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date: record.date instanceof Date ? record.date.toISOString().split('T')[0] : record.date,
        hours: record.hours,
        employeeId: record.employeeId,
        projectId: record.projectId,
        taskId: record.taskId,
        recordType: record.recordType,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error saving timesheet:', error);
    throw error;
  }
};

/**
 * Save multiple timesheets for a week
 */
export const saveWeeklyTimesheets = async (request: WeeklyTimesheetRequest): Promise<TimesheetResponse> => {
  try {
    const response = await fetch(`${SAVE_SERVICE_URL}/save-service/timesheets/weekly`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error saving weekly timesheets:', error);
    throw error;
  }
};

/**
 * Submit a single timesheet record to the submit-service
 */
export const submitTimesheet = async (record: TimesheetRecord): Promise<TimesheetResponse> => {
  try {
    const response = await fetch(`${SUBMIT_SERVICE_URL}/submit-service/timesheets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date: record.date instanceof Date ? record.date.toISOString().split('T')[0] : record.date,
        hours: record.hours,
        employeeId: record.employeeId,
        projectId: record.projectId,
        taskId: record.taskId,
        recordType: record.recordType,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error submitting timesheet:', error);
    throw error;
  }
};

/**
 * Submit multiple timesheets for a week
 */
export const submitWeeklyTimesheets = async (request: WeeklyTimesheetRequest): Promise<TimesheetResponse> => {
  try {
    const response = await fetch(`${SUBMIT_SERVICE_URL}/submit-service/timesheets/weekly`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error submitting weekly timesheets:', error);
    throw error;
  }
};

/**
 * Fetch timesheets from submit-service with optional filters
 */
export const getSubmittedTimesheets = async (
  employeeId?: string,
  startDate?: string,
  endDate?: string
): Promise<TimesheetResponse> => {
  try {
    const params = new URLSearchParams();
    if (employeeId) params.append('employeeId', employeeId);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await fetch(`${SUBMIT_SERVICE_URL}/submit-service/timesheets${query}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching submitted timesheets:', error);
    throw error;
  }
};

/**
 * Fetch a single submitted timesheet by ID
 */
export const getSubmittedTimesheetById = async (id: string): Promise<TimesheetResponse> => {
  try {
    const response = await fetch(`${SUBMIT_SERVICE_URL}/submit-service/timesheets/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching submitted timesheet:', error);
    throw error;
  }
};
