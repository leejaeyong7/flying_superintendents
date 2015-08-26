
/*===============================================================================
 * @author: Jae Yong Lee
 * @file: sidebar.js
 *  
 * @summary:
 *      Grants sidebar functionality for html
 *
 *===============================================================================*/




$(document).ready(function () {


    /*
      side bar functionality support
     */
    var trigger = $('.hamburger'),
        overlay = $('.overlay');

    trigger.addClass('is-closed');
    trigger.click(function () {
        hamburger_cross();
    });


    /*
      toggles is-open and is-closed when hamburger button is clicked
     */
    function hamburger_cross() {

        if (trigger.hasClass('is-open')) {          
            overlay.hide();
            trigger.removeClass('is-open');
            trigger.addClass('is-closed');
        } 
        else {   
            overlay.show();
            trigger.removeClass('is-closed');
            trigger.addClass('is-open');
        } 
        $('#wrapper').toggleClass('toggled');
    }
});
