# MediSync | Operation Scheduler For Hospital Management

## Project Overview
**Domain**: Healthcare  
**Difficulty**: Medium  
**Technology Stack**: HTML5, CSS3, JavaScript (ES6), Firebase (Auth, Firestore, Storage)

MediSync is a dynamic scheduling solution for hospital Operation Theaters (OT). It replaces static timetables with a data-driven model that handles real-time changes such as emergencies, cancellations, and staff preferences.

## Key Features
- **Admin Dashboard**: Comprehensive monitoring of OT efficiency and resource usage.
- **Dynamic Scheduling**: Real-time updates for surgical procedures.
- **Resource Management**: Tracking of special drugs, instruments, and surgical materials.
- **Staff Portal**: Personalized schedules and patient chart access for medical professionals.
- **Audit Logging**: Mandatory logging of every system action for compliance.

## Project Structure
```text
├── index.html            # Landing Page / Portal Entry
├── css/
│   └── style.css         # Modern Glassmorphism Design System
├── js/
│   ├── main.js           # Core interactivity & Logging logic
│   ├── firebase-config.js # Firebase initialization template
│   └── dashboard.js      # Dashboard specific logic (upcoming)
├── pages/
│   ├── login.html        # Unified Auth Page
│   ├── register.html     # Staff Registration
│   ├── admin-dashboard.html
│   └── user-dashboard.html
└── documentation/        # LLD and Architecture docs
```

## Setup Instructions
1. **Clone the repository**:
   ```bash
   git clone <your-repo-link>
   cd operationschedular
   ```
2. **Firebase Configuration**:
   - Create a project in the [Firebase Console](https://console.firebase.google.com/).
   - Enable Authentication (Email/Password), Firestore, and Storage.
   - Copy your config keys into `js/firebase-config.js`.
3. **Execution**:
   - Simply open `index.html` in any modern web browser.
   - For a better experience, use a local server like `Live Server` in VS Code.

## Workflow
1. **Admin** logs in to manage doctors, patients, and theater schedules.
2. **Schedules** are created with specific OT IDs, anesthesia types, and required materials.
3. **Medical Staff** register and view their assigned procedures.
4. **Real-time Updates**: Any change made by the Admin is immediately visible to the staff.
5. **Post-Op**: Surgeons upload reports and remarks to complete the procedure record.

## Testing & Metrics
- **Performance**: Lightweight vanilla JS ensures fast load times (<1s).
- **Maintainability**: Modular script structure for easy scaling.
- **Logging**: All actions are audited via the `logAction` utility.

---
*Developed for Senior Design Assignment.*
