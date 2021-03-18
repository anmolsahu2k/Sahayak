var crimeAttributes = $("#alloptions div input[type='checkbox']");
crimeAttributes.on('change', function() {
    $('#crimeMsg').val(
        $.trim($('#crimeMsg').val()) + this.value
    );
});