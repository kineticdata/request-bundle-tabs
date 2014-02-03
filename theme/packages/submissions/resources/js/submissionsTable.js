/**
 * Define the common table options and callbacks
 */
var tableParams = { 
    // Define table specific properties
    'Open Request': {
        displayFields: {
            'Originating Request Id': 'Request ID',
            'Submitted': 'Submitted',
            'Originating Name': 'Service Item',
            'Display Status': 'Status'
        },
        sortField: 'Submitted',
        rowCallback: defaultRowCallback,
        columnCallback: defaultColumnCallback,
        completeCallback: defaultCompleteCallback
    },
    'Closed Request': {
        displayFields: {
            'Originating Request Id': 'Request ID',
            'Closed': 'Closed',
            'Originating Name': 'Service Item',
            'Display Status': 'Status'
        },
        sortField: 'Closed',
        rowCallback: defaultRowCallback,
        columnCallback: defaultColumnCallback,
        completeCallback: defaultCompleteCallback
    },
    'Draft Request': {
        displayFields: {
            'Originating Request Id': 'Request ID',
            'Modified': 'Started',
            'Originating Name': 'Service Item',
            'Display Status': 'Status'
        },
        sortField: 'Modified',
        rowCallback: defaultRowCallback,
        columnCallback: defaultColumnCallback,
        completeCallback: requestsParkedCompleteCallback
    },
    'Pending Approval': {
        displayFields: {
            'Originating Request Id': 'Request ID',
            'Sent': 'Sent',
            'Originating Name': 'Service Item',
            'Display Status': 'Status'
        },
        sortField: 'Sent',
        rowCallback: defaultRowCallback,
        columnCallback: defaultColumnCallback,
        completeCallback: approvalsPendingCompleteCallback
    },
    'Completed Approval': {
        displayFields: {
            'Originating Request Id': 'Request ID',
            'Submitted': 'Submitted',
            'Originating Name': 'Service Item',
            'Display Status': 'Status'
        },
        sortField: 'Submitted',
        rowCallback: defaultRowCallback,
        columnCallback: defaultColumnCallback,
        completeCallback: defaultCompleteCallback
    }
};

/*
 * Default row callback
 */
function defaultRowCallback(tr, value, index) {
    // Data used for links and buttons
    tr.data('Originating Id', value['Originating Id']);
    tr.data('Originating Request Id', value['Originating Request Id']);
    tr.data('Id', value['Id']);
}

/*
 * Default column callback
 */
function defaultColumnCallback(td, value, fieldname, label) {
    // Note::jQuery data doesn't work on td
    if(fieldname === 'Sent' || fieldname === 'Submitted' || fieldname === 'Closed' || fieldname === 'Modified') {
        td.attr('data-timestamp', ((value !== null) ? moment(value).format('YYYY-MM-DD hh:mm:ss a') : ""))
        .text(
            moment(td.text()).fromNow()
        )
    }
    if(fieldname === 'Originating Request Id') { td.html($('<a>').addClass('review').attr('href', 'javascript:void()').append(value)); }
}

/**
 * Default Complete callback
 */
function defaultCompleteCallback() {   
    // Create Review and activity details links
    this.consoleTable.on('click touchstart', 'table tbody tr', function(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        if($(window).width() < 536) {
            // Determine if buttons were created before
            if($(this).next('tr.footable-row-detail').find('button').length === 0) {
                $(this).next('tr.footable-row-detail')
                    .find('div.footable-row-detail-inner')
                    .append(
                        $('<div>').addClass('footable-row-detail-row').append(
                            $('<button>').addClass('requests view-activity-details btn-xs btn-gray')
                                .attr('data-submission-id', $(this).data('Originating Id'))
                                .append('View Details')
                        ).append(
                            $('<button>').addClass('requests review btn-xs btn-gray')
                                .attr('data-submission-id', $(this).data('Originating Id'))
                                .append('View Form')
                        )
                    );
            }
        } else {
            window.open(BUNDLE.config['submissionActivityUrl']+'&id=' + $(this).data('Originating Id'));
        }
    });
     
    // Unobstrusive live on click event for view activity details
    this.consoleTable.on('click touchstart', 'button.view-activity-details', function(event) {
        // Prevent default action.
        event.preventDefault();
        event.stopImmediatePropagation();
        window.location = BUNDLE.config['submissionActivityUrl'] + '&id=' + $(this).data('submission-id');
    });

    // Unobstrusive live on click event for review request
    this.consoleTable.on('click touchstart', 'button.review', function(event) {
        // Prevent default action.
        event.preventDefault();
        event.stopImmediatePropagation();
        window.location = BUNDLE.applicationPath + 'ReviewRequest?excludeByName=Review%20Page&csrv=' + $(this).data('submission-id');
    });

    // jQuery unobstrusive live on click event for review request
    this.consoleTable.on('click', 'table tbody tr td a.review', function(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        window.open(BUNDLE.applicationPath + 'ReviewRequest?excludeByName=Review%20Page&csrv=' + $(this).parents('tr').data('Originating Id'));
    });
}

/**
 * Complete callback for parked requests
 */
function requestsParkedCompleteCallback() {
    // Unobstrusive live on click event for complete form
    this.consoleTable.on('click touchstart', 'button.complete-form', function(event) {
        // Prevent default action.
        event.preventDefault();
        event.stopImmediatePropagation();
        window.location = BUNDLE.applicationPath + 'DisplayPage?csrv=' + $(this).data('Originating Id') + '&return=yes';
    });

    // Create complete form link
    this.consoleTable.on('click touchstart', 'table tbody tr', function(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        if($(window).width() < 536) {
            // Determine if buttons were created before
            if($(this).next('tr.footable-row-detail').find('button').length === 0) {
                $(this).next('tr.footable-row-detail')
                    .find('div.footable-row-detail-inner')
                    .append(
                        $('<div>').addClass('footable-row-detail-row').append(
                            $('<button>').addClass('requests complete-form btn-xs btn-gray')
                                .attr('href', 'javascript:void()')
                                .attr('data-submission-id', $(this).data('Originating Id'))
                                .append('Complete Form')
                        )
                    );
            }
        } else {
            window.open(BUNDLE.applicationPath + 'DisplayPage?csrv=' + $(this).data('Originating Id') + '&return=yes');
        }
    });
}

/**
 * Complete callback for pending requests
 */
function approvalsPendingCompleteCallback() {
    // Unobstrusive live on click event for complete form
    this.consoleTable.on('click touchstart', 'button.complete-approval', function(event) {
        // Prevent default action.
        event.preventDefault();
        event.stopImmediatePropagation();
        window.location = BUNDLE.applicationPath + 'DisplayPage?csrv=' + $(this).data('Originating Id');
    });

    // Create complete approval link
    this.consoleTable.on('click touchstart', 'table tbody tr', function(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        if($(window).width() < 536) {
            // Determine if buttons were created before
            if($(this).next('tr.footable-row-detail').find('button').length === 0) {
                $(this).next('tr.footable-row-detail')
                    .find('div.footable-row-detail-inner')
                    .append(
                        $('<div>').addClass('footable-row-detail-row').append(
                            $('<button>').addClass('requests complete-approval btn-xs btn-gray')
                                .attr('href', 'javascript:void()')
                                .attr('data-submission-id', $(this).data('Originating Id'))
                                .append('Complete Approval')
                        )
                    );
            }
        } else {
            window.open(BUNDLE.applicationPath + 'DisplayPage?csrv=' + $(this).data('Originating Id'));
        }
    });
}

function initialize(table, status, entryOptionSelected) {
    var loader = $('div#loader');
    var responseMessage = $('div.results-message');
    // Start list
    $('div.results').consoleTable({
        displayFields: table.displayFields,
        paginationPageRange: 3,
        pagination: true,
        entryOptionSelected: entryOptionSelected,
        entryOptions: [5, 10, 20, 50, 100],
        entries: true,
        info: true,
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
                    widget.element.hide();
                    responseMessage.empty();
                    loader.show();
                },
                success: function(data, textStatus, jqXHR) {
                    loader.hide();
                    if(data.count > 0) {
                        widget.buildResultSet(data.data, data.count);
                        $('h3').hide();
                        widget.consoleTable.show();
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
        rowCallback: function(tr, value, index) { table.rowCallback.call(this, tr, value, index); },
        columnCallback: function(td, value, fieldname, label) { table.columnCallback.call(this, td, value, fieldname, label); },
        completeCallback: function() { 
            // Foo tables ui
            this.table.find('thead tr th:nth-child(3)').attr('data-hide', 'phone');
            this.table.find('thead tr th:nth-child(4)').attr('data-hide', 'phone');
            this.table.footable();
            this.table.trigger('footable_initialize');
            table.completeCallback.call(this);
        }
    });
}