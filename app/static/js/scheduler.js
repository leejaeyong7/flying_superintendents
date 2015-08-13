/*	created by Jae Yong Lee
	
	scheduler.js

	handles javascript/jquery events for server menu page on browser-files
	also handles document.ready event
	
		javascript
		functions 		: 	getTableColumns(table,tabletype)
                                 retrieves DB form for table input and sets them accordingly for modal

                            getTableViews(table)
                                 retrieves DB form for table input in tableView modal

                            dbParameterFormatter(table, columnData, tabletype)
                                 
                            
                            function(params)
                                 --explanation

                            function(params)
                                 --explanation

                            function(params)
                                 --explanation

                            function(params)
                                 --explanation
		
		
		Jquery 
		Scripts 		: 	
*/



function getTableColumns(table){
    $.ajax({
	    type: 'GET',	   
	    url: '/get-db-columns',
	    data: "table="+table,
	    success: function(data){
		    if(data == "failure")
		    {

		    }
		    else
            {
                dbParameterFormatter(table,JSON.parse(data));
		    }
	    }
	}); 
}

function getTableViews(table){

    $.ajax({
	    type: 'GET',	   
	    url: '/get-db',    
	    data: "table="+table,
	    success: function(data){
		    if(data == "failure")
		    {
			    //when querying has no result
                //			alert("fail!")
		    }
		    else{
                var tableView = JSON.parse(data)
                var tableRowList = '';
                var currID = 0;
                if ($('#viewTableModal').find('#tableRowList').length > 0)
                {
                    currID =  $('#viewTableModal').find('#tableRowList').val();
                }
                tableRowList += '<select id="tableRowList" class="viewTableRowDD tableViewDD-'+table+'">'
                if(Object.keys(tableView).length != 0){
                    for (var rows in tableView)
                    {
                       // console.log(foreignTable);
                        if(tableView.hasOwnProperty(rows))
                        {
                            var rowData = tableView[rows]
                            tableRowList += '<option value=0>None </option>'

                            for(var rowID in rowData)
                            {
                                
                                if(rowData.hasOwnProperty(rowID))
                                {
                                    var row = rowData[rowID]
                                    //value must be same as ID in foreign table
                                    tableRowList += '<option value='+row['id']+'>';
                                    for(var col in row )
                                    {
                                        //display name/description/ppcvalue or email in dropdown menu
                                        if(col=="name" || col=="description" || col=="ppc" || col=="email")
                                        {
                                            tableRowList+= col + ' : '+ row[col]
                                        }
                                    }
                                }
                                tableRowList += '</option>'
                            }
                        }
                    }
                    tableRowList += '</select>'
                }
                else
                {
                    tableRowList = 'None'
                }    
                document.getElementById('viewtable-contents').innerHTML = tableRowList
                $('#viewTableModal').find('#tableRowList').children('[value='+currID+']').attr('selected','selected')
	        }
        }
	});
    
}


function dbParameterFormatter(table, columnData, tabletype){

    /*
      creating a html template based on inputs to return appropriate dataformat
    */
    
    var inputForm = '';
    inputForm += '<form id ="DBContainer" class ="">'
    for (var key in columnData){
        if(columnData.hasOwnProperty(key)){
            var obj = columnData[key];
            switch(obj){
            case "BIGINT":
            case "INTEGER":
                if(key == "projectFaxNumber" || key == "projectPhoneNumber" || key == "phoneNumber" )
                {
                    inputForm += integerInputForm(key, true, 'insertTable');
                }
                else
                {
                    inputForm += integerInputForm(key, false, 'insertTable');
                }
                break;
            case "FLOAT":
                inputForm += floatInputForm(key, 'insertTable');
                break;
            case "DATETIME":
                inputForm += dateInputForm(key, 'insertTable');
                break;
            default:
                if(obj.substring(0,7)=="VARCHAR"){
                    inputForm += stringInputForm(key,parseInt(obj.replace ( /[^\d.]/g, '' )), key=="emailAddress", 'insertTable');
                }
                else{
                    inputForm += foreignKeyInputForm(key,obj, 'insertTable');
                }
                break;
            }
        }
    }
    inputForm += '</form>'

    // put created html under scheduler contents
    document.getElementById('scheduler-contents').innerHTML = inputForm;

    // bootstrap styling for classes
    $('.columnName').addClass('col-md-4 col-sm-4 col-xs-4');
    $('.inputForm').addClass('col-md-7 col-sm-7 col-xs-7');

    // masking inputs
    $('.phoneNumber').mask("(999) 999-9999");
    $('.dateTime').mask("99/99/9999",{placeholder:"mm/dd/yyyy"});

}

/*



  below are input forms for integer/float/string and datetime



*/
function integerInputForm(columnName, isPhone, tabletype){
    var inputForm  = '';
    inputForm += '<div id = "inputrow" class = "row">'
        inputForm += '<div id = "columnName" class="columnName">'
            inputForm += columnName
        inputForm += '</div>'
        inputForm += '<div id = "integerInput" class="inputForm">'
    if (isPhone)
    {
        inputForm += '<input type="text" name='+columnName+' class = "phoneNumber"></input>';
    }
    else
    {
        inputForm += '<input type="text" name='+columnName+'></input>';
    }
    inputForm += "</div>"
    inputForm += "</div>"
    return inputForm
}
function floatInputForm(columnName, tabletype){
    var inputForm  = '';
    inputForm += '<div id = "inputrow" class = "row">'
        inputForm += '<div id = "columnName" class="columnName">'
            inputForm += columnName
        inputForm += '</div>'
        inputForm += '<div id = "floatInput" class="inputForm">'
            inputForm += '<input type="text" name='+columnName+' class="floatNumber"></input>';
        inputForm += "</div>"
    inputForm += "</div>"
    return inputForm

}
function dateInputForm(columnName, tabletype){
    var inputForm  = '';
    inputForm += '<div id = "inputrow" class = "row">'
        inputForm += '<div id = "columnName" class="columnName">'
            inputForm += columnName
        inputForm += '</div>'
        inputForm += '<div id = "dateInput" class="inputForm">'
            inputForm += '<input type="text" name='+columnName+' class= "dateTime"></input>';
        inputForm += "</div>"
    inputForm += "</div>"
    return inputForm

}
function stringInputForm(columnName, stringLength, isEmail, tabletype){
    var inputForm  = '';
    inputForm += '<div id = "inputrow" class = "row">'
        inputForm += '<div id = "columnName" class="columnName">'
            inputForm += columnName
        inputForm += '</div>'
        inputForm += '<div id = "stringInput" class="inputForm">'
    if (isEmail)
    {
        inputForm += '<input type="text" name='+columnName+' class = "emailAddress"  maxlength='+stringLength +'></input>';
    }
    else
    {
        inputForm += '<input type="text" name='+columnName+' maxlength='+stringLength +'></input>';
    }
    inputForm += "</div>"
    inputForm += "</div>"
    return inputForm

}

/*
  when foreignKey input form is called, it transfers the table with dropdown
*/
function foreignKeyInputForm(columnName,foreignKeyReference, tabletype){
    var inputForm  = '';
    inputForm += '<div id = "inputrow" class = "row">'
        inputForm += '<div id = "columnName" class="columnName">'
            inputForm += columnName
        inputForm += '</div>'
    
    var foreignTableName = foreignKeyReference.substr(0,foreignKeyReference.indexOf('.'));
    foreignTableName = foreignTableName.charAt(0).toUpperCase() + foreignTableName.slice(1);
    if(foreignTableName == "Users"){
        foreignTableName = 'User';
    }
        inputForm += '<div id = "foreignKeyInput" class="inputForm '+columnName+ '-'+foreignTableName+'">';
        inputForm += "</div>"
    
        inputForm +=  '<button type="button" class="btn btn-default btn-xs create-table-button"  onclick="createNewTableModal()">';
            inputForm +=  '<span class="glyphicon glyphicon-plus-sign" aria-hidden="true"></span>'
        inputForm +=  '</button>';

    inputForm += "</div>"
    
    $.ajax({
	    type: 'GET',	   
	    url: '/get-db',    
	    data: "table="+foreignTableName,
	    success: function(data){
		    if(data == "failure")
		    {
			    //when querying has no result
                //			alert("fail!")
		    }
		    else{
                var foreignTable = JSON.parse(data);
                var foreignTableDropDown = '';
                foreignTableDropDown += '<select id="foreignTableDropDown" name="'+ columnName +'"class = foreignDD-'+foreignTableName+'>'
                if(Object.keys(foreignTable).length != 0){
                    for (var rows in foreignTable)
                    {
                       // console.log(foreignTable);
                        if(foreignTable.hasOwnProperty(rows))
                        {
                            var rowData = foreignTable[rows]
                            foreignTableDropDown += '<option value=0>None </option>'

                            for(var rowID in rowData)
                            {
                                
                                if(rowData.hasOwnProperty(rowID))
                                {
                                    var row = rowData[rowID]
                                    //value must be same as ID in foreign table
                                    foreignTableDropDown += '<option value='+row['id']+'>';
                                    for(var col in row )
                                    {
                                        //display name/description/ppcvalue or email in dropdown menu
                                        if(col=="name" || col=="description" || col=="ppc" || col=="email")
                                        {
                                            foreignTableDropDown+= col + ' : '+ row[col]
                                        }
                                    }
                                }
                                foreignTableDropDown += '</option>'
                            }
                        }
                    }
                    foreignTableDropDown += '</select>'
                }
                else
                {
                    foreignTableDropDown = 'None'
                }    
                $('.'+columnName+'-'+foreignTableName).append(foreignTableDropDown)
                //console.log(foreignTableDropDown)
            }
	    }
	});
    return inputForm

}



function tableDropdown(){
    var inputForm  = '';
    //list of table in SQL
    var tables = ["None","Project","Organization","Firmtype","Personnel","Schedule","Task","Constraints","Promise","Performance","PerformanceVariance","TaskStatus","Objects","IFCElement","Location"];
    inputForm += '<select id="table-dropdown" class="dropdown">'
    for(var i = 0; i < tables.length; i++){
        inputForm += '<option value="' + tables[i] + '">' + tables[i] +'</option>';
    }
    inputForm += '</select>';
    $('#createTableTitle').append(inputForm);
    $('#viewTableTitle').append(inputForm);
    
}

$('.table-submit-button').on('click', function(){
    var tableForm ={};
    
    var tableName = $('#createTableModal').find('#table-dropdown').val();
    tableForm[tableName] = {};
    $.each( $('#DBContainer').children().children('.inputForm'), function(i,data){
        
        if($(data).children('input').length){
            if($(data).children('input').hasClass('phoneNumber')){
                tableForm[tableName][ $(data).children('input')[0].name] = parseInt($(data).children('input').val().replace ( /[^\d.]/g, '' ));
            }
            else if($(data).children('input').hasClass('dateTime')){
                tableForm[tableName][ $(data).children('input')[0].name] =  $(data).children('input').val();
            }
            else{
                tableForm[tableName][ $(data).children('input')[0].name] =  $(data).children('input').val();
            }
        }
        else if($(data).children('select').length){
            tableForm[tableName][ $(data).children('select')[0].name] =  parseInt($(data).children('select').val());
        }
    });
    var tableInputForm = new FormData();
    tableInputForm.append('jsonDBData',JSON.stringify(tableForm))
    //console.log(tableInputForm)
    $.ajax({
	    type: 'POST',	   
	    url: '/set-db',
		async: false,
		contentType: false,
		cache: false,
		processData: false,
	    data: tableInputForm,
	    success: function(data){
	        alert(data)
        }
	}); 
})

function loadViewTableValues(){
    var tableName = $('#viewTableModal').find('.dropdown').find('option:selected').text()
    var tableRowValue = document.getElementById('tableRowList').value
    if(tableRowValue != 0)
    {
        $.ajax({
            type: 'GET',
            url: '/get-db-columns',
            data: 'table='+tableName,
            success: function(data){
                //console.log(JSON.parse(data))
                var colData = JSON.parse(data);
                var input = '<hr></hr>';
                for (key in colData){
                    if(colData.hasOwnProperty(key))
                    {
                        //console.log(rowData[key])
                        var obj = colData[key];
                        switch(obj){
                        case "BIGINT":
                        case "INTEGER":
                            if(key == "projectFaxNumber" || key == "projectPhoneNumber" || key == "phoneNumber" )
                            {
                                input += integerInputForm(key, true, 'alterTable');
                            }
                            else
                            {
                                input += integerInputForm(key, false, 'alterTable');
                            }
                            break;
                        case "FLOAT":
                            input += floatInputForm(key, 'alterTable');
                            break;
                        case "DATETIME":
                            input += dateInputForm(key, 'alterTable');
                            break;
                        default:
                            if(obj.substring(0,7)=="VARCHAR"){
                                input += stringInputForm(key,parseInt(obj.replace ( /[^\d.]/g, '' )), key=="emailAddress", 'alterTable');
                            }
                            else{
                                input += foreignKeyInputForm(key,obj, 'alterTable');
                            }
                            break;
                        }
                    }
                }
                
                // put created html under viewtable contents
                document.getElementById('viewtable-db').innerHTML = input;
                $.ajax({
                    type: 'GET',
                    url: '/get-db',
                    data: 'table='+tableName+'&'+'id='+tableRowValue,
                    success: function(data2){
                        var rowData = JSON.parse(data2);
                        for (col in rowData){
                            if(rowData.hasOwnProperty(col))
                            {
                                // console.log(col, rowData[col])
                                // console.log(document.getElementsByName(col));
                                //rowData[col] = document.getElementsByName(col)[0].defaultValue;
                                $('input[name="'+col+'"]').attr('value', rowData[col]);
                                $('select[name="'+col+'"').children().eq(rowData[col]).attr("selected", "selected")
                            }
                        }
                        

                        // bootstrap styling for classes
                        $('.columnName').addClass('col-md-4 col-sm-4 col-xs-4');
                        $('.inputForm').addClass('col-md-7 col-sm-7 col-xs-7');

                        // masking inputs
                        $('.phoneNumber').mask("(999) 999-9999");
                        $('.dateTime').mask("99/99/9999",{placeholder:"mm/dd/yyyy"});

                    }
                    
                })
            }
        })
    }
    else{
        $('#viewtable-db').empty()
    }
}

$(document).on('change', '#tableRowList', function(){
    /* 
       load data values
    */
    loadViewTableValues()
    
})

$(document).on('click', '.close-button' ,function(e){
    $('#scheduler-contents').empty()
    $('#viewtable-contents').empty()
    $('#viewtable-db').empty()
    $('.dropdown').val("None")
})


$('.change-submit-button').on('click', function(){
    var tableForm ={};
    var tableName = $('#viewTableModal').find('#table-dropdown').val();
    var rowID = $('#viewTableModal').find('#tableRowList').val();
    console.log(rowID)
    tableForm[tableName] = {};
    tableForm['id'] = parseInt(rowID);
    $.each( $('#viewtable-db').children().children('.inputForm'), function(i,data){
        
        if($(data).children('input').length){
            if($(data).children('input').hasClass('phoneNumber')){
                tableForm[tableName][ $(data).children('input')[0].name] = parseInt($(data).children('input').val().replace ( /[^\d.]/g, '' ));
            }
            else if($(data).children('input').hasClass('dateTime')){
                tableForm[tableName][ $(data).children('input')[0].name] =  $(data).children('input').val();
            }
            else{
                tableForm[tableName][ $(data).children('input')[0].name] =  $(data).children('input').val();
            }
        }
        else if($(data).children('select').length){
            tableForm[tableName][ $(data).children('select')[0].name] =  parseInt($(data).children('select').val());
        }
    });
    
    var tableInputForm = new FormData();
    tableInputForm.append('jsonDBData',JSON.stringify(tableForm))
    //console.log(tableInputForm)
    $.ajax({
	    type: 'POST',	   
	    url: '/update-db',
		async: false,
		contentType: false,
		cache: false,
		processData: false,
	    data: tableInputForm,
	    success: function(data){
            var tableName = $('#viewTableModal').find('.dropdown').val()
           
            getTableViews(tableName)

	       // loadViewTableValues()
        }
	}); 
})


$(document).ready(function() {
    tableDropdown();
    $('.dropdown').change(function(){
        var tableName = $('option:selected',this).text();
        if($('#createTableModal').hasClass('in')){
            
            if(tableName != 'None'){
                getTableColumns(tableName);
            }
            else{
                $('#DBContainer').empty();
            }
        }
        else if($('#viewTableModal').hasClass('in')){
            $('#viewtable-contents').empty()
            $('#viewtable-db').empty()
            if(tableName != 'None'){
                getTableViews(tableName);
            }
        }
    });
   
   
    
    
    
})


