'use strict';

(function() {
  /**
   * Размер картинки
   * @const {string}
   */
  var IMG_SIZE = '182px';

  /**
   * Количество элементов на странице
   * @const {number}
   */
  var PAGE_SIZE = 12;

  /**
   * Таймер для регулирования частоты вызова
   * скролла
   * @const {number}
   */
  var SCROLL_TIMER = 100;

  /**
   * Контейнер для хранения фотографии
   * @type {Element}
   */
  var container = document.querySelector('.pictures');

  /**
   * Храним ссылку на структуру шаблона
   * @type {Element}
   */
  var template = document.querySelector('#picture-template');

  /**
   * Ссылка на родителя всех фильтров
   * @type {Element}
   */
  var filters = document.querySelector('.filters');

  /**
   * Используем для ускорения прогрузки страницы
   * @type {DocumentFragment}
   */
  var fragment = document.createDocumentFragment();

  /**
   * Массив всех фотографий
   * @type {Array}
   */
  var picturesMas = [];

  /**
   * Отфильтрованный массив фотографий
   * @type {Array}
   */
  var filteredPictures = [];

  /**
   * Храним имя на фильтра по умолчанию
   * @type {string}
   */
  var activeFilter = 'filter-popular';

  /**
   * Текущая страничка
   * @type {number}
   */
  var currentPage = 0;

  /**
   * id-счётчика для scroll'а
   * @type {number}
   */
  var scrollTimeout;

  getPictures();

  // Скрываем фильтры
  filters.classList.add('hidden');

  filters.addEventListener('click', function(evt) {
    var clickedElement = evt.target;

    if (clickedElement.classList.contains('filters-item')) {
      setActiveFilter(clickedElement.previousElementSibling.id);
    }
  });

  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(checkPositionPages, SCROLL_TIMER);
  });

  /**
   * Проверяем нужноли прогружать следующую страничку
   */
  function checkPositionPages() {
    var footerCoordinates = container.getBoundingClientRect();
    var viewportSize = window.innerHeight;

    if (footerCoordinates.bottom - viewportSize <= footerCoordinates.height) {
      if (currentPage < Math.ceil(filteredPictures.length / PAGE_SIZE)) {
        renderPictures(filteredPictures, ++currentPage);
      }
    }
  }

  /**
   * Отрисовка фотографий
   * @param {Array} picturesToRender
   * @param {number} pageNumber
   * @param {boolean} replace
   */
  function renderPictures(picturesToRender, pageNumber, replace) {
    if (replace) {
      container.innerHTML = '';
    }

    var numberFrom = pageNumber * PAGE_SIZE;
    var numberTo = numberFrom + PAGE_SIZE;
    var pagePictures = picturesToRender.slice(numberFrom, numberTo);

    // Цикл по всем картинкам
    pagePictures.forEach(function(picture) {
      var element = getElementFromTemplate(picture);
      fragment.appendChild(element);
    });
    container.appendChild(fragment);
  }

  // Показываем фильтры
  filters.classList.remove('hidden');

  /**
   * Установка фильтра
   * @param {string} selectedFilter
   * @param {boolean} force
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
        // Реализовал выборку в 3 месяца
        // по убыванию цены.
        var threeMonth = new Date() - 90 * 24 * 60 * 60 * 1000;

        filteredPictures = filteredPictures.sort(function(a, b) {
          var dateB = new Date(b.date).getTime();
          var dateA = new Date(a.date).getTime();
          return dateB - dateA;
        }).filter(function(picture) {
          var datePicture = Date.parse(picture.date);
          return datePicture >= threeMonth;
        });
        break;

      case 'filter-discussed':
        // Фильтр самые обсуждаемые
        // по убыванию

        filteredPictures = filteredPictures.sort(function(a, b) {
          return b.comments - a.comments;
        });
        break;
    }

    currentPage = 0;
    renderPictures(filteredPictures, currentPage, true);
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
    };

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
   * Вызываем, если нужно обновить фотографии
   * что-то изменилось (выбрали другой фильтр)
   * @param {Array} loadedPictures
   */
  function updateLoadedPictures(loadedPictures) {
    picturesMas = loadedPictures;

    // Выбор фильтрации
    setActiveFilter(activeFilter, true);
  }

  /**
   * Получаем шаблон элемента
   * @param {Object} data
   * @returns {HTMLElement}
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
    // после которых он уберет src у изображения и добавит класс pictures-failure,
    // который показывает, что фотография не прогрузилась.
    var imageLoadTimeout = setTimeout(function() {
      backgroundImage.src = ''; // Прекращаем загрузку
      element.classList.add('pictures-failure'); // Показываем ошибку
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
      element.classList.add('pictures-failure');
    };

    return element;
  }
})();
