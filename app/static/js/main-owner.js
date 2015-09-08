
/*===============================================================================
 * @author: Jae Yong Lee
 * @file: main-owner.js
 *  
 * @summary:
 *      handles main page functions for owner type account
 *
 *
 *===============================================================================*/



/**
 *  retrieves organization name of the owner
 *  @param: none
 *  @return: none
 */
function getOrgname(){
    $.ajax({
        type: 'GET',
        url: '/organization-name',
        success:  function(e){
            /*
              retrieve owner's company name and put it on header
            */
            $('#organization-name').text(e);
        },
        error:  function(e){
            /*
              function called on fail
            */
            alert("organization name retrieval failed...");
        },
        contentType: false,
        cache: false,
        processData: false
    });
}


/**
 *  retrieves list of personnel in organization
 *  @param: none
 *  @return: none
 */
function getPersonnel(){
    
    $.ajax({
        type: 'GET',
        url: '/personnel-list',
        success:  function(e){
            /*
              function called after success
            */
            var personnel_list = $.parseJSON(e);
            var personnelHTML = '';
            for( var personnel in personnel_list)
            {
                console.log(personnelStringObject(personnel_list[personnel]));
                
                personnelHTML += (personnelStringObject(personnel_list[personnel]));
            }
            $('#contact-list').html(personnelHTML);
        },
        error:  function(e){
            /*
              function called on fail
            */
            alert("personnel retrieval failed...");
        },
        contentType: false,
        cache: false,
        processData: false
    });
}


/**
 *  creates html element of personnel
 *  @param: {object} personnel = json object of personnel
 *  @return: string of html element from personnel
 */
function personnelStringObject(personnel){

    var str = '';
    str += '<li class="list-group-item">';
    str += '<div class="col-xs-12 col-sm-12">';
    str += '<span class="name col-xs-12">' +personnel.firstname + " " + personnel.lastname+ '</span>';
    str += '<span class="address col-xs-6">' + personnel.address1 + ' ' + personnel.address2 + '</span>';
    str += '<span class="email col-xs-6">' +personnel.email + '</span>';
    str += '</div>';
    str += '<div class="clearfix"></div>';
    str += '</li>';
    return str;
}

/**
 *  regex checker for email input
 *  @param: {string} email = email address to be tested
 *  @return: {bool} if correct true, else false
 */
function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}


$('#personnelModal').find('#personnel-email').keyup(function(e){
    var userEmail = $('#personnelModal').find('#personnel-email').val();
    if(validateEmail(userEmail))
    {
        var formData = new FormData();
        formData.append("email",userEmail);

        $.ajax({
            type: 'POST',
            url: '/check-personnel-email',
            success:  function(e){
                /*
                  function called after success
                */
                if(e=='none')
                {
                    $('#signup-email').tooltip("destroy");
                    $.ajax({
                        type: 'POST',
                        url: '/check-user-email',
                        success:  function(e){
                            /*
                              function called after success
                            */
                            if(["none","exists","owner"].indexOf(e) == -1 )
                            {
                                var userData = JSON.parse(e);
                                $('#personnelModal').find('#personnel-firstname').val(userData.firstname);
                                $('#personnelModal').find('#personnel-middlename').val(userData.middlename);
                                $('#personnelModal').find('#personnel-lastname').val(userData.lastname);
                            }
                            else
                            {
                                $('#personnelModal').find('#personnel-firstname').val('');
                                $('#personnelModal').find('#personnel-middlename').val('');
                                $('#personnelModal').find('#personnel-lastname').val('');
                            }
                        },
                        error:  function(e){
                            /*
                              function called on fail
                            */
                            console.log(e);
                        },
                        data: formData,
                        contentType: false,
                        cache: false,
                        processData: false
                    });
                }
                else{
                    $('#personnel-email').tooltip({title:"email already exists!", placement: "top", trigger:"manual"}).tooltip('show');   
                }
            },
            error:  function(e){
                /*
                  function called on fail
                */
            },
            data: formData,
            contentType: false,
            cache: false,
            processData: false
        });
    }
});



$('#personnelModal').find('.close-button').on('click', function(e){
    var userEmail = $('#personnelModal').find('#personnel-email').val();
    var formData = new FormData();
    formData.append("email",userEmail);
    $.ajax({
        type: 'POST',
        url: '/check-user-email',
        success:  function(e){
            /*
              function called after success
            */
            console.log(e);
        },
        error:  function(e){
            /*
              function called on fail
            */
            console.log(e);
        },
        data: formData,
        contentType: false,
        cache: false,
        processData: false
    });
});

$(document).ready(function(){
    getOrgname();
    getPersonnel();
});
