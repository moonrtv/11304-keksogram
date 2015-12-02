'use strict';

(function() {
  // ��������� ��� �������� ����������
  var container = document.querySelector('.pictures');

  // ���� �� ���� ���������
  pictures.forEach(function(picture){
    var element = getElementFromTemplate(picture);
    container.appendChild(element);
  });

  function getElementFromTemplate(data) {
    var template = document.querySelector('#picture-template');
    var filters = document.querySelector('.filters');
    var element;

    // �������� �������
    filters.classList.add('hidden');

    // �������� �� IE
    if ('content' in template) {
      element = template.content.children[0].cloneNode(true);
    } else {
      element = template.children[0].cloneNode(true);
    }

    // ��������� �������
    element.querySelector('.picture-comments').textContent = data.comments;
    element.querySelector('.picture-likes').textContent = data.likes;

    var backgroundImage = new Image();

    // ������� ��������
    backgroundImage.onload = function() {
      clearTimeout(imageLoadTimeout);
      element.style.backgroundImage = 'url(\''+ '../../'+ data.url + '\')';
      var oldImg = element.querySelector('img');
      var newImg = document.createElement('img');
      newImg.setAttribute('src', data.url);
      newImg.style.width = '182px';
      newImg.style.height = '182px';
      element.replaceChild(newImg, oldImg);
      filters.classList.remove('hidden');
    };


    // ���� ����������� �� ����������� (404 ������, ������ �������),
    // ���������� ���������, ��� � ����� ��� ����������.
    backgroundImage.onerror = function() {
      element.classList.add('picture-load-failure');
    };

    // ����� �������� �������� ����������
    var IMAGE_TIMEOUT = 5000;

    // ��������� �������� �� �������� �����������. ������ ������� 5 ������
    // ����� ������� �� ������ src � ����������� � ������� ����� picture-load-failure,
    // ������� ����������, ��� ���������� �� ������������.
    var imageLoadTimeout = setTimeout(function() {
      backgroundImage.src = ''; // ���������� ��������
      element.classList.add('picture-load-failure'); // ���������� ������
    }, IMAGE_TIMEOUT);

    // ��������� src � ����������� �������� ��������.
    backgroundImage.src = data.preview;

    return element;
  }
})();