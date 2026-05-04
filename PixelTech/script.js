const header = document.querySelector(".site-header");
const mobileQuery = window.matchMedia("(max-width: 620px)");
const animatedElements = document.querySelectorAll(
  ".hero-copy, .hero-visual, .section-heading, .card, .step-card, .stat-card, .testimonial-card, .support-list article, .final-cta, .cta-band"
);
const statNumbers = document.querySelectorAll(".stat-card strong");
const whatsappNumber = "5516981964563";

let lastScrollY = window.scrollY;
let ticking = false;
let lastFocusedElement = null;

function showHeader() {
  header?.classList.remove("is-hidden-mobile");
}

function updateHeader() {
  const currentScrollY = window.scrollY;

  if (!header || !mobileQuery.matches) {
    header?.classList.toggle("is-scrolled", currentScrollY > 10);
    showHeader();
    lastScrollY = currentScrollY;
    ticking = false;
    return;
  }

  const scrollingDown = currentScrollY > lastScrollY + 8;
  const scrollingUp = currentScrollY < lastScrollY - 8;

  if (currentScrollY < 20 || scrollingUp) {
    showHeader();
  } else if (scrollingDown) {
    header.classList.add("is-hidden-mobile");
  }

  header.classList.toggle("is-scrolled", currentScrollY > 10);

  lastScrollY = currentScrollY;
  ticking = false;
}

function requestHeaderUpdate() {
  if (!ticking) {
    window.requestAnimationFrame(updateHeader);
    ticking = true;
  }
}

window.addEventListener("scroll", requestHeaderUpdate, { passive: true });
mobileQuery.addEventListener("change", updateHeader);
updateHeader();

animatedElements.forEach((element, index) => {
  element.classList.add("reveal-on-scroll");
  element.style.transitionDelay = `${Math.min(index * 45, 220)}ms`;
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
  );

  animatedElements.forEach((element) => revealObserver.observe(element));
} else {
  animatedElements.forEach((element) => element.classList.add("is-visible"));
}

function getCounterParts(text) {
  const cleanedText = text.trim();
  const numericText = cleanedText.replace(/[^\d]/g, "");
  const suffix = cleanedText.replace(/[\d.\s]/g, "");

  return {
    target: Number(numericText),
    suffix
  };
}

function formatCounterValue(value, suffix) {
  return `${new Intl.NumberFormat("pt-BR").format(value)}${suffix}`;
}

function animateCounter(element) {
  if (element.dataset.counted === "true") {
    return;
  }

  const { target, suffix } = getCounterParts(element.textContent);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  element.dataset.counted = "true";

  if (!target || reducedMotion) {
    element.textContent = formatCounterValue(target, suffix);
    return;
  }

  const duration = Math.min(1800, Math.max(950, target * 22));
  const startTime = performance.now();

  function updateCounter(currentTime) {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    const currentValue = Math.round(target * easedProgress);

    element.textContent = formatCounterValue(currentValue, suffix);

    if (progress < 1) {
      window.requestAnimationFrame(updateCounter);
    } else {
      element.textContent = formatCounterValue(target, suffix);
    }
  }

  element.textContent = formatCounterValue(0, suffix);
  window.requestAnimationFrame(updateCounter);
}

if ("IntersectionObserver" in window) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.45 }
  );

  statNumbers.forEach((number) => counterObserver.observe(number));
} else {
  statNumbers.forEach(animateCounter);
}

function createSupportModal() {
  const modal = document.createElement("div");
  modal.className = "support-modal";
  modal.id = "support-modal";
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = `
    <div class="support-modal__backdrop" data-close-modal></div>
    <section class="support-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="support-modal-title">
      <button class="support-modal__close" type="button" aria-label="Fechar formulario" data-close-modal>&times;</button>
      <p class="eyebrow">Apoie o projeto</p>
      <h2 id="support-modal-title">Candidate-se para apoiar o PixelTechBom</h2>
      <p class="support-modal__intro">
        Preencha seus dados e envie uma mensagem pronta pelo WhatsApp.
      </p>
      <form class="support-form">
        <label>
          Nome completo
          <input type="text" name="name" placeholder="Seu nome" required>
        </label>
        <label>
          Telefone
          <input type="tel" name="phone" placeholder="(16) 99999-9999">
        </label>
        <label>
          Cidade ou bairro
          <input type="text" name="location" placeholder="Ex: Ribeirao Preto">
        </label>
        <label>
          Como voce quer apoiar?
          <select name="supportType" required>
            <option value="">Selecione uma opcao</option>
            <option value="Voluntariado">Voluntariado</option>
            <option value="Doacao de equipamentos">Doacao de equipamentos</option>
            <option value="Apoio financeiro">Apoio financeiro</option>
            <option value="Parceria">Parceria</option>
          </select>
        </label>
        <label class="support-form__full">
          Mensagem
          <textarea name="message" rows="4" placeholder="Conte rapidamente como voce pode ajudar"></textarea>
        </label>
        <button class="button primary support-form__submit" type="submit">Enviar pelo WhatsApp</button>
      </form>
    </section>
  `;

  document.body.appendChild(modal);
  return modal;
}

const supportModal = createSupportModal();
const supportForm = supportModal.querySelector(".support-form");
const firstModalField = supportModal.querySelector("input[name='name']");

function openSupportModal() {
  lastFocusedElement = document.activeElement;
  supportModal.classList.add("is-open");
  supportModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  firstModalField?.focus();
}

function closeSupportModal() {
  supportModal.classList.remove("is-open");
  supportModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  lastFocusedElement?.focus();
}

document.querySelectorAll("a, button").forEach((element) => {
  if (element.textContent.trim().toLowerCase().includes("apoie o projeto")) {
    element.addEventListener("click", (event) => {
      event.preventDefault();
      openSupportModal();
    });
  }
});

supportModal.addEventListener("click", (event) => {
  if (event.target.matches("[data-close-modal]")) {
    closeSupportModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && supportModal.classList.contains("is-open")) {
    closeSupportModal();
  }
});

supportForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(supportForm);
  const name = data.get("name").trim();
  const phone = data.get("phone").trim();
  const location = data.get("location").trim();
  const supportType = data.get("supportType").trim();
  const message = data.get("message").trim();

  const whatsappMessage = [
    "Ola, PixelTechBom! Quero me candidatar para apoiar o projeto.",
    `Nome: ${name}`,
    phone ? `Telefone: ${phone}` : "",
    location ? `Cidade/Bairro: ${location}` : "",
    `Forma de apoio: ${supportType}`,
    message ? `Mensagem: ${message}` : ""
  ]
    .filter(Boolean)
    .join("\n");

  window.open(
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`,
    "_blank"
  );

  closeSupportModal();
  supportForm.reset();
});
