const BASE_URL = 'https://senior-project-website-add-optimizer.onrender.com';

async function initSession() {
  if (localStorage.getItem('session_id')) return;
  const res = await fetch(BASE_URL + '/visitor-sessions', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({user_agent: navigator.userAgent, referrer: document.referrer})
  });
  const data = await res.json();
  localStorage.setItem('session_id', data.id);
}

async function trackPageview() {
  await fetch(BASE_URL + '/events/track', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      session_id: parseInt(localStorage.getItem('session_id')),
      type: 'pageview',
      page: window.location.pathname
    })
  });
}

function trackClick(element) {
  const payload = JSON.stringify({
    session_id: parseInt(localStorage.getItem('session_id')),
    type: 'click',
    element: element,
    page: window.location.pathname
  });
  navigator.sendBeacon(
    BASE_URL + '/events/track',
    new Blob([payload], {type: 'application/json'})
  );
}

document.addEventListener('click', e => {
  const el = e.target.closest('[data-track]');
  if (el) trackClick(el.dataset.track);
});
