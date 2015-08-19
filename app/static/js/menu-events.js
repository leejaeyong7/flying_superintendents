/*	created by Jae Yong Lee
	
	menu-events.js
	
	handles input mouse/keyboard events in menu page


		global
		variables		:	var firstIndex;										
								 int : index for first clicked list

							var lastIndex;
								 int : index for last clicked list

							var rightIndex;										
								 int : index for right clicked list

							var mouseOnClickInFilebrowser;									 
								 boolean : true if on clicking

							var mouseOnDragInFilebrowser;						
								 boolean : true if on Mouse is dragging in filesystem menu

							var shiftOnClick;									
								 boolean : true if shift key is pressed

							var ctrlOnClick;									
								 boolean : true if ctrl key is pressed
		javascript
		functions 		: 	filesystem_drawBetweenWith(class, option)
								 highlight based on option
									 option true: 
									 	hightlight all system between first clicked and last clicked index of list
									 	in file system, with leaving all previously highlighted indexes untouched
									 	-- used in ctrl + shift click or drag event

									 option false:
									 	hightlight all system between first clicked and last clicked index of list
									 	in file system, with removing all previously highlighted indexes
									 	-- used in ctrl 

							filesystem_eraseAllClickedExcept(clicked)
								 highlight clicked value and erase the rest

		Jquery 
		Scripts 	: 		$(document).on('dblclick','li.browser-files-list',function(e)..
								 handles doubleclick action by filesystem
								 	if folder, call ajax handler /change-directory 
								 	else if image, open image file using image viewer

							$(document).on('mousedown','li.browser-files-list',function(e)..
								 handles filesystem mouse down event action
								 	if left click, highlight based on :
								 		(ctrl)shift + click 	: call filesystem_drawBetweenWith() 
								 		ctrl  + click 			: call 

							$(document).on('mouseup','li.browser-files-list',function(e)..
								 handles filesystem mouse up event action

							$(document).on('mouseleave','li.browser-files-list',function(e)..
								 handles events for mouse leaving action in filesystem li parameter

							$(document).on('mouseenter','li.browser-files-list',function(e)..
								 handles events for mouse entering action in filesystem li parameter
*/


//--------------------------------------------------------------------
//--------------------------------------------------------------------
//
//				global variables for click actions
//
//--------------------------------------------------------------------
//--------------------------------------------------------------------


var firstIndex;		// index for first clicked list
var lastIndex;		// index for last clicked list
var rightIndex;		// index for right clicked list

var mouseOnClickInFilebrowser;	// true if on click
var mouseOnDragInFilebrowser;	// true if on drag
var mouseleftInFilebrowser;		// true if mouse left li after clicking
var shiftOnClick;	// true if on keydown
var ctrlOnClick;	// true if on keydown


//--------------------------------------------------------------------
//--------------------------------------------------------------------
//
//			 list click action for browser-files-list
//
//--------------------------------------------------------------------
//--------------------------------------------------------------------

/*
	double click for ajax call change directory on folder inputs
	image viewer modal for image inputs
*/
$(document).on('dblclick','li.browser-files-list',function(e){
	e.preventDefault();
	if($(this).hasClass("filetype-Folder")){
		var foldername = $(this).children('.browser-files-file').text();
		var folderString = {newpath: foldername};

		$.ajax({
            type: 'POST',
            url: '/change-directory',
            data: folderString,
            success: function(data) {
				$('#browser').empty();
				getFileList('browser-files-list',viewOption);
            }
        })
	}
	else if($(this).hasClass("filetype-Image")){
		rightIndex = $(this).index();
		$('#imageModal').modal('show');
	}
})
/*

	browser mouse down event
	left click
		shift click, meta click, normal click
	right click
		normal click

*/
$(document).on('mousedown','li.browser-files-list',function(e){
	// if left clicked
	if(e.button==0){
		//prevent default action
		e.preventDefault();

		//set option parameters
		mouseOnClickInFilebrowser = true;
		mouseOnDragInFilebrowser = false;
		mouseleftInFilebrowser = false;


		//if on shift click
		if(e.shiftKey){
			lastIndex = $(this).index();
			filesystem_drawBetweenWith('browser-clicked browser-focused','shift');
		}
		//if on ctrl or command click
		else if(e.metaKey || e.ctrlKey){
			firstIndex = $(this).index();
			if($(this).hasClass('browser-clicked')){
				$(this).removeClass('browser-clicked browser-focused');
			}
			else{
				$(this).addClass('browser-clicked browser-focused');
			}
		}
		//default click action
		else{
			firstIndex = $(this).index();
			$(this).addClass('browser-focused');
			if($(this).hasClass("browser-clicked")){
				mouseOnDragInFilebrowser = true;	
			}
		}
	}



	// if right clicked
	if(e.button==2)
	{
		rightIndex = $(this).index();
		var totalFiles = 0;
		var clicked = $(this).index();

		if(!$(this).hasClass('browser-clicked')){
			$(this).addClass("browser-clicked");
			filesystem_eraseAllClickedExcept(clicked); 
		}

		var $contextMenu;

		$(this).parent().children().each(function(){
			if($(this).hasClass("browser-clicked")){
				totalFiles += 1;
			}
		});

		//erase all except this one

		$('.rcmenu ').hide();
		if(totalFiles == 1){
			if($(this).hasClass("filetype-Folder")){
				$contextMenu = $('#folderMenu');
			}
			else if ($(this).hasClass("filetype-Image")){
				$contextMenu = $('#imageMenu');
			}
			else if ($(this).hasClass("filetype-Video")){
				$contextMenu = $('#videoMenu');
			}
			else if ($(this).hasClass("filetype-File")){
				$contextMenu = $('#fileMenu');
			}
			else{
				$contextMenu = $('#fileMenu');
			}
		}
		else{
			$contextMenu = $('#fileMenu');

		}
		//var top = e.pageY - $(window).scrollTop();
		$contextMenu.css(
		{
			display: "block",
			left: e.pageX+10,
			top: e.pageY,
			position: 'absolute'
		});
	}
	
})


/*
	browser mouse up event
	left click
		shift click, meta click, normal click
	right click
		normal click
*/
$(document).on('mouseup','li.browser-files-list',function(e){
	e.preventDefault();
	//left up
	$('.browser-focused').removeClass('browser-focused');
	if(e.button== 0){
		//if meta or ctrl key is clicked
		if(e.metaKey || e.ctrlKey){
			if(!mouseleftInFilebrowser){
				lastIndex = $(this).index();
			}
		}
		//if shift click up
		else if(e.shiftKey){
			if(!mouseleftInFilebrowser){
				//alert('im here')
				lastIndex = $(this).index();
			}
		}
		//default click 
		else{
			lastIndex = $(this).index();
			if(firstIndex == lastIndex){
				//erase all except this one
				var clicked = $(this).index();
				if ((!mouseleftInFilebrowser) && (!e.metaKey && !e.ctrlKey) && (!e.shiftKey)){
					$(this).toggleClass("browser-clicked");
					filesystem_eraseAllClickedExcept(clicked);
				}
			}
			else if(mouseOnDragInFilebrowser){
				if($(this).hasClass("browser-move-folder")){
					var moveIndex = new FormData();
					$('.browser-clicked').each(function(){
						moveIndex.append('filelist',$(this).children('.browser-files-file').text());
					});
					moveIndex.append('destination',$(this).children('.browser-files-file').text());
					$.ajax({
						type: 'POST',
						url: '/move-files',
						async: false,
						contentType: false,
						cache: false,
						processData: false,
						data: moveIndex
					});
					$('#browser').empty();
					getFileList('browser-files-list',viewOption);
				}
			}
			$('#browser').children().each(function(){
				$(this).removeClass("browser-move-folder")
			});
		}
	}
	//right up
	if(e.button==2){

	}
	
	mouseOnClickInFilebrowser = false;
	mouseOnDragInFilebrowser = false;
})
/*
	browser mouse leave event
	left click
		shift click, meta click, normal click
	right click
		normal click
*/
$(document).on('mouseleave','li.browser-files-list',function(e){
	
	if(mouseOnClickInFilebrowser){
		//alert(mouseleftInFilebrowser)
		//mouseleftInFilebrowser = true;
		$(this).removeClass("browser-move-folder");
	}
	if(mouseOnClickInFilebrowser){
		mouseleftInFilebrowser = true;
	}
})

/*
	browser mouse enter event
	left click
		shift click, meta click, normal click
	right click
		normal click
*/
$(document).on('mouseenter','li.browser-files-list',function(e){
	if(mouseOnClickInFilebrowser){
		//$(this).addClass('browser-focused');
		if(mouseOnDragInFilebrowser){
			if($(this).hasClass("filetype-Folder")){
				$(this).addClass("browser-move-folder");
			}
		}
		else{
			if(e.shiftKey){
				lastIndex = $(this).index();
				filesystem_drawBetweenWith('browser-clicked browser-focused','shift');
			}
			else if(e.metaKey){
				lastIndex = $(this).index();
				if($(this).hasClass('browser-clicked')){
					$(this).removeClass('browser-clicked');
					$(this).removeClass('browser-focused')
				}
				else{
					$(this).addClass('browser-clicked');
					$(this).addClass('browser-focused');
				}
			}
			else{
				lastIndex = $(this).index();
				filesystem_drawBetweenWith('browser-clicked browser-focused','none');
			}
		}
	}
})
//--------------------------------------------------------------------
//--------------------------------------------------------------------
/*
	helper functions for drawings
*/
//--------------------------------------------------------------------
//--------------------------------------------------------------------

/*
	on mousedown, ajax call for move implemented
*/

function filesystem_drawBetweenWith(classname, option){
	$("#browser").children().each(function(){
		if((firstIndex <= $(this).index() && $(this).index() <= lastIndex) || (lastIndex <= $(this).index() && $(this).index() <= firstIndex)){
			switch(option){
				case 'shift'		: $(this).addClass(classname);
					break;
				case 'ctrl'			: //$(this).toggleClass(classname);
					break;
				default 			: $(this).addClass(classname);
					break;
			}
		}
		else{
			switch(option){
				case 'shift'		: $(this).removeClass(classname);
					break;
				case 'ctrl'			: //$(this).toggleClass("browser-clicked");
					break;
				default 			: $(this).removeClass(classname);
					break;
			}
		}
	})
}
function filesystem_eraseAllClickedExcept(clicked){
	$('#browser').children().each(function(index,val){
		if(clicked != index){
			$(this).removeClass("browser-clicked");
		}
	});
}

//--------------------------------------------------------------------
//--------------------------------------------------------------------
/*
	general mouse events on document DOM
*/
//--------------------------------------------------------------------
//--------------------------------------------------------------------


//always hide rightclick menu when clicked
$(document).on('click',function(e){
	$('.rcmenu').hide();
})

// hide rename/newfolder input when clicked
$(document).on('mousedown',function(e){
	//hide rename input if it is displayed
	if($('#rename-text-input').is(':visible')){
		$('#browser').children().eq(rightIndex).children('.browser-files-file').empty();
		$('#browser').children().eq(rightIndex).children('.browser-files-file').text(backupName);
	}	

	//hide newfolder name input if it is displayed
	if($('#newFolder-text-input').is(':visible')){

		$('#browser').empty();
		getFileList('browser-files-list',viewOption);
	}
})

//right left arrow traversal for imagemodal
$(document).on('keydown',function(e){
	if($('#imageModal').is(':visible')){
		var maxIndex = $('#browser').children().length;
		//key = left
		if(e.keyCode == 37)
		{
			do{
				rightIndex += 1;
				if(rightIndex == maxIndex){
					rightIndex = 0;
				}
			}while(!$('#browser').children().eq(rightIndex).hasClass('filetype-Image'))
		}
		//key = right
		else if(e.keyCode == 39)
		{
			do{
				if(rightIndex == 0){
					rightIndex = maxIndex;
				}
				rightIndex -= 1;
			}while(!$('#browser').children().eq(rightIndex).hasClass('filetype-Image'))

		}
		updateImageModal();
	}

})


//--------------------------------------------------------------------
//--------------------------------------------------------------------
/*
	etc events
*/
//--------------------------------------------------------------------
//--------------------------------------------------------------------

	/*

		searchbox event

	*/
	$('#data-search-box').keyup(function () {

		var rex = new RegExp($(this).val(), 'i');
		$('li.browser-files').hide();
		$('li.browser-files').filter(function () {
		    return rex.test($(this).children('.browser-files-file').text());
		}).show();

	});
