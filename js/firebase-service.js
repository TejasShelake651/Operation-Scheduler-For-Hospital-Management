import { db } from './firebase-config.js';
import { 
    collection, 
    addDoc, 
    getDocs, 
    onSnapshot, 
    query, 
    orderBy, 
    serverTimestamp,
    deleteDoc,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const auth = getAuth();

// Collection References
const surgeriesCol = collection(db, 'surgeries');
const patientsCol = collection(db, 'patients');

// 0. AUTH OPERATIONS
export const registerUser = async (email, password) => {
    return await createUserWithEmailAndPassword(auth, email, password);
};

export const loginUser = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
};

export const logoutUser = async () => {
    return await signOut(auth);
};

export const checkAuthState = (callback) => {
    return onAuthStateChanged(auth, callback);
};

// 1. SURGERY OPERATIONS
export const addSurgery = async (surgeryData) => {
    try {
        const docRef = await addDoc(surgeriesCol, {
            ...surgeryData,
            createdAt: serverTimestamp(),
            status: surgeryData.status || 'SCHEDULED'
        });
        return docRef.id;
    } catch (e) {
        console.error("Error adding surgery: ", e);
        throw e;
    }
};

export const streamSurgeries = (callback) => {
    const q = query(surgeriesCol, orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
        const surgeries = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(surgeries);
    });
};

// 2. PATIENT OPERATIONS
export const addDoctor = async (doctorData) => {
    try {
        const doctorsCol = collection(db, 'doctors');
        const docRef = await addDoc(doctorsCol, {
            ...doctorData,
            createdAt: serverTimestamp()
        });
        return docRef.id;
    } catch (e) {
        console.error("Error adding doctor: ", e);
        throw e;
    }
};

export const addPatient = async (patientData) => {
    try {
        const docRef = await addDoc(patientsCol, {
            ...patientData,
            createdAt: serverTimestamp()
        });
        return docRef.id;
    } catch (e) {
        console.error("Error adding patient: ", e);
        throw e;
    }
};

export const streamPatients = (callback) => {
    const q = query(patientsCol, orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
        const patients = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(patients);
    });
};

// 3. LOGGING OPERATIONS
export const streamLogs = (callback) => {
    const logsCol = collection(db, 'system_logs');
    const q = query(logsCol, orderBy('timestamp', 'desc'));
    return onSnapshot(q, (snapshot) => {
        const logs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate() || new Date()
        }));
        callback(logs);
    });
};

// 4. UTILITIES
export const deleteSurgery = async (id) => {
    await deleteDoc(doc(db, 'surgeries', id));
};

export const updateSurgeryStatus = async (id, status) => {
    await updateDoc(doc(db, 'surgeries', id), { status });
};
