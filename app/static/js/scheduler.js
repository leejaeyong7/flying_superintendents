/*	created by Jae Yong Lee
	
	scheduler.js

	handles javascript/jquery events for server menu page on browser-files
	also handles document.ready event
	
		javascript
		functions 		: 	getData(table, id)
								 retreives DB data by querying

		
		
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
             //   alert(data)
                dbParameterFormatter(table,JSON.parse(data));
		    }
	    }
	}); 
}



function getTable(table){
    var retval = {};
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
                $.extend(true,retval,JSON.parse(data));//			alert(data);
                //console.log(retval)
            }
		    //$('.scheduler-contents').text(data);

	    }
	});
    //console.log(retval)
  //  alert(retval);
    return retval;
}

function getData(table, id){
	$.ajax({
		type: 'GET',
		url: '/get-db',
		data: "table="+table+"&id="+id,
		success: function(data){
			if(data == "failure")
			{
				//when querying has no result
				alert("fail!")
			}
			else{
//				alert(data);
			}
		//$('.scheduler-contents').text(data);
	}
	});
}
/*
	okay lets create basic db format inputter..
	first, obtain which data we want to input
	I have to create 'create DB button' for every input tables.

	Hence, I need a if/else on whether the data queryied is table or not
        --fixed with having foreign key reference in columnData

        columnData format:
        {
            "columnName": "type" / "foreignkeyref"
        }

	using getData(table,id), I can query JSON file for all tables except user
	

	
*/
function dbParameterFormatter(table, columnData){
    var inputForm = '';
    inputForm += '<form id ="DBContainer" class ="">'

    for (var key in columnData){
        if(columnData.hasOwnProperty(key)){
            var obj = columnData[key];
            //key = columnName
            //obj = type or foreignkeyref
            switch(obj){
            case "INTEGER":
                if(key == "projectFaxNumber" || key == "projectPhoneNumber" || key == "phoneNumber" )
                {
                    inputForm += integerInputForm(key, true);
                }
                else
                {
                    inputForm += integerInputForm(key, false);
                }
                break;
            case "FLOAT":
                inputForm += floatInputForm(key);
                break;
            case "DATETIME":
                inputForm += dateInputForm(key);
                break;
            default:
                if(obj.substring(0,7)=="VARCHAR"){
                    inputForm += stringInputForm(key,parseInt(obj.replace ( /[^\d.]/g, '' )), key=="emailAddress");
                }
                else{
                    inputForm += foreignKeyInputForm(key,obj);
                }
                break;
            }
        }
    }
    inputForm += '</form>'
    document.getElementById('scheduler-contents').innerHTML = inputForm;
    $('.phoneNumber').mask("(999) 999-9999");
    $('.dateTime').mask("99/99/9999",{placeholder:"mm/dd/yyyy"});
   // console.log(inputForm);
}


function integerInputForm(columnName, isPhone){
    var inputForm  = '';
    inputForm += '<div id = "inputrow" class = "row">'
        inputForm += '<div id = "columnName" class = "col-md-3 col-sm-3 col-xs-3">'
            inputForm += columnName
        inputForm += '</div>'
        inputForm += '<div id = "integerInput">'
    if (isPhone)
    {
        inputForm += '<input type="text" name='+columnName+' class = "phoneNumber">';
    }
    else
    {
        inputForm += '<input type="text" name='+columnName+'>';
    }
    inputForm += "</div>"
    inputForm += "</div>"
    return inputForm
}
function floatInputForm(columnName){
    var inputForm  = '';
    inputForm += '<div id = "inputrow" class = "row">'
        inputForm += '<div id = "columnName" class = "col-md-3 col-sm-3 col-xs-3">'
            inputForm += columnName
        inputForm += '</div>'
        inputForm += '<div id = "floatInput">'
            inputForm += '<input type="text" name='+columnName+' class="floatNumber">';
        inputForm += "</div>"
    inputForm += "</div>"
    return inputForm

}
function dateInputForm(columnName){
    var inputForm  = '';
    inputForm += '<div id = "inputrow" class = "row">'
        inputForm += '<div id = "columnName" class = "col-md-3 col-sm-3 col-xs-3">'
            inputForm += columnName
        inputForm += '</div>'
        inputForm += '<div id = "dateInput">'
            inputForm += '<input type="text" name='+columnName+' class= "dateTime">';
        inputForm += "</div>"
    inputForm += "</div>"
    return inputForm

}
function stringInputForm(columnName, stringLength, isEmail){
    var inputForm  = '';
    inputForm += '<div id = "inputrow" class = "row">'
        inputForm += '<div id = "columnName" class = "col-md-3 col-sm-3 col-xs-3">'
            inputForm += columnName
        inputForm += '</div>'
        inputForm += '<div id = "stringInput">'
    if (isEmail)
    {
        inputForm += '<input type="text" name='+columnName+' class = "emailAddress"  maxlength='+stringLength +'>';
    }
    else
    {
        inputForm += '<input type="text" name='+columnName+' maxlength='+stringLength +'>';
    }
    inputForm += "</div>"
    inputForm += "</div>"
    return inputForm

}
function foreignKeyInputForm(columnName,foreignKeyReference){
    var inputForm  = '';
    inputForm += '<div id = "inputrow" class = "row">'
        inputForm += '<div id = "columnName" class = "col-md-3 col-sm-3 col-xs-3">'
            inputForm += columnName
        inputForm += '</div>'
    
    var foreignTableName = foreignKeyReference.substr(0,foreignKeyReference.indexOf('.'));
    foreignTableName = foreignTableName.charAt(0).toUpperCase() + foreignTableName.slice(1);
        inputForm += '<div id = "foreignKeyInput" class='+columnName+ '-'+foreignTableName+'>';


    //addy.substr(0, addy.indexOf(',')); 
        inputForm += "</div>"
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
                foreignTableDropDown += '<select id="foreignTableDropDown" class = foreignDD-'+foreignTableName+'>'
                if(Object.keys(foreignTable).length != 0){
                    for (var rows in foreignTable)
                    {
                        if(foreignTable.hasOwnProperty(rows))
                        {
                            var rowData = foreignTable[rows]
                            foreignTableDropDown += '<option value=0>None </option>'

                            for(var rowID in rowData)
                            {
                                //console.log(rowID)
                                //console.log(rowData[rowID])
                                foreignTableDropDown += '<option value='+rowID+'>';
                                if(rowData.hasOwnProperty(rowID))
                                {
                                    var row = rowData[rowID]
                                    for(var col in row )
                                    {
                                        console.log(col)
                                        //console.log(row[col])
                                        if(col=="name" || col=="description" || col=="ppc")
                                        {
                                            foreignTableDropDown+= col + ' : '+ row[col]
                                        //                                    foreignTableDropDown +=
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
/*
  Funtion to set data
      I want to be able to set data given JSONIFIED string of user input
 */

function setData(){

}

/* contents */

//initialize AlloyUI and load the Scheduler module.

YUI().use(
  'aui-scheduler',
  function(Y) {
    var events = [
      {
        content: 'AllDay',
        endDate: new Date(2015, 1, 5, 23, 59),
        startDate: new Date(2015, 1, 5, 0)
      },
      {
        color: '#8D8',
        content: 'Colorful',
        endDate: new Date(2015, 1, 6, 6),
        startDate: new Date(2015, 1, 6, 2)
      },
      {
        content: 'MultipleDays',
        endDate: new Date(2015, 1, 8),
        startDate: new Date(2015, 1, 4)
      },
      {
        content: 'Disabled',
        disabled: true,
        endDate: new Date(2015, 1, 8, 5),
        startDate: new Date(2015, 1, 8, 1)
      },
      {
        content: 'Meeting',
        endDate: new Date(2015, 1, 7, 7),
        meeting: true,
        startDate: new Date(2015, 1, 7, 3)
      },
      {
        color: '#88D',
        content: 'Overlap',
        endDate: new Date(2015, 1, 5, 4),
        startDate: new Date(2015, 1, 5, 1)
      },
      {
        content: 'Reminder',
        endDate: new Date(2015, 1, 4, 4),
        reminder: true,
        startDate: new Date(2015, 1, 4, 0)
      }
    ];

    var agendaView = new Y.SchedulerAgendaView();
    var dayView = new Y.SchedulerDayView();
    var eventRecorder = new Y.SchedulerEventRecorder();
    var monthView = new Y.SchedulerMonthView();
    var weekView = new Y.SchedulerWeekView();

    new Y.Scheduler(
      {
        activeView: weekView,
        boundingBox: '#myScheduler',
        date: new Date(2015, 1, 4),
        eventRecorder: eventRecorder,
        items: events,
        render: true,
        views: [dayView, weekView, monthView, agendaView]
      }
    );
  }
);


$(document).ready(function() {
    //    getTable("Project")
    getTableColumns("Task");
    
   // $('.phoneNumber').mask("(999) 999-9999")
//    setData();
})


   /* (self, name, userID, projectAddress, projectFaxNumber, projectPhoneNumber, responsibleIndividual, LinkToProjectInfor)*/
/*
name, requestor, personCommitted, responsibleSubs, startDate, endDate, actualStartDate, duration, taskPredecessor, taskSuccessor, taskConstraints, taskPerformance, taskAnticipated, taskPerformanceVariance,taskRepeated, elements    
*/
// personnel1, personnel2, organization, 
/*    var tests = 
	{
	    1:{
		Firmtype:
		{
		    name:"the firm"
		}
	    },
	    2:{
		Organization:
		{
		    name:"org name",
		    address:"UIUC",
		    phoneNumber:123123123,
		    firmtypeID:1
		}
	    },
	    3:{
		Personnel:
		{
		    name:"jae",
		    phoneNumber:123123123,
		    emailAddress:"hello@gmail.com",
		    role:"UI dev",
		    organizationID:1		
		}
	    },
	    4:{
		Personnel:
		{		    
		    name:"yong",
		    phoneNumber:123123123,
		    emailAddress:"hello2@gmail.com",
		    role:"UI dev",
		    organizationID:1
		}
	    },
	    5:{
		TaskStatus:
		{
		    name:'test taskstatus'
		}
	    },
	    6:{
		Performance:
		{
		    ppc:10.0,
		    taskMadeReady:1.00,
		    maturityLevel:1.00,
		    variance:1.00,
		    status:1
		}
	    },
	   7:{
		PerformanceVariance:
		{
		    name:'test PerformanceVariance'
		}
	    },
	    8:{
		Promise:
		{
		    name:"nameOpromise"
		}
	    },
	    9:{
		Constraints:
		{
		    relatedID:2,
		    description:"descrb",
		    responsibleIndividual:1,
		    initiateDate:Date.UTC(2013,10,04),
		    promiseDate:Date.UTC(2013,10,08),
		    completeDate:Date.UTC(2014,01,3),
		    revisePromiseCompletion:1,
		    constraintVariance:1,
		}
	    },
	    10:{
		Objects:
		{
		    name:"objname"
		}
	    },
	    11:{
		Task:
		{
		    name:'times test',
		    requestor:1,//personnel,
		    personCommitted:2,//personnel
		    responsibleSubs:1,//organization
		    startDate:Date.UTC(2012,10,04),
		    endDate:Date.UTC(2012,11,3),
		    actualStartDate:Date.UTC(2012,10,8),
		    duration:200,
		    taskPredecessor:null,//task
		    taskSuccessor:null,//task
		    taskConstraints:1,//task
		    taskPerformance:1,//constraints
		    taskAnticipated:123,//performance
		    taskPerformanceVariance:1,//performancevariance
		    taskRepeated:3,
		    elements:1//objects
		}
	    }
	}

    
    for(var test in tests){
	var obj = JSON.stringify(tests[test]);	
	//alert(obj)
	var tableInputForm = new FormData();
	tableInputForm.append("jsonDBData",obj);
	$.ajax({
	    type: 'POST',
	    url: '/set-db',
	    data: tableInputForm,  //JSON of inputs
	    contentType: false,	    
	    cache: false,	    
	    processData: false,	  
	    success: function(data){
	    
	    
	    }
	
	});
    }
*/
