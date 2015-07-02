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
function getTable(table){
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
//			alert(data);
		}
		//$('.scheduler-contents').text(data);

	    }
	});
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
	using getData(table,id), I can query JSON file for all tables except user
	
	

	
*/
function dbParameterFormatter(){
    
}
/*
  Funtion to set data
      I want to be able to set data given JSONIFIED string of user input
 */

function setData(){

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

}


$(document).ready(function() {
//    getTable("Project")
    setData();
})
