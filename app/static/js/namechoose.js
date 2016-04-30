/**
 * Created by Filip on 24.01.2016.
 */
var nameselect = document.getElementById("nameselect");
var choosetext = document.getElementById("choosetext");

var ctx = function(){
    choosetext.href = "/u/" + nameselect.value;
};