
$('input[type=file]').on('filebatchuploadsuccess', function (event, data, previewId, index) {
    var form = data.form, files = data.files, extra = data.extra,
        response = data.response, reader = data.reader;
    
    //console.log('File uploaded');
    //console.log($(this).attr('name'));
    //console.log(response.files[0].fd);
    $(`input[name="${$(this).attr('name')}_fd"]`).val(response.files[0].fd);
})