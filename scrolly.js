gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', function () {
  const galleryItems = document.querySelectorAll('.ground-truth-gallery .gallery-item');
  const infoButton = document.querySelector('.info-button');

  galleryItems.forEach(item => {
    item.addEventListener('click', function (event) {
      event.preventDefault();
      const targetId = item.querySelector('a').getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        gsap.to(window, {
          duration: 1,
          scrollTo: targetSection,
          ease: 'power2.inOut',
          onComplete: function () {
            infoButton.setAttribute('data-section', targetId);
          }
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