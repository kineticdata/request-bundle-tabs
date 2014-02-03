$(function() {
    // Slide navigation
    var contentSlide = $('div.content-slide');
    var firstToggleClick = true;
    var previousScrollTop = $(window).scrollTop();
    var currentScrollTop = '-' + $(window).scrollTop() + 'px';
    $('button.fa-bars').on('click', function(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        // Turn off any previous one events to prevent stacking
        contentSlide.off('click');
        $(window).off('resize');
        // First click of the button?
        if(firstToggleClick) {
            firstToggleClick = false;
            // Update scroll top information
            previousScrollTop = $(window).scrollTop();
            currentScrollTop = '-' + $(window).scrollTop() + 'px';
            startMobileNavigation(contentSlide, $(this).data('target'), currentScrollTop);
            // Create one reset display event for resize
            $(window).one('resize', function() {
                // If the current active element is a text input, we can assume the soft keyboard is visible.
               if($(document.activeElement).attr('type') !== 'search') {
                    firstToggleClick = true;
                    resetDisplay(contentSlide, contentSlide.data('target'), previousScrollTop);
               }
            }); 
            // Create one reset display event on content slide
            contentSlide.one('click', function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();
                firstToggleClick = true;
                resetDisplay(this, $(this).data('target'), previousScrollTop); 
            });
        } else {
            firstToggleClick = true;
            resetDisplay(contentSlide, $(this).data('target'), previousScrollTop);     
        }
    });
});

// This should remove address bar in cell phones
if (navigator.userAgent.indexOf('iPhone') != -1 || navigator.userAgent.indexOf('Android') != -1) {
    addEventListener('load', function() {
        setTimeout(hideUrlBar, 0);
    }, false);
}
// Hides the url bar inside mobile devices
function hideUrlBar() {
    if (window.location.hash.indexOf('#') == -1) {
        window.scrollTo(0, 1);
    }
}

function range(start, end) {
    var array = new Array();
    for(var i = start; i <= end; i++) {
        array.push(i);
    }
    return array;
}

/**
 * @param contentWrap selector
 * @param menuWrap selector
 * @param top
 * @return void
 */
function startMobileNavigation(contentWrap, menuWrap, top) {
    // Disable click events on content wrap
    $(contentWrap).find('div.pointer-events').css({'pointer-events':'none'});
    $(contentWrap).find('header.main, header.sub').css({'left': '240px'});
    $(contentWrap).css({'position':'fixed', 'min-width':'480px', 'top': top, 'bottom':'0', 'right':'0', 'left':'240px'});
    $(menuWrap).show();
    // Set the scroll top again for navigation slide. This will not affect content wrap since it's position is now fixed.
    // @TODO might want to adjust based on which li is active $(window).scrollTop($(menuWrap).find('ul li.active').offset().top - 60);
    $(window).scrollTop(0);
}
/**
 * @param contentWrap selector
 * @param menuWrap selector
 * @param top
 * @return void
 */
function resetDisplay(contentWrap, menuWrap, top) {
    $(contentWrap).find('header.main, header.sub').css({'left': '0'});
    $(contentWrap).css({'position':'static', 'left':'0', 'width':'auto', 'min-width':'0'});
    // Enable click events on content wrap
    $(contentWrap).find('div.pointer-events').css({'pointer-events':'auto'});
    $(menuWrap).hide();
    // Return scroll top to original state
    $(window).scrollTop(top);
}

// Returns the version of Internet Explorer or a -1
// (indicating the use of another browser).
// From: http://msdn.microsoft.com/en-us/library/ms537509(v=vs.85).aspx
function getInternetExplorerVersion() {
    var rv = -1; // Return value assumes failure.
    if (navigator.appName == 'Microsoft Internet Explorer') {
        var ua = navigator.userAgent;
        var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null) {
            rv = parseFloat( RegExp.$1 );
        }
    }
    return rv;
}

// This jQuery method can be used to check the existance of dom elements
jQuery.fn.exists = function() {
    return this.length > 0;
}

/**
 * @return object url parameters
 */
function getUrlParameters() {
  var searchString = window.location.search.substring(1)
    , params = searchString.split("&")
    , hash = {}
    ;

  for (var i = 0; i < params.length; i++) {
    var val = params[i].split("=");
    hash[unescape(val[0])] = unescape(val[1]);
  }
  return hash;
}

/**
 * Live jQuery hover function used to display specific behavior when a user hovers over dhildren selector.
 * The parent slector of the children are quired for the even to be live.
 * @param parentSelector string
 * @param childSelector string
 * @param mouseEnter function
 * @param mouseLeave function
 */
function hover(parentSelector, childSelector, mouseEnter, mouseLeave) {
    $(parentSelector).on({
        mouseenter: function() {
            if(mouseEnter != null) {
                mouseEnter(this);
            }
        },
        mouseleave: function() {
            if(mouseLeave != null) {
                mouseLeave(this);
            }
        }
    }, childSelector);
}

/**
 * @param obj object
 * IE ONLY - used with the styles "preRequiredLabel
 * Example: *.preRequiredLabel { zoom: expression(setIE7PreRequired(this)); }
 */
setIE7PreRequired = function(obj) {
    if($(obj).hasClass('preRequiredLabel')) {
        if(obj.innerHTML.indexOf("*")==-1) {
            $(obj).append("*");
        }
    }
}

/**
 * @param email string
 * @param displaySelector string
 */
function gravatar(email, displaySelector) {
    var lowercaseEmail = email.toLocaleLowerCase();
    var md5 = $.md5(lowercaseEmail);
    var gravatarHtml = '<img src="https://secure.gravatar.com/avatar/'+md5+'" />';
    $(displaySelector).html(gravatarHtml);
}

/**
 * Message class
 */
function Message() {
    'use strict';

    /**
     * @var string private
     */
    var message = new String();

    /**
     * @param msg
     * @return Message
     */
    this.setMessage = function(msg) {
        message = msg;
        return this;
    }

    /**
     * @return error message
     */
    this.getErrorMessage = function() {
        return '<div class="message alert alert-error"><a class="close" data-dismiss="alert">x</a>'+message+'</div>';
    }

    /**
     * @return success message
     */
    this.getSuccessMessage = function() {
        return '<div class="message alert alert-success"><a class="close" data-dismiss="alert">x</a>'+message+'</div>';
    }

    /**
     * @return info message
     */
    this.getWarningMessage = function() {
        return '<div class="message alert alert-info"><a class="close" data-dismiss="alert">x</a>'+message+'</div>';
    }
}