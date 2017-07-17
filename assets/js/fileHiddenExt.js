$(document).ready(function () {

    $('input[type=file]').each((idx, elem) => {
        var name = $(elem).attr('name');

        $(elem).after(`<input type=hidden name="${name}_fd" />`)
        .fileinput({
            showPreview: true,
            uploadAsync: false,
            uploadUrl: `/message/image/${name}`, // server upload action
            language: "zh",
            allowedFileExtensions: ['jpg', 'png', 'gif'],
            maxFileCount: 1,
        }).on('filebatchuploadsuccess', function (event, data, previewId, index) {
            var form = data.form, files = data.files, extra = data.extra,
                response = data.response, reader = data.reader;

            //console.log('File uploaded');
            //console.log($(this).attr('name'));
            //console.log(response.files[0].fd);
            $(`input[name="${name}_fd"]`).val(response.files[0].fd);
        });
    });



    // star2 ext. will move to separate file later

    $('div.star5Ext').each((idx, elem) => {
        $(elem).addClass('stars').append('<form></form>');
        var uiid = $(elem).attr('id') || `ui${parseInt(Math.random() * 10000)}`;
        console.log(uiid);
        [5,4,3,2,1].forEach((i) => {
            $('form', elem).append(`<input name=${$(elem).attr('data-name')} class="star star-${i}" id="star-${uiid}-${i}" type="radio" value=${i} ${ i==$(elem).attr('data-rating') ? 'checked' : '' } />`)
            .append(`<label class="star star-${i}" for="star-${uiid}-${i}"></label>`);
        });
    });
    
});