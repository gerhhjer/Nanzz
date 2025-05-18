document.addEventListener("DOMContentLoaded", function() {
  const buttons = document.querySelectorAll(".card-buttons button");
  const sections = document.querySelectorAll(".card-section");
  const card = document.querySelector(".card");

  let currentSection = document.querySelector(".card-section.is-active") || sections[0];
  let isAnimating = false;

  const switchSection = (targetSectionId) => {
    if (isAnimating || !targetSectionId) return;

    const newSection = document.querySelector(targetSectionId);
    if (!newSection || newSection === currentSection) return;

    isAnimating = true;
    currentSection.classList.add("fade-out");

    setTimeout(() => {
      sections.forEach((s) => s.classList.remove("is-active", "fade-in", "fade-out"));

      newSection.classList.add("is-active", "fade-in");

      buttons.forEach((b) => b.classList.remove("is-active"));
      const targetButton = document.querySelector(`button[data-section="${targetSectionId}"]`);
      if (targetButton) targetButton.classList.add("is-active");

      card.setAttribute("data-state", targetSectionId);
      currentSection = newSection;
      isAnimating = false;
    }, 300);
  };

  buttons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const target = e.currentTarget.getAttribute("data-section");
      if (target && document.querySelector(target)) {
        switchSection(target);
      }
    });
  });

  if (currentSection) {
    currentSection.classList.add("is-active");
  }

  const typingText = document.querySelector(".typing-text .text");
  if (typingText) {
    const roles = ["Pelajar", "Developer", "Pemula", "hehehe 🗿"];
    let i = 0, j = 0, isDeleting = false;

    const typeEffect = () => {
      const current = roles[i];
      typingText.textContent = isDeleting 
        ? current.substring(0, j - 1) 
        : current.substring(0, j + 1);

      j += isDeleting ? -1 : 1;

      if (j === current.length) {
        isDeleting = true;
        setTimeout(typeEffect, 1000);
      } else if (j === 0) {
        isDeleting = false;
        i = (i + 1) % roles.length;
        setTimeout(typeEffect, 400);
      } else {
        setTimeout(typeEffect, isDeleting ? 60 : 120);
      }
    };
    typeEffect();
  }

  const musicBtn = document.getElementById("musicBtn");
  const backgroundMusic = document.getElementById("backgroundMusic");

  if (musicBtn && backgroundMusic) {
    backgroundMusic.volume = 0.3;

    const updateMusicButton = () => {
      musicBtn.innerHTML = backgroundMusic.paused ? '<i class="fas fa-play"></i>' : '<i class="fas fa-pause"></i>';
    };

    musicBtn.addEventListener("click", async () => {
      if (backgroundMusic.paused) {
        try {
          await backgroundMusic.play();
        } catch (error) {
          console.error("Music playback error:", error);
        }
      } else {
        backgroundMusic.pause();
      }
      updateMusicButton();
    });

    backgroundMusic.addEventListener("ended", () => {
      backgroundMusic.currentTime = 0;
      backgroundMusic.play();
    });

    document.body.addEventListener("click", () => {
      if (localStorage.getItem("musicPlaying") === "true") {
        backgroundMusic.play().catch(() => console.log("Autoplay blocked"));
      }
    });
  }

  const initSnowEffect = () => {
    const snowContainer = document.createElement("div");
    snowContainer.className = "snow-effect";
    document.body.appendChild(snowContainer);

    const createSnowflake = () => {
      const snowflake = document.createElement("div");
      snowflake.className = "snowflake";

      const size = Math.random() * 10 + 5;
      const posX = Math.random() * window.innerWidth;
      const duration = Math.random() * 5 + 5;
      const delay = Math.random() * 5;
      const opacity = Math.random() * 0.5 + 0.5;

      snowflake.style.width = `${size}px`;
      snowflake.style.height = `${size}px`;
      snowflake.style.left = `${posX}px`;
      snowflake.style.animationDuration = `${duration}s`;
      snowflake.style.animationDelay = `${delay}s`;
      snowflake.style.opacity = opacity;

      snowContainer.appendChild(snowflake);

      setTimeout(() => {
        snowflake.remove();
      }, duration * 1000);
    };

    for (let i = 0; i < 30; i++) {
      createSnowflake();
    }

    const snowInterval = setInterval(createSnowflake, 500);

    return () => {
      clearInterval(snowInterval);
      snowContainer.remove();
    };
  };

  const whatsappButton = document.querySelector("[data-section='#whatsapp']");
  if (whatsappButton) {
    whatsappButton.addEventListener("click", () => {
      const cleanupSnow = initSnowEffect();

      const observer = new MutationObserver(() => {
        if (card.getAttribute("data-state") !== "#whatsapp") {
          cleanupSnow();
          observer.disconnect();
        }
      });
      observer.observe(card, { attributes: true, attributeFilter: ["data-state"] });
    });
  }
});
