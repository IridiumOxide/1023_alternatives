'use strict'

var set1 = function() {
  setTimeout(function() {
    createLamps(999);
    set2();
  }, 1000);
}

var set2 = function() {
  setTimeout(function() {
    createLamps(123);
    set3();
  }, 1000);
}

var set3 = function() {
  setTimeout(function() {
    createLamps(500);
    set1();
  }, 1000);
}

var setrandom = function() {
  setTimeout(function() {
    var config = Math.floor(Math.random() * 1023 + 1);
    console.log(config);
    createLamps(config);
    createButtons(config);
    clearLamps();
  }, 1000)
}

var clearLamps = function() {
  setTimeout(function() {
    createLamps(0);
    createButtons(0);
    setrandom();

  }, 5000)
}
