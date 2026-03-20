import { db, auth } from './firebase-config.js';
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
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Collection References
const surgeriesCol = collection(db, 'surgeries');
const patientsCol = collection(db, 'patients');

// 0. AUTH OPERATIONS (MOCKED FOR OFFLINE/TESTING)
export const registerUser = async (email, password) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ user: { uid: 'mock-uid-' + Date.now(), email } });
        }, 1200);
    });
};

export const loginUser = async (email, password) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if(password.length < 6) {
                reject(new Error("auth/wrong-password"));
            } else {
                resolve({ user: { uid: 'mock-uid-' + Date.now(), email } });
            }
        }, 1200);
    });
};

export const logoutUser = async () => {
    return new Promise((resolve) => setTimeout(resolve, 500));
};

export const checkAuthState = (callback) => {
    // Mock user always logged in for testing
    callback({ uid: 'mock-uid', email: 'test@medisync.local' });
    return () => {}; // Mock unsubscribe
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
        console.warn("API Error: Falling back to Local Storage", e);
        const localSurgeries = JSON.parse(localStorage.getItem('mockSurgeries') || '[]');
        const newSurgery = { id: 'mock-' + Date.now(), ...surgeryData };
        localSurgeries.push(newSurgery);
        localStorage.setItem('mockSurgeries', JSON.stringify(localSurgeries));
        window.dispatchEvent(new Event('storage')); // Trigger update across tabs
        return newSurgery.id;
    }
};

export const streamSurgeries = (callback) => {
    const q = query(surgeriesCol, orderBy('createdAt', 'desc'));
    
    let lastFirebaseDocs = [];
    const pullData = () => {
        const local = JSON.parse(localStorage.getItem('mockSurgeries') || '[]').reverse();
        callback([...local, ...lastFirebaseDocs]);
    };

    window.addEventListener('storage', pullData);

    try {
        return onSnapshot(q, (snapshot) => {
            lastFirebaseDocs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            pullData();
        }, (error) => {
            console.warn("Firestore snapshot failed, using mock data", error);
            pullData();
        });
    } catch (e) {
        pullData();
    }
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

export const streamDoctors = (callback) => {
    const doctorsCol = collection(db, 'doctors');
    const q = query(doctorsCol, orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
        let doctors = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        // Inject Random Mock Doctors if the database is currently empty
        if (doctors.length === 0) {
            doctors = [
                { id: 'd1', name: 'Julian Moore', specialization: 'Cardiovascular Surgery', experience: '15', contact: 'jm@domain.com' },
                { id: 'd2', name: 'Sarah Chen', specialization: 'Neurology', experience: '12', contact: 'sc@domain.com' },
                { id: 'd3', name: 'Michael Ross', specialization: 'Orthopedics', experience: '8', contact: 'mr@domain.com' },
                { id: 'd4', name: 'Elena Rodriguez', specialization: 'Anesthesiology', experience: '10', contact: 'er@domain.com' }
            ];
        }
        callback(doctors);
    });
};

// 4. UTILITIES
export const deleteSurgery = async (id) => {
    try {
        await deleteDoc(doc(db, 'surgeries', id));
    } catch (e) {
        let local = JSON.parse(localStorage.getItem('mockSurgeries') || '[]');
        local = local.filter(s => s.id !== id);
        localStorage.setItem('mockSurgeries', JSON.stringify(local));
        window.dispatchEvent(new Event('storage'));
    }
};

export const updateSurgeryStatus = async (id, status) => {
    try {
        await updateDoc(doc(db, 'surgeries', id), { status });
    } catch (e) {
        const local = JSON.parse(localStorage.getItem('mockSurgeries') || '[]');
        const target = local.find(s => s.id === id);
        if(target) target.status = status;
        localStorage.setItem('mockSurgeries', JSON.stringify(local));
        window.dispatchEvent(new Event('storage'));
    }
};
