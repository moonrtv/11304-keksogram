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

    this.element = document.querySelector('.gallery-overlay');
    this._closeButton = this.element.querySelector('.gallery-overlay-close');
    this._photoImage = this.element.querySelector('.gallery-overlay-image');
    this._photoLikes = this.element.querySelector('.likes-count');
    this._photoComments = this.element.querySelector('.comments-count');

    this._onCloseClick = this._onCloseClick.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
    this._onPhotoClick = this._onPhotoClick.bind(this);
    this._checkPhoto = this._checkPhoto.bind(this);
    this._getPositionString = this._getPositionString.bind(this);
    this._onHashChange = this._onHashChange.bind(this);

    window.addEventListener('load', this._onHashChange);
    window.addEventListener('hashchange', this._onHashChange);
  }

  /**
   * Метод показа галлереи
   * @method show
   */
  Gallery.prototype.show = function() {
    this.element.classList.remove('invisible');
    this._closeButton.addEventListener('click', this._onCloseClick);
    this._photoImage.addEventListener('click', this._onPhotoClick);
    document.addEventListener('keydown', this._onDocumentKeyDown);
  };

  /**
   * Метод скрытия галлереи
   * @method hide
   */
  Gallery.prototype.hide = function() {
    location.hash = '';
    this.element.classList.add('invisible');
    this._closeButton.removeEventListener('click', this._onCloseClick);
    this._photoImage.removeEventListener('click', this._onPhotoClick);
    document.removeEventListener('keydown', this._onDocumentKeyDown);
    //this.setHash();
  };

  /**
   * Обработчик кнопки закрытия в галлереи
   * @method _onCloseClick
   * @private
   */
  Gallery.prototype._onCloseClick = function() {
    this.hide();
  };

  /**
   * Обработчик щелчка по фотографии
   * @method _onPhotoClick
   * @private
   */
  Gallery.prototype._onPhotoClick = function() {
    var index = this._moveForward(this._currentImage);
    this.searchCurrentPicture(index);
    this._currentImage = index;
  };

  /**
   * Обработчик на клавиши ESC, <-, ->
   * @method _onDocumentKeyDown
   * @private
   */
  Gallery.prototype._onDocumentKeyDown = function(e) {
    if (e.keyCode === Gallery.KEY_CODE.ESC_CODE) {
      this.hide();
    }
    var index = this._checkLimitsNumber(this._currentImage);
    if (e.keyCode === (Gallery.KEY_CODE.LEFT_ARROW)) {
      index = this._moveBackward(index);
      this.searchCurrentPicture(index);
    }
    if (e.keyCode === (Gallery.KEY_CODE.RIGHT_ARROW)) {
      index = this._moveForward(index);
      this.searchCurrentPicture(index);
    }
  };

  /**
   * Возвращает следующий индекс
   * (обходит концы массива и невалидные фотографии)
   * @param {number} index
   * @returns {number} index
   * @method _moveForward
   * @private
   */
  Gallery.prototype._moveForward = function(index) {
    var notFailed = true;

    while (notFailed) {
      index = this._checkLimitsNumber(index + 1);
      notFailed = this._checkPhoto(index);
    }

    return index;
  };

  /**
   * Возвращает предыдущий индекс
   * (обходит концы массива и невалидные фотографии)
   * @param {number} index
   * @returns {number} index
   * @method _moveBackward
   * @private
   */
  Gallery.prototype._moveBackward = function(index) {
    var notFailed = true;

    while (notFailed) {
      index = this._checkLimitsNumber(index - 1);
      notFailed = this._checkPhoto(index);
    }

    return index;
  };

  /**
   * Метод проверяет индекс на пределы в массиве
   * @param {number} index
   * @returns {number} index
   * @method _checkLimitsNumber
   * @private
   */
  Gallery.prototype._checkLimitsNumber = function(index) {
    var length = this.pictures.length - 1;

    if (index < 0) {
      index = length;
    } else if (index > length) {
      index = 0;
    }

    return index;
  };


  /**
   * Метод для установки массива фотографий
   * @param {Array.<Object>} pictures
   * @method setPictures
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
    if (typeof index === 'number') {
      this.setHash(this.pictures[index].url);
    } else if (typeof index === 'string') {
      var number = this._getPositionString(index);
      if (number !== -1) {
        this.setCurrentPicture(number);
      }
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
   * @method setHash
   */
  Gallery.prototype.setHash = function(hash) {
    location.hash = hash ? 'photo/' + hash : '';
  };

  /**
   * Метод находит индекс текущей фотографии по url
   * и возвращает его
   * @param {string} index
   * @returns {number}
   * @method _getPositionString
   * @private
   */
  Gallery.prototype._getPositionString = function(index) {
    if (typeof this.pictures !== 'undefined') {
      var length = this.pictures.length;
      for (var i = 0; i < length; i++) {
        if (this.pictures[i].url === index) {
          return i;
        }
      }
    }
    return -1;
  };

  /**
   * Проверка хеша на странице
   * @private
   * @method
   */
  Gallery.prototype._onHashChange = function() {
    this._hash = location.hash.match(/#photo\/(\S+)/);

    if (this._hash && this._hash[1] !== '') {
      var number = this._getPositionString(this._hash[1]);
      if (number !== -1) {
        this.setCurrentPicture(number);
        this.show();
      }
    } else {
      this.hide();
    }
  };

  /**
   * @type {Gallery}
   */
  return Gallery;
});
