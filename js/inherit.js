/**
 * Created by Tink on 18.12.2015.
 */

'use strict';

(function() {
  /**
   * Наследование свойств родителя.
   * @param {Function} child
   * @param {Function} parent
   */
  function inherit(child, parent) {
    /** @constructor */
    var EmptyConstructor = function() {};
    EmptyConstructor.prototype = parent.prototype;
    child.prototype = new EmptyConstructor();
  }

  window.inherit = inherit;
})();
