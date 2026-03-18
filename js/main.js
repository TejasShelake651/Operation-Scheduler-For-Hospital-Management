// MediSync Core Intelligence System
// Handling global interactions, modular logic, and UI feedback

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initModals();
    initForms();
    initDynamicTables();
    console.log('MediSync Engine: Fully Operational');
});

// 1. Navigation & Active States
function initNavigation() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        // Reset active state based on URL
        if (link.getAttribute('href') && currentPath.includes(link.getAttribute('href').split('/').pop())) {
            link.classList.add('active');
        }

        // Add click feedback
        link.addEventListener('mousedown', () => {
            link.style.transform = 'scale(0.95)';
        });
        link.addEventListener('mouseup', () => {
            link.style.transform = 'scale(1)';
        });
    });
}

// 2. Modal Management System
function initModals() {
    const modals = document.querySelectorAll('[id$="Modal"]');
    const closeButtons = document.querySelectorAll('.close-modal, [onclick*="display=\'none\'"]');

    // Close on background click
    window.onclick = (event) => {
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    };

    // ESC key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(m => m.style.display = 'none');
        }
    });
}

// 3. Form Submission Engine (Simulated)
function initForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Skip forms that have their own authentication handlers
        if (form.id === 'loginForm' || form.id === 'registerForm') {
            return;
        }
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // UI Feedback
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> PROCESSING...';
            
            setTimeout(() => {
                showToast('Transaction Successful: Data Synchronized', 'success');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Hide containing modal if exists
                const modal = form.closest('[id$="Modal"]');
                if (modal) modal.style.display = 'none';
                
                form.reset();
                logAction('System', 'Form Submit', `Form ID: ${form.id || 'Generic'}`);
            }, 1000);
        });
    });
}

// 4. Dynamic Table Interactions
function initDynamicTables() {
    // Delete Button Logic
    document.addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.fa-trash')?.parentElement;
        if (deleteBtn) {
            const row = deleteBtn.closest('tr');
            if (confirm('Are you sure you want to remove this record from the clinical registry?')) {
                row.style.opacity = '0';
                row.style.transform = 'translateX(20px)';
                setTimeout(() => {
                    row.remove();
                    showToast('Record Purged Successfully', 'success');
                }, 300);
            }
        }

        // Edit Button Logic
        const editBtn = e.target.closest('.fa-pen-to-square')?.parentElement;
        if (editBtn) {
            showToast('Loading Editor Interface...', 'info');
            // Logic to populate a modal would go here
        }
    });

    // Search Filtering
    const searchInputs = document.querySelectorAll('input[placeholder*="Search"]');
    searchInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const table = document.querySelector('.data-table');
            if (!table) return;
            
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(term) ? '' : 'none';
            });
        });
    });
}

// TOAST NOTIFICATION UTILITY
export const showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    const colors = {
        success: '#10b981',
        danger: '#ef4444',
        info: '#2563eb',
        warning: '#f59e0b'
    };

    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: white;
        color: #1e293b;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
        border-left: 5px solid ${colors[type]};
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 9999;
        font-weight: 600;
        animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    `;

    toast.innerHTML = `
        <i class="fa-solid ${type === 'success' ? 'fa-check-circle' : 'fa-circle-exclamation'}" style="color: ${colors[type]}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
};

// GLOBAL LOGGER
export const logAction = (user, action, details) => {
    console.log(`%c[MEDISYNC LOG] ${new Date().toLocaleTimeString()} | ${user} | ${action}`, 'color: #2563eb; font-weight: bold;', details);
};

// CSS Injection for Animations
const style = document.createElement('style');
style.innerHTML = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);
