document.addEventListener("DOMContentLoaded", () => {


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

    const tiempoSeguro = duration === null ? 3500 : duration;
    if (tiempoSeguro && tiempoSeguro > 0) {
      loaderTimeout = setTimeout(() => {
        hideLoader();
      }, tiempoSeguro);
    }
  }

  function hideLoader() {
    loader.classList.remove("activo");
  }

  window.addEventListener("pageshow", hideLoader);

  showLoader("Cargando RetiroConecta...", "Inicializando la experiencia", 650);

  document.querySelectorAll("a[href]").forEach(link => {
    link.addEventListener("click", function(e) {
      const href = this.getAttribute("href");
      const target = this.getAttribute("target");

      if (!href || href === "#" || href.startsWith("mailto:") || href.startsWith("tel:")) {
        return;
      }

      if (target === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }

      e.preventDefault();

      const isExternal = href.startsWith("http");
      const message = isExternal ? "Abriendo ruta seleccionada..." : "Cargando sección...";
      const submessage = isExternal ? "Redirigiendo al proyecto correspondiente" : "Preparando el contenido";

      showLoader(message, submessage, 1400);

      setTimeout(() => {
        window.location.href = href;
      }, 650);
    });
  });

  document.querySelectorAll("select, input[type='date']").forEach(elemento => {
    elemento.addEventListener("change", () => {
      const valor = elemento.value;
      const texto = valor && !valor.toLowerCase().includes("seleccionar")
        ? `Cargando ${valor}...`
        : "Cargando selección...";

      showLoader(texto, "Actualizando datos disponibles", 850);
    });
  });

  document.querySelectorAll("button, .btn-principal, .btn-secundario, .btn-card").forEach(elemento => {
    elemento.addEventListener("click", () => {
      if (elemento.closest("form") || elemento.classList.contains("menu-toggle") || elemento.classList.contains("modo-toggle")) return;
      showLoader("Procesando acción...", "Un momento, por favor", 750);
    });
  });



  const header = document.querySelector(".header");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      header.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)";
    } else {
      header.style.boxShadow = "none";
    }
  });



  const animatedElements = document.querySelectorAll(
    ".card, .recorrido-card, .parada-card, .servicio-card, .horario-card, .info-card, .info-bloque, .info-link-card, .simulador-viaje, .consulta-apoyo, .consulta-rutas"
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



  const simuladorForm = document.querySelector(".simulador-formulario");

  if (simuladorForm) {
    const datosViaje = {
      "La Plata": { duracion: 90, frecuencia: 20, perfil: "ruta universitaria y administrativa", transporte: "Colectivo interurbano - Ruta 1", sector: "Plataforma 4 / Andén B", costo: "$4.200 aprox." },
      "Luján": { duracion: 105, frecuencia: 30, perfil: "ruta turística y familiar", transporte: "Colectivo interurbano - Ruta 2", sector: "Plataforma 6 / Andén C", costo: "$4.600 aprox." },
      "Zárate": { duracion: 110, frecuencia: 35, perfil: "ruta laboral e industrial", transporte: "Servicio semirápido - Ruta 3", sector: "Plataforma 8 / Sector Norte", costo: "$5.100 aprox." },
      "Pilar": { duracion: 80, frecuencia: 20, perfil: "ruta residencial, educativa y comercial", transporte: "Colectivo directo - Ruta 4", sector: "Plataforma 2 / Sector Oeste", costo: "$3.900 aprox." }
    };

    const estadoServicio = [
      { texto: "Servicio normal", clase: "estado-verde", demora: 0, progreso: "46%" },
      { texto: "Demoras leves", clase: "estado-amarillo", demora: 8, progreso: "62%" },
      { texto: "Alta demanda", clase: "estado-rojo", demora: 15, progreso: "78%" }
    ];

    const formatearHora = (minutosTotales) => {
      const minutosDia = ((minutosTotales % 1440) + 1440) % 1440;
      const horas = Math.floor(minutosDia / 60).toString().padStart(2, "0");
      const minutos = (minutosDia % 60).toString().padStart(2, "0");
      return `${horas}:${minutos}`;
    };

    const horaAMinutos = (hora) => {
      const [h, m] = hora.split(":").map(Number);
      return (h * 60) + m;
    };

    const escribirResultado = (selector, texto) => {
      const elemento = document.querySelector(selector);
      if (elemento) elemento.textContent = texto;
    };

    simuladorForm.addEventListener("submit", function(e) {
      e.preventDefault();

      const destino = document.querySelector("#simDestino")?.value;
      const dia = document.querySelector("#simDia")?.value;
      const hora = document.querySelector("#simHora")?.value || "08:00";

      if (!destino) {
        showToast("Seleccioná un destino para simular el viaje");
        return;
      }

      const datos = datosViaje[destino];
      const estado = estadoServicio[Math.floor(Math.random() * estadoServicio.length)];
      const salidaBase = horaAMinutos(hora);
      const salidaRecomendada = salidaBase - 15;
      const llegada = salidaBase + datos.duracion + estado.demora;
      const duracionTexto = estado.demora > 0
        ? `${datos.duracion + estado.demora} min, con demora estimada`
        : `${datos.duracion} min`;

      const estadoElemento = document.querySelector(".estado-servicio");
      const rutaElemento = document.querySelector(".resultado-ruta");
      const destinoLinea = document.querySelector(".linea-punto:not(.activo)");
      const lineaTramo = document.querySelector(".linea-tramo");

      if (estadoElemento) {
        estadoElemento.className = `estado-servicio ${estado.clase}`;
        estadoElemento.textContent = estado.texto;
      }
      if (rutaElemento) rutaElemento.textContent = `Retiro → ${destino}`;
      if (destinoLinea) destinoLinea.textContent = destino;
      if (lineaTramo) lineaTramo.style.setProperty("--progreso-viaje", estado.progreso);

      escribirResultado("#resTransporte", datos.transporte);
      escribirResultado("#resSector", datos.sector);
      escribirResultado("#resDuracion", duracionTexto);
      escribirResultado("#resCosto", datos.costo);
      escribirResultado("#resSalida", formatearHora(salidaBase));
      escribirResultado("#resLlegada", formatearHora(llegada));
      escribirResultado("#resConsejo", `Llegá a Retiro a las ${formatearHora(salidaRecomendada)}. Es una ${datos.perfil} y el día seleccionado es ${dia.toLowerCase()}.`);

      showLoader(`Simulando viaje a ${destino}...`, "Calculando salida, llegada y estado del servicio", 900);
      setTimeout(() => showToast(`Viaje Retiro → ${destino} simulado correctamente`), 950);
    });
  }



  const filtroHorarios = document.querySelector(".filtros-horarios form");

  if (filtroHorarios) {
    filtroHorarios.addEventListener("submit", function(e){
      e.preventDefault();
      showLoader("Actualizando horarios...", "Filtrando la información seleccionada", 1200);
      setTimeout(() => showToast("Horarios actualizados"), 1200);
    });
  }



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
        showToast("Correo electrónico inválido");
        return;
      }

      showLoader("Enviando consulta...", "Procesando tu mensaje", 1200);
      setTimeout(() => {
        showToast("Consulta enviada correctamente");
        contactoForm.reset();
      }, 1200);
    });
  }



  const chatbotForm = document.querySelector(".chatbot-formulario");

  if (chatbotForm) {
    const respuestasChatbot = {
      banos: "Los baños se encuentran en el hall central y en el sector de andenes. El servicio funciona las 24 horas.",
      plataformas: "La plataforma aparece en la consulta de viajes. También podés verificarla en la oficina de información del acceso principal.",
      estacionamiento: "El estacionamiento está en el acceso vehicular oeste y permanece abierto las 24 horas.",
      gastronomia: "Los locales gastronómicos están en el patio gastronómico. El horario estimado es de 07:00 a 00:00.",
      espera: "Las áreas de espera están en la Sala Norte y la Sala Sur, con asientos, pantallas informativas y puntos de carga."
    };

    chatbotForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const pregunta = document.querySelector("#chatbotPregunta")?.value;
      const respuesta = document.querySelector("#chatbotRespuesta");

      if (!pregunta) {
        showToast("Seleccioná una pregunta del asistente");
        return;
      }

      if (respuesta) respuesta.textContent = respuestasChatbot[pregunta];
      showLoader("Consultando asistente...", "Buscando respuesta frecuente", 650);
    });
  }



  const puntos = document.querySelectorAll(".punto, .parada-mapa");

  puntos.forEach(punto => {
    punto.addEventListener("mouseenter", () => {
      punto.style.transform = "scale(1.1)";
    });

    punto.addEventListener("mouseleave", () => {
      punto.style.transform = "scale(1)";
    });
  });



  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const abierto = navLinks.classList.toggle("abierto");
      menuToggle.classList.toggle("abierto", abierto);
      menuToggle.setAttribute("aria-expanded", abierto ? "true" : "false");
      menuToggle.setAttribute("aria-label", abierto ? "Cerrar menú de navegación" : "Abrir menú de navegación");
    });

    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("abierto");
        menuToggle.classList.remove("abierto");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menú de navegación");
      });
    });
  }



  const darkButton = document.createElement("button");
  darkButton.type = "button";
  darkButton.className = "modo-toggle";
  darkButton.setAttribute("aria-label", "Activar modo oscuro");
  darkButton.textContent = "🌙";

  document.body.appendChild(darkButton);

  const preferenciaGuardada = localStorage.getItem("retiroconecta-dark-mode");
  let dark = preferenciaGuardada === "true";

  function aplicarModoOscuro() {
    document.body.classList.toggle("dark-mode", dark);
    darkButton.textContent = dark ? "☀️" : "🌙";
    darkButton.setAttribute("aria-label", dark ? "Desactivar modo oscuro" : "Activar modo oscuro");
    localStorage.setItem("retiroconecta-dark-mode", String(dark));
  }

  aplicarModoOscuro();

  darkButton.addEventListener("click", () => {
    showLoader("Cambiando modo visual...", "Aplicando preferencias", 450);
    dark = !dark;
    setTimeout(aplicarModoOscuro, 250);
  });


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
