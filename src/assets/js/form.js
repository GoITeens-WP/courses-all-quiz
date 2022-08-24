// Form.js - v1.0.0 - 2022-08-13 @Suzuya_re1

import $ from 'jquery';
import intlTelInput from 'intl-tel-input';
import JustValidate from 'just-validate';
import service from './service.js';
import crm from './submit.js';

$(window).on('load', async function () {
  // Params
  const params = {
    needsRedirectToLeeloo: window.leelooHash ? true : false,
    needsRedirectToTelegramBackend: window.telegramBackendUrl ? true : false,

    utmMarks: ['utm_source', 'utm_medium', 'utm_content', 'utm_term', 'utm_campaign'],
    referralMarks: ['SRC', 'from'],

    defaultLocale: 'uk',
    defaultPhoneCountry: 'ua',
    preferredPhoneCountries: ['ua'],
    excludePhoneCountries: ['ru', 'by'],

    forms: [
      {
        formId: 'leadForm',

        /*
        ! Required params if you need send email
        needSendEmail: false,
        onlySendEmail: false,
        emailTitle: 'title',
        emailRecipient: 'test@test.test',

        !Zoho CRM params, window vars by default
        productName: 'dummy_product',
        productId: 'dummy_product_id',
        */
      },
    ],
  };

  // ? Can We use html lang attribute?
  /* It's a check that the locale is set. If not, it sets the default locale. */
  if (!window.locale) {
    console.log('Locale is not set, setting default locale: ' + params.defaultLocale);
    window.locale = params.defaultLocale;
  }

  /* It's a check that you can use only one of the following methods: redirect to leeloo or redirect to
telegram backend. */
  if (params.needsRedirectToLeeloo && params.needsRedirectToTelegramBackend) {
    throw new Error(
      'You can use only one of the following methods: redirect to leeloo or redirect to telegram backend',
    );
  }

  /* It's a function that gets the country code from the user's IP address. */
  service
    .geoIpLookup(params.defaultPhoneCountry)
    .then(country_code => (window.itiInitialCountry = country_code));

  /* It's a function that saves the UTM marks to cookies. */
  service.saveParamsToCookies(params.utmMarks);

  /* It's a function that saves the referral marks to cookies. */
  params.telegramBackendUrl && service.saveParamsToCookies(params.referralMarks);

  /* It's a function that takes an array of forms and validates them. */
  Promise.all(params.forms.map(async form => await formHandler(form)));

  /**
   * It's a function that initializes the form
   * @param formParams - form params
   */
  async function formHandler(formParams) {
    const {
      formId,
      needSendEmail = false,
      onlySendEmail = false,
      emailTitle = 'New request',
      emailRecipient = 'info@goit.ua',
      productName = window.productName,
      productId = window.productId,
    } = formParams;

    // Refs
    const form = document.getElementById(formId);

    if (!form) {
      throw new Error(`Form with id ${formId} not found`);
    }

    const name = form.querySelector('[name="name"]');
    const phone = form.querySelector('[type="tel"]');
    const email = form.querySelector('[name="email"]');

    // Vars
    const iti = intlTelInput(
      phone,
      await service.getItiConfig(params.preferredPhoneCountries, params.excludePhoneCountries),
    );

    /* It's a function that initializes the validation library. */
    const validationForm = new JustValidate(
      form,
      service.validationOptions,
      service.getValidationLocale(),
    );

    validationForm.setCurrentLocale(window.locale);

    // apply rules to form fields
    service
      .setFormValidation(validationForm)
      .addField(`#${phone.id}`, [
        {
          validator: value => iti.isValidNumber(),
          errorMessage: 'Phone number is invalid!',
        },
      ])
      // submit form
      .onSuccess(event => {
        event.preventDefault();

        /* It's a function that removes extra spaces */
        name.value = name.value.trim();

        /* It's a function that gets the phone number from the input field. */
        const phoneNumber = iti.getNumber();

        // ToDo: rewrite this class
        const loading = new service.Loading(
          `data-${form.id.toLowerCase()}-loading`,
          'Wait a few seconds... almost got your request',
          '.form-wrapper',
        );
        loading.show();

        if (needSendEmail) {
          service
            .sendEmail({
              title: emailTitle,
              name: name.value,
              phone: phoneNumber,
              email: email.value,
              recipient: emailRecipient,
              // ToDo - add message, attach file, etc.
            })
            .then(res => {
              if (onlySendEmail) {
                // ? Should we write func for this?
                loading.hide();
                service.showSuccess();
              }
            })
            .catch(error => {
              console.log(error);
              service.showError();
            });
        }

        const crmParams = [name.value, phoneNumber, email.value, productName, productId];

        /* It's a function that generates data for the CRM. */
        const data = crm.generateData(...crmParams);
        /* It's a function that sends data to the CRM. */
        const response = crm.submit(...crmParams);

        /* It's a Google Tag Manager event. */
        dataLayer.push({ event: 'lead' });

        if (!onlySendEmail) {
          /* It's a function that redirects the user to the Leeloo CRM. */
          if (params.needsRedirectToLeeloo) {
            service.setParamsForLeeloo(data);

            response
              .then(resp => {
                if (resp.status === 200) {
                  if (!params.needsRedirectToLeeloo) {
                    service.showSuccess();
                  } else {
                    service.setUrlParameter('name2', name.value);
                    //Todo change selector
                    // ? Mb get selector from form parent element?
                    service.initializeLeeloo('.modal');
                    $(form).css('display', 'none');
                    // Todo: add after send func
                  }

                  loading.hide();
                  $(form).trigger('reset');
                } else {
                  console.log('error ', resp.statusText);
                  service.showError();
                }
              })
              .catch(err => {
                console.log(err);
                service.showError();
              });
          } else if (params.needsRedirectToTelegramBackend) {
            /* It's a function that redirects the user to the Telegram backend. */
            response.finally(() => {
              // Todo: add after send func
              service.redirectToTelegramBackend(data);
            });
          }
        }
      });
  }
});
