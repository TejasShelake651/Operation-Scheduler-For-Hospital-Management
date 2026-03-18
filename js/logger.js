import { db } from './firebase-config.js';
import { 
    collection, 
    addDoc, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const logsCol = collection(db, 'system_logs');

/**
 * Global Logger for MediSync
 * Records every significant action to Firebase for audit trails
 * @param {string} action - Descriptive name of the action (e.g., 'ADD_SURGERY')
 * @param {string} user - ID or Role of the performer
 * @param {Object} details - Additional metadata related to the action
 * @param {string} level - Log level ('INFO', 'WARNING', 'ERROR')
 */
export const logAction = async (action, user, details = {}, level = 'INFO') => {
    try {
        console.log(`[${level}] ${action} by ${user}:`, details);
        
        await addDoc(logsCol, {
            action,
            user,
            details,
            level,
            timestamp: serverTimestamp(),
            userAgent: navigator.userAgent
        });
    } catch (e) {
        console.error("Critical: Logging failed", e);
    }
};

export const LOG_LEVELS = {
    INFO: 'INFO',
    WARNING: 'WARNING',
    ERROR: 'ERROR'
};

export const ACTIONS = {
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    ADD_SURGERY: 'ADD_SURGERY',
    UPDATE_SURGERY: 'UPDATE_SURGERY',
    DELETE_SURGERY: 'DELETE_SURGERY',
    ADD_PATIENT: 'ADD_PATIENT',
    ADD_DOCTOR: 'ADD_DOCTOR',
    SYNC_DATA: 'SYNC_DATA'
};
