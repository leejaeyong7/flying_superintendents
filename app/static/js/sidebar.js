$(document).on('click', '#main-account', function(e){
  /*$('#contents').empty();
  $('#contents').load('account');
  $('.hamburger').removeClass('is-open');
  $('.hamburger').addClass('is-closed');
  $('.overlay').hide();
  $('#wrapper').toggleClass('toggled');*/
})

$(document).on('click', '#main-viewer', function(e){
  /* $('#contents').empty();
  $('#contents').load('viewer')
  $('.hamburger').removeClass('is-open');
  $('.hamburger').addClass('is-closed');
  $('.overlay').hide();
  $('#wrapper').toggleClass('toggled');*/
})

$(document).on('click', '#main-menu', function(e){
  /*$('#contents').empty();
  $('#contents').load('menu')
  $('.hamburger').removeClass('is-open');
  $('.hamburger').addClass('is-closed');
  $('.overlay').hide();
  $('#wrapper').toggleClass('toggled');
  $('#browser').empty();
  getFileList('browser-files-list',viewOption);*/
})


$(document).ready(function () {
 
 // usernameVal();
  //progressModalData(0);
  /*$(document).on('contextmenu',function(){
    return false;
  });*/

  var trigger = $('.hamburger'),
      overlay = $('.overlay');
    trigger.addClass('is-closed');
    trigger.click(function () {
      hamburger_cross();
    });

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
  
  /*$('[data-toggle="offcanvas"]').click(function () {
        $('#wrapper').toggleClass('toggled');
  }); */ 
});