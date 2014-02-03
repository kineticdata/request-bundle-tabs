/**
 * jQuery Kinetic Data console table widget
 */
(function($) {
    $.widget('custom.consoleTable', {
        // Default opitons
        options: {
            entryOptionSelected: 5,
            entryOptions: [5, 10, 50, 100],
            page: 1,
            total: 0,
            paginationPageRange: 5,
            resultsPerPage: 0,
            entries: true,
            serverSidePagination: true
        },
        _create: function() {
            // Set current object context to use inside jquery objects
            var widget = this;
            // This is the first request, make a server call
            widget.firstRequest = true;
            // Hide
            widget.element.hide();
            // Build HTML
            widget.select = $('<select>').addClass('limit');
            $.each(widget.options.entryOptions, function(index, value) {
                if(value === widget.options.entryOptionSelected) {
                    widget.select.append($('<option>').val(value).text(value).attr('selected','selected'));
                } else if(index === 0) {
                    widget.select.append($('<option>').val(value).text(value).attr('selected','selected'));
                } else {
                    widget.select.append($('<option>').val(value).text(value));
                }
            });
            widget.refresh = $('<a>').addClass('refresh').attr('href', 'javascript:void(0)').text('Refresh');
            widget.table = $('<table>').addClass('kd-table');
            widget.information = $('<div>').addClass('information');
            widget.pagination = $('<nav>').addClass('pagination');
            widget.header = $('<div>').addClass('header');
            widget.consoleTable = $('<div>').addClass('console')
                .append(widget.header.append(widget.refresh));
            if(widget.options.entries) {
                widget.entriesSelection = $('<div>').addClass('entries-selection')
                    .prepend($('<span>').append('Show'))
                    .append(widget.select)
                    .append($('<span>').append('entries'));
                widget.header.prepend(widget.entriesSelection);
                    
            }
            widget.consoleTable.append(widget.table)
                .append(
                    $('<div>').addClass('footer')
                        .append(widget.information)
                        .append(widget.pagination)
                );
            // Add html to selector
            widget.element.html(widget.consoleTable);
            widget._createEvents();
            widget._makeRequest(1, widget.select.val());
        },
        _createEvents: function() {
            // Set current object context to use inside jquery objects
            var widget = this;
            // Click event for pagination
            widget.pagination.on('click touchstart', 'ul.links li a', function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();
                // Get Page
                page = $(this).data('page');
                // Set current page number for other events to use
                widget.element.data('page', page);
                // Execute the request and return results
                widget._makeRequest(page, widget.select.val());
            });

            // Click event for refresh
            widget.refresh.on('click touchstart', function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();
                // Make a server call again
                widget.firstRequest = true;
                // Execute the request and return results
                widget._makeRequest(1, widget.select.val());
            });

            // Click event for refresh
            widget.select.on('change', function(event) {
                // Prevent default action.
                event.preventDefault();
                // Execute the request and return results
                widget._makeRequest(1, widget.select.val());
            });

            // Click event for sorting
            widget.table.on('click touchstart', 'thead tr th', function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();
                var sortOrder;
                (($(this).data('sort-order') === 'DESC') ? sortOrder = 'ASC' : sortOrder = 'DESC');
                widget.options.sortOrder = sortOrder;
                widget.options.sortOrderField = $(this).data('field');
                // Make a server call again
                widget.firstRequest = true;
                // Execute the request and return results
                widget._makeRequest(1, widget.select.val());
            });
        },
        _makeRequest: function(page, resultsPerPage) {
            // Set current object context to use inside jquery objects
            var widget = this;
            // Pagination
            widget.options.resultsPerPage = resultsPerPage;
            if(widget.options.pagination) {
                widget.options.page = page;
            }
            if (widget.options.dataSource != undefined) { 
                if(widget.options.serverSidePagination) {
                    index = widget._getIndex();
                } else {
                    resultsPerPage = 0;
                    index = 0;
                }
                if(widget.firstRequest) {
                    widget.options.dataSource.call(
                        widget, 
                        resultsPerPage, 
                        index, 
                        widget.options.sortOrder, 
                        widget.options.sortOrderField
                    );
                } else {
                    widget.buildResultSet(widget.records, widget.recordCount);
                }
                // Disable subsequent server requests from performing if pagination isn't suppose to run server side
                if(!widget.options.serverSidePagination) { widget.firstRequest = false; }
            }
        },
        buildResultSet: function(records, recordCount) {
            // Set current object context to use inside jquery objects
            var widget = this;
            widget.records = records;
            widget.recordCount = recordCount;
            // Empty
            widget.table.empty();
            widget.information.empty();
            // Build theader
            var thead = $('<thead>');
            var tr = $('<tr>');
            $.each(widget.options.displayFields, function(fieldname, label) {
                var th = $('<th>');
                th.append(label)
                    .data('field', fieldname)
                    .data('sort-order', widget.options.sortOrder);
                // Sorting
                if(fieldname === widget.options.sortOrderField) {
                    th.addClass('kd-header-sorting-selected')
                        .append(
                        $('<span>').addClass('kd-header-sorting-' + widget.options.sortOrder)
                    );
                } else {
                    th.append(
                        $('<span>').addClass('kd-header-sorting')
                    );
                }
                tr.append(th);
            });
            thead.append(tr);
            // Build tbody
            var tbody = $('<tbody>');
            // Build client or server side pagination
            if(widget.options.serverSidePagination) {
                $.each(widget.records, function(index, value) {
                    // Create row
                    var tr = $('<tr>');
                    $.each(widget.options.displayFields, function(fieldname, label) {
                        // Create Column
                        var td = $('<td>');
                        // Append value
                        td.append(((value[fieldname] !== null) ? value[fieldname] : ""));
                        // Column callback
                        if (widget.options.columnCallback != undefined) { widget.options.columnCallback.call(widget, td, value[fieldname], fieldname, label); }
                        tr.append(td);
                    });
                    // Striping
                    ((index % 2 == 0) ? tr.addClass('kd-odd') : tr.addClass('kd-even'));
                    // Row callback
                    if (widget.options.rowCallback != undefined) { widget.options.rowCallback.call(widget, tr, value, index); }
                    // Append to tbody
                    tbody.append(tr);
                });
            } else {
                $.each(widget.records, function(index, value) {
                    if(index >= widget._getIndex() && index <= (widget._getIndex() + (widget.options.resultsPerPage  - 1))) {
                        // Create row
                        var tr = $('<tr>');
                        $.each(widget.options.displayFields, function(fieldname, label) {
                            // Create Column
                            var td = $('<td>');
                            // Append value
                            td.append(((value[fieldname] !== null) ? value[fieldname] : ""));
                            // Column callback
                            if (widget.options.columnCallback != undefined) { widget.options.columnCallback.call(widget, td, value[fieldname], fieldname, label); }
                            tr.append(td);
                        });
                        // Striping
                        ((index % 2 == 0) ? tr.addClass('kd-odd') : tr.addClass('kd-even'));
                        // Row callback
                        if (widget.options.rowCallback != undefined) { widget.options.rowCallback.call(widget, tr, value, index); }
                        // Append to tbody
                        tbody.append(tr);
                    }
                });
            } 
            // Build pagination links
            widget.options.total = widget.recordCount;
            if(widget.options.pagination) {
                widget.pagination.html(widget._buildHtmlPaginatationList());
            }
            // Append information
            if(widget.options.info) {
                widget.information.append('Showing&nbsp;')
                    .append(widget._getIndex() + 1)
                    .append('&nbsp;to&nbsp;')
                    .append(widget._getIndex() + tbody.find('tr').length)
                    .append('&nbsp;of&nbsp;')
                    .append(widget.options.total)
                    .append('&nbsp;entries');
            }
            // Append table data
            widget.table.append(thead)
                .append(tbody);
            // Show
            this.element.show();
            // Run complete callback
            widget._complete();
        },
        _complete: function() {
            if (this.options.completeCallback != undefined) { this.options.completeCallback.call(this); }
        },
        _getIndex: function() {
            return (this.options.page - 1) * this.options.resultsPerPage;
        },
        _getTotalPages: function() {
            return Math.ceil(this.options.total / this.options.resultsPerPage);
        },
        _buildPaginatationData: function() { 
            var startPage = 1;
            var currentPage = this.options.page;
            var endPage = this._getTotalPages();
            // Assume total pages is less than range
            var currentPageRange = this._range(1, endPage);
            // If total pages is greater than range, calculate page range based on current page
            if(endPage > this.options.paginationPageRange) {
                // Determine start range
                var startRange = currentPage - Math.floor(this.options.paginationPageRange / 2);
                // Determine end range
                var endRange = currentPage + Math.floor(this.options.paginationPageRange / 2);
                if(startRange <= 0) {
                    endRange += Math.abs(startRange) + 1;
                    startRange = startPage;
                }
                if(endRange > endPage) {
                    startRange -= endRange - endPage;
                    endRange = endPage;
                }
                // Assume range option is odd
                var offset = 0;
                // Determine if range is even or odd for building the correct range of page numbers shown
                if (this.options.paginationPageRange % 2 === 0) { offset = 1; }
                if(endPage !== endRange) {
                    endRange = endRange - offset;
                } else {
                    startRange = startRange + offset;
                }
                // Ensure start range is still 1 or greater
                if(startRange <= 0) { startRange = startPage; }
                currentPageRange = this._range(startRange, endRange);
            }
            // Initialize object
            var pages = new Object();
            var pageNumbers = new Array();
            if(currentPageRange.length > 1) {
                // Setup prev
                if(currentPage !== startPage) {
                    pages['prev'] = new Object({
                        'page':(currentPage - 1),
                        'label':'Prev'
                    });
                }
                // Setup link showing first page if not inside page range
                if($.inArray(startPage, currentPageRange) === -1) {
                    pages['firstPage'] = new Object({
                        'page':startPage,
                        'label':startPage + '...'
                    });
                }
                // Create page numbers
                $.each(currentPageRange, function(index, value) {
                    pageNumbers[index] = new Object({
                        'page':value,
                        'label':value
                    });
                });
                pages['pageRange'] = pageNumbers;
                // Setup link showing last page if not inside page range
                if($.inArray(endPage, currentPageRange) === -1) {
                    pages['lastPage'] = new Object({
                        'page':endPage,
                        'label':'... ' + endPage
                    });
                }
                // Setup next
                if(currentPage !== endPage) {
                    pages['next'] = new Object({
                        'page':currentPage + 1,
                        'label':'Next'
                    });
                }
            } else {
                pages = new Array();
            }
            return new Object({'pages':pages});
        },
        _range: function(start, end) {
            var array = new Array();
            for(var i = start; i <= end; i++) {
                array.push(i);
            }
            return array;
        },
        _buildHtmlPaginatationList: function() {
            // Set current object context to use inside jquery objects
            var widget = this;
            var paginationData = this._buildPaginatationData();
            var paginationList = $('<ul>').addClass('unstyled links');
            $.each(paginationData.pages, function(index, value) {
                if(index === 'pageRange') {
                    $.each(value, function(index, value) {
                        var li = $('<li>')
                                .append(
                                    $('<a>').attr('href', 'javascript(void)')
                                    .data('page', value.page)
                                    .text(value.label)
                                )
                        // Create Active class based selected page
                        if(value.page === widget.options.page) { li.addClass('active'); }
                        paginationList.append(li);
                    });
                } else {
                    paginationList.append(
                        $('<li>')
                        .append(
                            $('<a>').attr('href', 'javascript(void)')
                            .data('page', value.page)
                            .text(value.label)
                        )
                    );
                }
            });
            return paginationList;
        },
        _destroy: function() {
            this.consoleTable.remove();
        }
    });
})(jQuery);