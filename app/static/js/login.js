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
    //not yet implemented yet
    if($('#signup-email').length)
        return true;
}



/**
 *  check whether password is valid or not
 *  @param: none
 *  @return: {bool} if correct true, else false
 */
function checkPassword(){
    return $("#default-password").val() == $("#confirm-password").val();
}



/**
 *  checks confirm-password is same value with original password and prompts signup button to be true
 *  @param: none
 *  @return: none
 */
$('#confirm-password').keyup(function(e){
    if(!e.enterKey){
        if($('#default-password').length && checkEmail()){
            if(checkPassword()){
                $('#signup-button').prop('disabled',false);
            }
            else{
                $('#signup-button').prop('disabled',true);
            }
        }
    }
});

$(document).ready(function(){
    $('#signup-button').prop('disabled',true);
});
