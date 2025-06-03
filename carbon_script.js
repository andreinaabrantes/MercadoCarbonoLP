// script.js

// Smooth scroll for any anchor linking to "#form"
document.addEventListener('DOMContentLoaded', function () {
  const ctaLinks = document.querySelectorAll('a[href="#form"]');
  ctaLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.getElementById('form');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target.focus({ preventScroll: true });
      }
    });
  });

  // Countdown Timer (7 days from page load)
  const countdownElement = document.getElementById('countdown');
  const targetTime = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

  function updateCountdown() {
    const now = Date.now();
    const diff = targetTime - now;

    if (diff <= 0) {
      countdownElement.textContent = '00d 00h 00m 00s';
      clearInterval(timerInterval);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    countdownElement.textContent =
      String(days).padStart(2, '0') + 'd ' +
      String(hours).padStart(2, '0') + 'h ' +
      String(minutes).padStart(2, '0') + 'm ' +
      String(seconds).padStart(2, '0') + 's';
  }

  updateCountdown();
  const timerInterval = setInterval(updateCountdown, 1000);

  // dataLayer.push on form submission
  const form = document.getElementById('form');
  if (form) {
    form.addEventListener('submit', function () {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'form_submit' });
    });
  }
});
