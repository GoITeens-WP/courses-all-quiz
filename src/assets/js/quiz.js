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
};

document.addEventListener('DOMContentLoaded', () => {
  let currentStep = 0;
  let answersString = '';
  const counts = {
    python: 0,
    design: 0,
    frontend: 0,
    game: 0
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

  refs.quizItems.forEach((item, index) => {
    const radios = item.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => {
      radio.addEventListener('change', () => {
        console.log(radio.parentElement.dataset.id);
        const category = radio.parentElement.dataset.id;
        refs.sectionStepOne.classList.add('min-h-[1140px]');
        refs.sectionStepOne.classList.remove('min-h-[888px]');

        if(category === 'Python') {
          counts.python++;
        } else if(category === 'Design') {
          counts.design++;
        } else if(category === 'Frontend') {
          counts.frontend++;
        } else if(category === 'Game') {
          counts.game++;
        }
        const arrayValues = Object.values(counts);
        const maxValue = Math.max(...arrayValues);

        if (maxValue === counts.python) {
          const benefits =  [
            "<b>На першому уроці</b> ваша дитина створить телеграм-бота",
            "<b>На курсі</b> вивчатиме основи Python, автоматизацію процесів, аналіз даних",
            "<b>Перспективи:</b> створення власних програм, аналіз даних, розробка штучного інтелекту"
          ]

          refs.sectionStepTwo.style.backgroundImage = 'url(./assets/images/quiz/python-bg.jpg)';
          refs.formTitle.innerHTML = 'Ідеальний напрям для вашої дитини — <br class="sm:hidden"> Python!';
          refs.formSubtitle.textContent = 'Записатися на безоплатний урок з Python';
          refs.formList.innerHTML = benefits.map(benefit => `<li class='item'><svg class='flex-shrink-0' width="24" height="24" aria-label="іконка відмітки"><use href="./assets/images/sprite.svg#done-icon"></use></svg> <p> ${benefit}</p></li>`).join('');

          console.log( ' choose python');
        } else if (maxValue === counts.design) {
          console.log('choose design');
        } else if (maxValue === counts.frontend) {
          console.log(' choose frontend');
        } else if (maxValue === counts.game) {
          console.log(' choose game');
        }


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
