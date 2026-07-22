/* ==========================================================================
   Waseet Media (وسيط ميديا) - Interactive JavaScript Engine
   Features: Theme Switcher, Branch Filter, Package Tabs, Add-on Calculator,
             Booking Form & Live Estimator, WhatsApp Generator & Modal Receipt.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  /* -------------------------------------------------------------------------- */
  /* 0. Preloader Splash Screen Control                                         */
  /* -------------------------------------------------------------------------- */
  const preloader = document.getElementById("preloader");
  if (preloader) {
    const hidePreloader = () => {
      preloader.classList.add("preloader-hidden");
      setTimeout(() => {
        preloader.style.display = "none";
      }, 900);
    };
    // Auto transition splash screen after ~3.1 seconds
    setTimeout(hidePreloader, 3100);
  }

  /* -------------------------------------------------------------------------- */
  /* 1. Theme Toggle (Dark / Light Mode) & LocalStorage State                   */
  /* -------------------------------------------------------------------------- */
  const themeToggleBtn = document.getElementById("themeToggle");
  const htmlElement = document.documentElement;

  // Check saved theme preference or default to 'dark'
  const savedTheme = localStorage.getItem("waseet_theme") || "dark";
  htmlElement.setAttribute("data-theme", savedTheme);

  themeToggleBtn.addEventListener("click", () => {
    const currentTheme = htmlElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    htmlElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("waseet_theme", newTheme);

    showToast(
      newTheme === "dark"
        ? "تم تفعيل الوضع الليلي السينمائي 🌙"
        : "تم تفعيل الوضع النهاري ☀️",
      newTheme === "dark" ? "fa-moon" : "fa-sun",
    );
  });

  /* -------------------------------------------------------------------------- */
  /* 2. Mobile Drawer Navigation                                                */
  /* -------------------------------------------------------------------------- */
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const navMenu = document.getElementById("navMenu");
  const drawerOverlay = document.getElementById("drawerOverlay");
  const navLinks = document.querySelectorAll(".nav-link");

  function toggleMobileMenu() {
    navMenu.classList.toggle("open");
    drawerOverlay.classList.toggle("show");
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener("click", toggleMobileMenu);
  }

  if (drawerOverlay) {
    drawerOverlay.addEventListener("click", toggleMobileMenu);
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navMenu.classList.contains("open")) {
        toggleMobileMenu();
      }
    });
  });

  /* -------------------------------------------------------------------------- */
  /* 3. Branch Quick Selector & Dropdown                                        */
  /* -------------------------------------------------------------------------- */
  const branchPillBtn = document.getElementById("branchPillBtn");
  const branchMenu = document.querySelector(".branch-menu");
  const currentBranchName = document.getElementById("currentBranchName");
  const branchOptions = document.querySelectorAll(".branch-option");
  const bookingBranchSelect = document.getElementById("bookingBranch");

  if (branchPillBtn && branchMenu) {
    branchPillBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      branchMenu.classList.toggle("show");
    });

    document.addEventListener("click", (e) => {
      if (!branchPillBtn.contains(e.target) && !branchMenu.contains(e.target)) {
        branchMenu.classList.remove("show");
      }
    });
  }

  function selectBranch(branchKey) {
    branchOptions.forEach((opt) => {
      if (opt.getAttribute("data-branch") === branchKey) {
        opt.classList.add("active");
      } else {
        opt.classList.remove("active");
      }
    });

    if (branchKey === "saudi") {
      currentBranchName.textContent = "فرع جدة (السعودية)";
      if (bookingBranchSelect) bookingBranchSelect.value = "saudi";
      highlightBranchCard("branch-saudi");
    } else if (branchKey === "yemen") {
      currentBranchName.textContent = "فرع حضرموت (اليمن)";
      if (bookingBranchSelect) bookingBranchSelect.value = "yemen";
      highlightBranchCard("branch-yemen");
    }
  }

  branchOptions.forEach((opt) => {
    opt.addEventListener("click", () => {
      const branchKey = opt.getAttribute("data-branch");
      selectBranch(branchKey);
      branchMenu.classList.remove("show");
      showToast(
        `تم اختيار ${opt.querySelector("strong").textContent}`,
        "fa-location-dot",
      );
    });
  });

  if (bookingBranchSelect) {
    bookingBranchSelect.addEventListener("change", (e) => {
      selectBranch(e.target.value);
    });
  }

  function highlightBranchCard(cardId) {
    const cards = document.querySelectorAll(".branch-card");
    cards.forEach((c) => c.classList.remove("active-branch-highlight"));
    const target = document.getElementById(cardId);
    if (target) target.classList.add("active-branch-highlight");
  }

  /* -------------------------------------------------------------------------- */
  /* 4. Package Filtering Tabs                                                  */
  /* -------------------------------------------------------------------------- */
  const tabBtns = document.querySelectorAll(".tab-btn");
  const packageCards = document.querySelectorAll(".package-card");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");

      packageCards.forEach((card) => {
        const category = card.getAttribute("data-category");
        if (filter === "all" || category === filter) {
          card.style.display = "flex";
          card.style.animation = "fadeIn 0.4s ease";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  /* -------------------------------------------------------------------------- */
  /* 5. Package Selection to Booking Form                                       */
  /* -------------------------------------------------------------------------- */
  const pkgSelectBtns = document.querySelectorAll(".btn-package-select");
  const bookingPackageSelect = document.getElementById("bookingPackage");

  pkgSelectBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const packageTitle = btn.getAttribute("data-package");

      if (bookingPackageSelect) {
        // 1. Try exact match first
        let found = false;
        for (let option of bookingPackageSelect.options) {
          if (option.value === packageTitle) {
            bookingPackageSelect.value = option.value;
            found = true;
            break;
          }
        }

        // 2. Fallback: partial match (includes)
        if (!found) {
          for (let option of bookingPackageSelect.options) {
            if (
              option.value.includes(packageTitle) ||
              packageTitle.includes(option.value)
            ) {
              bookingPackageSelect.value = option.value;
              found = true;
              break;
            }
          }
        }

        // 3. Visual highlight on the select field
        bookingPackageSelect.classList.add("package-selected-highlight");
        setTimeout(() => {
          bookingPackageSelect.classList.remove("package-selected-highlight");
        }, 2500);

        // Recalculate price total
        updateGrandTotal();

        // Smooth scroll to booking section then focus the select
        const bookingSection = document.getElementById("booking");
        bookingSection.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => {
          bookingPackageSelect.focus();
        }, 700);

        showToast(
          `✅ تم اختيار ${packageTitle} — يمكنك تغييرها من حقل الباقة`,
          "fa-check-circle",
        );
      }
    });
  });

  /* -------------------------------------------------------------------------- */
  /* 6. Interactive Add-ons Calculator & Live Total Update                      */
  /* -------------------------------------------------------------------------- */
  const addonInputs = document.querySelectorAll(".addon-input");
  const selectedAddonsCountEl = document.getElementById("selectedAddonsCount");
  const selectedAddonsTotalEl = document.getElementById("selectedAddonsTotal");
  const applyAddonsBtn = document.getElementById("applyAddonsToBooking");
  const formAddonsListText = document.getElementById("formAddonsListText");
  const formGrandTotalDisplay = document.getElementById(
    "formGrandTotalDisplay",
  );

  function calculateAddonsTotal() {
    let count = 0;
    let addonsTotal = 0;
    let selectedNames = [];

    addonInputs.forEach((input) => {
      if (input.checked) {
        count++;
        const val = parseInt(input.value) || 0;
        addonsTotal += val;
        const name = input.getAttribute("data-name");
        const customPrice = input.getAttribute("data-custom-price");
        selectedNames.push(customPrice ? `${name} (${customPrice})` : name);
      }
    });

    if (selectedAddonsCountEl) {
      selectedAddonsCountEl.textContent = `${count} خدمات`;
    }

    if (selectedAddonsTotalEl) {
      selectedAddonsTotalEl.textContent = `${addonsTotal.toLocaleString()} ر.س`;
    }

    return { count, addonsTotal, selectedNames };
  }

  addonInputs.forEach((input) => {
    input.addEventListener("change", () => {
      calculateAddonsTotal();
      updateGrandTotal();
    });
  });

  if (applyAddonsBtn) {
    applyAddonsBtn.addEventListener("click", () => {
      const { count, selectedNames } = calculateAddonsTotal();
      if (count === 0) {
        showToast(
          "قم باختيار إضافة واحدة على الأقل للاعتماد",
          "fa-info-circle",
        );
      } else {
        showToast(
          `تم اعتماد ${count} خدمات إضافية ونقلها لنموذج الحجز`,
          "fa-check",
        );
        document
          .getElementById("booking")
          .scrollIntoView({ behavior: "smooth" });
      }
      updateGrandTotal();
    });
  }

  // Helper to extract base price from selected package text
  function getSelectedPackagePrice() {
    if (!bookingPackageSelect || !bookingPackageSelect.value) return 0;
    const valText = bookingPackageSelect.value;
    const match = valText.match(/(\d+)\s*ر\.س/);
    if (match && match[1]) {
      return parseInt(match[1]);
    }
    return 0;
  }

  function updateGrandTotal() {
    const pkgPrice = getSelectedPackagePrice();
    const { addonsTotal, selectedNames } = calculateAddonsTotal();

    const grandTotal = pkgPrice + addonsTotal;

    if (formAddonsListText) {
      if (selectedNames.length > 0) {
        formAddonsListText.textContent = selectedNames.join(" + ");
      } else {
        formAddonsListText.textContent =
          "لم يتم اختيار إضافات (يمكنك اختيارها من الأعلى)";
      }
    }

    if (formGrandTotalDisplay) {
      if (grandTotal > 0) {
        formGrandTotalDisplay.textContent = `${grandTotal.toLocaleString()} ر.س`;
      } else {
        formGrandTotalDisplay.textContent = "0 ر.س";
      }
    }
  }

  if (bookingPackageSelect) {
    bookingPackageSelect.addEventListener("change", updateGrandTotal);
  }

  /* -------------------------------------------------------------------------- */
  /* 7. Booking Form Submission & WhatsApp Generator & Confirmation Modal       */
  /* -------------------------------------------------------------------------- */
  const bookingForm = document.getElementById("bookingForm");
  const btnWhatsAppSubmit = document.getElementById("btnWhatsAppSubmit");
  const bookingModal = document.getElementById("bookingModal");
  const modalClose = document.getElementById("modalClose");
  const modalDoneBtn = document.getElementById("modalDoneBtn");
  const modalReceipt = document.getElementById("modalReceipt");
  const modalConfirmWhatsapp = document.getElementById("modalConfirmWhatsapp");

  let currentBookingData = null;

  function gatherFormData() {
    const name = document.getElementById("clientName").value.trim();
    const phone = document.getElementById("clientPhone").value.trim();
    const branchVal = document.getElementById("bookingBranch").value;
    const branchText =
      branchVal === "saudi" ? "فرع السعودية (جدة)" : "فرع اليمن (حضرموت)";
    const eventType = document.getElementById("eventType").value;
    const eventDate = document.getElementById("eventDate").value;
    const pkgVal = document.getElementById("bookingPackage").value;
    const notes = document.getElementById("clientNotes").value.trim();

    const { addonsTotal, selectedNames } = calculateAddonsTotal();
    const pkgPrice = getSelectedPackagePrice();
    const grandTotal = pkgPrice + addonsTotal;

    const bookingRef = "WM-" + Math.floor(100000 + Math.random() * 900000);

    return {
      bookingRef,
      name,
      phone,
      branchVal,
      branchText,
      eventType,
      eventDate,
      pkgVal,
      pkgPrice,
      addonsList: selectedNames,
      addonsTotal,
      grandTotal,
      notes,
    };
  }

  function validateForm() {
    const name = document.getElementById("clientName").value.trim();
    const phone = document.getElementById("clientPhone").value.trim();
    const eventType = document.getElementById("eventType").value;
    const eventDate = document.getElementById("eventDate").value;
    const pkgVal = document.getElementById("bookingPackage").value;

    if (!name || !phone || !eventType || !eventDate || !pkgVal) {
      showToast(
        "يرجى تعبئة جميع الحقول المطلوبة (*)",
        "fa-exclamation-triangle",
      );
      return false;
    }
    return true;
  }

  if (bookingForm) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validateForm()) return;

      currentBookingData = gatherFormData();
      renderModalReceipt(currentBookingData);

      if (bookingModal) {
        bookingModal.classList.add("show");
      }
    });
  }

  function renderModalReceipt(data) {
    if (!modalReceipt) return;

    modalReceipt.innerHTML = `
            <div class="receipt-line">
                <span>رقم الحجز المرجعي:</span>
                <strong>${data.bookingRef}</strong>
            </div>
            <div class="receipt-line">
                <span>اسم العميل:</span>
                <strong>${data.name}</strong>
            </div>
            <div class="receipt-line">
                <span>رقم الجوال:</span>
                <strong dir="ltr">${data.phone}</strong>
            </div>
            <div class="receipt-line">
                <span>الفرع المختار:</span>
                <strong>${data.branchText}</strong>
            </div>
            <div class="receipt-line">
                <span>نوع المناسبة والتاريخ:</span>
                <strong>${data.eventType} (${data.eventDate})</strong>
            </div>
            <div class="receipt-line">
                <span>الباقة المطلوبة:</span>
                <strong>${data.pkgVal}</strong>
            </div>
            ${
              data.addonsList.length > 0
                ? `
            <div class="receipt-line">
                <span>الخدمات الإضافية:</span>
                <strong>${data.addonsList.join("، ")}</strong>
            </div>
            `
                : ""
            }
            ${
              data.notes
                ? `
            <div class="receipt-line">
                <span>ملاحظات أو تفاصيل إضافية:</span>
                <strong>${data.notes}</strong>
            </div>
            `
                : ""
            }
            <div class="receipt-line total-line" style="border-top:1px dashed #444; padding-top:8px; margin-top:8px;">
                <span>التكلفة التقديرية الإجمالية:</span>
                <strong class="text-orange" style="font-size:1.15rem;">${data.grandTotal.toLocaleString()} ر.س</strong>
            </div>
        `;
  }

  function generateWhatsAppUrl(data) {
    const phoneTarget =
      data.branchVal === "saudi" ? "966559220161" : "967735810830";

    let msg = `*طلب حجز جديد عبر موقع وسيط ميديا*\n`;
    msg += `-------------------------------\n`;
    msg += `🔖 *رقم المرجع:* ${data.bookingRef}\n`;
    msg += `👤 *الاسم:* ${data.name}\n`;
    msg += `📞 *رقم التواصل:* ${data.phone}\n`;
    msg += `📍 *الفرع:* ${data.branchText}\n`;
    msg += `🎉 *نوع المناسبة:* ${data.eventType}\n`;
    msg += `📅 *تاريخ المناسبة:* ${data.eventDate}\n`;
    msg += `📦 *الباقة:* ${data.pkgVal}\n`;

    if (data.addonsList.length > 0) {
      msg += `➕ *الإضافات:* ${data.addonsList.join(" + ")}\n`;
    }

    msg += `💰 *الإجمالي التقديري:* ${data.grandTotal.toLocaleString()} ر.س\n`;

    if (data.notes) {
      msg += `📝 *ملاحظات:* ${data.notes}\n`;
    }

    msg += `-------------------------------\n`;
    msg += `يرجى تأكيد الحجز وإفادتي بالإجراءات.`;

    return `https://wa.me/${phoneTarget}?text=${encodeURIComponent(msg)}`;
  }

  if (btnWhatsAppSubmit) {
    btnWhatsAppSubmit.addEventListener("click", () => {
      if (!validateForm()) return;
      const data = gatherFormData();
      const url = generateWhatsAppUrl(data);
      window.open(url, "_blank");
      showToast("جاري فتح الواتساب لإرسال تفاصيل الحجز...", "fa-whatsapp");
    });
  }

  if (modalConfirmWhatsapp) {
    modalConfirmWhatsapp.addEventListener("click", () => {
      if (currentBookingData) {
        const url = generateWhatsAppUrl(currentBookingData);
        window.open(url, "_blank");
      }
    });
  }

  if (modalClose) {
    modalClose.addEventListener("click", () => {
      bookingModal.classList.remove("show");
    });
  }

  if (modalDoneBtn) {
    modalDoneBtn.addEventListener("click", () => {
      bookingModal.classList.remove("show");
    });
  }

  /* -------------------------------------------------------------------------- */
  /* 8. Back to Top Button & Scroll Active Nav                                  */
  /* -------------------------------------------------------------------------- */
  const backToTopBtn = document.getElementById("backToTop");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 350) {
      backToTopBtn.classList.add("show");
    } else {
      backToTopBtn.classList.remove("show");
    }

    // Active Nav Link Scrollspy
    const sections = document.querySelectorAll("section[id]");
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute("id");
      const navLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);

      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLink.classList.add("active");
        } else {
          navLink.classList.remove("active");
        }
      }
    });
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* -------------------------------------------------------------------------- */
  /* 9. Toast Notification System                                               */
  /* -------------------------------------------------------------------------- */
  function showToast(message, iconClass = "fa-info-circle") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast-msg";
    toast.innerHTML = `
            <i class="fa-solid ${iconClass}"></i>
            <span>${message}</span>
        `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(50px)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // Initial setup calculation call
  updateGrandTotal();

  /* -------------------------------------------------------------------------- */
  /* 10. Language Switcher (i18n Engine)                                        */
  /* -------------------------------------------------------------------------- */
  const langToggleBtn = document.getElementById("langToggle");
  const langLabel = document.getElementById("langLabel");
  const htmlTag = document.documentElement;

  let currentLang = localStorage.getItem("waseet_lang") || "ar";

  async function applyLanguage(lang) {
    try {
      const translations = lang === 'ar' ? arTranslations : enTranslations;

      // Update HTML attributes
      htmlTag.setAttribute("lang", lang);
      htmlTag.setAttribute("dir", translations.dir);
      htmlTag.setAttribute("data-lang", lang);

      // Update Toggle Label
      if (langLabel) {
        langLabel.textContent = lang === "ar" ? "EN" : "AR";
      }

      // Update all elements with data-i18n
      document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        const keys = key.split(".");
        let value = translations;
        
        for (let k of keys) {
          value = value ? value[k] : null;
        }

        if (value) {
          if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
            el.placeholder = value;
          } else {
            // Check if element has font awesome icon inside it, to preserve it
            const icon = el.querySelector("i.fa-solid, i.fa-brands, i.fa-regular");
            if (icon) {
              el.innerHTML = icon.outerHTML + " " + value;
            } else {
              el.innerHTML = value;
            }
          }
        }
      });

      // Save preference
      localStorage.setItem("waseet_lang", lang);
    } catch (error) {
      console.error("Error applying language:", error);
    }
  }

  // Load saved language on startup
  if (currentLang) {
    applyLanguage(currentLang);
  }

  // Toggle button click
  if (langToggleBtn) {
    langToggleBtn.addEventListener("click", () => {
      currentLang = currentLang === "ar" ? "en" : "ar";
      applyLanguage(currentLang);
    });
  }
});
