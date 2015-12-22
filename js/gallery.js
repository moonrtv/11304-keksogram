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
      PREV_CODE: 37,
      NEXT_CODE: 39
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
    if (this.pictures[++this._currentImage]) {
      this.setHash(this.pictures[this._currentImage].url);
    } else {
      this._currentImage = 0;
      this.setHash(this.pictures[this._currentImage].url);
    }
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
    if (e.keyCode === Gallery.KEY_CODE.PREV_CODE) {
      if (this._currentImage === 0) {
        this._currentImage = this.pictures.length - 1;
        this.setHash(this.pictures[this._currentImage].url);
      } else {
        this.setHash(this.pictures[--this._currentImage].url);
      }
    }
    if (e.keyCode === Gallery.KEY_CODE.NEXT_CODE) {
      if (this._currentImage === --this.pictures.length) {
        this._currentImage = 0;
        this.setHash(this.pictures[this._currentImage].url);
      } else {
        this.setHash(this.pictures[++this._currentImage].url);
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
   * Метод для установки массива фотографий
   * @param {number} index
   * @method
   */
  Gallery.prototype.setCurrentPicture = function(index) {
    if (typeof index === 'number') {
      if (index <= this.pictures.length - 1) {
        this._currentImage = index;
        var picture = this.pictures[this._currentImage];
      }
    } else if (typeof index === 'string') {
      this.pictures.forEach(function(item, i) {
        if (item.url === index) {
          this._currentImage = i;
          picture = item;
        }
      }.bind(this));
    }
    this._photoImage.src = picture.url;
    this._photoLikes.textContent = picture.likes.toString();
    this._photoComments.textContent = picture.comments;
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
        this.setCurrentPicture(this._hash[1]);
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
