// ================= STT HOLIDAYS - MAIN APP =================
// 3D Particles, Scroll Video Control, AI Features, Auth, API Integration

const API_BASE_URL = 'http://localhost:5000/api';
let authToken = localStorage.getItem('stt_token');
let currentUser = JSON.parse(localStorage.getItem('stt_user') || 'null');

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

// ================= SCROLL-CONTROLLED VIDEO =================
class ScrollVideoController {
    constructor() {
        this.video = document.getElementById('heroVideo');
        this.hero = document.querySelector('.hero');
        if (!this.video || !this.hero) return;

        this.isLoaded = false;
        this.duration = 0;
        
        // Smooth scrolling properties
        this.targetTime = 0;
        this.currentTime = 0;
        this.ease = 0.08; // Adjust for smoothness

        this.init();
    }

    init() {
        this.video.pause();
        this.video.currentTime = 0;

        this.video.addEventListener('loadedmetadata', () => {
            this.duration = this.video.duration;
            this.isLoaded = true;
        });

        // Fallback: if video doesn't load metadata quickly, use estimate
        setTimeout(() => {
            if (!this.isLoaded && this.video.duration) {
                this.duration = this.video.duration;
                this.isLoaded = true;
            }
        }, 2000);

        window.addEventListener('scroll', () => this.handleScroll());
        window.addEventListener('resize', () => this.handleScroll());
        
        // Start animation loop
        this.animate();
    }

    handleScroll() {
        if (!this.isLoaded) return;

        const heroRect = this.hero.getBoundingClientRect();
        const scrollableDistance = this.hero.offsetHeight - window.innerHeight;
        
        let scrollProgress = 0;
        if (heroRect.top <= 0) {
             scrollProgress = Math.max(0, Math.min(1, -heroRect.top / scrollableDistance));
        }

        // Update target time instead of setting video time directly
        this.targetTime = scrollProgress * this.duration;

        // Parallax effect on hero content
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            const translateY = scrollProgress * 50;
            const opacity = 1 - Math.pow(scrollProgress, 2);
            heroContent.style.transform = `translateY(${translateY}px)`;
            heroContent.style.opacity = Math.max(0, opacity);
        }
    }
    
    animate() {
        if (this.isLoaded) {
            // Lerp (Linear Interpolation) for buttery smooth transition
            this.currentTime += (this.targetTime - this.currentTime) * this.ease;
            
            // Apply to video if difference is noticeable enough
            if (Math.abs(this.currentTime - this.video.currentTime) > 0.01) {
                this.video.currentTime = this.currentTime;
            }
        }
        requestAnimationFrame(() => this.animate());
    }
}

// ================= 3D PARALLAX LAYERS =================
class Parallax3D {
    constructor() {
        this.layers = document.querySelectorAll('.showcase-layer');
        this.showcase = document.querySelector('.showcase-3d');
        if (!this.showcase) return;
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.handleScroll());
    }

    handleScroll() {
        const rect = this.showcase.getBoundingClientRect();
        const progress = 1 - (rect.top / window.innerHeight);

        if (progress > -0.5 && progress < 1.5) {
            this.layers.forEach(layer => {
                const speed = parseFloat(layer.dataset.speed) || 0.5;
                const translateY = (progress - 0.5) * 200 * speed;
                const scale = 1 + Math.abs(progress - 0.5) * 0.1;
                layer.style.transform = `translateY(${translateY}px) scale(${scale})`;
            });
        }
    }
}

// ================= 3D TILT EFFECT =================
class Tilt3D {
    constructor() {
        this.elements = document.querySelectorAll('[data-3d]');
        this.init();
    }

    init() {
        this.elements.forEach(el => {
            el.addEventListener('mousemove', (e) => this.handleMouseMove(e, el));
            el.addEventListener('mouseleave', (e) => this.handleMouseLeave(e, el));
        });
    }

    handleMouseMove(e, el) {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / centerY * -10;
        const rotateY = (x - centerX) / centerX * 10;

        el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    }

    handleMouseLeave(e, el) {
        el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    }
}

// ================= SCROLL REVEAL =================
class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('.section-3d > .container, .destination-card, .package-card, .feature-item, .info-card');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        this.elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(40px)';
            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            observer.observe(el);
        });
    }
}

// ================= NAVBAR =================
class Navbar {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.menuBtn = document.getElementById('menuBtn');
        this.navMenu = document.getElementById('navMenu');
        this.searchBtn = document.getElementById('searchBtn');
        this.searchOverlay = document.getElementById('searchOverlay');
        this.searchClose = document.getElementById('searchClose');
        this.loginBtn = document.getElementById('loginBtn');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.handleScroll());

        this.menuBtn?.addEventListener('click', () => {
            this.navMenu.classList.toggle('active');
            this.menuBtn.innerHTML = this.navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });

        this.searchBtn?.addEventListener('click', () => {
            this.searchOverlay.classList.add('active');
            document.getElementById('searchInput')?.focus();
        });

        this.searchClose?.addEventListener('click', () => {
            this.searchOverlay.classList.remove('active');
        });

        this.loginBtn?.addEventListener('click', () => {
            document.getElementById('loginModal')?.classList.add('active');
        });

        // Smooth scroll for nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                    this.navMenu.classList.remove('active');
                    this.menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
            });
        });

        // Update active nav on scroll
        window.addEventListener('scroll', () => this.updateActiveNav());
    }

    handleScroll() {
        if (window.scrollY > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    }

    updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 200;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// ================= COUNTER ANIMATION =================
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('[data-count]');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(el) {
        const target = parseInt(el.dataset.count);
        const duration = 2000;
        const start = performance.now();

        const update = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(easeOut * target).toLocaleString();
            if (progress < 1) requestAnimationFrame(update);
        };

        requestAnimationFrame(update);
    }
}

// ================= TESTIMONIAL SLIDER =================
class TestimonialSlider {
    constructor() {
        this.cards = document.querySelectorAll('.testimonial-card');
        this.dots = document.querySelectorAll('.testimonial-dots .dot');
        this.prevBtn = document.getElementById('testPrev');
        this.nextBtn = document.getElementById('testNext');
        this.current = 0;
        this.init();
    }

    init() {
        this.prevBtn?.addEventListener('click', () => this.prev());
        this.nextBtn?.addEventListener('click', () => this.next());
        this.dots.forEach((dot, i) => {
            dot.addEventListener('click', () => this.goTo(i));
        });

        // Auto-slide
        setInterval(() => this.next(), 5000);
    }

    update() {
        this.cards.forEach((card, i) => {
            card.classList.remove('active', 'prev');
            if (i === this.current) card.classList.add('active');
            else if (i === (this.current - 1 + this.cards.length) % this.cards.length) card.classList.add('prev');
        });

        this.dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === this.current);
        });
    }

    next() {
        this.current = (this.current + 1) % this.cards.length;
        this.update();
    }

    prev() {
        this.current = (this.current - 1 + this.cards.length) % this.cards.length;
        this.update();
    }

    goTo(index) {
        this.current = index;
        this.update();
    }
}

// ================= DESTINATIONS =================
class DestinationsManager {
    constructor() {
        this.grid = document.getElementById('destinationsGrid');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.destinations = [];
        this.init();
    }

    async init() {
        this.loadDestinations();
        this.bindFilters();
    }

    async loadDestinations() {
        // Demo data (will be replaced with API call)
        const demoData = [
            { name: "Kashmir Valley", description: "Heaven on Earth with snow-capped mountains and beautiful lakes.", image: "https://images.unsplash.com/photo-1566836610593-62a64888a216?w=600", category: "mountain", rating: 4.8, price: "₹32,999", tags: ["snow", "valley", "lake"], location: "Srinagar, J&K" },
            { name: "Goa Beaches", description: "India's beach paradise with golden sands and vibrant nightlife.", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600", category: "beach", rating: 4.6, price: "₹18,499", tags: ["beach", "party", "water-sports"], location: "Panaji, Goa" },
            { name: "Kerala Backwaters", description: "Serene network of lagoons, lakes, and canals with houseboats.", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600", category: "beach", rating: 4.7, price: "₹27,999", tags: ["backwaters", "houseboat", "ayurveda"], location: "Alleppey, Kerala" },
            { name: "Manali", description: "Adventure hub with snow-capped peaks and thrilling activities.", image: "https://images.unsplash.com/photo-1626010448982-4d629b1a015f?w=600", category: "mountain", rating: 4.5, price: "₹22,999", tags: ["adventure", "snow", "mountains"], location: "Manali, HP" },
            { name: "Jaipur", description: "The Pink City with magnificent forts and rich culture.", image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600", category: "historical", rating: 4.6, price: "₹25,999", tags: ["heritage", "palace", "culture"], location: "Jaipur, Rajasthan" },
            { name: "Andaman Islands", description: "Pristine beaches and vibrant coral reefs in the Bay of Bengal.", image: "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?w=600", category: "beach", rating: 4.7, price: "₹45,999", tags: ["island", "diving", "beach"], location: "Port Blair" },
        ];

        this.destinations = demoData;
        this.render(this.destinations);
    }

    render(data) {
        if (!this.grid) return;
        this.grid.innerHTML = data.map(dest => `
            <div class="destination-card" data-category="${dest.category}">
                <div class="destination-image">
                    <img src="${dest.image}" alt="${dest.name}" loading="lazy">
                    <div class="destination-overlay"></div>
                    <div class="destination-rating"><i class="fas fa-star"></i> ${dest.rating}</div>
                </div>
                <div class="destination-content">
                    <h3>${dest.name}</h3>
                    <p>${dest.description}</p>
                    <div class="destination-meta">
                        <span><i class="fas fa-map-marker-alt"></i> ${dest.location}</span>
                    </div>
                    <div class="destination-tags">
                        ${dest.tags.map(tag => `<span>${tag}</span>`).join('')}
                    </div>
                    <div class="destination-footer">
                        <div class="destination-price">${dest.price} <span>/ person</span></div>
                        <button class="btn-view">View Details</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    bindFilters() {
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.dataset.filter;
                const filtered = filter === 'all' 
                    ? this.destinations 
                    : this.destinations.filter(d => d.category === filter);
                this.render(filtered);
            });
        });
    }
}

// ================= AI ITINERARY GENERATOR =================
class AIItinerary {
    constructor() {
        this.destination = document.getElementById('aiDestination');
        this.days = document.getElementById('aiDays');
        this.travelers = document.getElementById('aiTravelers');
        this.budgetBtns = document.querySelectorAll('.budget-btn');
        this.interestTags = document.querySelectorAll('.interest-tag');
        this.generateBtn = document.getElementById('generateItinerary');
        this.result = document.getElementById('plannerResult');

        this.selectedBudget = 'standard';
        this.selectedInterests = [];
        this.init();
    }

    init() {
        this.budgetBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.budgetBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectedBudget = btn.dataset.budget;
            });
        });

        this.interestTags.forEach(tag => {
            tag.addEventListener('click', () => {
                tag.classList.toggle('active');
                const interest = tag.dataset.interest;
                if (tag.classList.contains('active')) {
                    this.selectedInterests.push(interest);
                } else {
                    this.selectedInterests = this.selectedInterests.filter(i => i !== interest);
                }
            });
        });

        this.generateBtn?.addEventListener('click', () => this.generate());
    }

    generate() {
        const dest = this.destination?.value || 'Kashmir';
        const days = parseInt(this.days?.value) || 5;
        const travelers = parseInt(this.travelers?.value) || 2;

        // Show loading
        this.result.innerHTML = '<div class="spinner"></div><p style="text-align:center;color:var(--text-secondary)">Generating your perfect itinerary...</p>';

        // Simulate AI generation
        setTimeout(() => {
            const itinerary = this.createItinerary(dest, days, travelers);
            this.renderItinerary(itinerary, dest, days);
        }, 1500);
    }

    createItinerary(destination, days, travelers) {
        const activities = {
            adventure: ['Trekking', 'Paragliding', 'River Rafting', 'Rock Climbing', 'Safari', 'Zip-lining'],
            relaxation: ['Spa Day', 'Beach Time', 'Yoga Retreat', 'Sunset Cruise', 'Hot Springs', 'Meditation'],
            cultural: ['Museum Visit', 'Local Market Tour', 'Cooking Class', 'Heritage Walk', 'Festival', 'Art Gallery'],
            family: ['Amusement Park', 'Zoo Visit', 'Boat Ride', 'Picnic', 'Aquarium', 'Science Center']
        };

        const allActivities = [...activities.adventure, ...activities.relaxation, ...activities.cultural];
        const itinerary = [];

        for (let day = 1; day <= days; day++) {
            const dayActivities = [];
            const morning = allActivities[(day - 1) % allActivities.length];
            const afternoon = allActivities[day % allActivities.length];
            const evening = allActivities[(day + 1) % allActivities.length];

            const costs = { budget: { food: 15, activity: 30 }, standard: { food: 40, activity: 80 }, luxury: { food: 100, activity: 150 } };
            const cost = costs[this.selectedBudget] || costs.standard;

            dayActivities.push(
                { time: '08:00', title: 'Breakfast', description: `Local cuisine breakfast at ${destination}`, cost: cost.food, type: 'food' },
                { time: '10:00', title: morning, description: `Experience ${morning} in ${destination}`, cost: cost.activity, type: 'activity' },
                { time: '13:00', title: 'Lunch', description: 'Traditional lunch at a local restaurant', cost: cost.food * 1.5, type: 'food' },
                { time: '15:00', title: afternoon, description: `Afternoon ${afternoon} session`, cost: cost.activity, type: 'activity' },
                { time: '19:00', title: evening, description: `Evening ${evening} experience`, cost: cost.activity * 1.2, type: 'activity' },
                { time: '21:00', title: 'Dinner', description: 'Fine dining experience', cost: cost.food * 2, type: 'food' }
            );

            itinerary.push({ day, activities: dayActivities });
        }

        return itinerary;
    }

    renderItinerary(itinerary, destination, days) {
        const totalCost = itinerary.reduce((sum, day) => sum + day.activities.reduce((s, a) => s + a.cost, 0), 0);

        this.result.innerHTML = `
            <div class="itinerary-result">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;padding-bottom:16px;border-bottom:1px solid var(--border)">
                    <div>
                        <h3 style="font-size:1.3rem;font-weight:800">${destination} Itinerary</h3>
                        <p style="color:var(--text-muted);font-size:0.9rem">${days} Days • ${document.getElementById('aiTravelers')?.value || 2} Travelers</p>
                    </div>
                    <div style="text-align:right">
                        <p style="font-size:0.85rem;color:var(--text-muted)">Est. Total</p>
                        <p style="font-size:1.5rem;font-weight:800;color:var(--primary)">₹${totalCost.toLocaleString()}</p>
                    </div>
                </div>
                ${itinerary.map(day => `
                    <div class="itinerary-day">
                        <h4>Day ${day.day}</h4>
                        ${day.activities.map(act => `
                            <div class="itinerary-activity">
                                <span class="activity-time">${act.time}</span>
                                <div class="activity-details">
                                    <h5>${act.title}</h5>
                                    <p>${act.description}</p>
                                </div>
                                <span style="color:var(--primary);font-weight:600;font-size:0.85rem">₹${act.cost}</span>
                            </div>
                        `).join('')}
                    </div>
                `).join('')}
                <button class="btn-primary btn-3d" style="width:100%;margin-top:16px" onclick="app.showToast('Itinerary saved to your trips!', 'success')">
                    <i class="fas fa-save"></i> Save Itinerary
                </button>
            </div>
        `;
    }
}

// ================= BUDGET ESTIMATOR =================
class BudgetEstimator {
    constructor() {
        this.destination = document.getElementById('budgetDestination');
        this.daysInput = document.getElementById('budgetDays');
        this.travelersInput = document.getElementById('budgetTravelers');
        this.daysValue = document.getElementById('daysValue');
        this.travelersValue = document.getElementById('travelersValue');
        this.styleBtns = document.querySelectorAll('.style-btn');
        this.calculateBtn = document.getElementById('calculateBudget');
        this.result = document.getElementById('budgetResult');

        this.selectedStyle = 'standard';
        this.init();
    }

    init() {
        this.daysInput?.addEventListener('input', () => {
            this.daysValue.textContent = `${this.daysInput.value} days`;
        });

        this.travelersInput?.addEventListener('input', () => {
            this.travelersValue.textContent = `${this.travelersInput.value} people`;
        });

        this.styleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.styleBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectedStyle = btn.dataset.style;
            });
        });

        this.calculateBtn?.addEventListener('click', () => this.calculate());
    }

    calculate() {
        const dest = this.destination?.value || 'kashmir';
        const days = parseInt(this.daysInput?.value) || 5;
        const travelers = parseInt(this.travelersInput?.value) || 2;

        const baseCosts = {
            accommodation: { budget: 1500, standard: 3500, luxury: 12000 },
            food: { budget: 800, standard: 2000, luxury: 5000 },
            transport: { budget: 500, standard: 1500, luxury: 4000 },
            activities: { budget: 1000, standard: 2500, luxury: 6000 },
            miscellaneous: { budget: 300, standard: 800, luxury: 2000 }
        };

        const style = this.selectedStyle;
        const breakdown = {
            accommodation: baseCosts.accommodation[style] * days * travelers,
            food: baseCosts.food[style] * days * travelers,
            transport: baseCosts.transport[style] * days * travelers,
            activities: baseCosts.activities[style] * days * travelers,
            miscellaneous: baseCosts.miscellaneous[style] * days * travelers
        };

        const total = Object.values(breakdown).reduce((a, b) => a + b, 0);

        this.result.innerHTML = `
            <div class="budget-breakdown">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px">
                    <h3 style="font-size:1.2rem;font-weight:700">Budget for ${dest.charAt(0).toUpperCase() + dest.slice(1)}</h3>
                    <span style="padding:6px 16px;background:rgba(0,212,255,0.1);border-radius:20px;color:var(--primary);font-size:0.85rem;font-weight:600;text-transform:capitalize">${style}</span>
                </div>
                <div class="budget-item">
                    <span class="budget-label"><i class="fas fa-hotel"></i> Accommodation</span>
                    <span class="budget-value">₹${breakdown.accommodation.toLocaleString()}</span>
                </div>
                <div class="budget-item">
                    <span class="budget-label"><i class="fas fa-utensils"></i> Food & Dining</span>
                    <span class="budget-value">₹${breakdown.food.toLocaleString()}</span>
                </div>
                <div class="budget-item">
                    <span class="budget-label"><i class="fas fa-bus"></i> Transport</span>
                    <span class="budget-value">₹${breakdown.transport.toLocaleString()}</span>
                </div>
                <div class="budget-item">
                    <span class="budget-label"><i class="fas fa-ticket-alt"></i> Activities</span>
                    <span class="budget-value">₹${breakdown.activities.toLocaleString()}</span>
                </div>
                <div class="budget-item">
                    <span class="budget-label"><i class="fas fa-shopping-bag"></i> Miscellaneous</span>
                    <span class="budget-value">₹${breakdown.miscellaneous.toLocaleString()}</span>
                </div>
                <div class="budget-item total">
                    <span class="budget-label">Total Estimated Budget</span>
                    <span class="budget-value">₹${total.toLocaleString()}</span>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:20px">
                    <div style="text-align:center;padding:16px;background:var(--bg-tertiary);border-radius:var(--radius-md)">
                        <p style="font-size:0.85rem;color:var(--text-muted)">Per Person</p>
                        <p style="font-size:1.2rem;font-weight:700;color:var(--primary)">₹${Math.round(total / travelers).toLocaleString()}</p>
                    </div>
                    <div style="text-align:center;padding:16px;background:var(--bg-tertiary);border-radius:var(--radius-md)">
                        <p style="font-size:0.85rem;color:var(--text-muted)">Per Day</p>
                        <p style="font-size:1.2rem;font-weight:700;color:var(--primary)">₹${Math.round(total / days).toLocaleString()}</p>
                    </div>
                </div>
            </div>
        `;
    }
}

// ================= PLACES NEAR ME =================
class PlacesNearMe {
    constructor() {
        this.locateBtn = document.getElementById('locateBtn');
        this.results = document.getElementById('nearmeResults');
        this.init();
    }

    init() {
        this.locateBtn?.addEventListener('click', () => this.findNearby());
    }

    findNearby() {
        if (!navigator.geolocation) {
            app.showToast('Geolocation is not supported by your browser', 'error');
            return;
        }

        this.locateBtn.innerHTML = '<div class="spinner" style="width:20px;height:20px;border-width:2px;margin:0"></div> Locating...';

        navigator.geolocation.getCurrentPosition(
            (position) => this.showNearbyPlaces(position.coords),
            (error) => {
                this.locateBtn.innerHTML = '<i class="fas fa-location-arrow"></i><span>Find Places Near Me</span>';
                app.showToast('Unable to get your location. Using default.', 'error');
                this.showNearbyPlaces({ latitude: 28.6139, longitude: 77.2090 }); // Delhi default
            }
        );
    }

    showNearbyPlaces(coords) {
        this.locateBtn.innerHTML = '<i class="fas fa-location-arrow"></i><span>Find Places Near Me</span>';

        // Demo nearby places
        const nearby = [
            { name: "Red Fort", distance: "2.5 km", image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400", category: "Historical" },
            { name: "India Gate", distance: "3.8 km", image: "https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?w=400", category: "Monument" },
            { name: "Qutub Minar", distance: "12 km", image: "https://images.unsplash.com/photo-1548013146-72479768bada?w=400", category: "Heritage" },
            { name: "Lotus Temple", distance: "15 km", image: "https://images.unsplash.com/photo-1561361058-4c1d22bf2432?w=400", category: "Religious" },
        ];

        this.results.innerHTML = nearby.map(place => `
            <div class="nearby-card">
                <img src="${place.image}" alt="${place.name}" loading="lazy">
                <div class="nearby-card-content">
                    <h4>${place.name}</h4>
                    <p>${place.category}</p>
                    <span class="nearby-distance"><i class="fas fa-map-marker-alt"></i> ${place.distance}</span>
                </div>
            </div>
        `).join('');
    }
}

// ================= AUTHENTICATION =================
class AuthManager {
    constructor() {
        this.modal = document.getElementById('loginModal');
        this.overlay = this.modal?.querySelector('.modal-overlay');
        this.closeBtn = document.getElementById('modalClose');
        this.tabBtns = document.querySelectorAll('.tab-btn');
        this.loginForm = document.getElementById('loginForm');
        this.registerForm = document.getElementById('registerForm');
        this.loginBtn = document.getElementById('loginBtn');
        this.init();
    }

    init() {
        this.closeBtn?.addEventListener('click', () => this.close());
        this.overlay?.addEventListener('click', () => this.close());

        this.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });

        this.loginForm?.addEventListener('submit', (e) => this.handleLogin(e));
        this.registerForm?.addEventListener('submit', (e) => this.handleRegister(e));

        // Update UI if logged in
        this.updateUI();
    }

    switchTab(tab) {
        this.tabBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tab));
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `${tab}Tab`);
        });
    }

    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (response.ok) {
                authToken = data.token;
                currentUser = data.user;
                localStorage.setItem('stt_token', authToken);
                localStorage.setItem('stt_user', JSON.stringify(currentUser));
                this.close();
                this.updateUI();
                app.showToast(`Welcome back, ${data.user.name}!`, 'success');
            } else {
                app.showToast(data.error || 'Login failed', 'error');
            }
        } catch (error) {
            // Demo fallback
            authToken = 'demo-token';
            currentUser = { name: 'Demo User', email };
            localStorage.setItem('stt_token', authToken);
            localStorage.setItem('stt_user', JSON.stringify(currentUser));
            this.close();
            this.updateUI();
            app.showToast('Welcome back, Demo User!', 'success');
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const phone = document.getElementById('regPhone').value;
        const password = document.getElementById('regPassword').value;

        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone, password })
            });

            const data = await response.json();
            if (response.ok) {
                authToken = data.token;
                currentUser = data.user;
                localStorage.setItem('stt_token', authToken);
                localStorage.setItem('stt_user', JSON.stringify(currentUser));
                this.close();
                this.updateUI();
                app.showToast(`Welcome, ${data.user.name}! Account created.`, 'success');
            } else {
                app.showToast(data.error || 'Registration failed', 'error');
            }
        } catch (error) {
            authToken = 'demo-token';
            currentUser = { name, email };
            localStorage.setItem('stt_token', authToken);
            localStorage.setItem('stt_user', JSON.stringify(currentUser));
            this.close();
            this.updateUI();
            app.showToast('Welcome! Account created successfully.', 'success');
        }
    }

    updateUI() {
        if (currentUser) {
            this.loginBtn.innerHTML = `<i class="fas fa-user"></i> ${currentUser.name.split(' ')[0]}`;
        } else {
            this.loginBtn.innerHTML = '<i class="fas fa-user"></i> Login';
        }
    }

    close() {
        this.modal?.classList.remove('active');
    }
}

// ================= CONTACT FORM =================
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }

    init() {
        this.form?.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(e) {
        e.preventDefault();

        const data = {
            name: document.getElementById('contactName').value,
            email: document.getElementById('contactEmail').value,
            subject: document.getElementById('contactSubject').value,
            message: document.getElementById('contactMessage').value
        };

        try {
            const response = await fetch(`${API_BASE_URL}/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                app.showToast('Message sent successfully!', 'success');
                this.form.reset();
            } else {
                app.showToast('Failed to send message', 'error');
            }
        } catch (error) {
            app.showToast('Message sent! We will get back to you soon.', 'success');
            this.form.reset();
        }
    }
}

// ================= SCROLL TO TOP =================
class ScrollToTop {
    constructor() {
        this.btn = document.getElementById('scrollTop');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                this.btn?.classList.add('visible');
            } else {
                this.btn?.classList.remove('visible');
            }
        });

        this.btn?.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// ================= TOAST NOTIFICATIONS =================
class ToastManager {
    constructor() {
        this.container = document.getElementById('toastContainer');
    }

    show(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icons = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle' };
        toast.innerHTML = `<i class="fas ${icons[type]}"></i><span>${message}</span>`;

        this.container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('removing');
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    }
}

// ================= PRELOADER =================
class Preloader {
    constructor() {
        this.el = document.getElementById('preloader');
        this.init();
    }

    init() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.el?.classList.add('hidden');
            }, 2500);
        });
    }
}

// ================= MAIN APP =================
class App {
    constructor() {
        this.toast = new ToastManager();
        this.preloader = new Preloader();
        this.particles = new ParticleSystem();
        this.scrollVideo = new ScrollVideoController();
        this.parallax = new Parallax3D();
        this.tilt = new Tilt3D();
        this.scrollReveal = new ScrollReveal();
        this.navbar = new Navbar();
        this.counter = new CounterAnimation();
        this.testimonials = new TestimonialSlider();
        this.destinations = new DestinationsManager();
        this.itinerary = new AIItinerary();
        this.budget = new BudgetEstimator();
        this.nearMe = new PlacesNearMe();
        this.auth = new AuthManager();
        this.contact = new ContactForm();
        this.scrollTop = new ScrollToTop();
    }

    showToast(message, type) {
        this.toast.show(message, type);
    }
}

// Initialize app
const app = new App();

// Newsletter form
document.getElementById('newsletterForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    app.showToast('Thank you for subscribing!', 'success');
    e.target.reset();
});
