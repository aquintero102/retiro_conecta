document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // LOADER PROFESIONAL
  // =========================
  const loader = document.createElement("div");
  loader.className = "loader-overlay";
  loader.innerHTML = `
    <div class="loader-card">
      <div class="loader-spinner"></div>
      <p>Cargando...</p>
      <span class="loader-subtexto">Preparando la información</span>
      <div class="loader-barra"><span></span></div>
    </div>
  `;
  document.body.appendChild(loader);

  let loaderTimeout;

  function showLoader(text = "Cargando...", subtext = "Preparando la información", duration = 900) {
    const loaderText = loader.querySelector("p");
    const loaderSubtext = loader.querySelector(".loader-subtexto");

    loaderText.textContent = text;
    loaderSubtext.textContent = subtext;
    loader.classList.add("activo");

    clearTimeout(loaderTimeout);

    if (duration) {
      loaderTimeout = setTimeout(() => {
        hideLoader();
      }, duration);
    }
  }

  function hideLoader() {
    loader.classList.remove("activo");
  }

  // Loader al entrar a la página, como una web profesional.
  showLoader("Cargando RetiroConecta...", "Inicializando la experiencia", 650);

  // Loader al hacer clic en links internos o externos.
  document.querySelectorAll("a[href]").forEach(link => {
    link.addEventListener("click", function(e) {
      const href = this.getAttribute("href");

      if (!href || href === "#" || href.startsWith("mailto:") || href.startsWith("tel:")) {
        return;
      }

      e.preventDefault();

      const isExternal = href.startsWith("http");
      const message = isExternal ? "Abriendo ruta seleccionada..." : "Cargando sección...";
      const submessage = isExternal ? "Redirigiendo al proyecto correspondiente" : "Preparando el contenido";

      showLoader(message, submessage, null);

      setTimeout(() => {
        window.location.href = href;
      }, 750);
    });
  });

  // Loader cada vez que se selecciona una opción o fecha.
  document.querySelectorAll("select, input[type='date']").forEach(elemento => {
    elemento.addEventListener("change", () => {
      const valor = elemento.value;
      const texto = valor && !valor.toLowerCase().includes("seleccionar")
        ? `Cargando ${valor}...`
        : "Cargando selección...";

      showLoader(texto, "Actualizando datos disponibles", 850);
    });
  });

  // Loader visual al presionar botones comunes.
  document.querySelectorAll("button, .btn-principal, .btn-secundario, .btn-card").forEach(elemento => {
    elemento.addEventListener("click", () => {
      if (elemento.closest("form")) return;
      showLoader("Procesando acción...", "Un momento, por favor", 750);
    });
  });


  // =========================
  // NAVBAR SHADOW ON SCROLL
  // =========================
  const header = document.querySelector(".header");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      header.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
    } else {
      header.style.boxShadow = "none";
    }
  });


  // =========================
  // SCROLL ANIMATIONS
  // =========================
  const animatedElements = document.querySelectorAll(
    ".card, .recorrido-card, .parada-card, .servicio-card, .horario-card, .info-card, .info-bloque, .info-link-card"
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, {
    threshold: 0.2
  });

  animatedElements.forEach(el => {
    el.style.opacity = 0;
    el.style.transform = "translateY(40px)";
    el.style.transition = "all 0.6s ease";
    observer.observe(el);
  });


  // =========================
  // BUSCADOR INDEX
  // =========================
  const buscador = document.querySelector(".buscador form");

  if (buscador) {
    buscador.addEventListener("submit", function (e) {
      e.preventDefault();

      const destino = document.querySelector("#destino")?.value;

      if (!destino || destino === "Seleccionar destino") {
        showToast("Seleccioná un destino");
        return;
      }

      showLoader(`Buscando viajes hacia ${destino}...`, "Consultando rutas y horarios", 1200);
      setTimeout(() => showToast(`Resultados cargados para ${destino}`), 1200);
    });
  }


  // =========================
  // FILTRO HORARIOS
  // =========================
  const filtroHorarios = document.querySelector(".filtros-horarios form");

  if (filtroHorarios) {
    filtroHorarios.addEventListener("submit", function(e){
      e.preventDefault();
      showLoader("Actualizando horarios...", "Filtrando la información seleccionada", 1200);
      setTimeout(() => showToast("Horarios actualizados"), 1200);
    });
  }


  // =========================
  // CONTACTO FORM
  // =========================
  const contactoForm = document.querySelector(".formulario-contacto");

  if (contactoForm) {
    contactoForm.addEventListener("submit", function(e){
      e.preventDefault();

      const nombre = document.querySelector("#nombre").value.trim();
      const email = document.querySelector("#email").value.trim();
      const mensaje = document.querySelector("#mensaje").value.trim();

      if (!nombre || !email || !mensaje) {
        showToast("Completá todos los campos");
        return;
      }

      if (!email.includes("@")) {
        showToast("Email inválido");
        return;
      }

      showLoader("Enviando consulta...", "Procesando tu mensaje", 1200);
      setTimeout(() => {
        showToast("Consulta enviada correctamente");
        contactoForm.reset();
      }, 1200);
    });
  }


  // =========================
  // MAPA HOVER
  // =========================
  const puntos = document.querySelectorAll(".punto, .parada-mapa");

  puntos.forEach(punto => {
    punto.addEventListener("mouseenter", () => {
      punto.style.transform = "scale(1.1)";
    });

    punto.addEventListener("mouseleave", () => {
      punto.style.transform = "scale(1)";
    });
  });


  // =========================
  // DARK MODE
  // =========================
  const darkButton = document.createElement("button");
  darkButton.textContent = "🌙";
  darkButton.style.position = "fixed";
  darkButton.style.bottom = "20px";
  darkButton.style.right = "20px";
  darkButton.style.width = "55px";
  darkButton.style.height = "55px";
  darkButton.style.border = "none";
  darkButton.style.borderRadius = "50%";
  darkButton.style.background = "#0b1f3a";
  darkButton.style.color = "white";
  darkButton.style.cursor = "pointer";
  darkButton.style.fontSize = "20px";
  darkButton.style.zIndex = "999";

  document.body.appendChild(darkButton);

  let dark = false;

  darkButton.addEventListener("click", () => {
    showLoader("Cambiando modo visual...", "Aplicando preferencias", 450);
    dark = !dark;

    setTimeout(() => {
      if (dark) {
        document.body.style.background = "#121212";
        document.body.style.color = "white";
        darkButton.textContent = "☀️";
      } else {
        document.body.style.background = "#f4f6f8";
        document.body.style.color = "#0b1f3a";
        darkButton.textContent = "🌙";
      }
    }, 250);
  });


  // =========================
  // TOAST SYSTEM
  // =========================
  function showToast(text) {
    const toast = document.createElement("div");

    toast.textContent = text;
    toast.style.position = "fixed";
    toast.style.top = "25px";
    toast.style.right = "25px";
    toast.style.background = "#ff6b4a";
    toast.style.color = "white";
    toast.style.padding = "16px 22px";
    toast.style.borderRadius = "14px";
    toast.style.boxShadow = "0 10px 25px rgba(0,0,0,0.2)";
    toast.style.zIndex = "9999";
    toast.style.opacity = 0;
    toast.style.transition = "all 0.3s";

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = 1;
    }, 50);

    setTimeout(() => {
      toast.style.opacity = 0;
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

});
