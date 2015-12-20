/**
 * Created by Tink on 16.12.2015.
 */

'use strict';

(function() {
  /**
   * Функция-конструктор для галлереи
   * @constructor
   */
  function Gallery() {
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

    this.element = document.querySelector('.gallery-overlay');
    this._closeButton = this.element.querySelector('.gallery-overlay-close');
    this._photoImage = this.element.querySelector('.gallery-overlay-image');

    this._onCloseClick = this._onCloseClick.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
    this._onPhotoClick = this._onPhotoClick.bind(this);
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
      this.setCurrentPicture(this._currentImage);
    } else {
      this._currentImage = 0;
      this.setCurrentPicture(this._currentImage);
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
        this._currentImage = --this.pictures.length;
        this.setCurrentPicture(this._currentImage);
      } else {
        this.setCurrentPicture(--this._currentImage);
      }
    }
    if (e.keyCode === Gallery.KEY_CODE.NEXT_CODE) {
      if (this._currentImage === --this.pictures.length) {
        this._currentImage = 0;
        this.setCurrentPicture(this._currentImage);
      } else {
        this.setCurrentPicture(++this._currentImage);
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
    if (index <= this.pictures.length - 1) {
      this._currentImage = index;
      var picture = this.pictures[this._currentImage];
      this.element.querySelector('.gallery-overlay-image').src = picture.url;
      var galleryControls = document.querySelector('.gallery-overlay-controls');
      galleryControls.querySelector('.likes-count').textContent = picture.likes.toString();
      galleryControls.querySelector('.comments-count').textContent = picture.comments;
    }
  };

  /**
   * Расшариваем галлерею
   * @type {Gallery}
   */
  window.Gallery = Gallery;
})();
