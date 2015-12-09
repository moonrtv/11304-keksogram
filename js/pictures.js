'use strict';

(function() {
  var IMG_SIZE = '182px';
  // Контейнер для хранения фотографии
  var container = document.querySelector('.pictures');
  var template = document.querySelector('#picture-template');
  var filters = document.querySelector('.filters');
  var fragment = document.createDocumentFragment();
  var picturesMas = [];
  var filteredPictures = [];
  var activeFilter = 'filter-popular';

  // Скрываем фильтры
  filters.classList.add('hidden');

  filters.addEventListener('click', function(evt) {
    var clickedElement = evt.target;
    if (clickedElement.classList.contains('filters-item')) {
      setActiveFilter(clickedElement.previousElementSibling.id);
    }
  });

  getPictures();

  function renderPictures(picturesToRender, replace) {
    if (replace) {
      container.innerHTML = '';
    }

    // Цикл по всем картинкам
    picturesToRender.forEach(function(picture) {
      var element = getElementFromTemplate(picture);
      fragment.appendChild(element);
    });
    container.appendChild(fragment);
  }

  // Показываем фильтры
  filters.classList.remove('hidden');

  /**
   * Установка фильтра
   */
  function setActiveFilter(selectedFilter, force) {
    // Предотвращение повторной установки одного и того же фильтра.
    if (activeFilter === selectedFilter && !force) {
      return;
    }

    document.querySelector('#' + selectedFilter).checked = true;

    // Отсортировать и отфильтровать фотографии по выбранному параметру и вывести на страницу
    filteredPictures = picturesMas.slice(0); // Копирование массива

    switch (selectedFilter) {
      case 'filter-new':
        // Не реализовал выборку в 3 месяца
        // по убыванию цены.
        filteredPictures = filteredPictures.sort(function(a, b) {
          var dateB = new Date(b.date).getTime();
          var dateA = new Date(a.date).getTime();
          return dateB - dateA;
        });
        break;

      case 'filter-discussed':
        // Фильтр самые обсуждаемые
        // по убыванию
        var threeMonth = new Date() - 90 * 24 * 60 * 60 * 1000;

        filteredPictures = filteredPictures.sort(function(a, b) {
          return b.comments - a.comments;
        }).filter(function(picture) {
          var datePicture = Date.parse(picture.date);
          return datePicture >= threeMonth;
        });
        break;
    }

    renderPictures(filteredPictures, true);
    activeFilter = selectedFilter;
  }

  /**
   * Загрузка фотографий
   */
  function getPictures() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'data/pictures.json');
    xhr.timeout = 10000;
    xhr.onload = function(evt) {
      container.classList.remove('pictures-loading');
      var rawData = evt.target.response;
      var loadedPictures = JSON.parse(rawData);
      updateLoadedPictures(loadedPictures);
    }

    // Вызываем при ошибке
    xhr.onerror = function() {
      addClassFailure();
    };

    // Нет ответа в течение времени
    xhr.ontimeout = function() {
      addClassFailure();
    };
    container.classList.add('pictures-loading');
    xhr.send();
  }

  function addClassFailure() {
    container.classList.add('pictures-failure');
  }

  /**
   * Обновление фотографий
   */
  function updateLoadedPictures(loadedPictures) {
    picturesMas = loadedPictures;

    // Выбор фильтрации
    setActiveFilter(activeFilter, true);
  }

  /**
   * Создаём шаблон для фотографии
   */
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
      element.classList.add('picture-failure'); // Показываем ошибку
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
