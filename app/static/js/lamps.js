'use strict';

var createLamps = function(number) {
  var lamps_div = document.getElementById("lamps");
  lamps_div.innerHTML = '';
  for (var i = 1; i <= 10; ++i) {
    var lit = number % 2;
    number = Math.floor(number / 2);
    var litstring = "lit";
    if (lit == 0) {
      litstring = "unlit"
    }
    var lamp_img = document.createElement("img");
    lamp_img.src = STATIC_URL + "assets/lamp_" + litstring + ".png";

    var new_lamp = document.createElement("div");
    new_lamp.id = "lamp" + (i % 10);
    new_lamp.className = "lamp";
    new_lamp.appendChild(lamp_img);

    var lamp_info = document.createElement("div");
    lamp_info.className = "lamp_info";
    lamp_info.innerHTML = "" + (i % 10);
    new_lamp.appendChild(lamp_info);

    lamps_div.appendChild(new_lamp);
  }
};
