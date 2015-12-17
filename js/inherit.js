/**
 * Created by Tink on 18.12.2015.
 */

'use strict';

/**
 * Функция принимает два конструктора и записывает в прототип
 * дочернего конструктора Child методы и свойства родительского
 * конструктора Parent, используя пустой конструктор.
 * @param {Function} child
 * @param {Function} parent
 * @return {Object} child
 */
function inherit(child, parent) {
  var EmptyConstructor = function() {};
  EmptyConstructor.prototype = parent.prototype;
  child.prototype = new EmptyConstructor();

  return child;
}

// Вызов функции для проверки
console.log(inherit.toString());
