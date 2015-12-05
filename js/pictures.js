'use strict';

(function() {
  // Контейнер для хранения фотографии
  var container = document.querySelector('.pictures');
  var pictures = window.pictures;

  // Цикл по всем картинкам
  pictures.forEach(function(picture) {
    var element = getElementFromTemplate(picture);
    container.appendChild(element);
  });

  function getElementFromTemplate(data) {
    var template = document.querySelector('#picture-template');
    var filters = document.querySelector('.filters');
    var element;

    // Скрываем фильтры
    filters.classList.add('hidden');

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

    // Функция загрузки
    backgroundImage.onload = function() {
      clearTimeout(imageLoadTimeout);
      element.style.backgroundImage = 'url(\'' + data.url + '\')';
      var oldImg = element.querySelector('img');
      var newImg = document.createElement('img');
      newImg.setAttribute('src', data.url);
      newImg.style.width = '182px';
      newImg.style.height = '182px';
      element.replaceChild(newImg, oldImg);
      filters.classList.remove('hidden');
    };


    // Если изображение не загрузилось (404 ошибка, ошибка сервера),
    // показываем сообщение, что у отеля нет фотографий.
    backgroundImage.onerror = function() {
      element.classList.add('picture-load-failure');
    };

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

    return element;
  }
})();
