javascript: function pingFetch(url = '/ping') {
  const t0 = performance.now();
  return fetch(`${url}?cache_bust=${Math.random()}`, {
    method: 'HEAD',
    cache: 'no-store'
  })
    .then(() => Math.round(performance.now() - t0))
    .catch(() => null);
}

function sendTroops() {
  const button = document.getElementById('troop_confirm_submit');
  if (button) {
    button.click();
  }
}

function prepareTroops() {
  if (window.__twObserverActive) {
    showToast('🛑 Bereits aktiv!', 'DarkRed');
    return;
  }

  const target = document.getElementById('bar');
  const input = document.getElementById('msgoal');
  const timeInput = document.getElementById('timegoal');
  if (!target || !input || !timeInput) {
    showToast('😖 Das geht hier nicht man!', 'DarkRed');
    return;
  }

  let greenFound = false;

  const arrivalTime = new Date(timeInput.value).getTime();
  const duration = $('#date_arrival span').data('duration') * 1000;
  const now = Timing.getCurrentServerTime();

  const update250msBefore = arrivalTime - duration - 500;
  const timeUntilUpdate250ms = update250msBefore - now;

  if (timeUntilUpdate250ms > 0) {
    showToast(
      `😋 Latenz-Update in ${Math.round(timeUntilUpdate250ms / 1000)} Sekunden`,
      'DarkOliveGreen'
    );
    setTimeout(() => {
      pingFetch().then((latency) => {
        const CORRECTION_MS = 5;
        const baseMsGoal = parseInt(input.value);
        if (latency > 80) {
          input.value = baseMsGoal + parseInt(Timing.latency.getAverageLatency()) - CORRECTION_MS;
        } else {
          input.value = baseMsGoal + latency - CORRECTION_MS;
        }
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        showToast(`📶 ${latency}||${input.value}`, 'DarkOliveGreen');
      });
    }, timeUntilUpdate250ms);
  } else {
    showToast('😓 Falsche Zeitangaben', 'red');
    return;
  }

  // 🕙 Toast: 10 Sekunden vorher
  const toast10sBefore = arrivalTime - duration - 10000;
  const timeUntil10s = toast10sBefore - now;
  if (timeUntil10s > 0) {
    setTimeout(() => {
      showToast('😎 Geht gleich los, zurücklehnen bitte!', 'DarkOliveGreen');
    }, timeUntil10s);
  }

  // 🕓 Toast: 4 Sekunden vorher
  const toast4sBefore = arrivalTime - duration - 4000;
  const timeUntil4s = toast4sBefore - now;
  if (timeUntil4s > 0) {
    setTimeout(() => {
      showToast('😁 Alles gut, ich schaff das!', 'DarkOliveGreen');
    }, timeUntil4s);
  }

  const observer = new MutationObserver(() => {
    const bg = target.style.background;

    if (bg === 'green') {
      greenFound = true;
    } else if (greenFound && bg !== 'green') {
      sendTroops();
      observer.disconnect();
      window.__twObserverActive = false;
    }
  });

  observer.observe(target, {
    attributes: true,
    attributeFilter: ['style']
  });
  window.__twObserverActive = true;
}

function showToast(message, color = '#222') {
  // Create container once
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    Object.assign(container.style, {
      position: 'fixed',
      bottom: '30px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      zIndex: 9999
    });
    document.body.appendChild(container);
  }

  // Create toast
  const toast = document.createElement('div');
  const [emoji, ...rest] = message.split(' ');
  toast.innerHTML = `<span style="font-size: 32px; padding-right: 8px;">${emoji}</span> ${rest.join(
    ' '
  )}`;

  Object.assign(toast.style, {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: color,
    color: '#fff',
    padding: '8px 16px',
    borderRadius: '6px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
    fontSize: '14px',
    fontWeight: 'bold',
    opacity: '0',
    textAlign: 'center',
    transition: 'opacity 0.3s ease'
  });

  container.appendChild(toast);

  // Fade in
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
  });

  // Remove after timeout
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      toast.remove();
      if (container.children.length === 0) container.remove();
    }, 300);
  }, 3000);
}

prepareTroops();
