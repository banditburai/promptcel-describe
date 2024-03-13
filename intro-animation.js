document.addEventListener("DOMContentLoaded", function () {
  const introHeading = document.querySelector(".intro-heading");
  const processSteps = document.querySelectorAll(".process-step");

  gsap.from(".explore-icon", {
    opacity: 0,
    scale: 0.5,
    duration: 1,
    ease: "power2.out",
    delay: 2,
  });

  gsap.from(".describe-icon", {
    opacity: 0,
    scale: 0.5,
    duration: 1,
    ease: "power2.out",
    delay: 2.2,
  });

  gsap.from(".boat-icon", {
    opacity: 0,
    scale: 0.5,
    duration: 1,
    ease: "power2.out",
    delay: 2.4,
  });

  gsap.from(".compare-icon", {
    opacity: 0,
    scale: 0.5,
    duration: 1,
    ease: "power2.out",
    delay: 2.6,
  });

  gsap.to(introHeading, {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "power2.out",
    delay: 0.5,
  });

  gsap.to(processSteps, {
    opacity: 1,
    scale: 1,
    duration: 1,
    ease: "power2.out",
    delay: 1.5,
    stagger: 0.3,
  });

//   const backgroundAnimation = gsap.timeline({ repeat: -1, yoyo: true });
//   backgroundAnimation.to(".intro-animation", {
//     duration: 10,
//     backgroundPosition: "0 100%",
//     ease: "linear",
//   });

const backgroundAnimation = gsap.timeline({ repeat: -1, yoyo: true });
backgroundAnimation.to(".intro-animation::before", {
  duration: 10,
  backgroundPosition: "100% 50%", 
  ease: "Power1.easeInOut",
})
.to(".intro-animation::before", {
  duration: 8,
  backgroundPosition: "50% 100%", 
  ease: "Power1.easeInOut",
}, "<"); 
});