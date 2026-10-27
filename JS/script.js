document.addEventListener("DOMContentLoaded", () => {
    // 1. Initialize Theme
    initTheme();

    // 2. Page-Specific Logic
    if (document.getElementById('chatInput')) initChat();
    if (document.getElementById('loginBtn')) initAuth();
    if (document.getElementById('nav')) initNav();
    if (document.getElementById('statNumbers')) initLanding();
    if (document.getElementById('settingsPage')) initSettings();
});

/* ==========================================
   TOAST NOTIFICATION SYSTEM
   ========================================== */
function showToast(message) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas fa-info-circle" style="color: var(--primary-light);"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

/* ==========================================
   THEME SYSTEM
   ========================================== */
function initTheme() {
    const currentTheme = localStorage.getItem('futent_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('futent_theme', next);
    showToast(`Switched to ${next} mode`);
}

/* ==========================================
   LANDING PAGE LOGIC
   ========================================== */
function initNav() {
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => {
        nav.classList.toggle('is-scrolled', window.scrollY > 20);
    });
}

function initLanding() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
        });
    });
}

/* ==========================================
   AUTHENTICATION (Login / Register)
   ========================================== */
function initAuth() {
    // Login
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const code = document.getElementById('loginCode').value;
            const pass = document.getElementById('loginPassword').value;
            const phone = document.getElementById('loginPhone').value;

            if (!code || !pass || !phone) return showToast('⚠️ Please fill in all fields');
            if (code.length !== 5) return showToast('⚠️ Code must be 5 characters');

            localStorage.setItem('futent_logged_in', 'true');
            localStorage.setItem('futent_phone', phone);
            showToast('✅ Login successful!');
            setTimeout(() => window.location.href = 'chat.html', 1500);
        });
    }

    // Register
    const regBtn = document.getElementById('registerBtn');
    if (regBtn) {
        regBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const fname = document.getElementById('regName').value;
            const lname = document.getElementById('regSurname').value;
            const code = document.getElementById('regCode').value;
            const pass = document.getElementById('regPassword').value;
            const phone = document.getElementById('regPhone').value;

            if (!fname || !lname || !code || !pass || !phone) return showToast('⚠️ Please fill all fields');
            if (code.length !== 5) return showToast('⚠️ Code must be exactly 5 characters');
            if (pass.length < 8) return showToast('⚠️ Password must be 8+ characters');

            localStorage.setItem('futent_username', fname);
            localStorage.setItem('futent_phone', phone);
            localStorage.setItem('futent_logged_in', 'true');
            
            showToast('✅ Registration successful!');
            setTimeout(() => window.location.href = 'chat.html', 1500);
        });
    }

    // Toggle forms
    const showReg = document.getElementById('showRegister');
    const showLog = document.getElementById('showLogin');
    if (showReg && showLog) {
        showReg.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('login-form').classList.add('hidden-form');
            document.getElementById('register-form').classList.remove('hidden-form');
        });
        showLog.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('register-form').classList.add('hidden-form');
            document.getElementById('login-form').classList.remove('hidden-form');
        });
    }
}

/* ==========================================
   CHAT INTERFACE
   ========================================== */
function initChat() {
    // Authentication Guard
    if (localStorage.getItem('futent_logged_in') !== 'true') {
        showToast('🔒 Please log in first');
        setTimeout(() => window.location.href = 'login.html', 1000);
        return;
    }

    // Set user profile
    const username = localStorage.getItem('futent_username') || 'Student';
    document.getElementById('avatarDisplay').textContent = username.charAt(0).toUpperCase();
    
    // Menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const dropdownMenu = document.getElementById('dropdownMenu');
    if (menuToggle) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
        });
        document.addEventListener('click', () => dropdownMenu.classList.remove('show'));
    }

    const chatInput = document.getElementById('chatInput');
    const messagesContainer = document.getElementById('messagesContainer');
    const typingIndicator = document.getElementById('typingIndicator');

    // Auto-resize textarea
    chatInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    // Handle enter key
    chatInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    window.sendMessage = function() {
        const text = chatInput.value.trim();
        if (!text) return;

        // Add user message
        addMessage(text, 'user');
        chatInput.value = '';
        chatInput.style.height = '44px';
        
        // Show typing
        typingIndicator.style.display = 'flex';
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Simulate AI response
        setTimeout(() => {
            typingIndicator.style.display = 'none';
            const replies = [
                "I've found the relevant lecture notes for that.",
                "Based on the past questions, that topic is crucial.",
                "Here is a summary of the document you requested.",
                "Let me break that down for you step by step."
            ];
            const aiReply = replies[Math.floor(Math.random() * replies.length)];
            addMessage(aiReply, 'ai');
        }, 1500);
    };

    function addMessage(text, type) {
        const msg = document.createElement('div');
        msg.className = `message ${type}`;
        msg.textContent = text;
        messagesContainer.appendChild(msg);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Suggested prompts
    document.querySelectorAll('.suggestion-card').forEach(card => {
        card.addEventListener('click', () => {
            chatInput.value = card.textContent.trim();
            sendMessage();
        });
    });
}

/* ==========================================
   SETTINGS PAGE
   ========================================== */
function initSettings() {
    const username = localStorage.getItem('futent_username') || 'Student';
    document.getElementById('profileName').textContent = username;
    document.getElementById('profileAvatar').textContent = username.charAt(0).toUpperCase();

    document.getElementById('themeBtn').addEventListener('click', toggleTheme);
    
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('futent_logged_in');
        showToast('Logged out successfully');
        setTimeout(() => window.location.href = 'login.html', 1000);
    });
}