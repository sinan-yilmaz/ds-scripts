javascript: (() => {
  const I = 'ds-simple-modal',
    G = [
      'Adelshof',
      'Bauernhof',
      'Eisenmine',
      'Hauptgebäude',
      'Holzfällerlager',
      'Kaserne',
      'Lehmgrube',
      'Marktplatz',
      'Schmiede',
      'Speicher',
      'Stall',
      'Statue',
      'Versammlungsplatz',
      'Versteck',
      'Wachturm',
      'Wall',
      'Werkstatt'
    ];
  function c() {
    const e = document.getElementById(I);
    e && e.remove();
  }
  function t() {
    const e = /(\d{3})\|(\d{3})/.exec(document.title);
    return e ? { x: e[1], y: e[2] } : null;
  }
  function p(e) {
    if (!e) return null;
    const { x, y } = e;
    return /^\d{3}$/.test(x) && /^\d{3}$/.test(y) ? { BC: y.slice(1, 3), YZ: x.slice(1, 3) } : null;
  }
  function n() {
    c();
    const e = document.createElement('div');
    e.id = I;
    e.style.position = 'fixed';
    e.style.inset = '0';
    e.style.zIndex = '2147483647';
    e.style.display = 'flex';
    e.style.alignItems = 'center';
    e.style.justifyContent = 'center';
    e.style.background = 'rgba(0,0,0,.45)';
    const o = document.createElement('div');
    o.style.width = '200px';
    o.style.background = '#fff';
    o.style.borderRadius = '10px';
    o.style.boxShadow = '0 10px 30px rgba(0,0,0,.25)';
    o.style.padding = '12px';
    o.style.display = 'flex';
    o.style.flexDirection = 'column';
    o.style.gap = '10px';
    const l = document.createElement('label');
    l.style.fontSize = '12px';
    l.style.fontWeight = 'bold';
    l.style.color = '#444';
    l.textContent = 'Dorfgruppe*';
    const r = document.createElement('select');
    r.id = 'rename-group';
    r.style.width = '100%';
    r.style.padding = '6px';
    r.style.border = '1px solid #ddd';
    r.style.borderRadius = '8px';
    r.style.fontSize = '16px';
    G.forEach((a) => {
      const d = document.createElement('option');
      d.value = a;
      d.textContent = a;
      r.appendChild(d);
    });
    const s = document.createElement('label');
    s.style.fontSize = '12px';
    s.style.fontWeight = 'bold';
    s.style.color = '#444';
    s.textContent = 'Zusatz';
    const i = document.createElement('input');
    i.type = 'text';
    i.id = 'rename-extra';
    i.style.padding = '6px';
    i.style.border = '1px solid #ddd';
    i.style.borderRadius = '8px';
    i.style.fontSize = '14px';
    const m = document.createElement('button');
    m.type = 'button';
    m.textContent = 'Umbenennen';
    m.style.padding = '8px';
    m.style.background = '#4CAF50';
    m.style.color = '#fff';
    m.style.border = 'none';
    m.style.borderRadius = '6px';
    m.style.cursor = 'pointer';
    m.style.fontSize = '14px';
    o.addEventListener('click', (a) => a.stopPropagation());
    e.addEventListener('click', (a) => {
      a.target === e && (c(), document.removeEventListener('keydown', u));
    });
    function u(a) {
      a.key === 'Escape' && (c(), document.removeEventListener('keydown', u));
    }
    document.addEventListener('keydown', u);
    m.addEventListener('click', () => {
      const a = t();
      if (!a) {
        alert('Koordinate nicht im Titel gefunden.');
        return;
      }
      const d = p(a);
      if (!d) {
        alert('BC:YZ konnte nicht berechnet werden.');
        return;
      }
      const h = (r.value || '').trim(),
        y = (i.value || '').trim(),
        N = `${h} ${d.BC}:${d.YZ}${y ? ' | ' + y : ''}`,
        f =
          document.querySelector('form[action*="action=change_name"] input[name="name"]') ||
          document.querySelector('input[name="name"]');
      if (!f) {
        alert('Namensfeld nicht gefunden.');
        return;
      }
      f.value = N;
      f.dispatchEvent(new Event('input', { bubbles: true }));
      const v = f.closest('form');
      v ? v.submit() : alert('Formular nicht gefunden – Name wurde gesetzt.');
    });
    o.appendChild(l);
    o.appendChild(r);
    o.appendChild(s);
    o.appendChild(i);
    o.appendChild(m);
    e.appendChild(o);
    document.body.appendChild(e);
    r.focus();
  }
  n();
})();
