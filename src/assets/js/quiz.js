const quizWrapper = document.querySelector('.wrapper-quiz-form');

export const refs = {
  quizWrapper: quizWrapper?.querySelector('.quiz-wrapper'),
  sectionStepTwo: document.querySelector('.step-2'),
  sectionStepThree: document.querySelector('.step-3'),
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
      refs.sectionStepTwo.classList.add('translate-x-[-100%]');
      refs.sectionStepTwo.classList.remove('translate-x-[0%]');

      refs.sectionStepThree.classList.remove('translate-x-[100%]');
      refs.sectionStepThree.classList.add('translate-x-[0%]');

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
        if(category === 'Python') {
          counts.python++;
        } else if(category === 'Design') {
          counts.design++;
        } else if(category === 'Frontend') {
          counts.frontend++;
        } else if(category === 'Game') {
          counts.game++;
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
