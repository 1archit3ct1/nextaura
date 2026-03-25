const reveals = document.querySelectorAll(".section, .hero, .proof-card, .card");

reveals.forEach((element) => element.classList.add("reveal"));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: "0px 0px -5% 0px",
  }
);

reveals.forEach((element) => observer.observe(element));
