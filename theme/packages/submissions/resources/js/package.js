$(function() {
    // Get query string parameters into an object
    var urlParameters = getUrlParameters();
    // Determine if type is a real type
    if(urlParameters.type !== 'requests' && urlParameters.type !== 'approvals') {
        urlParameters.type = 'requests';
    }
    // Determine if the status is a real status
    var statusCheck = true;
    $.each(tableParams, function(index) { 
        if(urlParameters.status === index) {
            statusCheck = false;
            return false;
        }
    });
    if(statusCheck) {
        if(urlParameters.type === 'requests') {
            urlParameters.status = 'Open Request';
        } else {
             urlParameters.status = 'Pending Approval';
        }
    }
    // Active link class
    var activeNavSelector = $('ul li.requests');
    if(urlParameters.type === 'approvals') { activeNavSelector = $('ul li.approvals') };
    activeNavSelector.addClass('active').append($('<div>').addClass('arrow-left'));
    // Set active link
    $('header.sub div.container ul li').each(function(index, value) {
        if(urlParameters.status == $(this).find('a').data('group-name')) {
            $(this).addClass('active');
        }
    });
    // Position scroll for small devices
    var activeLinkPosition = $('header.sub div.container > ul li.active').position();
    if(activeLinkPosition !== undefined && activeLinkPosition.left !== undefined) { $('header.sub div.container > ul').scrollLeft(activeLinkPosition.left); }
    // Get table specific properties
    var table = tableParams[urlParameters.status];
    // How many entries to show on page load
    var entryOptionSelected = 5;
    // Start table
    initialize(table, urlParameters.status, entryOptionSelected);
});