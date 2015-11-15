function getMessage(a, b) {
  if (typeof a === 'boolean') {
      if (a) {
        return 'Переданное GIF-изображение анимировано и содержит ' + b + ' кадров.';
      }  else {
        return 'Переданное GIF-изображение не анимировано.';
      }
  } else if (typeof a === 'number') {// end if GIF
    return 'Переданное SVG-изображение содержит ' + a + ' объектов и ' + b*4 + ' атрибутов.';
    } else if (Array.isArray(a)) {// end if SVG
        function addNumber(x, y){ return x + y; }
        if (Array.isArray(b)) {
          var square = 0;

          for (var i = 0; i < a.length; i++) {
            square += a[i] * b[i];
          }

          return 'Количество красных точек во всех строчках изображения: ' + square + '.';
        } else {
          var sum = a.reduce(addNumber, 0);

          return 'Количество красных точек во всех строчках изображения: ' + sum + '.';
        }
    } else {// end if jpg, png
      throw 'Тип аргументов не обрабатывается! Передайте в другом формате данные!'
  }
}

