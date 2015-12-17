/**
 * Created by Tink on 16.12.2015.
 */

'use strict';

(function() {
  /**
   * Размер картинки
   * @const {string}
   */
  var IMG_SIZE = '182px';

  /**
   * Время ожидания загрузки фотографии
   * @const {number}
   */
  var IMAGE_TIMEOUT = 5000;

  /**
   * Храним ссылку на структуру шаблона
   * @type {HTMLElement}
   */
  var template = document.querySelector('#picture-template');

  /**
   * Функция-конструктор
   * @param {Object} data
   * @returns {Object}
   * @constructor
   */
  var Photo = function(data) {
    this._data = data;
  };

  /**
   * Получаем шаблоны картинок
   * @method
   * @returns {HTMLElement}
   */
  Photo.prototype.render = function() {

    // Проверка на IE
    if ('content' in template) {
      this.element = template.content.children[0].cloneNode(true);
    } else {
      this.element = template.children[0].cloneNode(true);
    }

    // Заполняем данными
    this.element.querySelector('.picture-comments').textContent = this._data.comments;
    this.element.querySelector('.picture-likes').textContent = this._data.likes.toString();

    var backgroundImage = new Image();

    /**
     * Установка таймаута на загрузку изображения. Таймер ожидает 5 секунд
     * после которых он уберет src у изображения и добавит класс picture-load-failure,
     * который показывает, что фотография не прогрузилась.
     * @type {number}
     * @function imageLoadTimeout
     */
    var imageLoadTimeout = setTimeout(function() {
      backgroundImage.src = ''; // Прекращаем загрузку
      this.element.classList.add('picture-load-failure'); // Показываем ошибку
    }.bind(this), IMAGE_TIMEOUT);

    // Изменение src у изображения начинает загрузку.
    backgroundImage.src = this._data.url;
    backgroundImage.style.width = IMG_SIZE;
    backgroundImage.style.height = IMG_SIZE;
    this.element.classList.add('picture-load-process');
    var currentImg = this.element.querySelector('img');

    /**
     * Функция загрузки
     * @event load
     */
    backgroundImage.addEventListener('load', function() {
      clearTimeout(imageLoadTimeout);
      // Удаление класс с картинки (loader)
      this.element.classList.remove('picture-load-process');
      this.element.replaceChild(backgroundImage, currentImg);
    }.bind(this));

    /**
     * Если изображение не загрузилось (404 ошибка, ошибка сервера)
     * @event error
     */
    backgroundImage.addEventListener('error', function() {
      // Удаление класс с картинки (loader)
      this.element.classList.remove('picture-load-process');
      this.element.classList.add('picture-load-failure');
    }.bind(this));

    return this.element;
  };

  /**
   * Расшариваем фотографии
   * @type {Photo}
   */
  window.Photo = Photo;
})();
