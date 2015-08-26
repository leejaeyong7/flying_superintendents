/*===============================================================================
 * @author: Jae Yong Lee
 * @file: menu-files.js
 *  
 * @summary:
 *      browser file list HTML parser functions
 *
 *
 *===============================================================================*/


//===============================================================================//
//===============================================================================//
//
//                            Global Variables
//
//===============================================================================//
//===============================================================================//

var viewOption = 0; //view option variable

//===============================================================================//
//===============================================================================//
//
//                            File Input Parsers
//
//===============================================================================//
//===============================================================================//

/**
 *  browser file list header parser on viewoptions (0,1,2)
 *  @params: {Integer} vO = viewOption value 
 *    vO == 0 : default(list) mode
 *    vO == 1 : 3 in a row mode
 *    vO == 2 : 6 in a row mode
 *  @return: none
 */
function browserHeaderSet(vO){//vO stands for viewOption (static variable)
    var string = '';
    $('#browser-header').empty();
    switch(vO){
        //for vO == 0, show table header-like form
    case 0:
        string+=	'<div id = "browser-header-filetype" class = "col-md-1 col-sm-4 col-xs-4 viewmode0">Type</div>';
        string+=	'<div id = "browser-header-filename" class = "col-md-7 col-sm-4 col-xs-4 viewmode0">Name</div>';
        string+=	'<div id = "browser-header-filedate" class = "col-md-4 col-sm-4 col-xs-4 viewmode0">Modified</div>';
        break;
        //else hide header
    case 1:
        string+=	'<div id = "browser-header-filetype" class = "hidden">Type</div>';
        string+=	'<div id = "browser-header-filename" class = "hidden">Name</div>';
        string+=	'<div id = "browser-header-filedate" class = "hidden">Modified</div>';
        break;
        
    case 2:
        string+=	'<div id = "browser-header-filetype" class = "hidden">Type</div>';
        string+=	'<div id = "browser-header-filename" class = "hidden">Name</div>';
        string+=	'<div id = "browser-header-filedate" class = "hidden">Modified</div>';
        break;
    }
    $('#browser-header').append(string);
}


/**
 *  parse icon given filetype and viewoption
 *  @params: {String} filename = name of file/folder
 *           {String} filetype = type of file/folder
 *           {Integer} vO = viewoption
 *  @return: {String} string = HTML form data for icon in list
 */
function parseIcon(filename,filetype, vO){
    var string = '';
    switch(filetype){
    case 'Image':
        switch(vO){
        case 0:
            string +='<i style="color:green" class="glyphicon glyphicon-picture"></i>';
            break;
        case 1:
            string +='<img src="get-imgs?type='+filename+'" alt="' +filename+'" class= "browser-files-image viewmode1">';
            string +='</img>';
            break;
        case 2:
            string +='<div class="browser-files-image viewmode2">';
            string +='<img src="get-imgs?type='+filename+'" alt="' +filename+'" class= "browser-files-image-image viewmode2">';
            string +='</img>';
            string +='</div>';
            break;
        }
        break;
    case 'File': string +='<i style="color:white" class="glyphicon glyphicon-file viewmode'+vO+'"></i>';
        break;
    case 'Video': string +='<i style="color:red" class="glyphicon glyphicon-facetime-video viewmode'+vO+'"></i>';
        break;
    case 'Folder': string +='<i style="color:yellow" class="glyphicon glyphicon-folder-close viewmode'+vO+'"></i>';
        break;
    default: string +='';
        break;
    }
    return string;
}


/**
 *  given parameters for file data, creates a HTML form for li element for each entry
 *  @params: {String} filetype = type of file
 *           {String} filename = name of file
 *           {String} filedate = date of file in string
 *           {String} classname = class name of browser list
 *           {Integer} vO = viewoption parameter
 *  @return: {String} string = string value of HTML li form structure
 */
function parseFileData(filetype, filename, filedate, classname ,vO){
    string = '';
    string +='<li class="browser-files filetype-' + filetype + ' '+classname+'">';
    string +='<div class="browser-files-icon '+classname+'">';
    string += parseIcon(filename,filetype,vO);
    string += '</div>';
    string +='<div class="browser-files-file '+classname+'" >'+filename+'</div>';
    string +='<div class="browser-files-time '+classname+'">';
    string +='<div class="browser-files-time-data '+classname+'" >';
    string +='<i style="color:white" class="glyphicon glyphicon-calendar"></i> ' + filedate;
    string +='</div>';
    string +='</div>';
    string +='</li>';
    return string;
}


/**
 *  adds bootstrap column / input class for given viewmode
 *  @params: {String} class1 = class name to add
 *           {Integer} vO = viewOption parameter
 *  @return: none
 */
function browserAddClassUponViewOption(class1, vO){
    
    switch(vO){
    case 0:	
        /*
          viewmode0 is file viewer
          #put button for search button in small window
        */
        $('.browser-files' +class1).addClass('viewmode0 row');
        $('.browser-files-icon' + class1).addClass('viewmode0 col-md-1 col-sm-4 col-xs-4');
        $('.browser-files-file' + class1).addClass('viewmode0 col-md-7 col-sm-4 col-xs-4');
        $('.browser-files-time' + class1).addClass('viewmode0 col-md-4 col-sm-4 col-xs-4');
        break;
    case 1:	
        $('.browser-files' + class1).addClass('viewmode1 col-md-4 col-sm-4 col-xs-4');
        $('.browser-files-icon' + class1).addClass('viewmode1 col-md-12 col-sm-12 col-xs-12');
        $('.browser-files-file' + class1).addClass('viewmode1 col-md-12 col-sm-12 col-xs-12');
        $('.browser-files-time' + class1).addClass('viewmode1 hidden');
        break;
    case 2:	
        $('.browser-files' + class1).addClass('viewmode2 col-md-2 col-sm-2 col-xs-2');
        $('.browser-files-icon' + class1).addClass('viewmode2 col-md-12 col-sm-12 col-xs-12');
        $('.browser-files-file'+ class1).addClass('viewmode2 col-md-12 col-sm-12 col-xs-12');
        $('.browser-files-time' + class1).addClass('viewmode2 hidden');
        break;
    default : 
        break;
    }
}

/**
 *  retrives file list in JSON form and append parsed HTML form in HTML
 *  @params: {String} classname = name of browser class
 *           {Integer} vO = viewOption parameter
 *  @return: none
 */
function getFileList(classname, vO){
    $.ajax({
        type: 'GET',
        url: '/get-files',
        beforeSend: function(e){
            /*
              function called before send
            */
            $('#browser').empty();
	        browserList = '';
	        browserHeaderSet(vO);
        },
        success: function(data){
            /*
              function called after success
            */
            var rawJSON = JSON.parse(data);
            var json = rawJSON.sort(predicatsBy(["filetype", "filename"]));
            for(var entry in json){
                browserList += parseFileData(json[entry].filetype,json[entry].filename,json[entry].filedate,classname,vO);
            }
		    if(browserList === '')
		    {
			    browserList = parseFileData('','nofiles','',classname,vO);
		    }
		    $('#browser').append(browserList);
		    browserAddClassUponViewOption('.'+classname,vO);
        },
        error: function(e){
            /*
              function called on fail
            */
            alert("file-list retrieval failed!");
        },
        contentType: false,
        cache: false,
        processData: false
    });
}

/**
 *  helper function for setting predicat
 *  @params: {[String]} propArray = array of property in string form
 *  @return: {Integer} predicate Value
 */
function predicatsBy(propArray){
    return function(a,b){
        var retval = 0;
        for(var prop in propArray){
            if(a[propArray[prop]]== "File" && b[propArray[prop]]=="Folder"){
                retval = 1;
                break;
            }
            else if(a[propArray[prop]]== "Folder" && b[propArray[prop]]=="File"){
                retval = -1;
                break;
            }

            if(a[propArray[prop]] > b[propArray[prop]])
            {
                retval = 1;
                break;
            }
            else if (a[propArray[prop]] < b[propArray[prop]])
            {
                retval = -1;
                break;
            }
        }
        return retval;
    };
}


//===============================================================================//
//===============================================================================//
//
//                            Helper/Hook functions 
//
//===============================================================================//
//===============================================================================//
/**
 *  disables default right-click menu for 
 *  @params: none
 *  @return: none
 */
$('#browser').on('contextmenu',function(){
        return false;
});


/**
 *  document ready event to load filelist on page visit
 *  @params: none
 *  @return: none
 */

$(document).ready(function () {
    getFileList('browser-files-list',viewOption);
});
