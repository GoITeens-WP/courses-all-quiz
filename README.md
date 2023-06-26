# ПОСИЛАННЯ НА МАКЕТ

🔗 https://www.figma.com/file/.....

# 🥤 Starter kit for SoftRyzen

## 1) Запуск збірки

Встановлення залежностей проекту:

```
yarn
```

Щоб запустити проект в режимі розробки:

```
yarn start
```

Щоб створити білд для продакшену:

```
yarn build
```

## 2) Інформація про збірку

### В збірці використовується шаблонизатор Nunjucks

> https://mozilla.github.io/nunjucks/templating.html

- Сторінки проекту зберігаються у папці **«pages»**.

- Секційні фрагменти зберігаються у папці **«partials»**.

### В збірці використовується CSS framework Tailwind і SASS (SCSS)

> https://tailwindcss.com/docs/installation

### В збірці є автоматичне створення WEBP зображень: треба додати вихідне jpg або png зображення і збірка автоматично створить webp, з назвою картинки як і в вихідного зображення.

### В збірці є автоматичне створення SPRITE.SVG, треба закинути свою svg за шляхом "src\assets\images\sprite". Звернутися до спрайту: "./assets/images/sprite.svg#logo". Айдишником svg у спрайті буде назва самої svg у папці "sprite".
