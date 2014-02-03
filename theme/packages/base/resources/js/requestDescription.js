$(document).ready(function() {
    if($('[label="Description Right"]').exists()) {
        $('[label="Description Right"]').append($('a.create-request').show('fade', 1000));
    } else {
        $('a.create-request').show('fade', 1000);
    }
});