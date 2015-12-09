'use strict';

(function() {
  var IMG_SIZE = '182px';
  // Контейнер для хранения фотографии
  var container = document.querySelector('.pictures');
  var template = document.querySelector('#picture-template');
  var filters = document.querySelector('.filters');
  var pictures = window.pictures;

  // Скрываем фильтры
  filters.classList.add('hidden');

  // Цикл по всем картинкам
  pictures.forEach(function(picture) {
    var element = getElementFromTemplate(picture);
    container.appendChild(element);
  });

  // Показываем фильтры
  filters.classList.remove('hidden');

  function getElementFromTemplate(data) {
    var element;

    // Проверка на IE
    if ('content' in template) {
      element = template.content.children[0].cloneNode(true);
    } else {
      element = template.children[0].cloneNode(true);
    }

    // Заполняем данными
    element.querySelector('.picture-comments').textContent = data.comments;
    element.querySelector('.picture-likes').textContent = data.likes;

    var backgroundImage = new Image();

    // Время ожидания загрузки фотографии
    var IMAGE_TIMEOUT = 5000;

    // Установка таймаута на загрузку изображения. Таймер ожидает 5 секунд
    // после которых он уберет src у изображения и добавит класс picture-load-failure,
    // который показывает, что фотография не прогрузилась.
    var imageLoadTimeout = setTimeout(function() {
      backgroundImage.src = ''; // Прекращаем загрузку
      element.classList.add('picture-load-failure'); // Показываем ошибку
    }, IMAGE_TIMEOUT);

    // Изменение src у изображения начинает загрузку.
    backgroundImage.src = data.url;
    backgroundImage.style.width = IMG_SIZE;
    backgroundImage.style.height = IMG_SIZE;
    var currentImg = element.querySelector('img');

    // Функция загрузки
    backgroundImage.onload = function() {
      clearTimeout(imageLoadTimeout);
      element.replaceChild(backgroundImage, currentImg);
    };

    // Если изображение не загрузилось (404 ошибка, ошибка сервера)
    backgroundImage.onerror = function() {
      element.classList.add('picture-load-failure');
    };

    return element;
  }
})();
