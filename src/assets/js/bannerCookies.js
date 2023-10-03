import $ from 'jquery';

function showBannerCookies() {
  const modal = document.querySelector('[data-modal-bannerCookies]');
  const body = document.querySelector('body');
  const closeModalBtn = document.querySelector('.acceptBtn');
  const backdrop = document.querySelector('.backdrop-bannerCookies');

  let isOpenedPopup = false;

  $(function () {
    setTimeout(() => {
      if (!isOpenedPopup) {
        modal.classList.remove('bannerCookies-is-hidden');

        isOpenedPopup = true;
      }

      function closeModal() {
        modal.classList.add('bannerCookies-is-hidden');
      }

      function handleClose(e) {
        if (e.target === e.currentTarget) {
          closeModal();
        }
        return;
      }

      closeModalBtn.addEventListener('click', closeModal);
    }, 1500);
  });
}

if (document.documentElement.lang !== 'uk') {
  showBannerCookies();
}
