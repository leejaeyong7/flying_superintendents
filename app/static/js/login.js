/*===============================================================================
 * @author: Jae Yong Lee
 * @file: login.js
 *  
 * @summary:
 *      handles login scripts and password checks
 *
 *
 *===============================================================================*/

/*
  TODO
  1. checkemail function
  2. signup-console

*/

/**
 *  checks whether email address is valid
 *  @param: none
 *  @return: {bool} if correct true, else false
 */
function checkEmail(){
    if($('#signup-email').val().length > 0)
        return validateEmail($('#signup-email').val());
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


/**
 *  check whether password is valid or not
 *  @param: none
 *  @return: {bool} if correct true, else false
 */
function checkPassword(){
    if($('#default-password').val().length > 0)
        return $("#default-password").val() == $("#confirm-password").val();
    else
        return false;
}

function checkNames(){
    return  ($('#signup-firstname').val().length > 0) &&  ($('#signup-lastname').val().length > 0);
}


/**
 *  checks confirm-password is same value with original password and prompts signup button to be true
 *  @param: none
 *  @return: none
 */
$('#signup-form').keyup(function(e){
    if(!e.enterKey){
        if(checkEmail() && checkNames() && checkPassword()){
            $('#signup-button').prop('disabled',false);
        }
        else{
            $('#signup-button').prop('disabled',true);
        }
    }
});

$(document).ready(function(){
    $('#signup-button').prop('disabled',true);
});
