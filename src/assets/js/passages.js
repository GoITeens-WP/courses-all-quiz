const stepOneSection = document.querySelector('.step-1');
const stepTwoSection = document.querySelector('.step-2');
const stepOneBtn = document.querySelector('.step-1 .btn');

stepOneBtn.addEventListener('click', () => {
  stepOneSection.classList.add('left-[-100%]');
  stepTwoSection.classList.remove('right-[-100%]');
  stepTwoSection.classList.add('right-0');
  stepOneSection.classList.remove('min-h-[888px]', "md:h-[1344px]", "xl:h-[80vh]");
  stepOneSection.classList.add('min-h-[888px]', 'xl:h-[80vh]');

})