/* global Resizer: true */

/**
 * @fileoverview
 * @author Igor Alexeenko (o0)
 */

'use strict';

(function() {
  /** Const */
  var ERR_MSG_LEFT = 'Сумма значений полей «слева» и «сторона» не должна быть больше ширины исходного изображения';
  var ERR_MSG_TOP = 'Сумма значений полей «сверху» и «сторона» не должна быть больше высоты исходного изображения';
  var ERR_MSG_NEGATIVE = 'Значение не может быть отрицательным!';

  /** @enum {string} */
  var FileType = {
    'GIF': '',
    'JPEG': '',
    'PNG': '',
    'SVG+XML': ''
  };

  /** @enum {number} */
  var Action = {
    ERROR: 0,
    UPLOADING: 1,
    CUSTOM: 2
  };

  /**
   * Регулярное выражение, проверяющее тип загружаемого файла. Составляется
   * из ключей FileType.
   * @type {RegExp}
   */
  var fileRegExp = new RegExp('^image/(' + Object.keys(FileType).join('|').replace('\+', '\\+') + ')$', 'i');

  /**
   * @type {Object.<string, string>}
   */
  var filterMap;

  /**
   * Объект, который занимается кадрированием изображения.
   * @type {Resizer}
   */
  var currentResizer;

  /**
   * Удаляет текущий объект {@link Resizer}, чтобы создать новый с другим
   * изображением.
   */
  function cleanupResizer() {
    if (currentResizer) {
      currentResizer.remove();
      currentResizer = null;
    }
  }

  /**
   * Ставит одну из трех случайных картинок на фон формы загрузки.
   */
  function updateBackground() {
    var images = [
      'img/logo-background-1.jpg',
      'img/logo-background-2.jpg',
      'img/logo-background-3.jpg'
    ];

    var backgroundElement = document.querySelector('.upload');
    var randomImageNumber = Math.round(Math.random() * (images.length - 1));
    backgroundElement.style.backgroundImage = 'url(' + images[randomImageNumber] + ')';
  }

  /**
   * Форма загрузки изображения.
   * @type {HTMLFormElement}
   */
  var uploadForm = document.forms['upload-select-image'];

  /**
   * Форма кадрирования изображения.
   * @type {HTMLFormElement}
   */
  var resizeForm = document.forms['upload-resize'];

  /**
   * Форма добавления фильтра.
   * @type {HTMLFormElement}
   */
  var filterForm = document.forms['upload-filter'];

  var resizeX = resizeForm['resize-x'];
  var resizeY = resizeForm['resize-y'];
  var resizeSide = resizeForm['resize-size'];

  /**
   * @type {HTMLImageElement}
   */
  var filterInputs = document.querySelector('.upload-resize-controls');

  /**
   * @type {HTMLImageElement}
   */
  var filterImage = filterForm.querySelector('.filter-image-preview');

  /**
   * @type {HTMLImageElement}
   */
  var buttonSubmit = document.querySelector('#resize-fwd');

  /**
   * @type {HTMLElement}
   */
  var uploadMessage = document.querySelector('.upload-message');

  /**
   * @param {Action} action
   * @param {string=} message
   * @return {Element}
   */
  function showMessage(action, message) {
    var isError = false;

    switch (action) {
      case Action.UPLOADING:
        message = message || 'Кексограмим&hellip;';
        break;

      case Action.ERROR:
        isError = true;
        message = message || 'Неподдерживаемый формат файла<br> <a href="' + document.location + '">Попробовать еще раз</a>.';
        break;
    }

    uploadMessage.querySelector('.upload-message-container').innerHTML = message;
    uploadMessage.classList.remove('invisible');
    uploadMessage.classList.toggle('upload-message-error', isError);
    return uploadMessage;
  }

  function hideMessage() {
    uploadMessage.classList.add('invisible');
  }

  /**
   * Обработчик изменения изображения в форме загрузки. Если загруженный
   * файл является изображением, считывается исходник картинки, создается
   * Resizer с загруженной картинкой, добавляется в форму кадрирования
   * и показывается форма кадрирования.
   * @param {Event} evt
   */
  uploadForm.addEventListener('change', function(evt) {
    var element = evt.target;
    if (element.id === 'upload-file') {
      // Проверка типа загружаемого файла, тип должен быть изображением
      // одного из форматов: JPEG, PNG, GIF или SVG.
      if (fileRegExp.test(element.files[0].type)) {
        var fileReader = new FileReader();

        showMessage(Action.UPLOADING);

        fileReader.onload = function() {
          cleanupResizer();

          currentResizer = new Resizer(fileReader.result);
          currentResizer.setElement(resizeForm);
          uploadMessage.classList.add('invisible');

          uploadForm.classList.add('invisible');
          resizeForm.classList.remove('invisible');

          hideMessage();
        };

        fileReader.readAsDataURL(element.files[0]);
      } else {
        // Показ сообщения об ошибке, если загружаемый файл, не является
        // поддерживаемым изображением.
        showMessage(Action.ERROR);
      }
    }
  });

  /**
   * Обработчик берущий значения смещения и размера кадра
   * из объекта resizer для добавления их в форму
   * @param {Event} resizerchange
   */
  window.addEventListener('resizerchange', resizeImg);

  function resizeImg() {
    var baseSize = currentResizer.getConstraint();

    resizeX.value = baseSize.x;
    resizeY.value = baseSize.y;
    resizeSide.value = baseSize.side;
  }

  /**
   * Синхронизация изменения значений полей resizeForm с габаритами окна кадрирования
   * и валидация формы.
   * @param {Event} change
   */
  resizeForm.addEventListener('change', function() {
    if (resizeFormIsValid()) {
      currentResizer.setConstraint(+resizeX.value, +resizeY.value, +resizeSide.value);
    }
  });

  /**
   * Обработка сброса формы кадрирования. Возвращает в начальное состояние
   * и обновляет фон.
   * @param {Event} evt
   */
  resizeForm.addEventListener('reset', function(evt) {
    evt.preventDefault();

    cleanupResizer();
    updateBackground();

    resizeForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  });

  /**
   * Обработка отправки формы кадрирования. Если форма валидна, экспортирует
   * кропнутое изображение в форму добавления фильтра и показывает ее.
   * @param {Event} evt
   */
  resizeForm.addEventListener('submit', function(evt) {
    evt.preventDefault();

    if (resizeFormIsValid()) {
      filterImage.src = currentResizer.exportImage().src;

      resizeForm.classList.add('invisible');
      filterForm.classList.remove('invisible');
    }
  });

  /**
   * Сброс формы фильтра. Показывает форму кадрирования.
   * @param {Event} evt
   */
  filterForm.addEventListener('reset', function(evt) {
    evt.preventDefault();

    filterForm.classList.add('invisible');
    resizeForm.classList.remove('invisible');
  });

  /**
   * Отправка формы фильтра. Возвращает в начальное состояние, предварительно
   * записав сохраненный фильтр в cookie.
   * @param {Event} evt
   */
  filterForm.addEventListener('submit', function(evt) {
    evt.preventDefault();

    cleanupResizer();
    updateBackground();

    filterForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  });

  /**
   * Создание и позицианирование сообщения.
   */
  var showInfoMsg = function(tooltip) {
    var checkMsg = document.querySelector('.tooltip');
    if (checkMsg) {
      removeInfoMsg(checkMsg);
    }

    var showingTooltip = document.createElement('div');
    showingTooltip.className = 'tooltip';
    showingTooltip.innerHTML = tooltip;
    document.body.appendChild(showingTooltip);

    var coords = filterInputs.getBoundingClientRect();

    var left = coords.left + (filterInputs.offsetWidth - showingTooltip.offsetWidth) / 2;
    // не вылезать за левую границу окна
    left = Math.max(left, 0);

    var top = coords.top - showingTooltip.offsetHeight - 5;
    // не вылезать за верхнюю границу окна
    if (top < 0) {
      top = coords.top + filterInputs.offsetHeight + 5;
    }

    showingTooltip.style.left = left + 'px';
    showingTooltip.style.top = top + 'px';

    return showingTooltip;
  };

  /**
   * Удаление сообщения.
   */
  var removeInfoMsg = function(showingTooltip) {
    try {
      if (showingTooltip) {
        document.body.removeChild(showingTooltip);
        showingTooltip = null;
      }
    } catch (e) {
      console.log('Хьюстон! У нас проблемы!');
    }
  };

  /**
   * Удаление сообщения по времени.
   */
  var removeInfoMsgTimeout = function(showingTooltip) {
    setTimeout(function() {
      if (showingTooltip) {
        removeInfoMsg(showingTooltip);
      }
    }, 3000);
  };

  /**
   * Проверка данных на валидность.
  */
  filterInputs.addEventListener('change', resizeFormIsValid);

  /**
   * Функция для проверки данных в форме кадрирования.
   * @return {boolean}
   */
  function resizeFormIsValid() {
    var Msg;
    var resizeXVal = +resizeForm['resize-x'].value;
    var resizeYVal = +resizeForm['resize-y'].value;
    var resizeSideVal = +resizeForm['resize-size'].value;

    var error = null;
    if ((resizeXVal >= 0) && (resizeYVal >= 0) && (resizeSideVal >= 0)) {
      if ((resizeXVal + resizeSideVal) > currentResizer._image.naturalWidth) {
        error = ERR_MSG_LEFT;
      } else if ((resizeYVal + resizeSideVal) > currentResizer._image.naturalHeight) {
        error = ERR_MSG_TOP;
      }
    } else {
      error = ERR_MSG_NEGATIVE;
    }

    if (error) {
      buttonSubmit.disabled = true;
      Msg = showInfoMsg(error);
    } else {
      buttonSubmit.disabled = false;
    }

    removeInfoMsgTimeout(Msg);

    if (error) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Вычисляем дату cookie.
   */
  var getDiffDate = function() {
    // Текущие преобразования относительно моего дня рождения
    var now = +Date.now(); // (new Date()).getTime() или +Date.now()
    var myBithday = (new Date('01.07.' + (new Date()).getFullYear())).getTime();
    // Если у нас день рождения уже прошёл(положительное число), то мы из текущей даты вычитаем нашу дату
    var dateDiff = now - myBithday;

    if (dateDiff <= 0) {
      var year = new Date().getFullYear() - 1;
      myBithday = new Date('01.07.' + year).getTime();
      dateDiff = now - myBithday;
    }

    // Вычисляем дату 'протухания' cookie
    var dateToExpire = new Date(now + dateDiff);

    return new Date(dateToExpire).toUTCString();
  };

  /**
   * Обработчик изменения фильтра. Добавляет класс из filterMap соответствующий
   * выбранному значению в форме.
   */
  filterForm.addEventListener('change', filterFormChange);

  function filterFormChange() {
    if (!filterMap) {
      // Ленивая инициализация. Объект не создается до тех пор, пока
      // не понадобится прочитать его в первый раз, а после этого запоминается
      // навсегда.
      filterMap = {
        'none': 'filter-none',
        'chrome': 'filter-chrome',
        'sepia': 'filter-sepia'
      };
    }

    var selectedFilter = 'filter-' + [].filter.call(filterForm['upload-filter'], function(item) {
      return item.checked;
    })[0].value;

    var currentCookie = docCookies.getItem('filter');

    if (currentCookie !== selectedFilter) {
      var formatedDateToExpire = getDiffDate();
      docCookies.setItem('filter', selectedFilter, formatedDateToExpire);
    }

    // Класс перезаписывается, а не обновляется через classList потому что нужно
    // убрать предыдущий примененный класс. Для этого нужно или запоминать его
    // состояние или просто перезаписывать.
    // Прошлая реализация
    //filterImage.className = 'filter-image-preview ' + filterMap[selectedFilter];
    filterImage.className = 'filter-image-preview ' + selectedFilter;
  }

  cleanupResizer();
  updateBackground();

  if (docCookies.getItem('filter')) {
    filterForm['upload-filter'].value = docCookies.getItem('filter');
    filterForm['upload-' + docCookies.getItem('filter')].checked = true;
    filterFormChange();
  }
})();
