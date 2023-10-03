import $ from 'jquery';

if (document.documentElement.lang !== 'uk') {
  showCookieBanner();
}

function showCookieBanner() {
  const cookieBanner = document.querySelector('[data-cookieBanner]');
  const acceptCookieBtn = document.querySelector('[data-acceptCookieBtn]');

  let isCookieBannerOpen = false;

  $(function () {
    setTimeout(() => {
      if (!isCookieBannerOpen) {
        cookieBanner.classList.remove('cookieBanner-is-hidden');

        isCookieBannerOpen = true;
      }

      function closeCookieBanner() {
        cookieBanner.classList.add('cookieBanner-is-hidden');
      }

      acceptCookieBtn.addEventListener('click', closeCookieBanner);
    }, 1500);
  });
}
