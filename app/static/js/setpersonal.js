/**
 * Created by Filip on 02.02.2016.
 */

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


var age = -1;
var gender = "-";
var setpersonal = function(){
    var genderfield = document.getElementById("gender");
    if(genderfield.value){
        gender = genderfield.value;
    }
    var agefield = document.getElementById("age");
    if(agefield.value){
        age = agefield.value;
    }
    sendthedata();
};

var dontsetpersonal = function(){
    age = -1;
    gender = "-";
    sendthedata();
};

var sendthedata = function(){
    document.getElementById("plzgivedata").innerHTML = "";
    console.log("SENDING AGE: " + age + ", GENDER: " + gender + " .");
    $.ajax({
        url: "api/setpersonal/" + USERNAME + "/",
        type: 'POST',
        data: {
            'age': age,
            'gender': gender
        },
        success: function(){

        },
        error: function(xhr, errmsg){
            alert("An error happened. Sorry.");
            console.log(errmsg);
        }
    })
};