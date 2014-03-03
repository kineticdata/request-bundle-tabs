if (typeof String.prototype.startsWith != 'function') {
  // see below for better implementation!
  String.prototype.startsWith = function (str){
    return this.indexOf(str) == 0;
  };
}

var displayFields = {
    'Closed': 'CLOSED ON',
    'Customer Survey Status': 'Customer Survey Status',
    'Display Status': 'Display Status',
    'Id': 'Id',
    'Modified': 'STARTED ON',
    'Originating Id': 'Originating Id',
    'Originating Name': 'Originating Name',
    'Originating Request Id': 'Originating Request Id',
    'Request Id': 'REQUEST ID#',
    'Request Status': 'Request Status',
    'Requested For': 'REQUESTED FOR',
    'Sent': 'SENT ON',
    'Service Item Image': 'Service Item Image',
    'Service Item Type': 'Service Item Type',
    'Submit Type': 'Submit Type',
    'Submitted': 'SUBMITTED ON',
    'Template Name': 'Template Name'
}

/**
 * Define the common table options and callbacks
 */
var tableParams = { 
    // Define table specific properties
    'Open Request': {
        displayFields: displayFields,
        sortField: 'Modified',
        rowCallback: defaultRowCallback,
        fieldCallback: defaultFieldCallback,
        completeCallback: defaultCompleteCallback
    },
    'Closed Request': {
        displayFields: displayFields,
        sortField: 'Modified',
        rowCallback: defaultRowCallback,
        fieldCallback: defaultFieldCallback,
        completeCallback: defaultCompleteCallback
    },
    'Draft Request': {
        displayFields: displayFields,
        sortField: 'Modified',
        rowCallback: defaultRowCallback,
        fieldCallback: defaultFieldCallback,
        completeCallback: defaultCompleteCallback
    },
    'Pending Approval': {
        displayFields: displayFields,
        sortField: 'Modified',
        rowCallback: defaultRowCallback,
        fieldCallback: defaultFieldCallback,
        completeCallback: defaultCompleteCallback
    },
    'Completed Approval': {
        displayFields: displayFields,
        sortField: 'Modified',
        rowCallback: defaultRowCallback,
        fieldCallback: defaultFieldCallback,
        completeCallback: defaultCompleteCallback
    }
};

/**
 * Row callback
 * Builds the li
 */
function defaultRowCallback(li, record, index, displayFields) {
    // Li styles
    li.addClass('border rounded');

    /* Start left column */
    // Left column Originating Request Id
    var leftColumn = $('<div>').addClass('col-sm-4 border-right')
        .append(
            $('<div>').addClass('request-id-label')
                .append(displayFields['Request Id'] + '&nbsp;')
        ).append(
            $('<div>').addClass('request-id-value')
                .append(record['Originating Request Id'])
        );

    if(record['Requested For'] !== null) {
        leftColumn.append(
            $('<div>').addClass('requested-for-label')
                .append(displayFields['Requested For'] + '&nbsp;')
        ).append(
            $('<div>').addClass('requested-for-value')
                .append(record['Requested For'])
        );
    }

    // Draft date
    if(record['Customer Survey Status'] === 'In Progress') {
        var submissionDateLabel = $('<div>').addClass('submitted-label')
            .append(displayFields['Modified']);
        var submissionDateValue = $('<div>').addClass('submitted-value')
            .append(((record['Modified'] !== null) ? moment(record['Modified']).format('MMMM DD, YYYY') : ""));
    // Closed date including completed approvals
    } else if(record['Request Status'] === 'Closed') {
        var submissionDateLabel = $('<div>').addClass('submitted-label')
            .append(displayFields['Closed']);
        var submissionDateValue = $('<div>').addClass('submitted-value')
            .append(((record['Closed'] !== null) ? moment(record['Closed']).format('MMMM DD, YYYY') : ""));
    // Pending approval date
    } else if(record['Display Status'] === 'Awaiting Approval') {
        var submissionDateLabel = $('<div>').addClass('submitted-label')
            .append(displayFields['Sent']);
        var submissionDateValue = $('<div>').addClass('submitted-value')
            .append(((record['Sent'] !== null) ? moment(record['Sent']).format('MMMM DD, YYYY') : ""));
    // Submitted date
    } else {
        var submissionDateLabel = $('<div>').addClass('submitted-label')
            .append(displayFields['Submitted']);
        var submissionDateValue = $('<div>').addClass('submitted-value')
            .append(((record['Submitted'] !== null) ? moment(record['Submitted']).format('MMMM DD, YYYY') : ""));
    }

    var viewRequestLink = $('<div>').addClass('view-request-details')
        .append(
            $('<a>')
                .attr('href', encodeURI(BUNDLE.applicationPath + 'ReviewRequest?csrv=' + record['Originating Id'] + '&excludeByName=Review Page&reviewPage=' + BUNDLE.config.reviewJsp))
                .attr('target', '_self')
                .append('View Submitted Form')
        );

    // Cannot open auto created requests
    ((record['Service Item Type'] !== BUNDLE.config.autoCreatedRequestType && record['Customer Survey Status'] !== 'In Progress') ? leftColumn.prepend(viewRequestLink) : submissionDateValue.css({'margin':'0 0 20px 0'}));
    leftColumn.prepend(submissionDateValue).prepend(submissionDateLabel);
    li.append(leftColumn);
    /* End left column */

    /* Start right column */
    var rightColumn = $('<div>').addClass('col-sm-8');
    var wrap = $('<div>').addClass('left clearfix');

    // Template name
    var contentWrap = $('<div>').addClass('content-wrap')
        .append(
            $('<div>').addClass('originating-name')
                .append(record['Originating Name'])
        );

    // Service item image
    if(record['Service Item Image'] !== null) {
        var imagePath;
        if(record['Service Item Image'].startsWith('http://')) {
            imagePath = record['Service Item Image'];
        } else {
            imagePath = BUNDLE.config.serviceItemImagePath + record['Service Item Image'];
        }
        var image = $('<div>').addClass('image')
            .append(
                $('<img>').attr('width', '40')
                    .attr('src', imagePath)
            )
        contentWrap.prepend(image);
    }

    // Validation status/display status and content wrap
    rightColumn.append(
        wrap.append(
            $('<div>').addClass('display-status')
            .append(record['Display Status'])
        ).append(contentWrap)
    );

    /* Start inner right column */
    var innerRightColumn = $('<div>').addClass('right');
    // Set instance id used viewing activity (deals with approvals and children requests)
    var instanceId = record['Originating Id'];
    // Complete button
    if(record['Customer Survey Status'] === 'In Progress') {
        innerRightColumn.append(
            $('<a>').addClass('complete-request templateButton')
                .attr('href', encodeURI(BUNDLE.applicationPath + 'DisplayPage?csrv=' + instanceId + '&return=yes'))
                .append('Complete Form')
        );
    }
    // View activity details button
    if(record['Customer Survey Status'] !== 'In Progress' && record['Submit Type'] !== 'Approval') {
        innerRightColumn.prepend('<br />')
            .prepend(
                $('<a>').addClass('view-activity templateButton')
                    .attr('href', encodeURI(BUNDLE.config.submissionActivityUrl + '&id=' + instanceId))
                    .attr('target', '_self')
                    .append('View Activity Details')
            );
    }
    // Complete approval button
    if(record['Customer Survey Status'] === 'Sent' && record['Submit Type'] === 'Approval') {
        innerRightColumn.prepend('<br />')
            .prepend(
                $('<a>').addClass('view-activity templateButton')
                    .attr('href', encodeURI(BUNDLE.applicationPath + 'DisplayPage?csrv=' + record['Id']))
                    .attr('target', '_self')
                    .append('Complete Approval')
            );
    }
    rightColumn.append(innerRightColumn);
    li.append(rightColumn);
    /* End inner right column */
    /* End right column */
}

/**
 * Field callback
 */
function defaultFieldCallback(li, value, fieldname, label) {}

/**
 * Complete callback
 */
function defaultCompleteCallback() {
    // If window height larger than content slide, get more results
    if($(window).height() > $('div.content-slide').height()) {
        $('nav.pagination ul.links li.active').next().find('a').trigger('click')
    }
}

function initialize(table, status, entryOptionSelected) {
    var loader = $('div#loader');
    var responseMessage = $('div.results-message');
    // Start list
    $('div.results').consoleList({
        displayFields: table.displayFields,
        paginationPageRange: 5,
        pagination: true,
        entryOptionSelected: entryOptionSelected,
        entryOptions: [5, 10, 20, 50, 100],
        entries: false,
        info: false,
        emptyPreviousResults: false,
        sortOrder: 'DESC',
        serverSidePagination: true,
        sortOrderField: table.sortField,
        dataSource: function(limit, index, sortOrder, sortOrderField) {
            var widget = this;
            // Execute the ajax request.
            BUNDLE.ajax({
                dataType: 'json',
                cache: false,
                type: 'get',
                url: BUNDLE.packagePath + 'interface/callbacks/submissions.json.jsp?qualification=' + status + '&offset=' + index + '&limit=' + limit + '&orderField=' + sortOrderField + '&order=' + sortOrder,
                beforeSend: function(jqXHR, settings) {
                    responseMessage.empty();
                    loader.show();
                },
                success: function(data, textStatus, jqXHR) {
                    loader.hide();
                    if(data.count > 0) {
                        widget.buildResultSet(data.data, data.count);
                        $('h3').hide();
                        widget.consoleList.show();
                        // Allow scroll to fire again
                        killScroll = false;
                    } else {
                        $('section.container nav.submissions-navigation').show();
                        responseMessage.html('<h4>There Are No ' + status + 's</h4>').show();
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    loader.hide();
                    responseMessage.html(errorThrown).show();
                }
            });
        },
        rowCallback: function(li, record, index, displayFields) { table.rowCallback.call(this, li, record, index, displayFields); },
        fieldCallback: function(li, value, fieldname, label) { table.fieldCallback.call(this, li, value, fieldname, label); },
        completeCallback: function() { table.completeCallback.call(this); }
    });
    // Keeps the scroll from firing until ajax completed
    var killScroll = false;
    // Paginate more results when user is close to bottom of page on scroll
    $(window).on('scroll', function(event) {    
        if(($(window).scrollTop() + window.innerHeight + 300) > $(document).height()) {
            if (killScroll == false) {
                // Prevent event stacking
                killScroll = true;
                $('nav.pagination ul.links li.active').next().find('a').trigger('click');
            }
        }
    });
}