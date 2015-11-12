function getMessage(a, b) {
  if (typeof a === "boolean") {
    if (a) {
      return "Переданное GIF-изображение анимировано и содержит " + b + " кадров.";
    } else {
      return "Переданное GIF-изображение не анимировано.";
    }
  }

  if (typeof a === "number")
    return "Переданное SVG-изображение содержит ".concat(a, " объектов и ", b*4, " аттрибутов.");

  if (Array.isArray(a)) {
    if (Array.isArray(b)) {
        var square = 0;

        a.forEach(
          function addNumber(value) { square += value; }
        );

        b.forEach(
          function addNumber(value) { square += value; }
        );

        return "Количество красных точек во всех строчках изображения: " + square + ".";
      } else {
        var sum = 0;

        a.forEach(
          function addNumber(value) { sum += value; }
        );

        return "Количество красных точек во всех строчках изображения: " + sum + ".";
      }
  }
}
