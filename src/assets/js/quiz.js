const quizWrapper = document.querySelector('.wrapper-quiz-form');

export const refs = {
  quizWrapper: quizWrapper?.querySelector('.quiz-wrapper'),
  sectionStepOne: document.querySelector('.step-1'),
  sectionStepTwo: document.querySelector('.step-2'),
  sectionStepThree: document.querySelector('.step-3'),
  formTitle: document.querySelector('.step-3 .title'),
  formList: document.querySelector('.step-3 .list'),
  formSubtitle: document.querySelector('.step-3 .subtitle'),
  formWrapper: quizWrapper?.querySelector('.form-wrapper'),
  afterSendWrapper: quizWrapper?.querySelector('.after-send-wrapper'),
  quizItems: quizWrapper?.querySelectorAll('.quiz-item'),
  progressItems: quizWrapper?.querySelectorAll('.quiz-progress-bar .progress-item'),
  quizQuestion: quizWrapper?.querySelectorAll('.quiz-question'),
  countQuestionSpan: quizWrapper?.querySelector('.count-question-span'),
  form: document.querySelector('#coursesAll'),
};

const categoryConfig = {
  Python: {
    countsKey: 'Python',
    benefits: [
      "<b>На першому уроці</b> ваша дитина створить телеграм-бота",
      "<b>На курсі</b> вивчатиме основи Python, автоматизацію процесів, аналіз даних",
      "<b>Перспективи:</b> створення власних програм, аналіз даних, розробка штучного інтелекту"
    ],
    backgrounds: {
      small: './assets/images/sections/quiz/python-bg.webp',
      medium: './assets/images/sections/quiz/python-bg-tab.webp',
      large: './assets/images/sections/quiz/python-bg-lap.webp',
      extraLarge: './assets/images/sections/quiz/python-bg-desk.webp'
    },
    title: 'Ідеальний напрям для вашої дитини — <br class="sm:hidden"> Python!',
    subtitle: 'Записатися на безоплатний урок з Python'
  },
  Design: {
    countsKey: 'Design',
    benefits: [
      "<b>На першому уроці</b> ваша дитина створить листівку, банер або GIF-анімацію",
      "<b>На курсі</b> вивчатиме роботу у Figma, основи цифрового дизайну та брендингу",
      "<b>Перспективи:</b> професії графічного дизайнера, ілюстратора, UX/UI-спеціаліста"
    ],
    backgrounds: {
      small: './assets/images/sections/quiz/design-bg.webp',
      medium: './assets/images/sections/quiz/design-bg-tab.webp',
      large: './assets/images/sections/quiz/design-bg-lap.webp',
      extraLarge: './assets/images/sections/quiz/design-bg-desk.webp'
    },
    title: 'Ідеальний напрям для вашої дитини — <br class="sm:hidden"> Design!',
    subtitle: 'Записатися на безоплатний урок з Design'
  },
  Frontend: {
    countsKey: 'Frontend',
    benefits: [
      "<b>На першому уроці</b> ваша дитина створить власний простий сайт",
      "<b>На курсі</b> і вивчатиме HTML, CSS, JavaScript та основи сучасних фреймворків",
      "<b>Перспективи:</b> кар'єра веброзробника, full-stack інженера, frontend-розробника"
    ],
    backgrounds: {
      small: './assets/images/sections/quiz/frontend-bg.webp',
      medium: './assets/images/sections/quiz/frontend-bg-tab.webp',
      large: './assets/images/sections/quiz/frontend-bg-lap.webp',
      extraLarge: './assets/images/sections/quiz/frontend-bg-desk.webp'
    },
    title: 'Ідеальний напрям для вашої дитини — <br class="sm:hidden"> Frontend!',
    subtitle: 'Записатися на безоплатний урок з Frontend'
  },
  GameDev: {
    countsKey: 'GameDev',
    benefits: [
      "<b>На першому уроці</b> ваша дитина створить математичну гру-угадайку",
      "<b>На курсі</b> вивчатиме Unity, C#, 2D та 3D дизайн ігор",
      "<b>Перспективи:</b> кар'єра розробника ігор, ігрового дизайнера, власника ігрової студії"
    ],
    backgrounds: {
      small: './assets/images/sections/quiz/game-dev-bg.webp',
      medium: './assets/images/sections/quiz/game-dev-bg-tab.webp',
      large: './assets/images/sections/quiz/game-dev-bg-lap.webp',
      extraLarge: './assets/images/sections/quiz/game-dev-bg-desk.webp'
    },
    title: 'Ідеальний напрям для вашої дитини — <br class="sm:hidden"> GameDev!',
    subtitle: 'Записатися на безоплатний урок з GameDev'
  }
};


document.addEventListener('DOMContentLoaded', () => {
  let currentStep = 0;
  let answersString = '';
  const counts = {
    Python: 0,
    Design: 0,
    Frontend: 0,
    GameDev: 0
  };
  const updateQuizStep = () => {
    refs?.quizItems?.forEach((item, index) => {
      if (index === currentStep) {
        setTimeout(() => {
          item.classList.add('active');
        }, 300);
      } else {
        setTimeout(() => {
          item.classList.remove('active');
        }, 300);
      }
    });

    refs?.progressItems?.forEach((item, index) => {
      if (index === currentStep) {
        setTimeout(() => {
          item.classList.add('active');
        }, 300);
      } else {
        item.classList.remove('active');
      }
    });

    refs.countQuestionSpan.textContent = currentStep + 1;

    if (currentStep >= refs.quizItems.length) {
      refs.sectionStepTwo.classList.add('left-[-100%]');
      // refs.sectionStepTwo.classList.remove('right-0');

      refs.sectionStepThree.classList.remove('right-[-100%]');
      refs.sectionStepThree.classList.add('right-0');

    }
  };


  const collectAnswers = () => {
    answersString = ''; // Reset the string
    refs.quizItems.forEach((item, index) => {
      const selectedRadio = item.querySelector('input[type="radio"]:checked');
      if (selectedRadio) {
        const questionText = refs.quizQuestion[index]?.textContent.trim();
        answersString += `${questionText}: ${selectedRadio.value}; `;
      }
    });
    console.log(answersString);
    window.quizAnswers = answersString;
  };

  const updateBackground = (imageSet) => {
    if (window.innerWidth < 768) {
      return imageSet.small;
    } else if (window.innerWidth < 1280) {
      return imageSet.medium;
    } else if (window.innerWidth < 1600) {
      return imageSet.large;
    } else {
      return imageSet.extraLarge;
    }
  }

  const updateUI = (categoryKey, refs) => {
    const config = categoryConfig[categoryKey];
    refs.sectionStepThree.style.backgroundImage = `url(${updateBackground(config.backgrounds)})`;
    refs.formTitle.innerHTML = config.title;
    refs.formSubtitle.textContent = config.subtitle;
    console.log(refs.form);
    refs.form.dataset.id = categoryKey;
    refs.formList.innerHTML = config.benefits
      .map(benefit => `<li class='item'><svg class='flex-shrink-0' width="24" height="24" aria-label="іконка відмітки"><use href="./assets/images/sprite.svg#done-icon"></use></svg> <p>${benefit}</p></li>`)
      .join('');
  }


  refs.quizItems.forEach((item, index) => {
    const radios = item.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => {
      radio.addEventListener('change', () => {
        console.log(radio.parentElement.dataset.id);
        const category = radio.parentElement.dataset.id;

        if(currentStep === 2) {
          refs.sectionStepOne.classList.add('min-h-[1140px]', "md:min-h-[960px]", "xl:min-h-[80vh]");
          refs.sectionStepOne.classList.remove('min-h-[888px]', "md:h-[1344px]", "xl:h-[80vh]");
        }

        counts[categoryConfig[category].countsKey]++;
        const maxCategory = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
        updateUI(maxCategory, refs);

        console.log(maxCategory);

        window.addEventListener('resize', () => {
          refs.sectionStepThree.style.backgroundImage = `url(${updateBackground(categoryConfig[maxCategory].backgrounds)})`;
        });


        console.log(counts);
        collectAnswers();
        if (index < refs.quizItems.length - 1) {
          currentStep++;
          updateQuizStep();
        } else {
          currentStep++;
          updateQuizStep();
        }
      });
    });
  });

  updateQuizStep();

  // Export the answers string
  window.quizAnswers = answersString;

  refs.quizItems.forEach((item, index) => {
    item.addEventListener('click', (e) => {
      if (e.target.classList.contains('back-btn')) {
        currentStep--;
        updateQuizStep();
      }
    })
  })
});
