/*	created by Jae Yong Lee
	
	menu-common.js

	handles common javascript functions for menu.html
	
		javascript
		functions 		: 	updateUploadModal()
								 updates upload modal with allowed extension

							updateImageModal()
								 updates imageviewer with imagefile

							getFileList(classname, vO)
								 receives file list information in JSON format

							upload(i, file)
								 post file data to server with ajax call post

							deleteFiles()
								 call ajax to remove clicked files

							currenttime()
								 get current time

							usernameVal()
								 get username value from server

							renamefile()
								 call ajax function to rename files

							createNewFolder(name)
								 call ajax function to create new folder with name
		
		
		Jquery 
		Scripts 		: 	none
*/


//--------------------------------------------------------------------
//--------------------------------------------------------------------
/*
	Update Data in modals
*/
//--------------------------------------------------------------------
//--------------------------------------------------------------------

	function updateUploadModal(){
		//var allowedExtensions = '';
		$('.allowed-extension').empty();
		$.ajax({
			type: 'GET',
			url: '/allowed-extension',
			success: function(data){
				//alert(data);
				$('.allowed-extension').text(data);
			}
		})

	}


	/*
		updates image modal and its image
	*/
	function updateImageModal(){
		var filename = $('#browser').children().eq(rightIndex).find('.browser-files-file').text();
		//alert(filename);
		var string ='<img src="get-imgs?type='+filename+'" alt="' +filename+'" class= "imageModal-image"></img>';

		$('#imageModal').find('.modal-body').empty();
		$('#imageModal').find('.modal-body').append(string);
	}


//--------------------------------------------------------------------
//--------------------------------------------------------------------
/*
	Browser file list parser in menu-files.js
*/
//--------------------------------------------------------------------
//--------------------------------------------------------------------

var viewOption = 0;
function getFileList(classname, vO){
	browserList = '';
	browserHeaderSet(vO);
	$.getJSON($SCRIPT_ROOT + '/get-files?sort=filename&order=asc', function(json2){
        var json = json2.sort(predicatBy("filetype")).sort(predicatBy("filename"))
		$.each(json, function()
		{
			browserList += parseFileData(this.filetype,this.filename,this.filedate,classname,vO);

		});
		if(browserList == '')
		{
			browserList = parseFileData('','nofiles','',classname,vO);
		}
		$('#browser').append(browserList);
		parseViewMode('.'+classname,vO);
	});
}

function predicatBy(prop){
   return function(a,b){
      if( a[prop] > b[prop]){
          return 1;
      }else if( a[prop] < b[prop] ){
          return -1;
      }
      return 0;
   }
}

//--------------------------------------------------------------------
//--------------------------------------------------------------------
/*
	helper functions
*/
//--------------------------------------------------------------------
//--------------------------------------------------------------------



function deleteFiles(){
	if(confirm('delete all clicked files and folders?')){
		var deleteFiles = new FormData();
	  	var deleteFolders = new FormData();
			
		$('.browser-clicked').each(function(i){
			if($(this).hasClass('filetype-Folder'))
			{
                if($(this).children('.browser-files-file').text() != "..")
                {
				    deleteFolders.append('folder_name',$(this).children('.browser-files-file').text());
                }
			}
			else
			{
				deleteFiles.append('file_name',$(this).children('.browser-files-file').text());
			}
		});
		
		$.ajax({
	        type: 'POST',
	        url: '/delete',
	        data: deleteFiles,
	        contentType: false,
	        cache: false,
	        processData: false,
	        async: false
	    });
	    
	    
	    $.ajax({
	        type: 'POST',
	        url: '/delete-directory',
	        data: deleteFolders,
	        contentType: false,
	        cache: false,
	        processData: false,
	        async: false
	    });
    }
}




function currenttime(){

	$.ajax({
		type: 'GET',
		url: '/current-time',
		success: function(text){
			return text;
		},
		error: function(){
			return '';
		}
	})
}




function usernameVal(){
	var username;
	$.ajax({
		type: 'GET',
		url: '/username',
        contentType: false,
        cache: false,
        processData: false,
        async: false,
		success: function(text){
			username = text;
		},
		error: function(){
		}
	})
	$('.username-input').text(username);
}



function renamefile(){
	//rename file1 to file2
	var filesToChange = new FormData();
	$('.browser-files').each(function(e){
		if($(this).index() == rightIndex){
			filesToChange.append('file-name',backupName)
		}
		else if ($(this).hasClass('browser-clicked')){
			filesToChange.append('file-name',$(this).children('.browser-files-file').text())
		}
	});
	filesToChange.append('rename-id',$('#rename-text-input').val());

	$.ajax({
		type: 'POST',
		url: '/rename',
		data: filesToChange,
        contentType: false,
        cache: false,
        processData: false,
        async: false
	})
}


function createNewFolder(name){
	var newfolderForm = new FormData();
	newfolderForm.append('newfolder_id',name);
	$.ajax({
		type: 'POST',
		url: '/create-directory',
		data: newfolderForm,
        contentType: false,
        cache: false,
        processData: false,
        async: false

	})
}
