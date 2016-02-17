//this contains error logging functions and other miscellaneous functions.

var BECS = new Object;

//BE internal PIC data
/*
BECS.AppendData(oThumbs,oGPS,namespace)
BECS.RemoveData(oThumbs)
BECS.UpdateData(oThumbs,oGPS,namespace)  //this simply uses RemoveDate() ==> AppendData()
*/

//File objects
BECS.sFile = function(s_fFile){ //outputs string - file Portion Only
	//s_fFile = string or file object
  //oLog.sMe = "BECS.sFile()"

		return decodeURI(File(File(s_fFile)).name)
}
BECS.sPath = function(s_fPath){//outputs string - Path Portion Only
	//s_fPath = string or file object
	return File(File(File(s_fPath)).path).fsName + "\\"
}

BECS.sPathFile = function(s_fPathFile){//outputs string - Path and file
	//s_fPathFile = string or file object
	return File(File(s_fPathFile)).fsName
}

//log objects
/*BECS.sMe = function(oFunction){ 
//it seems as this has problems being called as a fucntion  
  //use this to get the function name of the function currently being executed
	var sMe = oFunction.callee.toString();
	sMe = sMe.substr('function '.length); 
	sMe = sMe.substr(0,sMe.indexOf("("))
	sMe = BECS.sTrim(sMe)
	return sMe
	}
*/
BECS.InitializeLogging = function(oLog,sMe){//oLog object, sMe = current function
  //folder to hold our variables / logging of variables

  oLog.oData = {}; //used for reformatting the logfile later
  oLog.oDataP = {};
  dataFolder = Folder('/c/FTP_Stuff/Aaron Koller/Scripts/Adobe/')
  if(!dataFolder.exists) dataFolder.create()   

  //error logging intialization
  BECS.CleanLogObject()
  oLog.StartTime = new Date().getTime() //for elapsed time
  oLog.sLogFileDate = dateFormat("yyyy'.'mm'.'dd_H'.'MM'.'ss")
  oLog.sScriptName = sScriptName
  if(!(sMe ==undefined)) oLog.sMe = sMe
  oLog.file = oLog.fileCreate(oLog.LogPath,sMe)
  oLog.nFiles = 0
  oLog.oDataP.nCounter = 0
  //add photoshop or bridge detection here
  //the working path is used for the header in the log file to show where work was being done
  
  
  //if(app.name == "bridge"){oLog.fWorkingPath = Folder(app.document.presentationPath)}
  //if(app.name == "Adobe Photoshop" && app.documents.length > 0){oLog.fWorkingPath = Folder(app.activeDocument.path )}
  if(oLog.fWorkingPath == undefined) oLog.fWorkingPath = ""

  if (!oLog.file.parent.exists) oLog.file.parent.create() //create the 'Error_Log' folder if it does not exist	   
}



BECS.WriteLog = function (oLog, nLevel, sFunction, sMessage, bAlrt, s_fFile) { /*//write a message to the log (oLog = text file should be declared globally, text string

///////////////////////////////////////
REQUIRES 
BECS.InitializeLogging(oLog,sMe);
to be called at least once before you can start logging errors with this function

MOST BASIC USAGE
var oLog = new logObject()
var sMe = BECS.sMe(arguments)
BECS.InitializeLogging(oLog,sMe);
BECS.WriteLog(oLog, 3, sMe, sMsg, true, sFile)
///////////////////////////////////////

TO DO: 
1. Make special case alert for final message with no errors
2. Scan s_fFile for array to output more than one file
3. make columns wider?

oLog = LogObject()
nLevel = (set the severity of the level)
	0 = no error - only informational
	1 = low logLevel (BIG error - do not halt script)
	2 = (small error - but the script must stop)
	3 = critical error exit script (BIG error must stop script)
sFunction = BECS.sMe(arguments)  (use this function to return the function currently being executed)
sMessage = "This is a test" (message to tell what is wrong) 
s_fFile  = File/Folder object OR string (the file errored on)
bAlrt = Boolean (display message or not)
*/
	if(oLog == undefined)var oLog = ""
	if(nLevel == undefined)var nLevel = ""
	if(sFunction == undefined)var sFunction = ""
	if(sMessage == undefined)var sMessage = ""
	if(bAlrt == undefined){var bAlrt = (nLevel >= 2 ) ? true : false} //if bAlrt is undefined and the nLevel >= 2 then display the message always for critical errors
	if(s_fFile == "") { //test for intentional blank string
		var s_fsFile = ""
	}else{//accepts string or File object
		if (s_fFile == undefined){ //test for undefined
			var s_fsFile = ""
		}else{
			if(BECS.sVariableType(s_fFile) == "array"){ //test for array
				for (var i = 0, lThumb = s_fFile.length; i < lThumb ; i++){
					s_fFile[i] = BECS.sFile(s_fFile[i])
				}
				s_fsFile = s_fFile.join(", ")
				//looping to get array to string
			}else{
				var s_fsFile = BECS.sFile(s_fFile)
			}//test for array
		} //test for undefined
	} //test for intentional blank string

	var Logfile = oLog.file
	sMessage.replace(/\n/g, " ") //remove newline, carriage returns, and tabs from message
	var sMessageClean = sMessage.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, "    ");
    var i = 0
	if (oLog.counter == 0 && oLog.typeCounter[0] ==0) { //create a header the first time we enter
		sWorkingPath = BECS.sPath(oLog.fWorkingPath)



//====================WRITE DATA TO DISK AND DATA ARRAY================================

    //write the header
    oLog.oDataP.nCounter = i
    var oD = oLog.oData[i] = {}
    oD.sTime = "Time"
    oD.sLevel = "Level"
    oD.sFunction = "Function"
    oD.sFile = "File"
    oD.sMessage = "Message"
    oLog.oDataP.nTimeLength = oD.sTime.length
    oLog.oDataP.nLevelLength = oD.sLevel.length
    oLog.oDataP.nFunctionLength = oD.sFunction.length
    oLog.oDataP.nFileLength = oD.sFile.length
    oLog.oDataP.nMessageLength = oD.sFile.length

    Logfile.open('e');
    Logfile.seek(0, 2);
    //Logfile.writeln("Error log created on: " + dateFormat("isoDate") + " - " + dateFormat("mediumTime") + "\tWorking Path: " + sWorkingPath)
    //Logfile.writeln("Time:\t\tLevel-Function:\t\tFile: \t\t\tMessage:");
    Logfile.writeln(oD.sTime + "\t\t" + oD.sLevel + "-" + oD.sFunction + "\t\t" + oD.sFile + "\t\t\t" + oD.sMessage);
        
    Logfile.close();
    s_fsWorkingPath = ""

	}
    //write error data
    i = oLog.oDataP.nCounter + 1
    oLog.oDataP.nCounter = i
    //$.writeln(oLog.oData.nCounter)
    oD = oLog.oData[i] = {}
    oD.sTime = dateFormat("mediumTime")
    oD.sLevel = nLevel
    oD.sFunction = sFunction
    oD.sFile = s_fsFile
    oD.sMessage = sMessageClean
    oLog.oDataP.nTimeLength = (oD.sTime.length > oLog.oDataP.nTimeLength) ? oD.sTime.length : oLog.oDataP.nTimeLength
    oLog.oDataP.nLevelLength = (oD.sLevel.length > oLog.oDataP.nLevleLength) ? oD.sLevel.length : oLog.oDataP.nLevelLength
    oLog.oDataP.nFunctionLength = (oD.sFunction.length > oLog.oDataP.nFunctionLength) ? oD.sFunction.length : oLog.oDataP.nFunctionLength
    oLog.oDataP.nFileLength = (oD.sFile.length > oLog.oDataP.nFileLength) ? oD.sFile.length : oLog.oDataP.nFileLength
    oLog.oDataP.nMessageLength = (oD.sMessage.length > oLog.oDataP.nMessageLength) ? oD.sMessage.length : oLog.oDataP.nMessageLength

    Logfile.open('e');
    Logfile.seek(0, 2);
	//Logfile.writeln(dateFormat("mediumTime") + "\t" + nLevel + ": " + sFunction + "\t\t" + s_fsFile + "\t\t" + sMessageClean);
    Logfile.writeln(oD.sTime + "\t" + oD.sLevel + ": " + oD.sFunction + "\t\t" + oD.sFile + "\t\t" + oD.sMessage);
    Logfile.close();

//====================CREATE ERROR MESSAGE================================

	oLog.typeCounter[nLevel]++
	if(nLevel>0){oLog.counter++} //do not count informational logging
    
	//create dynamic error message
	if (bAlrt == true){ //log message
		var sS = (oLog.counter == 1) ? "" : "s"
		var sN = (oLog.nFiles == 1) ? "" : "s"
		var sExitingMsg = (nLevel>=2) ? "The script '"+oLog.sScriptName+"' will exit due to an error:\n\n" : "The script '"+oLog.sScriptName+"' has finished processing.\n\n"
		var sMessage = (nLevel>=2 || bAlrt == true) ? sMessage + "\n\n" : "\n"
		
			var sM0 = (oLog.StartTime > 0) ? "Processed " + oLog.nFiles + " file" + sN + " in " + BECS.ElapsedTime(oLog.StartTime) + " seconds.\n" : ""
			var sM1 = (oLog.counter > 0) ? "Log Counter --> " + oLog.typeCounter[0] + " message" + sN + " logged.\n" : ""
			var sM2 = (oLog.counter > 0) ? "Error Counter --> " + oLog.counter + " error" + sS + " logged.\n" : ""
			var sM4 = (s_fsFile != "") ? "File Processed --> " + s_fsFile+ "\n" : ""
			var sM5 = (sFunction != "") ? "Last function called --> " + sFunction + "\n" : "" 
			var sM6 = "\nLog file --> " + Logfile.name + "\n"
			var sM7 = "Log location --> " + BECS.sPath(Logfile)
		var sConfirm = sM0 + sM1 + sM2 + sM4 + sM5 + sM6 + sM7

		if (oLog.counter == 0){ //display an alert only if there were no errors
              if(oLog.oDataP.nCounter > 0){BECS.ReformatLogFile("spaced")}
			alert(sExitingMsg + sMessage + sConfirm)
			Error.runtimeError(9999, "Exit Script")
			}
		//otherwise display a confirm box to allow the use to launch the log file
        if(oLog.oDataP.nCounter > 0){BECS.ReformatLogFile("spaced")}
        var bConfirm = confirm(sExitingMsg + sMessage + sConfirm + "\n\nDo you want to view the log file?")
		if (bConfirm == true) {Logfile.execute()}
		if(nLevel <= 3 && nLevel > 1) Error.runtimeError(9999, "Exit Script")  //cannot throw an error 2x without getting a major error.  This ensurs that the error is only thrown once.
	} //log message

}

function logObject(sFunction, sScriptName){//oLog Object

	if (sFunction == undefined) sFunction = ""
	if (sScriptName == undefined) sScriptName = ""
	
	dateTime = dateFormat("yyyy'.'mm'.'dd_H'.'MM'.'ss")
	this.LogPath="/C/FTP_Stuff/Aaron Koller/Scripts/Adobe/"
	
	this.StartTime = new Date().getTime();
	this.dateTime = dateTime
	this.file = ""
	this.counter = 0
	this.typeCounter = [0, 0, 0, 0, 0]
	this.sMessage = ""
	this.str = ""
	this.sScriptName = ""
  this.sMe = ""
	this.nFiles = 0	
	this.sLogFileDate = ""
	this.fBrowseScriptPath = "" //used to keep persistant path for browse button scripts
	this.fBrowseDataPath = "" //used to keep persistant path for browse button data file
	
	this.fileCreate = function(LogPath,sFunction){
		return File(LogPath + "/Error_Logs/" + oLog.sLogFileDate + "_" + sFunction +".txt");
		};
	
	};//oLog Object


BECS.CleanLogObject = function(){
    
	oLog.LogPath="/C/FTP_Stuff/Aaron Koller/Scripts/Adobe/"
	
	oLog.StartTime = new Date().getTime();
	oLog.dateTime = dateTime
	oLog.file = ""
	oLog.counter = 0
	oLog.typeCounter = [0, 0, 0, 0, 0]
	oLog.sMessage = ""
	oLog.str = ""
	oLog.sScriptName = ""
	oLog.nFiles = 0	
	oLog.sLogFileDate = ""
	oLog.fWorkingPath = ""
    
    }


BECS.ReformatLogFile = function(sFormat){
//sFormat = "csv", "spaced"
var sMe = "ReformatLogFile"
var oTestLog = oLog

var sTime = ""
var sLevel = ""
var sFunction = ""
var sFile = ""
var sMessage = ""

var nSpacer = 3

var nTime = oLog.oDataP.nTimeLength+nSpacer
var nLevel = oLog.oDataP.nLevelLength+nSpacer
var nFunction = oLog.oDataP.nFunctionLength+nSpacer
var nFile = oLog.oDataP.nFileLength+nSpacer
var nMessage = oLog.oDataP.nMessageLength+nSpacer

//remove the log file if it exists as we are going to replace it with a nicer looking one
    var Logfile = oLog.file
	if(Logfile.exists) Logfile.remove()  
            Logfile.open('e');
            
    for (var i in oLog.oData) {
        if (oLog.oData.hasOwnProperty(i)) {  //make sure that the object contains data and is not just a JS Prototype
            var obj = oLog.oData[i];

            switch (sFormat) { //Rotate images
                case ("spaced"):
                
                //create padding for each element
                sTime = BECS.PadRight (obj.sTime," ",nTime)
                sLevel = BECS.PadRight (obj.sLevel," ",nLevel)
                sFunction = BECS.PadRight (obj.sFunction," ",nFunction)
                sFile = BECS.PadRight (obj.sFile," ",nFile)
                sMessage = BECS.PadRight (obj.sMessage," ",nMessage)
                
                Logfile.writeln(sTime+sLevel+sFunction+sFile+sMessage);
                break;
            case ("CSV"):
                break;
            }
        }
    } // i in oLog.oData
Logfile.close();
}

//wrap script objects
BECS.WriteObjectsToFiles = function(sDebugFolderPath, oObject01,oObject02,oObject03,oObject04,oObject05){//write objects to Object##.txt files to the specified path
//sDebugFolderPath = URI Folder to write files
//oObject## = javascript objects/arrays/variables to be written to files

	BECS.RemoveWrapScriptObjects(sDebugFolderPath) //remove text files created by the wrap script function so that older files are not accidentally used.
	
	//for debugging purposes write the objects to files
	if(oObject01 != undefined)BECS.WriteStringToFile(sDebugFolderPath + 'Object01.txt',oObject01.toSource())
	if(oObject02 != undefined)BECS.WriteStringToFile(sDebugFolderPath + 'Object02.txt',oObject02.toSource())
	if(oObject03 != undefined)BECS.WriteStringToFile(sDebugFolderPath + 'Object03.txt',oObject03.toSource())
	if(oObject04 != undefined)BECS.WriteStringToFile(sDebugFolderPath + 'Object04.txt',oObject04.toSource())
	if(oObject05 != undefined)BECS.WriteStringToFile(sDebugFolderPath + 'Object05.txt',oObject05.toSource())
	
	}
BECS.RemoveWrapScriptObjects = function(sDebugFolderPath){  //remove text files created by the wrap script function so that older files are not accidentally used.
	if(File(sDebugFolderPath + 'Object01.txt').exists){File(sDebugFolderPath + 'Object01.txt').remove()}
	if(File(sDebugFolderPath + 'Object02.txt').exists){File(sDebugFolderPath + 'Object02.txt').remove()}
	if(File(sDebugFolderPath + 'Object03.txt').exists){File(sDebugFolderPath + 'Object03.txt').remove()}
	if(File(sDebugFolderPath + 'Object04.txt').exists){File(sDebugFolderPath + 'Object04.txt').remove()}
	if(File(sDebugFolderPath + 'Object05.txt').exists){File(sDebugFolderPath + 'Object05.txt').remove()}
}


BECS.WrapScript = function(oLog, tApp,fURIPathFile,oObject01,oObject02,oObject03,oObject04,oObject05){
//oLog = Log object
//tApp = Bridgetalk application to be targeted such as 'photoshop', 'bridge'
//fURIPathFile = URI with path and file
//objectxx = objects to be passed into the script

var sMe = "BECS.WrapScript"
//http://www.ps-scripts.com/bb/viewtopic.php?f=10&t=1282&p=4960

/* TIPS FOR DEBUGGING
	- make sure that the actual script runs withoug compile errors in photoshop
	- make sure that all includes are available.  PS will not error on this so you have to test each include one at a time
	- get the original script and see if it throws a message in PS
	- if photoshop is launched but you can't throw a message, check each object individually and find out which object is preventing photoshop from running the script
	- doubleslash comments in a created object can prevent it from loading 
*/

	//see if the script exists.  If not then exit.
	if(!File(fURIPathFile).exists){ //if the photoshop script could not be found then pass an error
		sMsg = "ERROR: The script '"+BECS.sPathFile(fURIPathFile)+"' could not be found."
		BECS.WriteLog(oLog, 3, sMe, sMsg, true, fURIPathFile)
		}

	//convert our objects to strings to pass to PS if they exist
	var sObject01 = (oObject01 == undefined) ? "" : oObject01.toSource()
	var sObject02 = (oObject02 == undefined) ? "" : oObject02.toSource()
	var sObject03 = (oObject03 == undefined) ? "" : oObject03.toSource()
	var sObject04 = (oObject04 == undefined) ? "" : oObject04.toSource()
	var sObject05 = (oObject05 == undefined) ? "" : oObject05.toSource()


	function ah_RunScript  ( tApp, tScript,wrap01,wrap02,wrap03,wrap04,wrap05) {
	   BridgeTalk.bringToFront (tApp);
	   var bt = new BridgeTalk ();
	   var fURIPathFile = ah_GetScript(tScript);
	   if (wrap01 != undefined) fURIPathFile = ah_wrapScript (fURIPathFile,wrap01,wrap02,wrap03,wrap04,wrap05);
	   bt.target = tApp;
	   bt.body = fURIPathFile;
	   bt.send();         
	}
	function ah_GetScript (tScript)  {
	   var scp = 'ah_remoteScript = ' + ah_remoteScript;
	   scp += 'ah_remoteScript("'+tScript+'");';
	   return scp;
	}
	function ah_remoteScript ( tFile) {
	   var f = new File (tFile);
	   if (f.open('r')) var sStr = f.read();
	   else throw('failed to open script'+f.fsName);
	   eval(sStr);
	}

	function ah_wrapScript (fURIPathFile,object01,object02,object03,object04,object05) {
	   return "ah_RunWrappedScript();function ah_RunWrappedScript(){var sObject01='"+object01 + "';var sObject02='"+object02 + "';var sObject03='"+object03 + "';var sObject04='"+object04 + "';var sObject05='"+object05 + "';" + fURIPathFile+"};";
	}
ah_RunScript(tApp, fURIPathFile, sObject01, sObject02, sObject03, sObject04, sObject05)
}

//////////////////////////////////////////////////////////START - CSV Fucntions//////////////////////////////////////////////////////////////////////
BECS.WriteStringToFile = function(sFile,sString){
	var fFile = new File(sFile)
	if(fFile.exists) fFile.remove()
	fFile.open("e")
	fFile.writeln(sString);
	fFile.close();
}

BECS.ReadStringFromFile = function(sFile){
	var fFile = new File(sFile)
	fFile.open('r');
	var sString = fFile.readln();
	fFile.close();
	return sString
}

BECS.ElapsedTime = function (nStart) {  //returns the time in seconds that have elapsed
// start = new Date().getTime() -- at any place in the function
var ms = new Date().getTime() - nStart  //same as: stop - start
if (ms < 1000) return 0
var sec = Math.floor(ms/1000)
ms = ms % 1000
t=""
//if(sec !=0) {t = three(ms)}

var min = Math.floor(sec/60)
sec = sec % 60
if(sec !=0) {t = two(sec) + t}

var hr = Math.floor(min/60)
min = min % 60
if(min !=0) {t = two(min) + ":" + t}

var day = Math.floor(hr/60)
hr = hr % 60
if(hr !=0) {t = two(hr) + ":" + t}
if(day !=0) {t = day + ":" + t}

return t
}



function writeCSVData(fptr, content, headers) { //fptr = path (can be string or file constructor), content = array data, headers = array of the header data

  function isNumber(s) {
    return !isNaN(s);
  }
  
  // This function converts an array of values into a correctly
  // formatted csv row (without an EOL marker).
  function arrayAsCSV(ar) {
    var str = '';
    for (var i = 0; i < ar.length; i++) {
      var v = ar[i];
      if (!isNumber(v)) {
        v = '\"' + v.replace(/"/g, '""') + '\"'; //");// needed for emacs syntax hilighting
        
      }
     str += v;
      if (i+1 != ar.length) {
        str += ',';
      }
    }
   return str;
  }

  if (fptr.constructor != File) {
    fptr = new File(fptr);
  }
  
  if (!fptr.open("w", "TEXT", "????")) {
    Error.runtimeError(9002, "IOError: unable to open file \"" + fptr + "\": " +
                       fptr.error + '.');
  }
  
  if (headers) {
    fptr.writeln(arrayAsCSV(headers));
  }

  for (var i = 0; i < content.length; i++) {
    var row = content[i];
    fptr.writeln(arrayAsCSV(row));
  }

  fptr.close();
};


BECS.aReadCSVData = function (type, pathFile) {; //readCSVData () <RETURNS: Array of all values in the CSV file
var sMe = "readCSVData"
	var CSVFile = null;
	switch (type)
	{
	case "GPS":
		//var inputFolder = new Folder(oLog.appPath);
		var inputFolder = new Folder(app.document.presentationPath)		
		
		//determine if the Path is valid.  Allow the user to select a file if it is invalid.  Stop the script if they cancel the dialog.
		//if the folder is valid then we need to find the data file in that folder.  Looking for the string 'data' in the filename
		if (inputFolder instanceof Folder) {;
			var fileList = inputFolder._getFiles("*.csv");
			if (fileList.length != 0) for (var i = 0; i < fileList.length; i++) {;
				var FilePathExt = File(fileList[i]);
				var name = FilePathExt.name;
				if (name.search(/data/i) != -1) {; //regex /data/i is case insensetive - a value of -1 means that the search string was not found
					CSVFile = File(FilePathExt);
					break;
				};
			}; // end for
		};
	case "VariableRead":
	CSVFile = File(pathFile) //for ease the CSVfile will be stored in a standard location
	}

	//if the data file was not found then locate it.  If the dialog box is cancelled then exit the script.
	if (CSVFile == null) {
		CSVFile = File.openDialog("Open Keywords File", "CSV File(*.csv):*.csv;");
	};
	if (CSVFile == null) {
		sMsg = "ERROR: You must select a CSV file to continue."
		BECS.WriteLog(oLog, 3, sMe, sMsg)
	};

	//read the CSV file to an array
	var datFile = [];
	var LineArray = [];
	var LineArrayelements
	var i = 1
	CSVFile.open('r');
	//CSVFile.readln();// Remove header line.
	while (!CSVFile.eof) {;
		var line = CSVFile.readln();
		LineArray = splitCSV(line); //splitline will parse a CSV with quotations in it
		if (LineArray.length != LineArrayelements && i != 1) {; //the number of columns MUST remain constant for all rows
			sMsg = "ERROR: The script cannot continue as the CSV parser found an error in:\n" + CSVFile.fsName.toString() + "\n\nThere must be an equal number of columns for each row.\n" + LineArray.length + " columns were found.  In the previous line " + LineArrayelements + " columns were found.\n\n" + "The error was found in line " + i + ": \n" + line.slice(0, 60) + " ..."
			BECS.WriteLog(oLog, 3, sMe, sMsg, true, CSVFile, CSVFile)
		};
		LineArrayelements = LineArray.length
		if (line.length > 5) datFile.push(LineArray); //push data into the array
		i++
	};
	CSVFile.close();
	return datFile
}; //readCSVData



function splitCSV(string, sep) { //String.prototype.splitCSV (sep = delimeter - usually a comma) <RETURNS: an array>
	for (var foo = string.split(sep = sep || ","), x = foo.length - 1, tl; x >= 0; x--) {
		if (foo[x].replace(/"\s+$/, '"').charAt(foo[x].length - 1) == '"') {
			if ((tl = foo[x].replace(/^\s+"/, '"')).length > 1 && tl.charAt(0) == '"') {
				foo[x] = foo[x].replace(/^\s*"|"\s*$/g, '').replace(/""/g, '"');
			} else if (x) {
				foo.splice(x - 1, 2, [foo[x - 1], foo[x]].join(sep));
			} else foo = foo.shift().split(sep).concat(foo);
		} else foo[x].replace(/""/g, '"');
	}
	return foo;
}; //String.prototype.splitCSV

//////////////////////////////////////////////////////////END - CSV Fucntions/////////////////////////////////////////////////////////////////////////
//
//////////////////////////////////////////////////////////START - Other Fucntions///////////////////////////////////////////////////////////////////
BECS.sVariableType = function(variable){ //input any variable to get a string telling what kind of variable it is such as 'array', 'object', 'function', 'number', 'string', 'null', 'boolean'
//http://www.guyfromchennai.com/?p=27
var resolve = (function() {
function what_is_it(o) {
if (o === null) {
return 'null';
}

return o.constructor.toString().split(' ')[1].replace(/\(\)/g,'').toLowerCase();
}
// Exposed methods
return {
'obj_is'	:function(o) { return what_is_it(o); }
};
})();


return resolve.obj_is(variable)
}




function displayLog(oLog){//display the log errors
	oLog.Message = (oLog.counter == 1 ? "There was 1 error." : "There were " + oLog.counter + " errors.")
	if (oLog.counter > 0) {
	var r = confirm(oLog.Message + " Do you wish to view the log file?\n\nThe file log file can be found in:\n" + Logfile.fsName.toString())
		if (r == true) {Logfile.execute()}
	}
}
function modifyAnalysis(name,operation,analysis){//modifyAnalysis (name = original file name can include extension, -1: deletes analysis - 1: adds analysis - "": changes the analysis, analysis = string of new name such as "RGB", "IR", "CIR") <RETURN: string of modified name (includes extension if in original file name)>
	var aComponents = name.split("_")
	switch (operation){
		case -1: aComponents.splice(2,1) break; //-1: deletes analysis
		case 1: aComponents.splice(2,0,analysis)break; //1: adds analysis to name
		default: aComponents.splice(2,0,analysis); //"": replaces analysis string (can be any value other than -1 or 1)
	}
	var newName  = aComponents.join("_")
	return newName
	}//modifyAnalysis

BECS.sLeft = function(str, n){
    if (n <= 0)
        return "";
    else if (n > String(str).length)
        return str;
    else
        return String(str).substring(0,n);
}
BECS.sRight = function(str, n){
    if (n <= 0)
       return "";
    else if (n > String(str).length)
       return str;
    else {
       var iLen = String(str).length;
       return String(str).substring(iLen, iLen - n);
    }
}

BECS.sTrim = function(sStr){
return sStr.replace(/^\s\s*/, '').replace(/\s\s*$/, '')	
}
BECS.RepeatString = function(sStr,nNum){  //repeats sStr sNum of times  (used for padLeft and padRight)
    //sStr = string to repeat
    //sNum = number of times to repeat the string
    return new Array(isNaN(nNum)? 1 : ++nNum).join(sStr)  //this will make sure that the valid string repeated is valid
    }
BECS.PadLeft = function(sStr,sPadChar, SFinalLength){ //pads sStr with sPadChar to a final length of sFinalLength on left side of sStr
    //sStr = input string to be padded
    //sPadChar = string padding i.e. "0", " "
    //sFinalLength = desired length of the final padded string
    var sRept = BECS.RepeatString(sPadChar,SFinalLength)
    return String(sRept + sStr).slice(-1*SFinalLength); // returns 00123
 }
BECS.PadRight = function(sStr,sPadChar, SFinalLength){ //pads sStr with sPadChar to a final length of sFinalLength on right side of sStr
    var sRept = BECS.RepeatString(sPadChar,SFinalLength - String(sStr).length)
    return sStr + sRept; // returns 00123
 }

 //////////////////////////////////////////////////////////END - Other Fucntions///////////////////////////////////////////////////////////////////////
//
//////////////////////////////////////////////////////////START - Objects//////////////////////////////////////////////////////////////////////////////////


function multiFilterArray(arr, idx, f) { //multiFilter (arr = array, idx = index/column number from 0, f = function refer to samples in code) <RETURNS: filtered array>
	//The Lambda function is composed of three parts:
	//the '( )' is just like a normal function( ) as you can pass your parameters through here (n,arr) will become function(n,arr)
	//the => is 'goes to' and just separates the left statement from the right
	//the left statement is the test performed true = {Return true} and n % 2 == 0 is {Return n % 2 == 0}
	//therefore ("( n, i ) => n % 2 == 0" ) is the same as function(n,i) {Return n % 2 == 0}
	//http://www.paulfree.com/28/javascript-array-filtering/#more-28
	//Refer to the follow
	//~ var multi = multiFilter(GPSArray,0, "( ) => true" )  ////returns everything
	//~ var multi = multiFilter(GPSArray,0, "( n, i ) => n % 2 == 0" ) //returns only even numbers
	//~ var multi01 = multiFilter(GPSArray,0, "( n, i ) => n > 1 && n < 5" ) //returns everything between 1 and 5
	//~ var multi02 = multiFilter(GPSArray,3, "( n, i ) => n.toLowerCase() === 'Subtarget'.toLowerCase()" ) //returns the text "Subtarget"
	//~ var test = "'subtargeT'"
	//~ var multi03 = multiFilter(GPSArray,3, "( n, i ) => n.toLowerCase() === "+test+".toLowerCase()" ) //same as above.  We can pass variables into the statement	   
	var fn = f;
	// if type of parameter is string         
	if (typeof f == "string")
	// try to make it into a function
	if ((fn = lambda(fn)) == null)
	// if fail, throw exception
	throw "Syntax error in lambda string: " + f;
	// initialize result array
	var res = [];
	var l = arr.length;
	// set up parameters for filter function call
	var p = [0, 0, res];
	// append any pass-through parameters to parameter array               
	for (var i = 1; i < arguments.length; i++) p.push(arguments[i]);
	// for each array element, pass to filter function
	for (var i = 0; i < l; i++) {
		// skip missing elements

if (typeof arr[i][idx] == "undefined") continue;
		// param1 = array element             
		p[0] = arr[i][idx];
		// param2 = current indeex
		p[1] = i;
		// call filter function. if return true, copy element to results            
		if ( !! fn.apply(arr, p)) res.push(arr[i]);
	}
	// return filtered result
	return res;
} //multiFilter

//arrThumbs.filterObject( "( el, i, res, param ) => el.type == param", "file" )
Array.prototype.filterObject =function(f){
      var fn = f ;
      // if type of parameter is string         
      if ( typeof f == "string" )
         // try to make it into a function
         if ( ( fn = lambda( fn ) ) == null )
            // if fail, throw exception
            throw "Syntax error in lambda string: " + f ;
      // initialize result array
      var res = [] ;
      var l = this.length;
      // set up parameters for filter function call
      var p = [ 0, 0, res ] ;
      // append any pass-through parameters to parameter array               
      for (var i = 1; i < arguments.length; i++) p.push( arguments[i] );
      // for each array element, pass to filter function
      for (var i = 0; i < l ; i++)
      {
         // skip missing elements
         if ( typeof this[ i ] == "undefined" ) continue ;
         // param1 = array element             
         p[ 0 ] = this[ i ] ;
         // param2 = current indeex
         p[ 1 ] = i ;
         // call filter function. if return true, copy element to results            
         if ( !! fn.apply(this, p)  ) res.push(this[i]);
      }
      // return filtered result
      return res ;
   }


function lambda(l) { //called by multiFilter (l = lamda function to be evaluated) <RETURNS: function to be applied by multiFilter>
	var fn = l.match(/\((.*)\)\s*=>\s*(.*)/);
	var p = [];
	var b = "";

	if (fn.length > 0) fn.shift();
	if (fn.length > 0) b = fn.pop();
	if (fn.length > 0) p = fn.pop().replace(/^\s*|\s(?=\s)|\s*$|,/g, '').split(' ');

	// prepend a return if not already there.
	fn = ((!/\s*return\s+/.test(b)) ? "return " : "") + b;

	p.push(fn);

	try {
		return Function.apply({}, p);
	}
	catch (e) {
		return null;
	}
} //lambda
//////////////////////////////////////////////////////////END - Advanced Multidimensional filter/////////////////////////////////////////
//
/////////////////////////////////////////////////////////////START - Date Format///////////////////////////////////////////////////////////////////////
//refer to:http://blog.stevenlevithan.com/archives/date-time-format
//documentation: /documentation/JavaScript Date Format.htm
/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */


var dateFormat = function () {
	var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) val = "0" + val;
			return val;
		};

	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc) {
		var dF = dateFormat;

		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date;
		if (isNaN(date)) throw SyntaxError("invalid date");

		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var _ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
				d: d,
				dd: pad(d),
				ddd: dF.i18n.dayNames[D],
				dddd: dF.i18n.dayNames[D + 7],
				m: m + 1,
				mm: pad(m + 1),
				mmm: dF.i18n.monthNames[m],
				mmmm: dF.i18n.monthNames[m + 12],
				yy: String(y).slice(2),
				yyyy: y,
				h: H % 12 || 12,
				hh: pad(H % 12 || 12),
				H: H,
				HH: pad(H),
				M: M,
				MM: pad(M),
				s: s,
				ss: pad(s),
				l: pad(L, 3),
				L: pad(L > 99 ? Math.round(L / 10) : L),
				t: H < 12 ? "a" : "p",
				tt: H < 12 ? "am" : "pm",
				T: H < 12 ? "A" : "P",
				TT: H < 12 ? "AM" : "PM",
				Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();

// Some common format strings
dateFormat.masks = {
	"default": "ddd mmm dd yyyy HH:MM:ss",
	shortDate: "m/d/yy",
	mediumDate: "mmm d, yyyy",
	longDate: "mmmm d, yyyy",
	fullDate: "dddd, mmmm d, yyyy",
	shortTime: "h:MM TT",
	mediumTime: "hh:MM:ss TT",
	longTime: "h:MM:ss TT Z",
	isoDate: "yyyy-mm-dd",
	isoTime: "HH:MM:ss",
	isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
	dayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
	monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
	return dateFormat(this, mask, utc);
};


//get simple time from Milliseconds
function two(x) {return ((x>9)?"":"0")+x}
function three(x) {return ((x>99)?"":"0")+((x>9)?"":"0")+x}

function timeFromMS(ms) {
var sec = Math.floor(ms/1000)
ms = ms % 1000
t = three(ms)

var min = Math.floor(sec/60)
sec = sec % 60
t = two(sec) + ":" + t

var hr = Math.floor(min/60)
min = min % 60
t = two(min) + ":" + t

var day = Math.floor(hr/60)
hr = hr % 60
t = two(hr) + ":" + t
t = day + ":" + t

return t
}




/////////////////////////////////////////////////////////////END - Date Format///////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////START - INI file//////////////////////////////////////////////////////////////////////////////////
//http://www.ps-scripts.com/bb/viewtopic.php?f=25&t=1110&p=13875&hilit=ini&sid=1bc81c3cfa8ade729f8667114446eb3d#p13875
//
// IniFile.jsx
//
// $Id: IniFile.jsx,v 1.1 2006/11/21 21:15:09 anonymous Exp $
// Contact: xbytor@gmail.com
//

//
// IniFile is a set of functions for reading and writing ini files
// in a consistent fashion across a broad number of scripts.
//
function IniFile(fptr) {
};

//
// Return fptr if its a File or Folder, if not, make it one
//
IniFile.convertFptr = function(fptr) {
  var f;
  if (fptr.constructor == String) {
    f = File(fptr);
  } else if (fptr instanceof File || fptr instanceof Folder) {
    f = fptr;
  } else {
    throw IOError("Bad file \"" + fptr + "\" specified.");
  }
  return f;
};

//
// Return an ini string to an object. Use 'ini' as the object if it's specified
//
IniFile.iniFromString = function(str, ini) {
  var lines = str.split(/\r|\n/);
  var rexp = new RegExp(/([^:]+):(.*)$/);

  if (!ini) {
    ini = {};
  }
    
  for (var i = 0; i < lines.length; i++) {
    var line = IniFile.trim(lines[i]);
    if (!line || line.charAt(0) == '#') {
      continue;
    }
    var ar = rexp.exec(line);
    if (!ar) {
      alert("Bad line in config: \"" + line + "\"");
      return undefined;
    }
    ini[IniFile.trim(ar[1])] = IniFile.trim(ar[2]);
  }

  return ini;
};


//
// Return an ini file to an object. Use 'ini' as the object if it's specified
//
IniFile.read = function(iniFile, ini) {
  if (!ini) {
    ini = {};
  }
  if (!iniFile) {
    return ini;
  }
  var file = IniFile.convertFptr(iniFile);

  if (!file) {
    throw "Bad ini file specified: \"" + iniFile + "\".";
  }

  if (!file.exists) {
  }
  if (file.exists && file.open("r")) {
    var str = file.read();
    ini = IniFile.iniFromString(str, ini);
    file.close();
  }
  return ini;
};

//
// Return an ini string coverted from an object
//
IniFile.iniToString = function(ini) {
  var str = '';
  for (var idx in ini) {
    if (idx.charAt(0) == '_') {         // private stuff
      continue;
    }
    if (idx == 'typename') {
      continue;
    }
    var val = ini[idx];
    if (val == undefined){continue}  //AK - somtimes objects in a menu are undefined
    if (val.constructor == String ||
        val.constructor == Number ||
        val.constructor == Boolean ||
        typeof(val) == "object") {
      str += (idx + ": " + val.toString() + "\n");
	  $.writeln(str)
    }
  }
  return str;
};

//
// Write an object to an ini file overwriting whatever was there before
//
IniFile.overwrite = function(iniFile, ini) {
  if (!ini || !iniFile) {
    return;
  }
  var file = IniFile.convertFptr.iniFileToFile(iniFile);

  if (!file) {
    throw "Bad ini file specified: \"" + iniFile + "\".";
  }

  if (!file.open("w")) {
    throw "Unable to open ini file " + file + ": " + file.error;
  }

  var str = IniString.iniToString(ini);
  file.write(str);
  file.close();

  return ini;
};
IniFile.trim = function(value) {
   return value.replace(/^[\s]+|[\s]+$/g, '');
};


//
// Updating the ini file retains the ini file layout including any externally
// add comments, blank lines, and the property sequence
//
IniFile.update = function(iniFile, ini) {
  if (!ini || !iniFile) {
    return;
  }
  var file = IniFile.convertFptr(iniFile);

  // we can only update the file if it exists
  var update = file.exists;
  var str = '';

  if (update) {
    file.open("r");
    str = file.read();
    file.close();
    
    for (var idx in ini) {
      if (idx.charAt(0) == '_') {         // private stuff
        continue;
      }
      if (idx == "typename") {
        continue;
      }

      var val = ini[idx];

      if (val == undefined) {
        val = '';
      }
      
      if (typeof val == "string" ||
          typeof val == "number" ||
          typeof val == "boolean" ||
          typeof val == "object") {
        idx += ':';
        var re = RegExp('^' + idx, 'm');

        if (re.test(str)) {
          re = RegExp('^' + idx + '[^\n]+', 'm');
          str = str.replace(re, idx + ' ' + val);
        } else {
          str += '\n' + idx + ' ' + val;
        }
      }
    }
  } else {
    str = IniFile.iniToString(ini);
  }

  if (str) {
    if (!file.open("w")) {
      throw "Unable to open ini file " + file + ": " + file.error;
    }
    file.write(str);
    file.close();
  }

  return ini;
};

// By default, I update ini files instead of overwriting them.
IniFile.write = IniFile.update;


// convert an object into an easy-to-read string
listProps = function(obj) {
  var s = '';
  for (var x in obj) {
    s += x + ":\t";
    try {
      var o = obj[x];
      s += (typeof o == "function") ? "[function]" : o;
    } catch (e) {
    }
    s += "\r\n";
  }
  return s;
};


// a simple demo of the INI functions
IniFile.demo1 = function() {
  var obj  = {
    name: "bob",
    age: 24
  };
  
  alert(listProps(obj));

  IniFile.write("~/testfile.ini", obj);

  var z = IniFile.read("~/testfile.ini", obj);

  alert(listProps(z));
};

// a simple demo of the INI functions
IniFile.demo2 = function() {
  var f = new File("~/testfile.ini");

  var obj = {};
  obj.city = "singapore";

  IniFile.read(f, obj);
  var z = IniFile.write(f, obj);

  alert(listProps(z));
};

// IniFile.demo1();
// IniFile.demo2();

"IniFile.jsx";

// EOF
//////////////////////////////////////////////////////////////END - INI file//////////////////////////////////////////////////////////////////////////////////

BECS.RunCommandLine = function(sExe,sArgs){//BECS.RunCommandLine

//
// exec.js
//    Execute external applications in PSCS-JS
// 
// Usage:
//    exec(cmd[, args])
//    bash(cmd[, args])
//      Executes the command 'cmd' with optional arguments. The
//      name of the file containing the output of that command
//      is returned.
//
// Examples:
//    exec("i_view32.exe", "/slideshow=c:\\images\\");
//
//    f = bash("~/exif/exifdump", fileName);
//    data = loadFile(f);
//
// Notes
//   The use of bash on XP requires that cygwin be installed.
//   Paths in the ExecOptions are XP paths. I'll put mac stuff
//      in later. Change if you don't like it.
//
// $Id: exec.js,v 1.4 2005/09/30 17:03:01 anonymous Exp $
// Copyright: (c)2005, xbytor
// License: http://creativecommons.org/licenses/LGPL/2.1
// Contact: xbytor@gmail.com
//

function ExecOptions() {
  var self = this;
  self.tempdir = "C:\FTP_Stuff\Aaron Koller\Scripts\AutoIT\\"
  //self.tempdir       = "c:\\temp\\";
  self.bash          = "c:\\cygwin\\bin\\bash";
  self.scriptPrefix  = "doExec-";
  self.captureOutput = true;
  self.captureFile   = "doExec.out"; // set this to undefined to get
                                     // a unique output file each time
  self.outputPrefix  = "doExec-";
};

function ExecRunner(opts) {
  var self = this;

  self.opts = opts || new ExecOptions();

  self.bash = function bash(exe, args) {
    var self = this;
    return self.doExec(self.opts.bash, "-c \"" + exe + " "  +
                       (args || ''), "  2>&1");
  };

  self.exec = function exec(exe, args) {
    var self = this;
    return self.doExec(exe, (args || ''), "");
  };

  self.doExec = function doExec(exe, args, redir) {
    var self = this;
    var opts = self.opts;
    if (exe == undefined) { throw "Must specify program to exec"; }

    args = (!args) ? '' : ' ' + args;

    // create a (hopefully) unique script name
    var ts = new Date().getTime();
    var scriptName = BECS.sPathFile(opts.tempdir) + opts.scriptPrefix + ts + ".bat";

    var cmdline = exe + args;   // the command line in the .bat file
    
    // redirected output handling
    var outputFile = undefined;
    if (opts.captureOutput) {
      if (opts.captureFile == undefined) {
        outputFile = opts.tempdir + opts.outputPrefix + ts + ".out";
      } else {
        outputFile = opts.tempdir + opts.captureFile;
        new File(outputFile).remove();
      }
      // stderr redirect in cygwin
      cmdline += "\" > \"" + outputFile + "\" " + redir;
    }
    
    var script = new File(scriptName);
    if (!script.open("w")) {
      throw "Unable to open script file: " + script.fsName;
    }
    script.writeln(cmdline);
    script.close();
    if (!script.execute()) {
      throw "Execution failed for " + script.fsName;
    }

    return outputFile;
  }
};

function bash(exe, args) {
  return (new ExecRunner()).bash(exe, args, " 2>&1");
};
function exec(exe, args) {
  return (new ExecRunner()).exec(exe, args, "");
};

exec(sExe,sArgs)
}//BECS.RunCommandLine


//////////////////////////////////////////////////////////////START - XML USES STDLIB  (find something else)////////////////////////////////////////////////////////////////////////////////
//http://www.ps-scripts.com/bb/viewtopic.php?f=9&t=3474&p=15764&hilit=read+ini&sid=7b96dbb13c5c42663a0cfc4bb407a0f6#p15764
function objectToXML (obj, name, xml) {
  if (!xml) {
    if (name == undefined) {
      name = "Object";
    }
    xml = new XML('<' + name + "></" + name + '>');
    // do the eval because of non-CS/2 syntax
    eval('xml.@type = (obj instanceof Array) ? "array" : "object"');
  }

  function _addChild(xml, obj, idx) {
    var val = obj[idx];

    var isArray = (obj instanceof Array);

    // skip 'hidden' properties
    if (idx.toString()[0] == '_') {
      return undefined;
    }

    // just skip undefined values
    if (val == undefined) {
      return undefined;
    }
    var type = typeof val;

    var child;

    switch (type){
    case "number":
    case "boolean":
    case "string":
      if (!isNumber(idx)) {
        child = new XML('<' + idx + "></" + idx + '>');
      } else {
        child = new XML('<el' + idx + "></el" + idx + '>');
      }
      child.appendChild(val);
      // do the eval because of non-CS/2 syntax
      eval('child.@type = type');
      break;

    case "object":
      child = objectToXML(val, idx);
      break;

    default:
      return undefined;
      break;
    }

    xml.appendChild(child);
  };

  if (obj instanceof Array) {
    for (var i = 0; i < obj.length; i++) {
      _addChild(xml, obj, i);
    }
  } else {
    for (var idx in obj) {
      _addChild(xml, obj, idx);
    }
    if (xml.children().length() == 0) {
      xml.appendChild(obj.toString());
      // do the eval because of non-CS/2 syntax
      eval('xml.@type = "string"');
    }
  }

  return xml;
};

function xmlToObject (xml, obj, parent) {
  if (xml.constructor == String) {
    xml = new XML(xml);
  } else if (xml instanceof XML) {
    xml = xml.copy();
  } else {
    Error.runtimeError(2, "xml");
  }

  xml.normalize();

  if (xml.hasSimpleContent()) {
    var str = xml.toString();
    if (parent) {
      parent[xml.localName()] = str;
    }
    return str;
  }

  var type;
  // do the eval because of non-CS/2 syntax
  eval('type = xml.@type.toString()');

  if (type == 'array') {
    obj = [];
  } else {
    obj = {};
  }

  var els = xml.elements();
  var len = els.length();
  if (len > 0) {
    for (var i = 0; i < len; i++) {
      var child = els[i];
      var val = '';
      var idx = (type == 'array') ? i : child.localName();

      if (child.hasComplexContent()) {
        val = xmlToObject(child);
      }

      if (child.hasSimpleContent()) {
        var ctype;
        // do the eval because of non-CS/2 syntax
        eval('ctype = child.@type.toString()');
        val = child.text().toString();

        if (val) {
          if (ctype == 'number') {
            val = Number(val);
          }
          if (ctype == 'boolean') {
            val = val.toLowerCase() == 'true';
          }
        }
      }

      obj[idx] = val;
    }
  } else {
    obj = xml.toString();
  }

  if (parent) {
    parent[xml.localName()] = obj;
  }

  return obj;
};


function _xmlTest() {
  var obj = {
    str: 'A String',
    num: 123,
    bool: true,
    inner: {
      inStr: 'string 2',
      n: 231231,
      //opts: SaveOptions.DONOTSAVECHANGES
    },
    ary: ['black', 'blue', 'red']
  };
  var xml = objectToXML(obj, 'Preferences');
  var str = xml.toXMLString();
  var f = new File(Folder.desktop + '/prefs.xml');
  f.open('w');
  f.close();
  f.open('r');
  var xmlStr = f.read();
  f.close();
  xml = new XML(xmlStr);
  var xobj = xmlToObject(xml);
  alert(xobj)
};
