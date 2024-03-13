gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', function () {
  const galleryItems = document.querySelectorAll('.ground-truth-gallery .gallery-item');

  galleryItems.forEach(item => {
    item.addEventListener('click', function () {
      const targetId = item.getAttribute('data-target');
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        gsap.to(window, {
          duration: 1,
          scrollTo: targetSection,
          ease: 'power2.inOut'
        });
      }
    });
  });

  function animateSections() {
    gsap.utils.toArray('.scroll-section').forEach(section => {
      gsap.from(section, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      });
    });
  }

  animateSections();

  const observer = new MutationObserver(animateSections);
  observer.observe(document.body, { childList: true, subtree: true });
});