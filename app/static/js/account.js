
$('#password-form').on('submit',function(e){
    var passwordData = new FormData();
    passwordData.append('oldPassword',document.getElementById('oldPassword').value);
    passwordData.append('password',document.getElementById('password').value);
    $.ajax({
        type: 'POST',
        url: '/change-password',
        data: passwordData,
        contentType: false,
        cache: false,
        processData: false,
        success: function(e){
            alert(e);
        }
    });
    document.getElementById('password-form').reset();
});


$(document).ready(function(){
    $.ajax({
        type: 'GET',
        url: '/username',
        success: function(data) {
            $('.modal-title').append(data);  
        }
    });
});
