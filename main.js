document.addEventListener("DOMContentLoaded", function () {
  // Animasi kemunculan elemen saat halaman dirender atau digulir
  const revealElements = document.querySelectorAll(
    ".hero-text, .hero-image-wrapper, .menu-card, .highlight-img-box, " +
    ".highlight-text, .step-card, .faq-left, .faq-item, .cta-banner, " +
    ".about-card, .filter-bar, .footer"
  );

  if ("IntersectionObserver" in window && revealElements.length > 0) {
    document.body.classList.add("reveal-enabled");

    revealElements.forEach(function (element, index) {
      element.classList.add("reveal-item");

      if (element.classList.contains("hero-text")) {
        element.classList.add("reveal-left");
      } else if (element.classList.contains("hero-image-wrapper")) {
        element.classList.add("reveal-right");
      } else if (index % 3 === 0) {
        element.classList.add("reveal-left");
      } else if (index % 3 === 2) {
        element.classList.add("reveal-right");
      }

      const parent = element.parentElement;
      const siblings = parent
        ? Array.from(parent.querySelectorAll(".reveal-item"))
        : [];
      const siblingIndex = siblings.indexOf(element);
      element.style.setProperty(
        "--reveal-delay",
        Math.max(0, siblingIndex) * 90 + "ms"
      );
    });

    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    revealElements.forEach(function (element) {
      revealObserver.observe(element);
    });
  }

  // Menu navigasi mobile
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      const isOpen = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      navToggle.setAttribute(
        "aria-label",
        isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"
      );
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Buka menu navigasi");
      });
    });
  }

  // FAQ
  const faqButtons = document.querySelectorAll(".faq-question");

  faqButtons.forEach(function (button) {
    button.setAttribute("aria-expanded", "false");

    button.addEventListener("click", function () {
      const faqItem = button.closest(".faq-item");
      if (!faqItem) {
        return;
      }

      const icon = button.querySelector("span");
      const isOpen = faqItem.classList.contains("open");

      faqButtons.forEach(function (otherButton) {
        if (otherButton !== button) {
          const otherItem = otherButton.closest(".faq-item");
          const otherIcon = otherButton.querySelector("span");

          if (otherItem) {
            otherItem.classList.remove("open");
          }
          if (otherIcon) {
            otherIcon.textContent = "+";
          }
          otherButton.setAttribute("aria-expanded", "false");
        }
      });

      faqItem.classList.toggle("open", !isOpen);
      const newOpenState = !isOpen;

      if (icon) {
        icon.textContent = newOpenState ? "-" : "+";
      }
      button.setAttribute(
        "aria-expanded",
        newOpenState ? "true" : "false"
      );
    });
  });

  // Filter menu
  const filterButtons = document.querySelectorAll(".filter-btn");
  const menuCards = document.querySelectorAll(".menu-card");

  filterButtons.forEach(function (button) {
    button.setAttribute("type", "button");

    button.addEventListener("click", function () {
      const filter = button.dataset.filter;

      filterButtons.forEach(function (filterButton) {
        filterButton.classList.remove("active");
      });
      button.classList.add("active");

      menuCards.forEach(function (card) {
        const category = card.dataset.category;
        const shouldShow = filter === "all" || category === filter;

        card.style.display = shouldShow ? "block" : "none";
      });
    });
  });

  // Pesan lewat WhatsApp
  const orderButtons = document.querySelectorAll(".order-btn");

  orderButtons.forEach(function (button) {
    button.setAttribute("type", "button");

    button.addEventListener("click", function () {
      const menu = button.dataset.menu;
      const price = button.dataset.price;

      if (!menu || !price) {
        return;
      }

      const formattedPrice = Number(price).toLocaleString("id-ID");
      const message =
        "Halo Leak Geprek, saya mau pesan " +
        menu +
        " dengan harga Rp " +
        formattedPrice;

      const whatsappUrl =
        "https://wa.me/6281234567890?text=" +
        encodeURIComponent(message);

      const popup = window.open(whatsappUrl, "_blank");
      if (popup) {
        popup.opener = null;
      }
    });
  });

  // Pastikan tautan tab baru aman
  document.querySelectorAll('a[target="_blank"]').forEach(function (link) {
    link.setAttribute("rel", "noopener noreferrer");
  });

  // Gulir halus untuk tautan FAQ yang mengarah ke #faq
  document.querySelectorAll('a[href*="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      const hashIndex = link.getAttribute("href").indexOf("#");
      if (hashIndex === -1) {
        return;
      }

      const targetId = link.getAttribute("href").slice(hashIndex + 1);
      const target = document.getElementById(targetId);

      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
});