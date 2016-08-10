function loginRequest() {
    var data = {
        user_name: $('#username').val(),
        password: $('#password').val()
    };
    
    $.post('/login', data, function(data) {
        if (data === 'ok') {
        location.href = "todo";
        }

        if(data == 'password_does_not_match') {
            $('#username').val('');
            $('#password').val('');
            alert('password does not match to username');
        }

    });
}
    
function registrationRequest() {
    var data = {
        user_name: $('#username').val(),
        password: $('#password').val()
    };
    
    $.post('/registration', data, function(data) {
        switch(data) {

            case 'login_already_exist': 
                $('#username').val('');
                $('#password').val('');
                alert('This username is already exist!');
                break;

            case 'ok':
                alert('Thank you for registration, now you can to login!')
                break;       
        }
    });
}