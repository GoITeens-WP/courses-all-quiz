import $ from 'jquery';
import Cookies from 'js-cookie';
import Inputmask from 'inputmask';
import intlTelInput from 'intl-tel-input';
import crm from '../../crm/submit.js';

// Params
const params = {
  phoneCountry: 'Europe',
  needsRedirectLeeloo: true,
  loadingMessage: 'Зачекайте декілька секунд… майже отримали Вашу заявку',
  successMessage: 'Отримали заявку',
  errorMessage: 'Помилка, щось пішло не так! Спробуйте пізніше.',
};

// Refs
const form = document.querySelector('#register_form');
const name = document.querySelector('#register_form_input_name');
const phone = document.querySelector('#register_form_input_tel');
const email = document.querySelector('#register_form_input_email');

// Validation vars
let nameValid = false;
let telValid = false;
let emailValid = false;
let iti = null;

// Get UTM marks
const source = getUrlParameter('utm_source');
const medium = getUrlParameter('utm_medium');
const term = getUrlParameter('utm_term');
const campaign = getUrlParameter('utm_campaign');
const content = getUrlParameter('utm_content');

// Set the cookies
if (source) {
  Cookies.set('utm_source', source);
}
if (medium) {
  Cookies.set('utm_medium', medium);
}
if (term) {
  Cookies.set('utm_term', term);
}
if (campaign) {
  Cookies.set('utm_campaign', campaign);
}
if (content) {
  Cookies.set('utm_content', content);
}

$(document).ready(function () {
  function getNumber() {
    if (params.phoneCountry.toLowerCase() === 'europe') {
      iti = intlTelInput(phone, {
        initialCountry: 'ua',
        hiddenInput: 'full_phone',
        preferredCountries: ['ua'],
        excludeCountries: ['ru'],
        utilsScript: './utils.js',
      });
      return iti.getNumber();
    } else {
      let im = new Inputmask('+389999999999');
      im.mask($('input[type="tel"]'));
      return phone.value;
    }
  }

  getNumber();

  $(form).submit(function (event) {
    event.preventDefault();
    const phoneNumber = getNumber();
    if (!validate()) {
      return;
    }

    const $form = $(this);
    const $progress = $('.progress');
    const $progressBar = $('.modal-progress-bar');

    $form.css('display', 'none');
    $progress.css('display', 'block');
    $progressBar.css('display', 'none');
    const modal = document.querySelector('.modal');
    const message = document.querySelector('.modal-message');
    const messageText = message.querySelector('.modal-text');

    messageText.textContent = params.loadingMessage;
    const modalHeight = modal.style.minHeight;
    modal.style.minHeight = 'initial';
    message.classList.toggle('modal-message--show');
    $('button[type="submit"]').attr('disabled', true);

    const showError = () => {
      messageText.textContent = params.errorMessage;
      $progress.css('display', 'none');
      setTimeout(() => {
        $form.css('display', 'block');
        $progressBar.css('display', 'flex');
        $('button[type="submit"]').removeAttr('disabled');
        modal.style.minHeight = modalHeight;
        message.classList.toggle('modal-message--show');
      }, 5000);
    };

    let data = crm.generateData(name.value, phoneNumber, email.value);
    let response = crm.submit(name.value, phoneNumber, email.value);
    dataLayer.push({ event: 'lead' });
    if (params.needsRedirectLeeloo) {
      redirectLeeLoo(data);
    }
    response
      .then(resp => {
        if (resp.ok) {
          afterSend($form);
        } else {
          console.log('error ', resp.statusText);
          showError();
        }
      })
      .catch(err => {
        console.log(err);
        showError();
      });
  });
});

function validate() {
  nameValid = validName(name);
  telValid = validPhone(phone);
  emailValid = validMail(email);

  return !!(nameValid && telValid && emailValid);
}
function afterSend(form) {
  const $progress = $('.progress');
  const $progressBar = $('.modal-progress-bar');
  const modal = document.querySelector('.modal');
  const message = document.querySelector('.modal-message');
  const messageText = message.querySelector('.modal-text');

  // Show next step
  $progressBar.find('.is-active').toggleClass('is-active');
  $progressBar.css('display', 'flex');

  if (params.needsRedirectLeeloo) {
    setUrlParameter('name2', name.value);

    const leeloo = document.querySelector('.leeloo');
    const wepster = `<div class="wepster-hash-${window.leelooHash}" data-leeloo></div>`;
    leeloo.insertAdjacentHTML('beforeend', wepster);

    $progressBar.children('.item')[1].classList.add('is-active');
    window.LEELOO = function () {
      window.LEELOO_INIT = { id: '5d0cb9cdaad9f4000e4b8e07' };
      var js = document.createElement('script');
      js.src = 'https://app.leeloo.ai/init.js';
      js.async = true;
      document.getElementsByTagName('head')[0].appendChild(js);
    };
    LEELOO();
    window.LEELOO_LEADGENTOOLS = (window.LEELOO_LEADGENTOOLS || []).concat(window.leelooHash);

    leeloo.classList.add('leeloo--active');
    message.classList.toggle('modal-message--show');
  } else {
    $progressBar.children('.item')[2].classList.add('is-active');
    messageText.textContent = params.successMessage;
    $progress.css('display', 'none');
  }

  modal.style.minHeight = 'initial';
}
function redirectLeeLoo(formData) {
  let fields = {
    utm_source: 'utm_source',
    utm_medium: 'utm_medium',
    umt_content: 'umt_content',
    utm_term: 'utm_term',
    phone: 'phone',
    email: 'email',
    name: 'first_name',
    google_id: 'ga',
  };

  let keys = Object.keys(formData);
  let url = new URL(window.location);

  for (let i = 0; i < keys.length; i++) {
    if (formData[keys[i]] !== undefined && formData[keys[i]] !== null) {
      if (fields.hasOwnProperty(keys[i])) {
        if (formData[keys[i]].length > 0) {
          url.searchParams.set(fields[keys[i]], formData[keys[i]]);
        }
      }
    }
  }

  window.history.pushState({}, document.title, url);
}
function getUrlParameter(sParam) {
  let sPageURL = decodeURIComponent(window.location.search.substring(1)),
    sURLVariables = sPageURL.split('&'),
    sParameterName,
    i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === 'undefined' ? true : sParameterName[1];
    }
  }
}
function setUrlParameter(key, value) {
  const url = new URL(window.location);
  url.searchParams.set(key, value);
  window.history.pushState({}, document.title, url);
}
function validName(nameInput) {
  const nameValue = nameInput.value;
  const re = /^.*[a-zA-Zа-яА-ЯёЁ ,.'`-]{2,}$/i;
  const valid = re.test(nameValue);
  !valid ? (nameInput.style.border = '2px solid red') : (nameInput.style.border = '2px solid #ccc');
  return valid;
}
function validPhone(phoneInput) {
  const phoneValue = removeExtraCharactersInPhoneNumber(phoneInput.value);
  let regex = /^((\+?3)?8)?((0\(\d{2}\)?)|(\(0\d{2}\))|(0\d{2}))\d{7}$/;

  switch (params.phoneCountry.toLowerCase()) {
    case 'europe':
      const isValid = iti.isValidNumber();
      !isValid
        ? (phoneInput.style.border = '2px solid red')
        : (phoneInput.style.border = '2px solid #ccc');
      return isValid;

    default:
      break;
  }

  const valid = regex.test(phoneValue);
  !valid
    ? (phoneInput.style.border = '2px solid red')
    : (phoneInput.style.border = '2px solid #ccc');
  return valid;
}
function validMail(emailInput) {
  const emailValue = emailInput.value;
  const re = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
  const valid = re.test(emailValue);
  !valid
    ? (emailInput.style.border = '2px solid red')
    : (emailInput.style.border = '2px solid #ccc');
  return valid;
}
function removeExtraCharactersInPhoneNumber(phoneNumber) {
  const validSymbolsArray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const arr = phoneNumber.split('');
  const newCleanArray = [];
  arr.forEach(el => {
    if (validSymbolsArray.includes(el)) {
      newCleanArray.push(el);
    }
  });
  return newCleanArray.join('');
}
