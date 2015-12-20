/**
 * Created by Tink on 16.12.2015.
 */

/* global PhotoBase: true, inherit: true */

'use strict';

(function() {
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

    /**
     * Размер картинки
     * @const {string}
     */
    Photo.IMG_SIZE = '182px';
  };

  inherit(Photo, PhotoBase);

  /**
   * Получаем шаблоны картинок
   * @method
   * @returns {HTMLElement}
   */
  Photo.prototype.show = function() {

    // Проверка на IE
    if ('content' in template) {
      this.element = template.content.children[0].cloneNode(true);
    } else {
      this.element = template.children[0].cloneNode(true);
    }

    // Заполняем данными
    this.element.querySelector('.picture-comments').textContent = this._data.comments;
    this.element.querySelector('.picture-likes').textContent = this._data.likes.toString();

    /**@type {Image}*/
    var backgroundImage = new Image();

    /**@type {number}*/
    var imageLoadTimeout = setTimeout(function() {
      backgroundImage.src = ''; // Прекращаем загрузку
      this.element.classList.add('picture-load-failure'); // Показываем ошибку
    }.bind(this), IMAGE_TIMEOUT);

    // Изменение src у изображения начинает загрузку.
    backgroundImage.src = this._data.url;
    backgroundImage.style.width = Photo.IMG_SIZE;
    backgroundImage.style.height = Photo.IMG_SIZE;
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

    this.element.addEventListener('click', this._onClick);
  };

  /**
   * Клик по фотографии
   * @param {Event} evt
   * @private
   */
  Photo.prototype._onClick = function(evt) {
    if (evt.target.classList.contains('picture') && !(this.element.classList.contains('picture-load-failure'))) {
      if (typeof this.onClick === 'function') {
        this.onClick();
      }
    }
  };

  /**
   * Удаление обработчика клика по фотографии
   * @override
   */
  Photo.prototype.hide = function() {
    this.element.removeEventListener('click', this._onClick);
  };

  /** @type {?Function} */
  Photo.prototype.onClick = null;

  window.Photo = Photo;
})();
