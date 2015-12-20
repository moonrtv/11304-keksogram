/**
 * Created by Tink on 20.12.2015.
 */
'use strict';

(function() {
  /**
   * Функция-констркутор
   * @param {Object} data
   * @constructor
   */
  var PhotoData = function(data) {
    this.info = data;
    this._liked = false;
  };

  /**
   * Получение количества лайков фотографии.
   * @returns {number}
   * @method
   */
  PhotoData.prototype.getLikes = function() {
    return this.info.likes;
  };

  /**
   * Получение количеста комментариев фотографии
   * @returns {number}
   * @method
   */
  PhotoData.prototype.getComments = function() {
    return this.info.comments;
  };

  /**
   * Получение изображения фотографии
   * @returns {string}
   * @method
   */
  PhotoData.prototype.getPicture = function() {
    return this.info.url;
  };

  /**
   * Получение даты фотографии
   * @returns {string}
   * @method
   */
  PhotoData.prototype.getDate = function() {
    return this.info.date;
  };

  /**
   * Изменение количества лайков фотографии
   * @param {number} likes
   * @method
   */
  PhotoData.prototype.setLikes = function(likes) {
    this.info.likes = likes;
  };

  window.PhotoData = PhotoData;
})();
