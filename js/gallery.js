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

    this.element = document.querySelector('.gallery-overlay');
    this._closeButton = this.element.querySelector('.gallery-overlay-close');
    this._photoImage = this.element.querySelector('.gallery-overlay-image');
    this._photoLikes = this.element.querySelector('.likes-count');
    this._photoComments = this.element.querySelector('.comments-count');

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
    debugger;
    var index = this._currentImage + 1;
    if(index >= this.pictures.length) index = 0;
    this.setCurrentPicture(index);
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
    debugger;
    var length = this.pictures.length - 1;
    if (e.keyCode === Gallery.KEY_CODE.LEFT_ARROW) {
      if (this._currentImage === 0) {
        this._currentImage = length;
        this.pictures[this._currentImage].url;
      } else {
        debugger;
        this.pictures[--this._currentImage].url;
      }
    }
    if (e.keyCode === Gallery.KEY_CODE.RIGHT_ARROW) {
      if (this._currentImage === length) {
        this._currentImage = 0;
        this.pictures[this._currentImage].url;
      } else {
        debugger;
        this.pictures[++this._currentImage].url;
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
    debugger;
    if (index < this.pictures.length && index > 0) {
      this._currentImage = index;
      var picture = this.pictures[this._currentImage];
      this._photoImage.src = picture.url;
      this._photoLikes.textContent = picture.likes.toString();
      this._photoComments.textContent = picture.comments;
    } else {
      console.log('Полученный индекс выходит за пределы массива.');
    }
  };

  /**
   * @type {Gallery}
   */
  window.Gallery = Gallery;
})();
