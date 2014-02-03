$(function() {
    // Set some states
    $('ul li.catalog').addClass('active').append($('<div>').addClass('arrow-left'));
    $('ul.categories').append($('ul.root-category-data').html());

    // Selectors that are used quite a bit
    var breadcrumbs = 'nav.catalog ul.breadcrumbs';
    var desktopBreadCrumbs = 'div.breadcrumbs ul';
    var templates = 'nav.catalog ul.templates';
    var templateDetails = 'nav.catalog div.template-details';
    var categories = 'nav.catalog ul.categories';
    var serviceItemContent = 'div.service-item-content';
    var loader = '#loader';
    
    // Click event for menus
    $(categories).on('click', 'li', function(event) {
        event.preventDefault();
        // Get current clicked category id and name
        var categoryId =  $(this).data('id');
        var categoryName =  $(this).data('name');
        // Find category's children and get the html
        var currentSubcategories = $('ul.category-data li[data-id=' + categoryId + ']').find('ul.subcategory-data').html();
        // Display the category's children if not undefined
        currentSubcategories !== undefined ? $(categories).html(currentSubcategories) : $(categories).empty();
        // Find category's templates and get the html
        var currentTemplates = $('ul.category-data li[data-id=' + categoryId + ']').find('ul.template-data').html();
        // Display the category's templates into div
        currentTemplates !== undefined ? $(templates).html(currentTemplates) : $(templates).empty();
        // Create new bread crumb with the category's information
        $(breadcrumbs).append(
            $('<li>').attr('data-id', $(this).data('id'))
                .attr('data-name', $(this).data('name'))
                .attr('data-description', $(this).data('description'))
                .attr('data-description-id', $(this).data('description-id'))
                .append($(this).data('name'))
                .append(
                    $('<i>').addClass('fa fa-chevron-circle-left')
                )
        );
        // Desktop breadcrumbs
        $(desktopBreadCrumbs).append(
            $('<li>').attr('data-id', $(this).data('id'))
                .attr('data-name', $(this).data('name'))
                .attr('data-description', $(this).data('description'))
                .attr('data-description-id', $(this).data('description-id'))
                .append(
                    $('<a>').attr('href', 'javascript:void(0)')
                        .append($(this).data('name')
                    )
                )
                .prepend('&nbsp;/&nbsp;')
        );
        // Set divider
        setNavDivider();
        // Get description
        if($(window).width() > 767) {
            getDescription.call(this);
        }
    });
    // Click event for template details
    $(templates).on('click', 'li', function(event) {
        event.preventDefault();
        var templateName =  $(this).data('name');
        // Clean up
        if($(window).width() < 767) {
            $(templates).empty();
            $(categories).empty();
        }
        // Hide service item content
        $(serviceItemContent).hide();
        // Show details
        $(templateDetails).html($(this).find('div.template-details-data').html()).show();
        // Create new bread crumb with the template's information
        $(breadcrumbs).append(
            $('<li>').attr('data-id', $(this).data('id'))
                .attr('data-name', $(this).data('name'))
                .append($(this).data('name'))
                .attr('data-description', $(this).data('description'))
                .attr('data-description-id', $(this).data('description-id'))
                .append(
                    $('<i>').addClass('fa fa-chevron-circle-left')
                )
        );
    });
    
    // Click event for breadcrumbs
    $(breadcrumbs).on('click', 'li', function(event) {
        event.preventDefault();
        $(templateDetails).empty();
        // Get previous id
        var previousCategoryId = $(this).prev().data('id');
        // Check if root bread crumb is selected or prev undefined
        if(previousCategoryId === 'root' || previousCategoryId === undefined) {
            $(categories).html($('ul.root-category-data').html());
            $(templates).empty();
            if(previousCategoryId !== undefined) {
                $(this).remove();
            }  
        } else {
            var currentSubcategories = $('ul.category-data li[data-id=' + previousCategoryId + ']').find('ul.subcategory-data').html();
            // Display the category's children if not undefined
            currentSubcategories !== undefined ? $(categories).html(currentSubcategories) : $(categories).empty();
            var currentTemplates = $('ul.category-data li[data-id=' + previousCategoryId + ']').find('ul.template-data').html();
            // Display the category's templates into div
            currentTemplates !== undefined ? $(templates).html(currentTemplates) : $(templates).empty();
            // Remove current breadcrumb
            $(this).remove();
        }
        // Set divider
        setNavDivider();
    });

    // Click event for breadcrumbs
    $(desktopBreadCrumbs).on('click', 'li', function(event) {
        event.preventDefault();
        $(templateDetails).empty().hide();
        // Get previous id
        var categoryId = $(this).data('id');
        if(categoryId === 'home') {
            alert('Home page not implemented');
        // Check if root bread crumb is selected or prev undefined
        } else if(categoryId === 'root' || categoryId === undefined) {
            $(categories).html($('ul.root-category-data').html());
            $(templates).empty();
            $(serviceItemContent).show();
            if(categoryId !== undefined) {
                $(this).next().remove();
            }
        } else {
            var currentSubcategories = $('ul.category-data li[data-id=' + categoryId + ']').find('ul.subcategory-data').html();
            // Display the category's children if not undefined
            currentSubcategories !== undefined ? $(categories).html(currentSubcategories) : $(categories).empty();
            var currentTemplates = $('ul.category-data li[data-id=' + categoryId + ']').find('ul.template-data').html();
            // Display the category's templates into div
            currentTemplates !== undefined ? $(templates).html(currentTemplates) : $(templates).empty();
            // Remove
            $(this).next().remove();
            // Get description
            getDescription.call(this);
        }
        // Set divider
        setNavDivider();
    });

    /* This will display template and category descriptions */
    var descriptions = {};
    function getDescription() {
        var descriptionId = $(this).data("description-id");
        if (descriptionId) {
           $('#preview').empty();
           if (descriptions[descriptionId] === undefined) {
               BUNDLE.ajax({
                   cache: false,
                   type: "get",
                   url: BUNDLE.applicationPath + "DisplayPage?srv=" + encodeURIComponent(descriptionId),
                   beforeSend: function(jqXHR, settings) {
                        $(serviceItemContent).hide();
                        $(loader).show();
                   },
                   success: function(data, textStatus, jqXHR) {
                       // Cache the description
                       descriptions[descriptionId] = data;
                       $(loader).hide();
                       $(templateDetails).html(data).show();
                   },
                   error: function(jqXHR, textStatus, errorThrown) {
                       // A 401 response will be handled by the BUNDLE.ajax function
                       // so we will not handle that response here.
                       if (jqXHR.status !== 401) {
                           $(loader).hide();
                           $(templateDetails).html("Could not load description.")
                       }
                   }
               });
           } else {
                $(serviceItemContent).hide();
                $(templateDetails).html(descriptions[descriptionId]).show();
           }
        } else {
           var description = $(this).data('description');
           $(serviceItemContent).hide();
           $(templateDetails).html(description).show();
        }
    }

   /* This hides or shows the divider between categories and templates nav */
   function setNavDivider() {
      if ($(templates + ' > li').exists() && $(categories + ' > li').exists()) {
          $('div.nav-divider').show();
      } else {
          $('div.nav-divider').hide();
      }
   }
});