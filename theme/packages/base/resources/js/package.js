$(function() {
    // This fix will correct the extra spacing created after the section header
    // because of the section header css of top -20px
    $('div.sectionHeader').next().css('margin', '-15px 0 0 0');
});

// Bundle js function for loading the review request iframe
// This function is able to determine when the iframe url has finished loading
function loadIframe(iFrameSelector, loaderSelector) {
    // Confirm if the csrv is stored as a data attribute
    if(typeof $(iFrameSelector).data('originating-csrv') != 'undefined') {
        var csrv = $(iFrameSelector).data('originating-csrv');
    } else {
        var csrv = clientManager.customerSurveyId;
    }
    $(iFrameSelector).attr('src', BUNDLE['applicationPath']+'ReviewRequest?csrv='+csrv+'&reviewPage=/'+BUNDLE['relativePackagePath']+'reviewFrame&loadAllPages=false&excludeByName=Review%20Page&noCache='+(new Date().getTime()));
    $(iFrameSelector).load(function() {
        $(loaderSelector).hide();
        $('#instructions').show();
        $('input[type="button"]').show();
        $(iFrameSelector).css({'visibility':'visible'});
    });
}