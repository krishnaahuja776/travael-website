// ================= ADMIN PANEL =================
class AdminPanel {
    constructor() {
        this.sidebar = document.querySelector('.admin-sidebar');
        this.sidebarToggle = document.getElementById('sidebarToggle');
        this.navItems = document.querySelectorAll('.sidebar-nav .nav-item');
        this.pages = document.querySelectorAll('.page');
        this.logoutBtn = document.getElementById('adminLogout');
        this.init();
    }

    init() {
        // Sidebar toggle
        this.sidebarToggle?.addEventListener('click', () => {
            this.sidebar.classList.toggle('active');
        });

        // Navigation
        this.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.dataset.page;
                if (page) this.showPage(page);

                this.navItems.forEach(n => n.classList.remove('active'));
                item.classList.add('active');

                if (window.innerWidth <= 992) {
                    this.sidebar.classList.remove('active');
                }
            });
        });

        // Logout
        this.logoutBtn?.addEventListener('click', () => {
            localStorage.removeItem('stt_token');
            localStorage.removeItem('stt_user');
            window.location.href = 'index.html';
        });

        // Check auth
        this.checkAuth();

        // Load dashboard data
        this.loadDashboardData();
    }

    showPage(pageName) {
        this.pages.forEach(page => page.classList.remove('active'));
        const target = document.getElementById(`${pageName}Page`);
        if (target) target.classList.add('active');
    }

    checkAuth() {
        const token = localStorage.getItem('stt_token');
        const user = JSON.parse(localStorage.getItem('stt_user') || 'null');

        if (!token || !user || user.role !== 'admin') {
            // For demo, allow access
            console.log('Admin access granted (demo mode)');
        }
    }

    async loadDashboardData() {
        try {
            const token = localStorage.getItem('stt_token');
            const response = await fetch('http://localhost:5000/api/admin/dashboard', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                document.getElementById('totalUsers').textContent = data.totalUsers?.toLocaleString() || '0';
                document.getElementById('totalTrips').textContent = data.totalTrips?.toLocaleString() || '0';
                document.getElementById('totalPlaces').textContent = data.totalPlaces?.toLocaleString() || '0';
                document.getElementById('totalContacts').textContent = data.newContacts?.toLocaleString() || '0';
            }
        } catch (error) {
            console.log('Using demo data');
        }
    }
}

// Initialize
const admin = new AdminPanel();

// ================= 3D PARTICLE SYSTEM =================
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particle-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.scrollY = 0;
        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        const count = Math.min(150, Math.floor(window.innerWidth / 10));
        this.particles = [];
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                z: Math.random() * 1000,
                size: Math.random() * 2 + 0.5,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                speedZ: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.5 + 0.2,
                color: Math.random() > 0.7 ? '#00d4ff' : Math.random() > 0.5 ? '#ff6b6b' : '#ffffff'
            });
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        window.addEventListener('scroll', () => {
            this.scrollY = window.scrollY;
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((p, i) => {
            // 3D depth effect
            p.z -= p.speedZ;
            if (p.z <= 0) {
                p.z = 1000;
                p.x = Math.random() * this.canvas.width;
                p.y = Math.random() * this.canvas.height;
            }

            // Mouse repulsion
            const dx = p.x - this.mouse.x;
            const dy = p.y - this.mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                const force = (150 - dist) / 150;
                p.x += dx * force * 0.02;
                p.y += dy * force * 0.02;
            }

            // Scroll parallax
            p.y += this.scrollY * 0.001 * (p.z / 1000);

            // Calculate 3D projection
            const scale = 1000 / (1000 + p.z);
            const x2d = p.x * scale + (1 - scale) * this.canvas.width / 2;
            const y2d = p.y * scale + (1 - scale) * this.canvas.height / 2;
            const size2d = p.size * scale;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(x2d, y2d, size2d, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.opacity * scale;
            this.ctx.fill();

            // Draw connections
            this.particles.slice(i + 1).forEach(p2 => {
                const dx2 = p.x - p2.x;
                const dy2 = p.y - p2.y;
                const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
                if (dist2 < 100) {
                    const scale2 = 1000 / (1000 + p2.z);
                    const x2d2 = p2.x * scale2 + (1 - scale2) * this.canvas.width / 2;
                    const y2d2 = p2.y * scale2 + (1 - scale2) * this.canvas.height / 2;
                    this.ctx.beginPath();
                    this.ctx.moveTo(x2d, y2d);
                    this.ctx.lineTo(x2d2, y2d2);
                    this.ctx.strokeStyle = 'rgba(0,212,255,0.1)';
                    this.ctx.globalAlpha = (1 - dist2 / 100) * 0.3 * scale;
                    this.ctx.stroke();
                }
            });
        });

        this.ctx.globalAlpha = 1;
        requestAnimationFrame(() => this.animate());
    }
}

const particles = new ParticleSystem();
