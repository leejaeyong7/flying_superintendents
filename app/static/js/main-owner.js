
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




/*
<ul class="list-group" id="contact-list">
<li class="list-group-item">
<!--div class="col-xs-12 col-sm-3">
<img src="http://api.randomuser.me/portraits/women/76.jpg" alt="Glenda Patterson" class="img-responsive img-circle" />
</div-->
<div class="col-xs-12 col-sm-12">
<span class="name">Glenda Patterson</span><br/>
<span class="glyphicon glyphicon-map-marker text-muted c-info" data-toggle="tooltip" title="5020 Poplar Dr"></span>
<span class="visible-xs"> <span class="text-muted">5020 Poplar Dr</span><br/></span>
<span class="glyphicon glyphicon-earphone text-muted c-info" data-toggle="tooltip" title="(538) 718-7548"></span>
<span class="visible-xs"> <span class="text-muted">(538) 718-7548</span><br/></span>
<span class="fa fa-comments text-muted c-info" data-toggle="tooltip" title="glenda.patterson@example.com"></span>
<span class="visible-xs"> <span class="text-muted">glenda.patterson@example.com</span><br/></span>

*/

$(document).ready(function(){
    getOrgname();
    getPersonnel();
});
