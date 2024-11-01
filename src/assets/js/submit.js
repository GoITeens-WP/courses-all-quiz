import Cookies from 'js-cookie';
import service from './service.js';

function generateData(crmParams) {
  const { origin, pathname } = window.location;
  const action_source = `${origin}${pathname}`;

  let data = {
    name: crmParams.userName,
    phone: crmParams.userPhone,
    email: crmParams.userEmail,
    promocode: crmParams.userPromocode,
    psWhoIs1: crmParams.userType,
    product_name: crmParams.productName,
    product_id: crmParams.productId,
    SiteURL: action_source,
    website: 'website',
    Projects: 'GoIT',
    Potential_Category: 'Course',
    Course: crmParams.productId,
    leadFBC: getUrlParamsOrCookie('_fbc'),
    leadFBP: getUrlParamsOrCookie('_fbp'),
    leadActionSource: action_source,
    leadFormat: window.leadFormat || 'marathon',
    leadIP: window.ipData.ip || '',
    leadUserAgent: window.navigator.userAgent,
    google_id: readCookie('_ga'),
  };
  return ensureUtmData(data);
}

async function submit(crmParams) {
  let data = generateData(crmParams);
  const response = await send(data);

  return response;
}

async function send(data) {
  const response = await fetch('./crm/lead.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

function ensureUtmData(data) {
  data.utm_source = getUrlParamsOrCookie('utm_source');
  data.utm_medium = getUrlParamsOrCookie('utm_medium');
  data.utm_term = getUrlParamsOrCookie('utm_term');
  data.utm_campaign = getUrlParamsOrCookie('utm_campaign');
  data.utm_content = getUrlParamsOrCookie('utm_content');
  data.campaignId = getUrlParamsOrCookie('campaignId');
  data.adsetId = getUrlParamsOrCookie('adsetId');
  data.adId = getUrlParamsOrCookie('adId');

  return data;
}

function getUrlParamsOrCookie(name) {
  const value = service.getUrlParameter(name) || Cookies.get(name);
  return value !== undefined ? value : null;
}

function readCookie(name) {
  let nameEQ = name + '=';
  let ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      let cidLong = c.substring(nameEQ.length, c.length);
      let tmp = cidLong.split('.');
      return tmp[2] + '.' + tmp[3];
    }
  }
  return null;
}

export default {
  generateData,
  submit,
};
