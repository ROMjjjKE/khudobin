
(function () {
  'use strict';
  var WA = 'https://wa.me/375447970638';
  var COMPLAINTS = {
    pull: ['Не тянет, провалы при разгоне', ['Диагностика двигателя', 'Компьютерная диагностика'],
      'Смотрим топливную смесь, наддув, датчики и живые параметры под нагрузкой. Часто причина в одном датчике или подсосе.'],
    check: ['Горит «чек» или ошибка на панели', ['Компьютерная диагностика', 'Диагностика двигателя'],
      'Считываем коды по всем блокам, отделяем текущую ошибку от старой и проверяем, что реально происходит с системой.'],
    knock: ['Стук или скрип в подвеске', ['Диагностика подвески', 'Технический осмотр'],
      'На подъёмнике проверяем люфты и состояние элементов, на ходу — как ведёт себя машина на неровностях.'],
    brakes: ['Вибрация или скрип при торможении', ['Диагностика тормозной системы'],
      'Диски, колодки, суппорты, направляющие и датчики ABS. У вибрации почти всегда есть конкретная причина.'],
    gear: ['Толчки, рывки в коробке', ['Диагностика КПП', 'Компьютерная диагностика'],
      'Ошибки блока КПП, состояние масла, давление и адаптации. Сначала проверяем, нужен ли ремонт вообще.'],
    diesel: ['Дизель дымит, троит, плохо заводится', ['Диагностика дизельного двигателя', 'Компьютерная диагностика'],
      'Давление в рампе, форсунки, наддув, EGR и сажевый фильтр — по параметрам видно, что именно сбоит.'],
    electro: ['Глючит электрика: свет, панель, стеклоподъёмники', ['Диагностика электрики', 'Компьютерная диагностика'],
      'Проверяем питание, массу, утечки тока и цепи. Ищем обрыв или окисление, а не меняем блоки наугад.'],
    buy: ['Покупаю машину, нужна проверка', ['Диагностика перед покупкой', 'Компьютерная диагностика'],
      'Полный осмотр до сделки: ошибки, следы ремонта, состояние агрегатов и список предстоящих работ.'],
    trip: ['Собираюсь в дальнюю поездку', ['Диагностика перед поездкой', 'Технический осмотр'],
      'Жидкости, тормоза, шины, свет и электрика. Всё, что чаще всего подводит в дороге.'],
    unknown: ['Не понимаю, что с машиной', ['Технический осмотр', 'Компьютерная диагностика'],
      'Начинаем с общего осмотра и сканера: так находится отправная точка, даже если жалоба звучит размыто.']
  };

  function initDrawer() {
    var d = document.getElementById('drawer');
    var b = document.querySelector('.header .burger');
    if (!d || !b) return;
    var last = null;
    function open() {
      last = document.activeElement;
      d.hidden = false; d.setAttribute('data-open', '');
      b.setAttribute('aria-expanded', 'true');
      document.body.classList.add('is-locked');
      var f = d.querySelector('a, button'); if (f) f.focus({ preventScroll: true });
    }
    function close() {
      d.hidden = true; d.removeAttribute('data-open');
      b.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('is-locked');
      if (last) last.focus({ preventScroll: true });
    }
    b.addEventListener('click', function () { d.hidden ? open() : close(); });
    d.addEventListener('click', function (e) {
      if (e.target.closest('[data-close]') || e.target.closest('a') || !e.target.closest('.drawer__in')) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !d.hidden) close();
      if (e.key === 'Tab' && !d.hidden) {
        var it = d.querySelectorAll('a, button, input');
        if (!it.length) return;
        var f = it[0], l = it[it.length - 1];
        if (e.shiftKey && document.activeElement === f) { e.preventDefault(); l.focus(); }
        else if (!e.shiftKey && document.activeElement === l) { e.preventDefault(); f.focus(); }
      }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 1024 && !d.hidden) close(); });
  }

  function initPick() {
    var box = document.getElementById('plist');
    if (!box) return;
    var out = {
      k: document.getElementById('pK'), t: document.getElementById('pT'), tx: document.getElementById('pText'),
      chips: document.getElementById('pChips'), send: document.getElementById('pSend')
    };
    function show(key) {
      var c = COMPLAINTS[key];
      out.k.textContent = 'ЖАЛОБА · ' + c[0].toUpperCase();
      out.t.textContent = c[0];
      out.tx.textContent = c[2];
      out.chips.innerHTML = c[1].map(function (x) { return '<span>' + x + '</span>'; }).join('');
      out.send.href = WA + '?text=' + encodeURIComponent('Диагностика с сайта (Кузнечная 2).\nЖалоба: ' + c[0] +
        '\nПроверки: ' + c[1].join(', ') + '\n\nАвто (марка, модель, год): ');
      [].forEach.call(box.children, function (b) { b.classList.toggle('is-on', b.getAttribute('data-k') === key); });
    }
    box.addEventListener('click', function (e) {
      var b = e.target.closest('.pbtn'); if (!b) return;
      show(b.getAttribute('data-k'));
    });
    show('pull');
  }

  function initBuilder() {
    var host = document.getElementById('clist');
    if (!host) return;
    var num = document.getElementById('bNum'), sel = document.getElementById('bSel'),
      empty = document.getElementById('bEmpty'), send = document.getElementById('bSend');
    function draw() {
      var picked = [].slice.call(host.querySelectorAll('input:checked')).map(function (i) { return i.getAttribute('data-v'); });
      num.textContent = picked.length;
      sel.innerHTML = picked.map(function (p) { return '<li>' + p + '</li>'; }).join('');
      empty.hidden = picked.length > 0;
      var msg = 'Заявка на диагностику с сайта (Кузнечная 2).\nНужно проверить: ' + (picked.length ? picked.join(', ') : '(не выбрано)') +
        '\n\nАвто (марка, модель, год): \nЧто беспокоит: ';
      send.href = WA + '?text=' + encodeURIComponent(msg);
      send.style.opacity = picked.length ? '1' : '.55';
    }
    host.addEventListener('change', draw);
    draw();
  }

  function initLead() {
    var f = document.getElementById('lead');
    if (!f) return;
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var n = document.getElementById('lName'), t = document.getElementById('lTel'),
        c = document.getElementById('lCar'), k = document.getElementById('lTask');
      var bad = false;
      [n, t].forEach(function (el) {
        if (!el.value.trim()) { el.style.borderColor = '#B3311F'; bad = true; } else { el.style.borderColor = ''; }
      });
      if (bad) return;
      var msg = 'Заявка с сайта (Кузнечная 2).\nИмя: ' + n.value.trim() + '\nТелефон: ' + t.value.trim() +
        (c.value.trim() ? '\nАвто: ' + c.value.trim() : '') + (k.value.trim() ? '\nЖалоба: ' + k.value.trim() : '');
      window.open(WA + '?text=' + encodeURIComponent(msg), '_blank');
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initDrawer(); initPick(); initBuilder(); initLead();
    var y = document.getElementById('yr'); if (y) y.textContent = new Date().getFullYear();
  });
})();
