/**
 * Created by Tink on 16.12.2015.
 */

/* global PhotoPreview: true, inherit: true */

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

    this.element = document.querySelector('.gallery-overlay');
    this._closeButton = this.element.querySelector('.gallery-overlay-close');
    this._photoImage = this.element.querySelector('.gallery-overlay-image');
    this._likeButton = this.element.querySelector('.gallery-overlay-controls-like');
    this._likes = this.element.querySelector('.likes-count');
    this._comments = this.element.querySelector('.comments-count');

    this._onCloseClick = this._onCloseClick.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
    this._onPhotoClick = this._onPhotoClick.bind(this);
    this._onLikeClick = this._onLikeClick.bind(this);
    this._changeLike = this._changeLike.bind(this);

    this._likedClass = 'likes-count-liked';

    this._currentSlide = 0;
    this._maxSlide = 0;
  }

  inherit(Gallery, PhotoPreview);

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
    if (this._currentSlide < this._maxSlide) {
      this.setCurrentPicture(++this._currentSlide);
    }
  };

  /**
   * Обработчик на клавишу ESC
   * @param e
   * @method
   * @private
   */
  Gallery.prototype._onDocumentKeyDown = function(e) {
    if (e.keyCode === Gallery.KEY_CODE.ESC_CODE) {
      this.hide();
    }
    if (e.keyCode === Gallery.KEY_CODE.NEXT_CODE && this._currentSlide > 0) {
      this.setCurrentPicture(--this._currentSlide);
    }
    if (e.keyCode === Gallery.KEY_CODE.PREV_CODE && this._currentSlide < this._maxSlide) {
      this.setCurrentPicture(++this._currentSlide);
    }
  };

  /**
   * @method
   * @param {Array.<Object>} pictures
   */
  Gallery.prototype.setPictures = function(pictures) {
    this._data = pictures;
    this._maxSlide = this._data.length - 1;
  };

  /**
   * Отрисовка фотографии в галерее (изображение, количество лайков и комментариев)
   * @method
   * @param {number} index
   */
  Gallery.prototype.setCurrentPicture = function(index) {
    /** @type {Object} */
    this._currentSlide = index;
    var picture = this._data[index];
    this._overlay.querySelector('.gallery-overlay-image').src = picture.getPicture();
    this._likes.textContent = picture.getLikes();
    this._comments.textContent = picture.getComments();
    if (this._data[this._currentSlide]._liked &&
      !this._likes.classList.contains(this._likedClass)) {
      this._likes.classList.add(this._likedClass);
    } else if (!this._data[this._currentSlide]._liked &&
      this._likes.classList.contains(this._likedClass)) {
      this._likes.classList.remove(this._likedClass);
    }
  };

  /**
   * Клик по лайкам
   * @method
   * @private
   */
  Gallery.prototype._onLikeClick = function() {
    if (this._data[this._currentSlide]._liked) {
      this._changeLike(true, -1);
    } else {
      this._changeLike(false, 1);
    }
  };

  /**
   * Изменение количества лайков
   * @param {boolean} liked
   * @param {number} count
   * @private
   */
  Gallery.prototype._changeLike = function(liked, count) {
    this._data[this._currentSlide]._liked = !liked;
    this._likes.textContent = +this._likes.textContent + count;
    this._data[this._currentSlide].setLikes(this._likes.textContent);
    this._likes.classList.toggle(this._likedClass);
  };

  /**
   * Расшариваем галлерею
   * @type {Gallery}
   */
  window.Gallery = Gallery;
})();
