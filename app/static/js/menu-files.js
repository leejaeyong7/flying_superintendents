/*	created by Jae Yong Lee
	
	menu-files.js

	handles javascript/jquery events for server menu page on browser-files
	also handles document.ready event
	
		javascript
		functions 		: 	browserHeaderSet(vO) 
								 append browser-file's header based on viewoptions

							parseViewOptions(filename,filetype, vO)
								 parse filetype based on viewOptions 

							parseFileData(filetype, filename, filedate, classname ,vO)
								 parse data based on input file/name/date

							parseViewMode(class1, vO)
								 adds classes based on viewOptions
		
		
		Jquery 
		Scripts 		: 	$('#upload-form').on('submit')
								 handles upload event
*/


//--------------------------------------------------------------------
//--------------------------------------------------------------------
/*
	File Input parsers
*/
//--------------------------------------------------------------------
//--------------------------------------------------------------------

/*
	append browser-file's header based on viewoptions(0,1,2)
*/
function browserHeaderSet(vO){//vO stands for viewOption (static variable)
	var string = '';
	$('#browser-header').empty();
	switch(vO){
		case 0:
		  	string+=	'<div id = "browser-header-filetype" class = "col-md-1 col-sm-4 col-xs-4 viewmode0">Type</div>'
		  	string+=	'<div id = "browser-header-filename" class = "col-md-7 col-sm-4 col-xs-4 viewmode0">Name</div>'
		  	string+=	'<div id = "browser-header-filedate" class = "col-md-4 col-sm-4 col-xs-4 viewmode0">Modified</div>'
			break;

		case 1:
		  	string+=	'<div id = "browser-header-filetype" class = "hidden">Type</div>'
		  	string+=	'<div id = "browser-header-filename" class = "hidden">Name</div>'
		  	string+=	'<div id = "browser-header-filedate" class = "hidden">Modified</div>'
			break;

		case 2:
		  	string+=	'<div id = "browser-header-filetype" class = "hidden">Type</div>'
		  	string+=	'<div id = "browser-header-filename" class = "hidden">Name</div>'
		  	string+=	'<div id = "browser-header-filedate" class = "hidden">Modified</div>'
			break;
	}
	$('#browser-header').append(string);
}


/*
	parse filetype based on viewOptions 
*/
function parseViewOptions(filename,filetype, vO){
	var string = '';
	switch(vO){
		//default mode
		case 0: 
			switch(filetype){
				case 'Image': string +='<i style="color:green" class="glyphicon glyphicon-picture"></i>';
					break;
				case 'File': string +='<i style="color:white" class="glyphicon glyphicon-file viewmode0"></i>';
					break;
				case 'Video': string +='<i style="color:red" class="glyphicon glyphicon-facetime-video viewmode0"></i>';
					break;
				case 'Folder': string +='<i style="color:yellow" class="glyphicon glyphicon-folder-close viewmode0"></i>';
					break;
				default: string +='';
					break;
			};
			break;
		//preview mode(shows image large, images)
		case 1:
			switch(filetype){
				case 'Image': string +='<img src="get-imgs?type='+filename+'" alt="' +filename+'" class= "browser-files-image viewmode1"></img>'
					break;
				case 'File': string +='<i style="color:white" class="glyphicon glyphicon-file viewmode1"></i>';
					break;
				case 'Video': string +='<i style="color:red" class="glyphicon glyphicon-facetime-video viewmode1"></i>';
					break;
				case 'Folder': string +='<i style="color:yellow" class="glyphicon glyphicon-folder-close viewmode1"></i>';
					break;
				default: string +='';
					break;
			}
			break;
		//test mode
		case 2:
			switch(filetype){
				case 'Image': 	string +='<div class="browser-files-image viewmode2">';
								string +='<img src="get-imgs?type='+filename+'" alt="' +filename+'" class= "browser-files-image-image viewmode2"></img>'
								string +='</div>'
					break;
				case 'File': string +='<i style="color:white" class="glyphicon glyphicon-file viewmode2"></i>';
					break;
				case 'Video': string +='<i style="color:red" class="glyphicon glyphicon-facetime-video viewmode2"></i>';
					break;
				case 'Folder': string +='<i style="color:yellow" class="glyphicon glyphicon-folder-close viewmode2"></i>';
					break;
				default: string +='';
					break;
			}
			break;
		default:
			break;
	}
	return string;
}


/*
	parse data based on input file/name/date
	gives how li data structure is made

*/
function parseFileData(filetype, filename, filedate, classname ,vO){
	string = '';
	string +='<li class="browser-files filetype-' + filetype + ' '+classname+'">';
		string +='<div class="browser-files-icon '+classname+'">';
			string += parseViewOptions(filename,filetype,vO);
		string += '</div>'
		string +='<div class="browser-files-file '+classname+'" >'+filename+'</div>';
		string +='<div class="browser-files-time '+classname+'">';
			string += '<div class="browser-files-time-data '+classname+'" >'
		if(classname != 'upload-table-list'){
			string += '<i style="color:white" class="glyphicon glyphicon-calendar"></i> ' + filedate;
		}
		else
			string += filedate;

			string += '</div>'
		string +='</div>'
	string +='</li>';
	return string;
}

/*
	adds classes based on viewOptions
*/
function parseViewMode(class1, vO){
	
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


//--------------------------------------------------------------------
//--------------------------------------------------------------------
/*
	Document actions/ form actions
*/
//--------------------------------------------------------------------
//--------------------------------------------------------------------

/*
	upload button submit
*/
$('#upload-form').on('submit', function(e){
	    e.preventDefault();
	    $('#upload-close').prop('disabled',true);
		$('.upload-table').empty();

	    var file = document.getElementById('file_input').files;
	    $.each(file,function(i,fileid){
	    	upload(i,fileid);
	    });

	    $('#upload-close').prop('disabled',false);
	    document.getElementById('upload-form').reset();

		$('#browser').empty();
		getFileList('browser-files-list',viewOption);
});


/*
	document.ready event
	handles all event that requires to be ran on loading page
*/
$(document).ready(function () {
	/*if(fileAlreadyLoaded()){
		return;
	}*/
	//$('.rcmenu ').hide();
	getFileList('browser-files-list',viewOption);
	//usernameVal();
	progressModalData(0);
	$('ol').on('contextmenu',function(){
		return false;
	});
});
