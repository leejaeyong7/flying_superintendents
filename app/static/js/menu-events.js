
/*===============================================================================
 * @author: Jae Yong Lee
 * @file: menu-events.js
 *  
 * @summary:
 *      mouse/keyboard event handling functions for browser-file list
 *      requires menu-files.js loaded beforehand for viewOption global variable
 *
 *===============================================================================*/


//===============================================================================//
//===============================================================================//
//
//                            Global Variables
//
//===============================================================================//
//===============================================================================//

var firstIndex;		// index for first clicked list
var lastIndex;		// index for last clicked list
var rightIndex;		// index for right clicked list

var mouseOnClickInFilebrowser;	// true if on click
var mouseOnDragInFilebrowser;	// true if on drag
var mouseleftInFilebrowser;		// true if mouse left li after clicking
var shiftOnClick;	// true if on keydown
var ctrlOnClick;	// true if on keydown


//===============================================================================//
//===============================================================================//
//
//                            Click actions
//
//===============================================================================//
//===============================================================================//
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
        });
    }
    else if($(this).hasClass("filetype-Image")){
        rightIndex = $(this).index();
        $('#imageModal').modal('show');
    }
});
/*
  
  browser mouse down event
  left click
  shift click, meta click, normal click
  right click
  normal click
  
*/
$(document).on('mousedown','li.browser-files-list',function(e){
    // if left clicked
    if(e.button === 0){
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
    
});


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
    if(e.button === 0){
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
                $(this).removeClass("browser-move-folder");
            });
        }
    }
    //right up
    if(e.button==2){
        
    }
    
    mouseOnClickInFilebrowser = false;
    mouseOnDragInFilebrowser = false;
});
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
});

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
                    $(this).removeClass('browser-focused');
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
});

//===============================================================================//
//===============================================================================//
//
//                            Click-Drawing functions
//
//===============================================================================//
//===============================================================================//

function filesystem_drawBetweenWith(classname, option){
    $("#browser").children().each(function(){
        if((firstIndex <= $(this).index() && $(this).index() <= lastIndex) ||
           (lastIndex <= $(this).index() && $(this).index() <= firstIndex)){
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
    });
}

function filesystem_eraseAllClickedExcept(clicked){
    $('#browser').children().each(function(index,val){
        if(clicked != index){
            $(this).removeClass("browser-clicked");
        }
    });
}


//===============================================================================//
//===============================================================================//
//
//                            General mouse events
//
//===============================================================================//
//===============================================================================//

/**
 *  hide right click menu when clicked elsewhere
 *  @params: none
 *  @return: none
 */
$(document).on('click',function(e){
    $('.rcmenu').hide();
});

/**
 *  hide rename/newfolder input when clicked elsewhere
 *  @params: none
 *  @return: none
 */
// hide rename/newfolder input when clicked
$(document).on('mousedown',function(e){
    //hide rename input if it is displayed
    if($('#rename-text-input').is(':visible')){
        $('#browser').children().eq(rightIndex).children('.browser-files-file').empty();
        $('#browser').children().eq(rightIndex).children('.browser-files-file').text(backupName);
    }	
    
    //hide newfolder name input if it is displayed
    if($('#newFolder-text-input').is(':visible')){
        getFileList('browser-files-list',viewOption);
    }
});




//===============================================================================//
//===============================================================================//
//
//                            Keyboard Events
//
//===============================================================================//
//===============================================================================//

/**
 *  search box keyboard event
 *  @params: none
 *  @return: none
 */
$('#data-search-box').keyup(function () {
    
    var rex = new RegExp($(this).val(), 'i');
    $('li.browser-files').hide();
    $('li.browser-files').filter(function () {
        return rex.test($(this).children('.browser-files-file').text());
    }).show();
 });

/**
 *  image modal keyboard event
 *  @params: none
 *  @return: none
 */
$(document).on('keydown',function(e){
    if($('#imageModal').is(':visible')){
        var maxIndex = $('#browser').children().length;
        //key = left
        if(e.keyCode == 39)
        {
            do{
                rightIndex += 1;
                if(rightIndex == maxIndex){
                    rightIndex = 0;
                }
            }while(!$('#browser').children().eq(rightIndex).hasClass('filetype-Image'));
        }
        //key = right
        else if(e.keyCode == 37)
        {
            do{
                if(rightIndex === 0){
                    rightIndex = maxIndex;
                }
                rightIndex -= 1;
            }while(!$('#browser').children().eq(rightIndex).hasClass('filetype-Image'));
            
        }
        updateImageModal();
    }
});
