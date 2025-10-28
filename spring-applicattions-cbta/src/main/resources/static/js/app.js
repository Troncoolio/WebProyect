document.addEventListener('DOMContentLoaded', () => {
const sectionsToAnimate = document.querySelectorAll('.animate-on-scroll');

  const observer = new IntersectionObserver((entries) => {
       entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.1
    });

    sectionsToAnimate.forEach(section => {
        observer.observe(section);
    });

    const sections = document.querySelectorAll('main section, footer');
    const navLinks = document.querySelectorAll('.main-nav a');
    const headerHeight = document.querySelector('header').offsetHeight; 

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const heroSection = document.getElementById('inicio');
        if (window.scrollY < heroSection.offsetHeight - headerHeight) {
            currentSectionId = 'inicio';
        } else {
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.scrollY >= sectionTop - headerHeight - 1) { 
                    currentSectionId = section.getAttribute('id');
                }
            });
        }

        navLinks.forEach(link => {
            if (link.getAttribute('href') === '/index') {
                 return;
            }
            link.classList.remove('activo');
            if (link.getAttribute('href') === '#' + currentSectionId) {
                link.classList.add('activo');
            }
        });
    });

    const menuToggle = document.getElementById('menu-toggle');
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (link.getAttribute('href').startsWith('#')) {
                if (menuToggle.checked) {
                    menuToggle.checked = false;
                }
            }
        });
    });

    const header = document.querySelector('header');
    const handleHeaderScroll = () => {
        if (window.scrollY > 50) { 
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    handleHeaderScroll();
    window.addEventListener('scroll', handleHeaderScroll);

    const videosLazy = document.querySelectorAll(".video-lazy-play");

    if (videosLazy.length > 0) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const video = entry.target;
                if (entry.isIntersecting) {
                    video.play().catch(error => {
                        console.info("El navegador bloqueó la reproducción automática.", error);
                    });
                } else {
                    video.pause();
                }
            });
        }, {
            threshold: 0.5
        });

        videosLazy.forEach(video => {
            videoObserver.observe(video);
        });
    }
});