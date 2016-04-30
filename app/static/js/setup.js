'use strict';

var csrftoken = $.cookie('csrftoken');

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

var pause_button = 80;
var action = false;
var feedback = false;
var wait_for_answers = false;
var time = 0;
var session_length = 0;

var current_config = 0;
var save_presses = false;
var test_start_date;
var presses = {};
var audio = new Audio(STATIC_URL + 'assets/beep.mp3');

var message2;
var message3;

var this_session = {};

var getDefinition = function(defname){
    var definition = {};
    $.ajax({
        url: "api/getdefinition/" + defname + "/",
        type: 'GET',
        success: function(data){
            console.log("GOT DATA: ");
            console.log(data);
            definition = data;
            start_experiment(definition);
        },
        error: function(xhr, errmsg){
            alert("An error happened. Sorry.");
            console.log(errmsg);
        }
    });
};

// Get info on last interrupted session and resume it; info remains empty if there was no such session
var getSessionInfo = function(instance_name){
    console.log("GETTING SESSION INFO!");
    $.ajax({
        url: "api/getsessioninfo/" + instance_name + "/",
        type: 'GET',
        success: function(info){
            if(info.starti == 0) { // if there was no session in progress
                var now = new Date();
                this_session.start_date = now;
                this_session.end_date = new Date(now.getFullYear() + 10, now.getMonth(), now.getDay());
                sendSession(this_session);
            }else{
                this_session.start_date = info.start_date;
            }

            normal_session(info['starti']);
        },
        error: function(xhr, errmsg){
            alert("An error happened. Sorry.");
            console.log(errmsg);
        }
    });
};

var sendSession = function(session){
    console.log(session);
    // SEND AND SAVE SESSION THROUGH AJAX
    $.ajax({
        url: "api/addsession/" + INSTANCE_NAME + "/",
        type: 'POST',
        data: {
            'start_date': session.start_date.toISOString(),
            'end_date': session.end_date.toISOString()
        },
        success: function(){

        },
        error: function(xhr, errmsg){
            alert("An error happened. Sorry.");
            console.log(errmsg);
        }
    })
};

var updateSessionEnd = function(){
    this_session.end_date = new Date();
    console.log("MODIFYING!");
    console.log(this_session);
    // SEND AND SAVE SESSION THROUGH AJAX
    $.ajax({
        url: "api/modsession/" + INSTANCE_NAME + "/",
        type: 'POST',
        data: {
            'start_date': this_session.start_date.toISOString(),
            'end_date': this_session.end_date.toISOString()
        },
        success: function(){

        },
        error: function(xhr, errmsg){
            alert("An error happened. Sorry.");
            console.log(errmsg);
        }
    })
};

var sendPresses = function() {
    if (!save_presses) {
        console.log("DON'T SAVE YET");
        return;
    }
    console.log(presses);
    var send_data = {};
    $.each(presses, function(k, v){
        console.log(v['time']);
        console.log(test_start_date);
        send_data[k] = v['time'].getTime() - test_start_date.getTime();
    });
    send_data['config'] = current_config;
    console.log(send_data);
    $.ajax({
        url: "api/sendpresses/" + INSTANCE_NAME + "/",
        type: 'POST',
        data: send_data,
        success: function(){

        },
        error: function(xhr, errmsg){
            alert("An error has occured.");
            console.log(errmsg);
        }
    });
    presses = {};
};

var setup = function(defname){
    console.log(defname);
    getDefinition(defname);
};

var start_experiment = function(definition){
    alert(definition['message1']);
    feedback = definition['feedback'];
    wait_for_answers = definition['wait_for_answers'];
    time = definition['time'];
    session_length = definition['session_length'];
    message2 = definition['message2'];
    message3 = definition['message3'];
    training_session(definition['training_length']);
};

var howmany = 0;


var training_session = function(training_length) {
    howmany = training_length;
    tr_clear_repeat();
};

var normal_session = function(starti){
    howmany = session_length - starti;
    tr_clear_repeat(session_length);
};

var tr_clear_repeat = function(){
    action = false;
    clear_lamps();
    if(howmany > 0) {
        console.log(howmany);
        howmany--;
        setTimeout(function () {
            tr_draw_repeat();
        }, 500);
    }else {
        if (!save_presses) {
            alert(message2);
            save_presses = true;
            console.log(save_presses);
            setTimeout(function(){
                getSessionInfo(INSTANCE_NAME);
            }, 500)
        }else{
            alert(message3);
            end_session();
        }
    }
};

var tr_draw_repeat = function(){
    var config = Math.floor(Math.random() * 1023 + 1);
    current_config = config;
    draw_lamps(config);
    console.log("SETTING NEW DATE!");
    presses = {};
    test_start_date = new Date();
    console.log(test_start_date);
    action = true;
    if(!wait_for_answers){
        setTimeout(function(){
            sendPresses();
            tr_clear_repeat();
        }, time)
    }
};

var finish_up = function(){
    setTimeout(function(){
        sendPresses();
        tr_clear_repeat();
    }, time);
};


var draw_lamps = function(config){
    console.log("DRAWIN!");
    var lamps_div = document.getElementById("lamps");
     lamps_div.innerHTML = '';
     for (var i = 1; i <= 10; ++i) {
        var lit = config % 2;
        config = Math.floor(config / 2);
        var litstring = "lit";
        if (lit == 0) {
          litstring = "unlit"
        }
        var lamp_img = document.createElement("img");
        lamp_img.src = STATIC_URL + "assets/lamp_" + litstring + ".png";
         lamp_img.id = "lamp_img" + (i % 10);

        var new_lamp = document.createElement("div");
        new_lamp.id = "lamp" + (i % 10);
        new_lamp.className = "lamp_" + litstring;
        new_lamp.appendChild(lamp_img);

        var lamp_info = document.createElement("div");
        lamp_info.className = "lamp_info";
        lamp_info.innerHTML = "" + (i % 10);
        new_lamp.appendChild(lamp_info);

        lamps_div.appendChild(new_lamp);
      }
};

var clear_lamps = function() {
     var lamps_div = document.getElementById("lamps");
     lamps_div.innerHTML = '';
     for (var i = 1; i <= 10; ++i) {
        var lamp_img = document.createElement("img");
        lamp_img.src = STATIC_URL + "assets/lamp_unlit.png";
         lamp_img.id = "lamp_img" + (i % 10);

        var new_lamp = document.createElement("div");
        new_lamp.id = "lamp" + (i % 10);
        new_lamp.className = "lamp_unlit";
        new_lamp.appendChild(lamp_img);

        var lamp_info = document.createElement("div");
        lamp_info.className = "lamp_info";
        lamp_info.innerHTML = "" + (i % 10);
        new_lamp.appendChild(lamp_info);

        lamps_div.appendChild(new_lamp);
      }
};


var end_session = function(){
    updateSessionEnd();
    var lamps_div = document.getElementById("lamps");
    lamps_div.innerHTML = "";
    // SPRAWDZIC CZY TO OSTATNIA SESJA, JAK TAK TO WIADOMOSC 4
};

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

var triggerButton = function(pressed_key){
    if(!action){
        return;
    }
    console.log("TRIGGERING A BUTTON!");
    var activated_lamp = document.getElementById("lamp" + pressed_key);
    var activated_lamp_img = document.getElementById("lamp_img" + pressed_key);
    if(activated_lamp.className == "lamp_lit"){
        if(!presses[pressed_key]){
            presses[pressed_key] = {'time': new Date(), 'correct': true};
        }
        activated_lamp.className = "lamp_unlit";
        activated_lamp_img.src = STATIC_URL + "assets/lamp_unlit.png";
    }else if(activated_lamp.className == "lamp_unlit") {
        if(feedback){
            console.log("FEEDBACKFEEDBACKFEEDBACKFEEDBACK");
            audio.play();
        }
        if(!presses[pressed_key]){
            presses[pressed_key] = {'time': new Date(), 'correct': false};
        }

    }


    if(wait_for_answers) {
        for (var i = 1; i <= 10; ++i) {
            var checking = document.getElementById("lamp" + (i % 10));
            if (checking.className == "lamp_lit") {
                return;
            }
        }
        finish_up();
    }


};

setupBindings();