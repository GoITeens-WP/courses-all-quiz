import $ from 'jquery';

if (document.documentElement.lang !== 'uk') {
  showCookieBanner();
}

function showCookieBanner() {
  const modal = document.querySelector('[data-modal-cookieBanner]');
  const closeModalBtn = document.querySelector('.cookieAcceptBtn');

  let isCookieBannerOpen = false;

  $(function () {
    setTimeout(() => {
      if (!isCookieBannerOpen) {
        modal.classList.remove('cookieBanner-is-hidden');

        isCookieBannerOpen = true;
      }

      function closeModal() {
        modal.classList.add('cookieBanner-is-hidden');
      }

      closeModalBtn.addEventListener('click', closeModal);
    }, 1500);
  });
}
