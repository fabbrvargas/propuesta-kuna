/* Propuesta de contenido — KUNÁ · Splash Labs
   Sin dependencias. Solo: barra al hacer scroll, fade-in, videos por viewport,
   visor simple e impresión. */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var escritorio = window.matchMedia('(min-width: 768px)');
  var soportaIO = 'IntersectionObserver' in window;

  /* ---------- Barra: aparece al salir de la portada ---------- */
  var barra = document.getElementById('barra');
  var portada = document.getElementById('portada');
  if (barra && portada && soportaIO) {
    new IntersectionObserver(function (entradas) {
      barra.classList.toggle('visible', !entradas[0].isIntersecting);
    }, { rootMargin: '-80px 0px 0px 0px' }).observe(portada);
  } else if (barra) {
    barra.classList.add('visible');
  }

  /* Ancla activa en la barra */
  var enlaces = barra ? barra.querySelectorAll('nav a') : [];
  if (soportaIO && enlaces.length) {
    var mapa = {};
    enlaces.forEach(function (a) { mapa[a.getAttribute('href').slice(1)] = a; });
    var observadorAnclas = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting || !mapa[e.target.id]) return;
        enlaces.forEach(function (x) { x.removeAttribute('aria-current'); });
        mapa[e.target.id].setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(mapa).forEach(function (id) {
      var s = document.getElementById(id);
      if (s) observadorAnclas.observe(s);
    });
  }

  /* ---------- Fade-in sutil ---------- */
  var aparecen = document.querySelectorAll('.aparece');
  if (soportaIO && !reducido) {
    var ioAparece = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); ioAparece.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    aparecen.forEach(function (el) { ioAparece.observe(el); });
  } else {
    aparecen.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- Portada: versión horizontal o vertical según pantalla ---------- */
  var videoPortada = document.querySelector('.js-portada');
  function cargarPortada() {
    if (!videoPortada) return;
    var sufijo = escritorio.matches ? 'h' : 'v';
    var src = videoPortada.getAttribute('data-src-' + sufijo);
    videoPortada.poster = videoPortada.getAttribute('data-poster-' + sufijo);
    if (reducido) return; // solo imagen fija
    if (videoPortada.getAttribute('src') !== src) {
      videoPortada.src = src;
      videoPortada.load();
    }
    var p = videoPortada.play();
    if (p && p.catch) p.catch(function () {});
  }
  cargarPortada();
  if (escritorio.addEventListener) escritorio.addEventListener('change', cargarPortada);

  if (videoPortada && soportaIO && !reducido) {
    new IntersectionObserver(function (entradas) {
      if (entradas[0].isIntersecting) { var p = videoPortada.play(); if (p && p.catch) p.catch(function () {}); }
      else videoPortada.pause();
    }).observe(videoPortada);
  }

  /* ---------- Portafolio: loop silenciado solo en viewport (escritorio) ----------
     En celular se muestra el poster; el video se ve al tocar la pieza. */
  var videosGaleria = document.querySelectorAll('.galeria video[data-src]');

  /* Posters diferidos: se asignan cuando la grilla se acerca a la pantalla */
  function ponerPoster(v) { if (!v.poster && v.getAttribute('data-poster')) v.poster = v.getAttribute('data-poster'); }
  if (soportaIO) {
    var ioPoster = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) { if (e.isIntersecting) { ponerPoster(e.target); ioPoster.unobserve(e.target); } });
    }, { rootMargin: '800px 0px' });
    videosGaleria.forEach(function (v) { ioPoster.observe(v); });
  } else {
    videosGaleria.forEach(ponerPoster);
  }
  window.addEventListener('beforeprint', function () { videosGaleria.forEach(ponerPoster); });
  if (soportaIO && !reducido) {
    var ioGaleria = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        var v = e.target;
        if (!escritorio.matches) { v.pause(); return; }
        if (e.isIntersecting) {
          if (!v.getAttribute('src')) { v.preload = 'metadata'; v.src = v.getAttribute('data-src'); }
          var p = v.play(); if (p && p.catch) p.catch(function () {});
        } else {
          v.pause();
        }
      });
    }, { threshold: 0.35 });
    videosGaleria.forEach(function (v) { ioGaleria.observe(v); });
  }

  /* ---------- Visor simple ---------- */
  var visor = document.getElementById('visor');
  var contenido = visor ? visor.querySelector('.visor-contenido') : null;
  var titulo = visor ? visor.querySelector('.visor-titulo') : null;
  var ultimoFoco = null;

  function abrirVisor(boton) {
    if (!visor || typeof visor.showModal !== 'function') {
      window.open(boton.getAttribute('data-src'), '_blank', 'noopener');
      return;
    }
    ultimoFoco = boton;
    contenido.innerHTML = '';
    var tipo = boton.getAttribute('data-tipo');
    var src = boton.getAttribute('data-src');
    if (tipo === 'video') {
      var v = document.createElement('video');
      v.src = src; v.controls = true; v.playsInline = true; v.preload = 'metadata';
      var poster = boton.querySelector('video');
      if (poster && poster.poster) v.poster = poster.poster;
      contenido.appendChild(v);
      videosGaleria.forEach(function (g) { g.pause(); });
      if (videoPortada) videoPortada.pause();
      var p = v.play(); if (p && p.catch) p.catch(function () {});
    } else {
      var img = document.createElement('img');
      img.src = src;
      var original = boton.querySelector('img');
      img.alt = original ? original.alt : '';
      contenido.appendChild(img);
    }
    titulo.textContent = boton.getAttribute('data-titulo') || '';
    visor.showModal();
  }

  function cerrarVisor() {
    if (!visor || !visor.open) return;
    visor.close();
  }

  if (visor) {
    visor.addEventListener('close', function () {
      var v = contenido.querySelector('video');
      if (v) { v.pause(); v.removeAttribute('src'); v.load(); }
      contenido.innerHTML = '';
      if (ultimoFoco) ultimoFoco.focus();
    });
    visor.querySelector('.visor-cerrar').addEventListener('click', cerrarVisor);
    visor.addEventListener('click', function (e) { if (e.target === visor) cerrarVisor(); });
  }

  document.querySelectorAll('.pieza-boton').forEach(function (b) {
    b.addEventListener('click', function () { abrirVisor(b); });
  });

  /* ---------- Imprimir / PDF ---------- */
  document.querySelectorAll('.js-imprimir').forEach(function (b) {
    b.addEventListener('click', function () { window.print(); });
  });
  window.addEventListener('beforeprint', function () {
    aparecen.forEach(function (el) { el.classList.add('visible'); });
  });
})();
