'use strict';

var pause_button = 80;

var setupBindings = function(){
  $(document).ready(function() {
    $(document).keydown(function(e) {
      if (e.which >= 48 && e.which <= 57 || e.which >= 96 && e.which <= 105) {
        var pressed_key = e.which;
        while (pressed_key > 40) {
          pressed_key -= 48;
        }
        triggerButton(pressed_key);
        console.log("NUMBER! " + pressed_key);
        e.preventDefault();
      } else if (e.which == pause_button) {
        console.log("PAUSE!");
      } else {
        console.log("KEY " + e.which);
      }
    });
  });
};

var createButtons = function(number) {

  var buttons_div = document.getElementById("buttons");
  buttons_div.innerHTML = '';
  if(number == 0){
    return;
  }


  for (var i = 1; i <= 10; ++i) {
    console.log("Creating button " + i);
    var correct = number % 2;
    number = Math.floor(number / 2);

    var button_img = document.createElement("input");
    button_img.type = "image";
    button_img.src = "../assets/button_untouched.png";

    button_img.onclick = (function(i) {
      return function() {
        triggerButton(i % 10);
      };
    })(i);

    var new_button = document.createElement("div");
    new_button.id = "button" + (i % 10);
    new_button.className = "button";
    new_button.correct = correct;
    new_button.appendChild(button_img);

    buttons_div.appendChild(new_button);
  }
};

// TODO move this functionality to logic file
var triggerButton = function(button_number) {
  console.log("TRIGGERED " + button_number);
  var button = document.getElementById("button" + button_number);
  if(!button){
    return;
  }
  var new_image = document.createElement("img");
  if (button.correct == 1) {
    new_image.src = "../assets/button_right.png";
  } else {
    new_image.src = "../assets/button_wrong.png";
  }
  button.innerHTML = '';
  button.appendChild(new_image);
};
