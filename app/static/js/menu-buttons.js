
/*===============================================================================
 * @author: Jae Yong Lee
 * @file: menu-button.js
 *  
 * @summary:
 *      handles jquery events for button click/input events
 *      should be loaded after menu-events for rightIndex variable
 *      should be loaded after menu-files for viewOption variable
 *
 *===============================================================================*/



//===============================================================================//
//===============================================================================//
//
//                            global variables
//
//===============================================================================//
//===============================================================================//

var backupname; // backup name for renaming file/folder

//===============================================================================//
//===============================================================================//
//
//                            buttons on header row
//
//===============================================================================//
//===============================================================================//


/**
 *  deletes selected files and reloads page
 *  @params: none
 *  @return: none
 */
$(document).on('click','.delete-button',function(e){
    //prompts user confirmation
	if(confirm('delete all clicked files and folders?')){
		var filesToDelete = new FormData();
	  	var foldersToDelete = new FormData();

        //append all files to delete and folders to delete
		$('.browser-clicked').each(function(i){
			if($(this).hasClass('filetype-Folder'))
			{
                if($(this).children('.browser-files-file').text() != "..")
                {
				    foldersToDelete.append('folder_name',$(this).children('.browser-files-file').text());
                }
			}
			else
			{
				filesToDelete.append('file_name',$(this).children('.browser-files-file').text());
			}
		});


        //call ajax request to delete all files and folders and refresh
		$.ajax({
	        type: 'POST',
	        url: '/delete',
	        data: filesToDelete,
	        contentType: false,
	        cache: false,
	        processData: false,
            success: function(e){                
	            $.ajax({
	                type: 'POST',
	                url: '/delete-directory',
	                data: foldersToDelete,
	                contentType: false,
	                cache: false,
	                processData: false,
                    success: function(e){
                        getFileList('browser-files-list',viewOption);
                    },
                    error: function(e){
                        alert("delete folder failed");
                    }

	            });
            },
            error: function(e){
                alert("delete failed");
            }
	    });//end ajax	  	    
    }//end confirm
});

/**
 *  changes current directory to home
 *  @params: none
 *  @return: none
 */
$(document).on('click','.home-button',function(e){
	$.ajax({
        type: 'POST',
        url: '/home-directory',
        success: function(e){
	        getFileList('browser-files-list',viewOption);            
        }
    });
});

/**
 *  changes current directory one level up
 *  @params: none
 *  @return: none
 */
$(document).on('click','.levelup-button',function(e){
	$.ajax({
        type: 'POST',
        url: '/up-directory',
        success: function(e){
	        getFileList('browser-files-list',viewOption);
        }
    });
});

/**
 *  cycles viewpoint on click
 *  @params: none
 *  @return: none
 */
$(document).on('click','.transform-button',function(e){
	viewOption = viewOption+1;
	if(viewOption == 3)
		viewOption = 0;
	getFileList('browser-files-list',viewOption);
});


/**
 *  create a prompt for user to input foldername 
 *  @params: none
 *  @return: none
 */
$(document).on('click','.newfolder-button',function(e){
    
	var ct = currenttime();
	var newFolderForm = '';
	newFolderForm +='<form id = "newFolder-text col-md-12 col-sm-12 col-xs-12">';
	newFolderForm += 	'<input id="newFolder-text-input" type="text" placeholder="New name for folder...">';
	newFolderForm += 	'</input>';
	newFolderForm += 	'<input id="newFolder-text-submit" type="submit">';
	newFolderForm += 	'</input>';
	newFolderForm += '</form>';
	var newFolderData = parseFileData('Folder', newFolderForm, ct, 'browser-files-list',viewOption);

	$('#browser').append(newFolderData);
	parseViewMode('.browser-files-list',viewOption);
	$('#newFolder-text-input').focus();
});

/**
 *  upload-submit button click event to upload files from inputs in upload-modal
 *  @params: none
 *  @return: none
 */
$('#upload-form').on('submit', function(e){
    //set upload-modal close button disabled for safety
    $('#upload-close').prop('disabled',true);

    //get file list into form
    var file = document.getElementById('file_input').files;
    var fileForm = new FormData({});
    for (var fid in file)
    {
        if(file.hasOwnProperty(fid))
        {
            fileForm.append('fileData', file[fid]);
        }
    }
    //prompt ajax upload with file formdata
    $.ajax({
        url: '/upload',  
        type: 'POST',
        // Custom XMLHttpRequest
        xhr: function() {
            var myXhr = $.ajaxSettings.xhr();
            if(myXhr.upload){ // Check if upload property exists
                myXhr.upload.addEventListener('progress',function(e){
                    // For handling the progress of the upload
                    $('#upload-progress').width( (count / (file.length) * 100)+"%");
                    count++;
                }, false);
            }
            return myXhr;
        },
        //Ajax events
        beforeSend: function(){
            var inputForm = '';
            $('.progress-place').empty();
            count = 0;
            inputForm += '<div class="progress">';
            inputForm += '<div id ="upload-progress" class="progress-bar progress-bar-success progress-sparse" style="width: 0%">';
            inputForm += '</div>';
            inputForm += '</div>';
            $('#uploadModal').find('.progress-place').append(inputForm);
        },
        success: function(data){
            $('#upload-progress').width( "100%");
            $('#upload-close').prop('disabled',false);
	        document.getElementById('upload-form').reset();
	        getFileList('browser-files-list',viewOption);
        },
        error: function(data){
            alert("upload failed");
            $('#upload-close').prop('disabled',false);
            //enable below code if wants to keep file data on error
	        //document.getElementById('upload-form').reset();
	        getFileList('browser-files-list',viewOption);
        },
        // Form data
        data: fileForm,
        cache: false,
        contentType: false,
        processData: false
    });
});

//===============================================================================//
//===============================================================================//
//
//                            Right Click menus
//
//===============================================================================//
//===============================================================================//


/**
 *  create a prompt to user input for new filename and focuses
 *  @params: none
 *  @return: none
 */
$(document).on('click','.rename-button',function(e){

    //save backupname from right-clicked file/folder name and 
	backupName = $('#browser').children().eq(rightIndex).children('.browser-files-file').text();
	$('#browser').children().eq(rightIndex).children('.browser-files-file').text('');
	$('#browser').children().eq(rightIndex).removeClass('browser-clicked');


    //rename form
	var renameForm = '';
	renameForm +='<form id = "rename-text col-md-12 col-sm-12 col-xs-12">';
	renameForm += 	'<input id="rename-text-input" type="text" placeholder="New name for file...">';
	renameForm += 	'</input>';
	renameForm += 	'<input id="rename-text-submit" type="submit">';
	renameForm += 	'</input>';
	renameForm += '</form>';

	$('#browser').children().eq(rightIndex).children('.browser-files-file').append(renameForm);
	$('#rename-text').css({
		display: 'block',
	});

	$('#rename-text-input').focus();
});

/**
 *  converts selected video file to video
 *  @params: none
 *  @return: none
 */
$(document).on('click','.convert-video-button',function(e){

    var fileName = $('#browser').children().eq(rightIndex).children('.browser-files-file').text();
    var source = new EventSource("/stream");

    // redis function message converting into progress percentage
    source.onmessage = function(event){
        $('#convert-process').width(parseInt(parseFloat(event.data)*100)+'%');
        console.log(parseInt(parseFloat(event.data)*100)+'%');
    };

    
    $.ajax({
	    type: 'POST',
	    url: '/convert-video',
        data: fileName,
        beforeSend: function(data){
            $('#convert-process').width('0%');
            $('#convertProgressModal').modal('show');
        },
        error: function(data){
 		    getFileList('browser-files-list',viewOption);
            source.close();
            $('#convertProgressModal').modal('hide');
        },
	    success: function(data){
 		    getFileList('browser-files-list',viewOption);
            source.close();
            $('#convert-process').width('100%');
            $('#convertProgressModal').modal('hide');
	    }
	});

    
});

/**
 *  keydown event handler for rename function. when enter, it will call helper function to rename files
 *  @params: none
 *  @return: none
 */
$(document).on('keydown','#rename-text-input',function(e){
	var rex;
	switch(e.keyCode){
		//when hit enter
	case 13:
		renamefile($(this).val());
		break;
	case 27:
		$('#browser').children().eq(rightIndex).children('.browser-files-file').empty();
		$('#browser').children().eq(rightIndex).children('.browser-files-file').text(backupName);
		break;
	default:
		rex = new RegExp($(this).val(), 'i');
		break;
	}

});

/**
 *  renames all highlighted file given filename
 *  @params: {string} name = filename for new files
 *  @return: none
 */
function renamefile(name){
	//rename file1 to file2
	var filesToChange = new FormData();
	$('.browser-files').each(function(e){
		if($(this).index() == rightIndex){
			filesToChange.append('file-name',backupName);
		}
		else if ($(this).hasClass('browser-clicked')){
			filesToChange.append('file-name',$(this).children('.browser-files-file').text());
		}
	});
	filesToChange.append('rename-id',name);

	$.ajax({
		type: 'POST',
		url: '/rename',
		data: filesToChange,
        contentType: false,
        cache: false,
        processData: false,
        success:function (e){
		    getFileList('browser-files-list',viewOption);
        },
        error: function (e){
            alert("rename failed");
        }
	});
}


/**
 *  keydown event for newfolder text input. When hit enter, it will call helper function to update foldername
 *  @params: 
 *  @return: 
 */
$(document).on('keydown','#newFolder-text-input',function(e){
    var rex;
    switch(e.keyCode){
		//when hit enter
    case 13:
        createNewFolder($(this).val());
        break;
        //when hit esc key
	case 27:
        getFileList('browser-files-list',viewOption);
        break;
        //when regular keystoke
    default:
        rex = new RegExp($(this).val(), 'i');
        break;
    }
});


/**
 *  calls ajax function based on given filename
 *  @params: {string} name = filename for new folder
 *  @return: none
 */
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
        success: function(e) {
            getFileList('browser-files-list',viewOption);
        },
        error: function(e) {
            alert("create new folder failed");
        }
	});
}

//===============================================================================//
//===============================================================================//
//
//                            Visualization Buttons
//
//===============================================================================//
//===============================================================================//


/** TODO
 *  calls visualization scripts on current folder
 *  @params: none
 *  @return: none
 */
$(document).on('click','.visualize-button',function(e){
    
});



/**
 *  triggers sparse reconstruction script given foldername by right click
 *  @params: none
 *  @return: none
 */
$(document).on('click','.sparse-button',function(e){
    //append folder name to form
    var testForm = new FormData();
    testForm.append('folder_id' , $('#browser').children().eq(rightIndex).find('.browser-files-file').text());
    
    //disable close button for safety
    $('.close-button').prop("disabled",true);
    var sparseFinished = false;
    
    $.ajax({
        type: 'POST',
        url: '/run-vsfm',
        data: testForm,
        contentType: false,
        cache: false,
        processData: false,
        error: function(){
            $('.close-button').prop("disabled",false);
            alert("sparse reconstruction error!");
        },
        success: function(data){
            if(data == '100'){
                $('.close-button').prop("disabled",false);
                progressModalData(rightIndex);
                sparseFinished = true;
                getFileList('browser-files-list',viewOption);
            }
            document.getElementById('progress-sparse').style.width = data + '%';
        }
    });
});

/**
 *  triggers dense reconstruction script after sparse reconstruction is done
 *  @params: none
 *  @return: none
 */
$(document).on('click','.dense-button',function(e){
    var sparseFinished = false;
    var testForm = new FormData();
    testForm.append('folder_id' , $('#browser').children().eq(rightIndex).find('.browser-files-file').text());
    
    $.ajax({
        type: 'POST',
        url: '/run-pmvs',
        data: testForm,
        contentType: false,
        cache: false,
        processData: false,
        error: function(){
            //error handling func
            $('.close-button').prop("disabled",false);
            alert("error!");
        },
        success:function(data){
            if(data == '100'){
                $('.close-button').prop("disabled",false);
                progressModalData(rightIndex);
                getFileList('browser-files-list',viewOption);
            }
            document.getElementById('progress-dense').style.width = data + '%';
            
        }
    });
});

/**
 *  triggers potree script after dense reconstruction is done
 *  @params: none
 *  @return: none
 */
$(document).on('click','.process-button',function(e){
    var sparseFinished = false;
    var testForm = new FormData();
    testForm.append('folder_id' , $('#browser').children().eq(rightIndex).find('.browser-files-file').text());
    
    $.ajax({
        type: 'POST',
        url: '/run-potree',
        data: testForm,
        contentType: false,
        cache: false,
        processData: false,
        error: function(){
            //error handling func
            $('.close-button').prop("disabled",false);
            alert("error!");
        },
        success:function(data){
            if(data == '100'){
                $('.close-button').prop("disabled",false);
                progressModalData(rightIndex);
                getFileList('browser-files-list',viewOption);
            }
            document.getElementById('progress-process').style.width = data + '%';
            
        }
    });
});


//===============================================================================//
//===============================================================================//
//
//                            helper functions
//
//===============================================================================//
//===============================================================================//
/**
 *  retrieves current time from server
 *  @params: none
 *  @return: none
 */
function currenttime(){
	$.ajax({
		type: 'GET',
		url: '/current-time',
		success: function(text){
			return text;
		},
		error: function(){
            alert("error retrieving time");
		}
	});
}
