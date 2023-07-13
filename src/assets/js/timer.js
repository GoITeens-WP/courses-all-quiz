/**
 * Start Date Timer from DATE in params
 */

document.addEventListener('DOMContentLoaded', () => {
  timerHandler();
});

function timerHandler() {
  const ref = {
    daysVal: document.querySelectorAll('[data-day]'),
    hoursVal: document.querySelectorAll('[data-hours]'),
    minutesVal: document.querySelectorAll('[data-min]'),
    secondsVal: document.querySelectorAll('[data-sec]'),
    dateVal: document.querySelector('[data-timer]').dataset.timer,
  };

  const startDate = Date.parse(String(`${ref.dateVal}`));

  const timeCount = () => {
    let nowDate = new Date();
    let leftUntil = startDate - nowDate;

    let days = Math.floor(leftUntil / 1000 / 60 / 60 / 24);
    let hours = Math.floor(leftUntil / 1000 / 60 / 60) % 24;
    let minutes = Math.floor(leftUntil / 1000 / 60) % 60;
    let seconds = Math.floor(leftUntil / 1000) % 60;

    ref.daysVal.forEach(item => (item.textContent = addZero(days)));
    ref.hoursVal.forEach(item => (item.textContent = addZero(hours)));
    ref.minutesVal.forEach(item => (item.textContent = addZero(minutes)));
    ref.secondsVal.forEach(item => (item.textContent = addZero(seconds)));

    if (leftUntil <= 0) {
      ref.daysVal.forEach(item => (item.textContent = '00'));
      ref.hoursVal.forEach(item => (item.textContent = '00'));
      ref.minutesVal.forEach(item => (item.textContent = '00'));
      ref.secondsVal.forEach(item => (item.textContent = '00'));

      timeInterval && clearInterval(timeInterval);
    }
  };

  const addZero = num => {
    if (num <= 9) {
      return '0' + num;
    } else {
      return num;
    }
  };

  let timeInterval = setInterval(timeCount, 10);
  timeCount();
}
