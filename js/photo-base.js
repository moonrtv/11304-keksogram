/**
 * Created by Tink on 20.12.2015.
 */
'use strict';

(function() {
  /** @constructor */
  var PhotoBase = function() {};

  /** @method show */
  PhotoBase.prototype.show = function() {};

  /** @method hide */
  PhotoBase.prototype.hide = function() {};

  /**
   * Метод изменения данных о фотографии
   * @param {Object} data
   * @method setData
   */
  PhotoBase.prototype.setData = function(data) {
    this._data = data;
  };

  /**
   * Метод получения данных от фотографии
   * @return {?PhotoBase}
   * @method getData
   */
  //PhotoBase.prototype.getData = function() {
  //  return this._data;
  //};

  window.PhotoBase = PhotoBase;
})();
