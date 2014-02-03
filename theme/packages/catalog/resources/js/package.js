$(function() {
    dropDown();
});

function dropDown() {
    var firstHover = true;
    $('ul.dropdown-menus').on({
        mouseenter: function() {
            if (firstHover) {
                firstHover = false;
            }
        }
    }, 'li.category');

    $('nav ul.nav li.dropdown').on({
        mouseenter: function() {
            // Show flyout table with root cats
            $(this).find('table.flyout-table').show();
            $(this).addClass('nav-hover');
            $(this).find('i.nav-sprite').css({'background-position':'-127px -22px'});
        },
        mouseleave: function() {
            // Reset first hover to true so animation will work again
            firstHover = true; 
            // Reset flyout
            $(this).find('.flyout').width('250px');
            $('.subcats-wrap').hide();
            $(this).find('.flyout-table').addClass('exposed-skin');
            // Reset drop down and dropdown flyout table
            $('nav ul.nav li.dropdown').removeClass('nav-hover');
            $('i.nav-sprite').css({'background-position':'-127px -12px'});
            $(this).find('table.flyout-table').hide();
            $('.subcats-wrap').hide();
            $(this).find('.flyout-table').addClass('exposed-skin');
        }
    });
}

function flyout() {
    var firstHover = true;
    $('ul.dropdown-menus').on({
        mouseenter: function() {
            if (firstHover) {
                firstHover = false;
                // Animate flyout
                $('.flyout').animate({ width: '640px' });
            } else {
                // Show flyout
                $('.flyout').width('640px');
            }
            $('.subcats-wrap').show();
            $('.subcats').empty().html($(this).find('ul.subcategories').html()).show();
            $('.subcats').append($(this).find('.category-image').html());
            $('.flyout-table').removeClass('exposed-skin');
        }
    }, 'li.category');

    $('nav ul.nav li.dropdown').on({
        mouseenter: function() {
            // Show flyout table with root cats
            $('table.flyout-table').show();
            $(this).addClass('nav-hover');
            $(this).find('i.nav-sprite').css({'background-position':'-127px -22px'});
        },
        mouseleave: function() {
            // Reset first hover to true so animation will work again
            firstHover = true; 
            // Reset flyout
            $('.flyout').width('250px' );
            $('.subcats-wrap').hide();
            $('.flyout-table').addClass('exposed-skin');
            // Reset drop down and dropdown flyout table
            $('nav ul.nav li.dropdown').removeClass('nav-hover');
            $('i.nav-sprite').css({'background-position':'-127px -12px'});
            $('table.flyout-table').hide();
            $('.subcats-wrap').hide();
            $('.flyout-table').addClass('exposed-skin');
        }
    });
}