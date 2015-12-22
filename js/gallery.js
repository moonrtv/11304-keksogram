/**
 * Created by Tink on 16.12.2015.
 */

/* global define: true */

'use strict';

define(function() {
  /**
   * Функция-конструктор для галлереи
   * @constructor
   */
  function Gallery() {
    /** @enum */
    Gallery.KEY_CODE = {
      ESC_CODE: 27,
      LEFT_ARROW: 37,
      RIGHT_ARROW: 39
    };

    /**
     * Текущая фотография
     * @type {Number}
     */
    this._currentImage = 0;
    this._hash = null;
    this._arrow = Gallery.KEY_CODE.RIGHT_ARROW;

    this.element = document.querySelector('.gallery-overlay');
    this._closeButton = this.element.querySelector('.gallery-overlay-close');
    this._photoImage = this.element.querySelector('.gallery-overlay-image');
    this._photoLikes = this.element.querySelector('.likes-count');
    this._photoComments = this.element.querySelector('.comments-count');

    this._onCloseClick = this._onCloseClick.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
    this._onPhotoClick = this._onPhotoClick.bind(this);
    this._checkPhoto = this._checkPhoto.bind(this);
    this._onHashChange = this._onHashChange.bind(this);

    window.addEventListener('load', this._onHashChange);
    window.addEventListener('hashchange', this._onHashChange);
  }

  /**
   * Метод показа галлереи
   * @method
   */
  Gallery.prototype.show = function() {
    this.element.classList.remove('invisible');
    this._closeButton.addEventListener('click', this._onCloseClick);
    this._photoImage.addEventListener('click', this._onPhotoClick);
    document.addEventListener('keydown', this._onDocumentKeyDown);
  };

  /**
   * Метод скрытия галлереи
   * @method
   */
  Gallery.prototype.hide = function() {
    this.element.classList.add('invisible');
    this._closeButton.removeEventListener('click', this._onCloseClick);
    this._photoImage.removeEventListener('click', this._onPhotoClick);
    document.removeEventListener('keydown', this._onDocumentKeyDown);
    this.setHash();
  };

  /**
   * Обработчик кнопки закрытия в галлереи
   * @method
   * @private
   */
  Gallery.prototype._onCloseClick = function() {
    this.hide();
  };

  /**
   * Обработчик щелчка по фотографии
   * @method
   * @private
   */
  Gallery.prototype._onPhotoClick = function() {
    this._arrow = Gallery.KEY_CODE.RIGHT_ARROW;
    var index = this._currentImage + 1;
    if (index >= this.pictures.length) {
      index = 0;
    }
    this.searchCurrentPicture(index);
    this._currentImage = index;
  };

  /**
   * Обработчик на клавиши ESC, <-, ->
   * @method
   * @private
   */
  Gallery.prototype._onDocumentKeyDown = function(e) {
    if (e.keyCode === Gallery.KEY_CODE.ESC_CODE) {
      this.hide();
    }
    var length = this.pictures.length - 1;
    var index = this._currentImage;
    if (e.keyCode === (Gallery.KEY_CODE.LEFT_ARROW)) {
      this._arrow = Gallery.KEY_CODE.LEFT_ARROW;
      if (index === 0) {
        this.searchCurrentPicture(length);
      } else {
        this.searchCurrentPicture(--index);
      }
    }
    if (e.keyCode === (Gallery.KEY_CODE.RIGHT_ARROW)) {
      this._arrow = Gallery.KEY_CODE.RIGHT_ARROW;
      if (index === length) {
        this.searchCurrentPicture(0);
      } else {
        this.searchCurrentPicture(++index);
      }
    }
  };

  /**
   * Метод для установки массива фотографий
   * @param {Array.<Object>} pictures
   * @method
   */
  Gallery.prototype.setPictures = function(pictures) {
    this.pictures = pictures;
  };

  /**
   * Установка текущей фотографии
   * @param {number} index
   * @method setCurrentPicture
   */
  Gallery.prototype.setCurrentPicture = function(index) {
    this._currentImage = index;
    var picture = this.pictures[this._currentImage];
    this._photoImage.src = picture.url;
    this._photoLikes.textContent = picture.likes.toString();
    this._photoComments.textContent = picture.comments;
  };

  /**
   * Поиск текущей фотографии
   * @param {number} index
   * @method searchCurrentPicture
   */
  Gallery.prototype.searchCurrentPicture = function(index) {
    var notFailed = true;
    if (typeof index === 'number') {
      while (index < this.pictures.length && index >= 0 && notFailed) {
        if (!this._checkPhoto(index)) {
          notFailed = false;
          this.setHash(this.pictures[index].url);
        } else {
          notFailed = this._checkPhoto(index);
          if (this._arrow === Gallery.KEY_CODE.RIGHT_ARROW) {
            index = ((index + 1) === this.pictures.length) ? 0 : ++index;
          } else {
            index = ((index - 1) === 0) ? this.pictures.length : --index;
          }
        }
      }
    } else if (typeof index === 'string') {
      this.pictures.forEach(function(item, i) {
        if (item.url === index) {
          this.setCurrentPicture(i);
        }
      }.bind(this));
    }

  };

  /**
   * Проверка на валидность
   * @param {number} index
   * @returns {boolean}
   * @method _checkPhoto
   * @private
   */
  Gallery.prototype._checkPhoto = function(index) {
    var fl = (this.pictures[index].url.match(/.mp4|failed.jpg/g)) ? true : false;
    return fl;
  };

  /**
   * Устанавливаем значение хеша
   * @param hash
   * @method
   */
  Gallery.prototype.setHash = function(hash) {
    location.hash = hash ? 'photo/' + hash : '';
  };

  /**
   * Проверка хеша на странице
   * @private
   * @method
   */
  Gallery.prototype._onHashChange = function() {
    setTimeout(function() {
      this._hash = location.hash.match(/#photo\/(\S+)/);
      if (this._hash && this._hash[1] !== '') {
        this.searchCurrentPicture(this._hash[1]);
        this.show();
      } else {
        this.hide();
      }
    }.bind(this), 100);
  };

  /**
   * @type {Gallery}
   */
  return Gallery;
});
