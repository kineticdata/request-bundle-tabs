$(function() {
    // This hack arranges the buttons to work with float right and show up in the right order
    // NOTE: tried to wrap these in a div but it causes the request events (validation, etc) to unbind for the submit/continue button
    // NOTE: currently there is no perfect css solution with the buttons continue and submit shown on the right until a solution comes around where the 
    // client can better control the html dom structure of these buttons through request.
    $('form#pageQuestionsForm div.previousButton').insertAfter('form#pageQuestionsForm div.submitButton');
});

/**
 * Displays messages to div above template button layer
 * alert box.  This gives the benefit of displaying HTML formatted strings.
 * @method alertPanel
 * @private
 * @param {Object} options Defines the text information to display
 *     header: {String} The text to diaplay in the Panel header
 *     body:   {String} The text to display in the Panel body
 *     element: {HTMLElement} A form field to set the focus to on close
 * @return void
 */
KD.utils.ClientManager.alertPanel = function (options) {
    if (options == null) {
        options = {
            header: 'Alert',
            body: '',
            element: null
        };
    }
    if($('div.warningContainer').exists()) {
        $('div.warningContainer').html(options.body);
    } else {
        if($('div[label="Bottom of Page"]').exists()) {
            $('div[label="Bottom of Page"]').before('<div class="warningContainer alert alert-danger">' + options.body + '</div>');
        } else {
            $('div.templateButtonLayer').before('<div class="warningContainer alert alert-danger">' + options.body + '</div>');
        }
    }
};

/**
 * The KINETIC global namespace object
 * @class KINETIC
 * @static
 */
function $Obj(o){return YAHOO.util.Dom.get(o);}
function $Q(o){return KD.utils.Action.getQuestionValue(o);}
 
if (typeof KINETIC == "undefined") {
    KINETIC = {};
}
if (typeof KINETIC.serviceitems == "undefined") {
    KINETIC.serviceitems = {};
}

if (! KINETIC.serviceitems.Helper){

    KINETIC.serviceitems.Helper= new function(){
        
        this.displ_confirm = function(){
            var name=confirm("Click OK to accept transaction");
            if (name==true){
                document.pageQuestionsForm.submit();
                return true;
            }else{
                window.close();
            }
        }

        this.confirmCancel = function(validationStatus, reqStatus){
            var name=confirm("Click OK to Cancel Request");
            if (name==true){
                if (clientManager.customerSurveyId == "null" || clientManager.customerSurveyId == null){
                    window.location = BUNDLE.config['catalogUrl'];
                } else {
                    KD.utils.Action.setQuestionValue(validationStatus, "Cancelled");    
                    KD.utils.Action.setQuestionValue(reqStatus, "Closed");  
                    document.pageQuestionsForm.submit();
                    return true;
                }
            }else{
                return true;
            }
        }
        this.returnToPortal = function(){
            window.location = BUNDLE.config['catalogUrl'];
        }
        
        this.setOptional = function(validationStatus, saveSw){
            var bSave = document.getElementById("b_save");
            if (bSave) {
                bSave.disabled = true;
            }
            KD.utils.Action.setQuestionValue(saveSw, "Yes");
            KD.utils.Action.setQuestionValue(validationStatus, "Draft");
            var qstns = document.pageQuestionsForm.elements;
            for (var i = 0; i <= qstns.length; i++) {
                if (qstns[i]){
                   qstns[i].setAttribute("required", "");
                }
            }
            document.pageQuestionsForm.submit();
        }

        this.saveForLaterPage = function(catalogName){
            var returnValue = KINETIC.serviceitems.Helper.getParameter("return");
            if (returnValue == "yes") {
                var qstns = document.pageQuestionsForm.elements;
                var myButton;
                for (var i = 0; i <= qstns.length; i++){
                    if (qstns[i]){
                        if(qstns[i].getAttribute("value")=="Back"){
                            myButton=qstns[i];
                        }
                    }
                }
                if(myButton) {
                    myButton.click();
                }
            } else {
                window.location = BUNDLE.config['catalogUrl'];
            }
        }

        this.clickBackButton = function(){
            var returnValue = KINETIC.serviceitems.Helper.getParameter("return");
            if (returnValue == "yes") {
                var qstns = document.pageQuestionsForm.elements;
                var myButton;
                for (var i = 0; i <= qstns.length; i++){
                    if (qstns[i]){
                        if(qstns[i].getAttribute("value")=="Back"){
                            myButton=qstns[i];
                        }
                    }
                }
                if(myButton) {
                    myButton.click();
                }
            }
        }
        
        this.getParameter = function(param) {
            param = param.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
            var regexS = "[\\?&]"+param+"=([^&]*)";
            var regex = new RegExp( regexS );
            var results = regex.exec( window.location.href );
            if ( results == null ) 
                return "";
            else
                return results[1];
        }  
      
        // Standard date validation function used to ensure that the date passed is greater than today or 
        // today + a specified number of days  
        this.dateValidation = function(questionIDMDY, numDays){      
            var nowDate = new Date();
            var nowDateArray = new Array();
            nowDateArray[0] = nowDate.getFullYear();
            nowDateArray[1] = nowDate.getMonth() + 1;
            nowDateArray[2] = nowDate.getDate();
            nowDate.setFullYear(nowDateArray[0], (nowDateArray[1] - 1), nowDateArray[2]);

            var nowDateComputed = new Date();
            nowDateComputed.setFullYear(nowDateArray[0], (nowDateArray[1] - 1), nowDateArray[2]);

            // *** do we need to exclude weekend days when adding days here ?? ***
            if (numDays > 0) {
                nowDateComputed.setDate(nowDate.getDate()+numDays);
            } 
 
            // The document.getelementById function simpley retrieves the value from the hidden date field
            // from the date questions on the template
            var dateQuestionElm = KD.utils.Util.getElementObject(questionIDMDY);
            var dateQuestionID = dateQuestionElm.id.substr(7);
            var requestStartDate=document.getElementById("SRVQSTN_" + dateQuestionID).value;

            // The hidden date field stores the date as a string, so the following steps grab the individual
            // values convert them to integers and make a date out of them.
            // This is repeated for both Start and End dates.
            requestStartDateString = requestStartDate.split("-");
            var requestStartDateInt = new Array();
            requestStartDateInt[0] = parseInt(requestStartDateString[0],10);
            requestStartDateInt[1] = parseInt(requestStartDateString[1],10);
            requestStartDateInt[2] = parseInt(requestStartDateString[2],10);
            var requestStartDateFinal = new Date();
            requestStartDateFinal.setFullYear(requestStartDateInt[0], (requestStartDateInt[1] - 1), requestStartDateInt[2]);         

            // Finally, the dates are compared  
            if (numDays == 0 && requestStartDateFinal < nowDate) {
                alert('The date entered cannot be less than today\'s date. Please click OK to return to the service request details page to correct the date.');
                return false; 
            } else {
                return true;
            }
        } // End Function
     
     
        // Standard date validation function used to compare a start date and end date for accuracy
        this.dateValidationRange = function(questionIDStart, questionIDEnd, numDays, errorMsg, errorMsgDuration){
            //Set the current date so it can be put back into the date fields if the error comes up
            var nowDate = new Date();

            var nowDateArray = new Array();
            nowDateArray[0] = nowDate.getFullYear();
            nowDateArray[1] = nowDate.getMonth() + 1;
            nowDateArray[2] = nowDate.getDate();

            // The document.getelementById function simpley retrieves the value from the specified date fields
            // from the date questions on the template
            var startDateQuestionElm = KD.utils.Util.getElementObject(questionIDStart);
            var startDateQuestionID = startDateQuestionElm.id.substr(7);
            var requestStartDate=document.getElementById("SRVQSTN_" + startDateQuestionID).value;
    
            var endDateQuestionElm = KD.utils.Util.getElementObject(questionIDEnd);
            var endDateQuestionID = endDateQuestionElm.id.substr(7);    
            var requestEndDate=document.getElementById("SRVQSTN_" + endDateQuestionID).value;

            // The date field stores the date as a string, so the following steps grab the individual
            // values convert them to integers and make a date out of them.
            // This is repeated for both Start and End dates.
            requestStartDateString = requestStartDate.split('-');
            var requestStartDateInt = new Array();
            requestStartDateInt[0] = parseInt(requestStartDateString[0],10);
            requestStartDateInt[1] = parseInt(requestStartDateString[1],10);
            requestStartDateInt[2] = parseInt(requestStartDateString[2],10);
            var requestStartDateFinal = new Date();
            requestStartDateFinal.setFullYear(requestStartDateInt[0], (requestStartDateInt[1] - 1), requestStartDateInt[2]);

            requestEndDateString = requestEndDate.split('-');
            var requestEndDateInt = new Array();
            requestEndDateInt[0] = parseInt(requestEndDateString[0],10);
            requestEndDateInt[1] = parseInt(requestEndDateString[1],10);
            requestEndDateInt[2] = parseInt(requestEndDateString[2],10);
            var requestEndDateFinal = new Date();
            requestEndDateFinal.setFullYear(requestEndDateInt[0], (requestEndDateInt[1] - 1), requestEndDateInt[2]);
    
            var one_day = 1000*60*60*24;
            var computedDays = Math.ceil((requestEndDateFinal.getTime() - requestStartDateFinal.getTime())/one_day);
    
            // Finally, the dates are compared
            if (requestStartDateFinal>requestEndDateFinal) {   //checks to make sure the end date is greater than the start date
                alert(errorMsg);
                return false;  //the return value of false stops continued processing of the submit action
            } else if (numDays > 0 && computedDays > numDays) {    //checks the number of days between the start and end date entered
                alert(errorMsgDuration);
               return false;  
            } else {
                return true;
            }   
        }        
       
       
    }
};

var siHelper= KINETIC.serviceitems.Helper;
