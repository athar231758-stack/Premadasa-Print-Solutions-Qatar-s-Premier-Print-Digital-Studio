/**
 * PREMADASA PRINT SOLUTIONS — MASTER JAVASCRIPT
 * Smooth Scroll Reveals • 3D Card Tilt • Fluid Canvas • Live Estimator • V-Card Studio
 */

document.addEventListener("DOMContentLoaded", () => {
  // Configuration
  const WHATSAPP_NUMBER = "97470283355";
  const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ==========================================================================
     0. PINNED HERO SCROLL SEQUENCE & 3D CARD FAN-OUT CONTROLLER
     ========================================================================== */
  const heroPinnedWrapper = document.getElementById("heroPinnedWrapper");
  const studioGatePortal = document.getElementById("studioGatePortal");
  const gateLeafLeft = document.getElementById("gateLeafLeft");
  const gateLeafRight = document.getElementById("gateLeafRight");
  const gateSeamLaser = document.getElementById("gateSeamLaser");
  const gateSealCenter = document.getElementById("gateSealCenter");
  const gateScrollCue = document.getElementById("gateScrollCue");
  const heroSection = document.querySelector(".hero-section");
  const heroCardDeck = document.querySelector(".hero-card-deck");
  const heroStage = document.querySelector(".hero-3d-stage");
  const siteNav = document.querySelector(".site-nav");
  const scrollProgress = document.getElementById("scrollProgress");
  const navLinks = document.querySelectorAll(".nav-menu .nav-item-link");
  const navSections = document.querySelectorAll("header#top, section#services, section#estimator, section#vcard-studio, section#process, section#reviews, section#contact");
  let lastScrollY = window.scrollY || 0;

  // Gate click-to-open handler: smoothly scrolls through pinned runway to fan out cards
  function openGatesSmoothly() {
    document.body.classList.remove("gate-closed");
    if (heroPinnedWrapper) {
      const scrollableDistance = heroPinnedWrapper.offsetHeight - window.innerHeight;
      window.scrollTo({
        top: Math.round(scrollableDistance * 0.85),
        behavior: "smooth"
      });
    } else {
      window.scrollTo({
        top: 600,
        behavior: "smooth"
      });
    }
  }

  if (gateSealCenter) gateSealCenter.addEventListener("click", openGatesSmoothly);
  if (gateScrollCue) gateScrollCue.addEventListener("click", openGatesSmoothly);

  function handleScrollAnimations() {
    const scrollY = window.scrollY || window.pageYOffset;

    // 1. PINNED HERO & 3D CARDS SEQUENCE (Viewport stays pinned while cards fan out)
    if (heroPinnedWrapper && !REDUCED_MOTION) {
      const wrapperTop = heroPinnedWrapper.offsetTop;
      const wrapperHeight = heroPinnedWrapper.offsetHeight;
      const scrollableDistance = wrapperHeight - window.innerHeight;
      
      // Progress through the pinned section (0 to 1)
      const pinnedProgress = scrollableDistance > 0 
        ? Math.min(Math.max((scrollY - wrapperTop) / scrollableDistance, 0), 1)
        : 1;

      // Gate Opening Animation (runs from pinnedProgress 0.0 to 0.30)
      if (studioGatePortal) {
        const gateProgress = Math.min(pinnedProgress / 0.30, 1);

        if (gateLeafLeft) {
          gateLeafLeft.style.transform = `translateX(${(-gateProgress * 105).toFixed(2)}%) rotateY(${(-gateProgress * 22).toFixed(2)}deg)`;
        }
        if (gateLeafRight) {
          gateLeafRight.style.transform = `translateX(${(gateProgress * 105).toFixed(2)}%) rotateY(${(gateProgress * 22).toFixed(2)}deg)`;
        }
        if (gateSeamLaser) {
          gateSeamLaser.style.opacity = Math.max(0, 1 - gateProgress * 2.6).toFixed(2);
        }
        if (gateSealCenter) {
          const sealScale = (1 + gateProgress * 1.3).toFixed(2);
          const sealRot = (gateProgress * 40).toFixed(1);
          gateSealCenter.style.transform = `translate(-50%, -50%) scale(${sealScale}) rotate(${sealRot}deg)`;
          gateSealCenter.style.opacity = Math.max(0, 1 - gateProgress * 1.6).toFixed(2);
        }
        if (gateScrollCue) {
          gateScrollCue.style.opacity = Math.max(0, 1 - gateProgress * 3.2).toFixed(2);
        }

        if (heroSection) {
          const heroScale = (0.92 + gateProgress * 0.08).toFixed(3);
          const heroOpacity = (0.3 + gateProgress * 0.7).toFixed(2);
          heroSection.style.transform = `scale(${heroScale})`;
          heroSection.style.opacity = heroOpacity;
        }

        // Navbar appearance: Show ONLY on / after opening the website (gateProgress >= 0.82)
        if (gateProgress >= 0.82) {
          document.body.classList.remove("gate-closed");
        } else if (scrollY <= 15) {
          document.body.classList.add("gate-closed");
        }

        if (gateProgress >= 0.98) {
          studioGatePortal.classList.add("gate-unlocked");
        } else {
          studioGatePortal.classList.remove("gate-unlocked");
        }
      } else {
        document.body.classList.remove("gate-closed");
      }

      // 3D Card Fan-Out Animation:
      // The page stays pinned here while the cards fan out!
      // Fanning begins as gates open (pinnedProgress 0.18) and reaches 100% full open at 0.82
      // From 0.82 to 1.0, the cards stay fully open.
      // After 1.0, the user has scrolled past the pinned runway and the page rolls downward!
      if (heroCardDeck) {
        const cardProgress = Math.min(Math.max((pinnedProgress - 0.18) / 0.64, 0), 1);
        heroCardDeck.style.setProperty("--card-fan-progress", cardProgress.toFixed(3));
        if (heroStage) {
          heroStage.style.setProperty("--card-fan-progress", cardProgress.toFixed(3));
        }
      }
    }

    // 2. Header Scrolled State & Smart Navigation (Navbar is ALWAYS visible)
    if (siteNav) {
      if (scrollY > 40) {
        siteNav.classList.add("scrolled");
      } else {
        siteNav.classList.remove("scrolled");
      }

      // Hide navbar when scrolling down fast deep in content, reveal when scrolling up
      if (scrollY > 750) {
        const scrollDelta = scrollY - lastScrollY;
        if (scrollDelta > 8) {
          siteNav.classList.add("nav-hidden");
        } else if (scrollDelta < -5) {
          siteNav.classList.remove("nav-hidden");
        }
      } else {
        siteNav.classList.remove("nav-hidden");
      }
    }

    // 3. Scroll progress bar calculation
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0 && scrollProgress) {
      const progress = (scrollY / totalHeight) * 100;
      scrollProgress.style.width = `${progress}%`;
    }

    // 4. Active Section Indicator (ScrollSpy)
    if (navLinks.length && navSections.length) {
      let currentSectionId = "";
      if (scrollY < 450) {
        currentSectionId = "top";
      } else {
        navSections.forEach((section) => {
          const sectionTop = section.offsetTop - 140;
          const sectionHeight = section.offsetHeight;
          if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            currentSectionId = section.getAttribute("id");
          }
        });
      }

      if (currentSectionId) {
        navLinks.forEach((link) => {
          const href = link.getAttribute("href");
          if (href === `#${currentSectionId}`) {
            link.classList.add("active");
          } else if (href && href.startsWith("#")) {
            link.classList.remove("active");
          }
        });
      }
    }

    lastScrollY = scrollY;
  }

  window.addEventListener("scroll", handleScrollAnimations, { passive: true });
  // Initial frame check
  handleScrollAnimations();

  /* ==========================================================================
     2. INTERSECTION OBSERVER FOR SCROLL REVEALS
     ========================================================================== */
  const revealElements = document.querySelectorAll(".reveal, .reveal-scale, .stagger-item");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px",
    });

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("revealed"));
  }

  /* ==========================================================================
     3. ANIMATED METRIC COUNTERS
     ========================================================================== */
  const metricNumbers = document.querySelectorAll(".metric-number");

  function animateCounter(el) {
    const target = parseInt(el.getAttribute("data-target"), 10);
    const suffix = el.getAttribute("data-suffix") || "";
    const prefix = el.getAttribute("data-prefix") || "";
    const duration = 2000;
    const start = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out expo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = Math.floor(ease * target);

      el.textContent = `${prefix}${currentVal.toLocaleString()}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        el.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
      }
    }

    requestAnimationFrame(updateCounter);
  }

  if (metricNumbers.length && "IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    metricNumbers.forEach((num) => counterObserver.observe(num));
  }

  /* ==========================================================================
     4. HERO 3D CARD TILT & PARALLAX
     ========================================================================== */
  const tiltCards = document.querySelectorAll(".tilt-card, .service-card");

  if (heroStage && heroCardDeck && !REDUCED_MOTION) {
    let currentX = 0, currentY = 0;
    let targetX = 0, targetY = 0;

    heroStage.addEventListener("mousemove", (e) => {
      const rect = heroStage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 26; // max rotateY deg
      targetY = -y * 24; // max rotateX deg
    });

    heroStage.addEventListener("mouseleave", () => {
      targetX = 0;
      targetY = 0;
    });

    function renderHeroTilt() {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      heroCardDeck.style.setProperty("--card-tilt-y", `${currentX.toFixed(2)}deg`);
      heroCardDeck.style.setProperty("--card-tilt-x", `${currentY.toFixed(2)}deg`);
      requestAnimationFrame(renderHeroTilt);
    }
    renderHeroTilt();
  }

  // Dynamic Bring-to-Front on Mouse Hover for 3D Hero Cards
  const heroCards = document.querySelectorAll(".hero-card-deck .tilt-card");
  heroCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      heroCards.forEach((c) => {
        if (c === card) {
          c.classList.add("card-front");
          c.style.zIndex = "60";
        } else {
          c.classList.remove("card-front");
          c.style.zIndex = "1";
        }
      });
    });

    card.addEventListener("mouseleave", () => {
      heroCards.forEach((c) => {
        c.classList.remove("card-front");
        c.style.zIndex = "";
      });
    });
  });

  // Specular reflection positioning for individual cards
  tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--mouse-x", `${x}%`);
      card.style.setProperty("--mouse-y", `${y}%`);
    });
  });

  /* ==========================================================================
     5. FLUID CMYK INK & PARTICLE AMBIENT CANVAS (60 FPS)
     ========================================================================== */
  const canvas = document.getElementById("inkCanvas");
  if (canvas && !REDUCED_MOTION) {
    const ctx = canvas.getContext("2d");
    let width, height;
    let particles = [];
    const particleCount = 14;

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const colors = [
      "rgba(0, 216, 246, 0.4)",  // Cyan
      "rgba(255, 0, 122, 0.35)", // Magenta
      "rgba(255, 184, 0, 0.3)",  // Yellow
      "rgba(157, 78, 221, 0.35)", // Purple
    ];

    class InkParticle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = Math.random() * 160 + 100;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.pulse = Math.random() * Math.PI;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.pulse += 0.015;

        if (this.x < -this.radius) this.x = width + this.radius;
        if (this.x > width + this.radius) this.x = -this.radius;
        if (this.y < -this.radius) this.y = height + this.radius;
        if (this.y > height + this.radius) this.y = -this.radius;
      }
      draw() {
        const currentRadius = this.radius + Math.sin(this.pulse) * 20;
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, currentRadius
        );
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, "rgba(7, 8, 12, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new InkParticle());
    }

    let isCanvasVisible = true;
    document.addEventListener("visibilitychange", () => {
      isCanvasVisible = !document.hidden;
    });

    function animateInk() {
      if (isCanvasVisible) {
        ctx.clearRect(0, 0, width, height);
        particles.forEach((p) => {
          p.update();
          p.draw();
        });
      }
      requestAnimationFrame(animateInk);
    }
    animateInk();
  }

  /* ==========================================================================
     6. INTERACTIVE LIVE PRICE ESTIMATOR
     ========================================================================== */
  const estimatorForm = document.getElementById("estimatorForm");
  const qtySlider = document.getElementById("qtySlider");
  const qtyDisplay = document.getElementById("qtyDisplay");
  const estimatedPriceEl = document.getElementById("estimatedPrice");
  const summaryProductEl = document.getElementById("summaryProduct");
  const summaryQtyEl = document.getElementById("summaryQty");
  const summaryFinishEl = document.getElementById("summaryFinish");
  const summarySpeedEl = document.getElementById("summarySpeed");
  const btnEstimatorWhatsApp = document.getElementById("btnEstimatorWhatsApp");

  // Pricing matrix in QAR
  const baseRates = {
    "Business Cards": { base: 120, per100: 45 },
    "Brochures & Flyers": { base: 180, per100: 55 },
    "Packaging Boxes": { base: 350, per100: 95 },
    "DTF T-Shirts & Caps": { base: 280, per100: 120 },
    "Signs & Banners": { base: 220, per100: 80 },
    "Rubber Stamps": { base: 85, per100: 25 },
  };

  const finishMultipliers = {
    "Standard Silk": 1.0,
    "Velvet Soft-Touch": 1.25,
    "Gold Foil Stamped": 1.45,
    "Spot Gloss UV": 1.35,
  };

  function updateEstimator() {
    if (!estimatorForm || !qtySlider) return;

    const selectedProduct = estimatorForm.querySelector('input[name="product"]:checked')?.value || "Business Cards";
    const selectedFinish = estimatorForm.querySelector('input[name="finish"]:checked')?.value || "Standard Silk";
    const isExpress = estimatorForm.querySelector('input[name="turnaround"]:checked')?.value === "Express VIP";
    const qty = parseInt(qtySlider.value, 10);

    // Update displays
    if (qtyDisplay) qtyDisplay.textContent = `${qty.toLocaleString()} units`;
    if (summaryProductEl) summaryProductEl.textContent = selectedProduct;
    if (summaryQtyEl) summaryQtyEl.textContent = `${qty.toLocaleString()} units`;
    if (summaryFinishEl) summaryFinishEl.textContent = selectedFinish;
    if (summarySpeedEl) summarySpeedEl.textContent = isExpress ? "⚡ 24h Express VIP" : "Standard (2-3 Days)";

    // Calculate Price in QAR
    const rate = baseRates[selectedProduct] || { base: 100, per100: 50 };
    const finishMult = finishMultipliers[selectedFinish] || 1.0;
    const speedMult = isExpress ? 1.35 : 1.0;

    const baseCost = rate.base + ((qty / 100) * rate.per100);
    const totalPrice = Math.round(baseCost * finishMult * speedMult);

    if (estimatedPriceEl) {
      estimatedPriceEl.textContent = totalPrice.toLocaleString();
    }

    // Format WhatsApp message
    const msg = [
      "Hello Premadasa Print Solutions! 🖨️",
      "I used the website quote estimator and would like to order:",
      `• Product: ${selectedProduct}`,
      `• Quantity: ${qty.toLocaleString()} units`,
      `• Finishing: ${selectedFinish}`,
      `• Turnaround: ${isExpress ? "24h Express VIP" : "Standard"}`,
      `• Estimated Budget: ~QAR ${totalPrice.toLocaleString()}`,
      "",
      "Please confirm pricing, artwork requirements, and delivery time. Thank you!"
    ].join("\n");

    if (btnEstimatorWhatsApp) {
      btnEstimatorWhatsApp.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    }
  }

  if (estimatorForm) {
    estimatorForm.addEventListener("input", updateEstimator);
    updateEstimator();
  }

  /* ==========================================================================
     7. INTERACTIVE 3D V-CARD STUDIO SIMULATOR
     ========================================================================== */
  const vcardInputs = {
    name: document.getElementById("vcardInputName"),
    role: document.getElementById("vcardInputRole"),
    company: document.getElementById("vcardInputCompany"),
    phone: document.getElementById("vcardInputPhone"),
    whatsapp: document.getElementById("vcardInputWhatsApp"),
    email: document.getElementById("vcardInputEmail"),
    address: document.getElementById("vcardInputAddress"),
  };

  const vcardPreviews = {
    name: document.getElementById("vcardPreviewName"),
    role: document.getElementById("vcardPreviewRole"),
    company: document.getElementById("vcardPreviewCompany"),
    btnCall: document.getElementById("vcardBtnCall"),
    btnWhatsApp: document.getElementById("vcardBtnWhatsApp"),
    btnEmail: document.getElementById("vcardBtnEmail"),
    btnMap: document.getElementById("vcardBtnMap"),
    cardWrapper: document.getElementById("vcardLivePreview"),
  };

  function updateVCardPreview() {
    const nameVal = vcardInputs.name?.value.trim() || "Najam Al-Thani";
    const roleVal = vcardInputs.role?.value.trim() || "Managing Director";
    const companyVal = vcardInputs.company?.value.trim() || "Qatar Corporate Ventures";
    const phoneVal = vcardInputs.phone?.value.trim() || "+974 7028 3355";
    const whatsappVal = vcardInputs.whatsapp?.value.trim() || "+974 7028 3355";
    const emailVal = vcardInputs.email?.value.trim() || "info@premadasaprintsolutions.com";
    const addressVal = vcardInputs.address?.value.trim() || "Abu Hamour, Salwa Road, Qatar";

    if (vcardPreviews.name) vcardPreviews.name.textContent = nameVal;
    if (vcardPreviews.role) vcardPreviews.role.textContent = roleVal;
    if (vcardPreviews.company) vcardPreviews.company.textContent = companyVal;

    const avatarInitialsEl = document.getElementById("vcardAvatarInitials");
    if (avatarInitialsEl) {
      const parts = nameVal.split(" ").filter(Boolean);
      const initials = parts.length > 1 
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : (nameVal.slice(0, 2)).toUpperCase();
      avatarInitialsEl.textContent = initials || "PPS";
    }

    const cleanDigits = phoneVal.replace(/[^\d+]/g, "");
    const cleanWaDigits = whatsappVal.replace(/[^\d]/g, "");

    if (vcardPreviews.btnCall) vcardPreviews.btnCall.href = `tel:${cleanDigits}`;
    if (vcardPreviews.btnWhatsApp) vcardPreviews.btnWhatsApp.href = `https://wa.me/${cleanWaDigits}`;
    if (vcardPreviews.btnEmail) vcardPreviews.btnEmail.href = `mailto:${emailVal}`;
    if (vcardPreviews.btnMap) vcardPreviews.btnMap.href = `https://maps.google.com/?q=${encodeURIComponent(addressVal)}`;

    // Order WhatsApp Link
    const orderBtn = document.getElementById("btnOrderVCardWhatsApp");
    if (orderBtn) {
      const orderMsg = [
        "Hello Premadasa Print Solutions! 🪪",
        "I designed my Digital V-Card on your website and want to order it:",
        `• Full Name: ${nameVal}`,
        `• Job Title: ${roleVal}`,
        `• Company: ${companyVal}`,
        `• Phone: ${phoneVal}`,
        `• WhatsApp: ${whatsappVal}`,
        `• Email: ${emailVal}`,
        `• Location: ${addressVal}`,
        "",
        "Please provide details on NFC card printing and profile activation. Thanks!"
      ].join("\n");
      orderBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(orderMsg)}`;
    }
  }

  Object.values(vcardInputs).forEach((input) => {
    if (input) input.addEventListener("input", updateVCardPreview);
  });

  // V-Card Theme Buttons
  const themeButtons = document.querySelectorAll(".theme-swatch-btn");
  themeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      themeButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const theme = btn.getAttribute("data-theme");
      if (vcardPreviews.cardWrapper) {
        vcardPreviews.cardWrapper.className = `vcard-live-preview ${theme}`;
      }
    });
  });

  updateVCardPreview();

  /* ==========================================================================
     8. SERVICES CATEGORY FILTER
     ========================================================================== */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const serviceCards = document.querySelectorAll(".service-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const category = btn.getAttribute("data-filter");

      serviceCards.forEach((card) => {
        const cardCat = card.getAttribute("data-category");
        if (category === "all" || cardCat === category) {
          card.style.display = "flex";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, 50);
        } else {
          card.style.opacity = "0";
          card.style.transform = "translateY(20px)";
          setTimeout(() => {
            card.style.display = "none";
          }, 300);
        }
      });
    });
  });

  /* ==========================================================================
     9. MOBILE NAVIGATION DRAWER & ANIMATED HAMBURGER
     ========================================================================== */
  const mobileToggle = document.getElementById("mobileToggle");
  const navMenu = document.getElementById("navMenu");

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");
      mobileToggle.classList.toggle("active", isOpen);
      mobileToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close when clicking any nav link
    navMenu.querySelectorAll(".nav-item-link").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        mobileToggle.classList.remove("active");
        mobileToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ==========================================================================
     10. DIRECT WHATSAPP ACTION HOOKS
     ========================================================================== */
  document.querySelectorAll("[data-whatsapp-product]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const product = btn.getAttribute("data-whatsapp-product") || "Printing Service";
      const text = `Hello Premadasa Print Solutions! I'm interested in ordering ${product}. Please share your catalog and quote.`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    });
  });
});

