/**
 * Created by Tink on 20.12.2015.
 */

/* global PhotoBase: true, inherit: true */

'use strict';

(function() {
  /**
   * @constructor
   * @extends {PhotoBase}
   */
  var PhotoPreview = function() {};

  inherit(PhotoPreview, PhotoBase);

  /**
   * @type {?Element}
   * @private
   */
  PhotoPreview.prototype._overlay = null;
  PhotoPreview.prototype._likeButton = null;
  PhotoPreview.prototype._onLikeClick = function() {};

  /**
   * Метод показа галлереи
   * @method show
   * @override
   */
  PhotoPreview.prototype.show = function() {
    this._overlay.classList.remove('invisible');
    this._closeButton.addEventListener('click', this._onCloseClick);
    this._photoImage.addEventListener('click', this._onPhotoClick);
    this._likeButton.addEventListener('click', this._onLikeClick);
    document.addEventListener('keydown', this._onDocumentKeyDown);
  };

  /**
   * Метод скрытия галлереи
   * @method hide
   * @override
   */
  PhotoPreview.prototype.hide = function() {
    this._overlay.classList.add('invisible');
    this._closeButton.removeEventListener('click', this._onCloseClick);
    this._photoImage.removeEventListener('click', this._onPhotoClick);
    this._likeButton.removeEventListener('click', this._onLikeClick);
    document.removeEventListener('keydown', this._onDocumentKeyDown);
  };

  window.PhotoPreview = PhotoPreview;
})();
