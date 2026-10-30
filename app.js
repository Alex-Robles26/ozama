// OZAMA · Tienda Arco: galería, precio por cantidad y pedido por WhatsApp
(function () {
  var WA = '18298531932';
  var UNIT = 2500, PAIR = 4000;

  var fmt = function (n) { return 'RD$' + n.toLocaleString('en-US'); };
  var priceFor = function (q) { return Math.floor(q / 2) * PAIR + (q % 2) * UNIT; };

  // galería
  var main = document.getElementById('mainImg');
  var thumbs = document.querySelectorAll('.thumb');
  function show(src) {
    if (main.getAttribute('src') === src) return;
    main.style.opacity = 0;
    setTimeout(function () { main.src = src; main.style.opacity = 1; }, 150);
    thumbs.forEach(function (t) { t.classList.toggle('active', t.dataset.img === src); });
  }
  thumbs.forEach(function (t) { t.addEventListener('click', function () { show(t.dataset.img); }); });
  document.querySelectorAll('#swatches input').forEach(function (r) {
    r.addEventListener('change', function () { show(r.dataset.img); });
  });

  // cantidad y total
  var q = 1;
  var qEl = document.getElementById('qty'), totalEl = document.getElementById('total');
  var saveEl = document.getElementById('save'), hintEl = document.getElementById('comboHint');
  function update() {
    qEl.textContent = q;
    var t = priceFor(q), full = q * UNIT;
    totalEl.textContent = fmt(t);
    saveEl.textContent = full > t ? 'Ahorras ' + fmt(full - t) : '';
    hintEl.hidden = q % 2 === 0;
    hintEl.textContent = q === 1 ? 'Llévate 2 por RD$4,000 y ahorra RD$1,000.' : 'Agrega uno más y llévate el par por RD$4,000.';
  }
  document.getElementById('qMinus').addEventListener('click', function () { if (q > 1) { q--; update(); } });
  document.getElementById('qPlus').addEventListener('click', function () { if (q < 20) { q++; update(); } });
  update();

  // pedido por WhatsApp (los datos solo van al chat de WhatsApp que abre el cliente)
  var form = document.getElementById('orderForm'), err = document.getElementById('formError');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var need = ['nombre', 'telefono', 'provincia', 'direccion'], ok = true;
    need.forEach(function (n) {
      var el = form.elements[n], bad = !el.value.trim();
      el.classList.toggle('bad', bad); if (bad) ok = false;
    });
    err.hidden = ok;
    if (!ok) { form.querySelector('.bad').focus(); return; }
    var color = form.querySelector('input[name=color]:checked').value;
    var lines = [
      'Hola OZAMA, quiero hacer un pedido:',
      '',
      '• Producto: Audífonos Arco',
      '• Color: ' + color,
      '• Cantidad: ' + q,
      '• Total a pagar al recibir: ' + fmt(priceFor(q)),
      '',
      'Nombre: ' + form.elements.nombre.value.trim(),
      'Teléfono: ' + form.elements.telefono.value.trim(),
      'Provincia: ' + form.elements.provincia.value,
      'Dirección: ' + form.elements.direccion.value.trim()
    ];
    var nota = form.elements.nota.value.trim();
    if (nota) lines.push('Nota: ' + nota);
    window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
  });
  form.querySelectorAll('input, select').forEach(function (el) {
    el.addEventListener('input', function () { el.classList.remove('bad'); });
  });

  // animaciones al hacer scroll
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.12 }) : null;
  document.querySelectorAll('.reveal').forEach(function (el) { io ? io.observe(el) : el.classList.add('in'); });

  // barra de compra en el celular: visible después del hero y oculta en la sección de compra
  var bar = document.getElementById('buybar'), hero = document.querySelector('.hero'), buy = document.getElementById('comprar');
  function onScroll() {
    var y = window.scrollY, h = hero.offsetTop + hero.offsetHeight;
    var r = buy.getBoundingClientRect(), inBuy = r.top < window.innerHeight * 0.6 && r.bottom > 120;
    bar.classList.toggle('show', y > h - 80 && !inBuy);
    waBtn.classList.toggle('away', inBuy);
  }
  var waBtn = document.querySelector('.wa-float');
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  document.getElementById('year').textContent = new Date().getFullYear();
})();
