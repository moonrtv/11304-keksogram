/* global requirejs: true, define: true */

'use strict';

requirejs.config({
  baseUrl: 'js'
});

define([
  'photo',
  'gallery',
  'resizer',
  'upload'
], function(Photo, Gallery) {
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
   * @type {HTMLElement}
   */
  var container = document.querySelector('.pictures');

  /**
   * Ссылка на родителя всех фильтров
   * @type {HTMLElement}
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

  /** @enum */
  var availableFilters = [
    'filter-popular',
    'filter-new',
    'filter-discussed'
  ];

  /**
   * Храним имя на фильтра по умолчанию
   * @type {string}
   */
  var activeFilter = (availableFilters.indexOf(localStorage.getItem('activeFilter')) <= 0) ? 'filter-popular' : localStorage.getItem('activeFilter');

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

  /**
   * Создаём объект галлерея
   * @type {Gallery}
   */
  var gallery = new Gallery();

  /**
   * Вызов на прорисовку фотографий
   */
  getPictures();

  /**
   * Скрываем фильтры
   */
  filters.classList.add('hidden');

  /**
   * Выбор фильтрации
   * @event click
   */
  filters.addEventListener('click', function(evt) {
    var clickedElement = evt.target;
    if (clickedElement.classList.contains('filters-radio')) {
      setActiveFilter(clickedElement.id);
    }
  });

  /**
   * "Медленный скроллинг"
   * @event scroll
   */
  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(checkPositionPages, SCROLL_TIMER);
  });

  /**
   * Проверяем нужно ли прогружать страничку
   * @function checkPositionPages
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
   * @param {Array.<Object>} picturesToRender
   * @param {number} pageNumber
   * @param {boolean=} replace
   * @function renderPictures
   */
  function renderPictures(picturesToRender, pageNumber, replace) {
    if (replace) {
      var renderedPictures = container.querySelectorAll('.picture');
      Array.prototype.forEach.call(renderedPictures, function(element) {
        container.removeChild(element);
      });
    }

    var numberFrom = pageNumber * PAGE_SIZE;
    var numberTo = numberFrom + PAGE_SIZE;
    var pagePictures = picturesToRender.slice(numberFrom, numberTo);

    pagePictures.forEach(function(picture, index) {
      var photo = new Photo(picture);
      photo.render();

      photo.onClick = function() {
        var currentPosition = index + numberFrom;
        gallery.setCurrentPicture(currentPosition);
        gallery.show();
        gallery.setHash(photo._data.url);
      };
      fragment.appendChild(photo.element);
    });

    container.appendChild(fragment);
  }

  /**
   * Установка фильтра
   * @param {string} selectedFilter
   * @param {boolean=} force
   * @function setActiveFilter
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
        filteredPictures = filteredPictures.filter(function(picture) {
          var datePicture = Date.parse(picture.date);
          return datePicture >= threeMonth;
        }).sort(function(a, b) {
          var dateB = new Date(b.date).getTime();
          var dateA = new Date(a.date).getTime();
          return dateB - dateA;
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
    gallery.setPictures(filteredPictures);
    renderPictures(filteredPictures, currentPage, true);
    checkPositionPages();
    activeFilter = selectedFilter;
    localStorage.setItem('activeFilter', selectedFilter);
    filters.querySelector('#' + selectedFilter).checked = true;
  }

  /**
   * Загрузка фотографий
   * @function getPictures
   */
  function getPictures() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'data/pictures.json');
    xhr.timeout = 10000;
    xhr.onload = function(evt) {
      container.classList.remove('pictures-loading');
      var rawData = evt.target.response;
      try {
        var loadedPictures = JSON.parse(rawData);
        updateLoadedPictures(loadedPictures);
      } catch (e) {
        console.log('Призагрузке JSON возникла ошибка.');
        xhr.onerror();
      }
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

  /**
   * @function addClassFailure
   */
  function addClassFailure() {
    container.classList.add('pictures-failure');
  }

  /**
   * Вызываем, если нужно обновить фотографии
   * что-то изменилось (выбрали другой фильтр)
   * @param {Array} loadedPictures
   * @function updateLoadedPictures
   */
  function updateLoadedPictures(loadedPictures) {
    picturesMas = loadedPictures;

    // Выбор фильтрации
    setActiveFilter(activeFilter, true);
  }

  // Показываем фильтры
  filters.classList.remove('hidden');
});
