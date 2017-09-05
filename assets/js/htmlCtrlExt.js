$(document).ready(function () {

    // file uploader ext.
    $('input[type=file]').each((idx, elem) => {
        var name = $(elem).attr('name');
        var fileCount = ensureInt($(elem).attr('count'), 1);
        var initFds = ensureString($(elem).attr('init-fd'), '');

        initFds.split(',').forEach(function (e) { if (e) $(elem).after(`<img src="/message/snapshot/${e}" class="img-thumbnail" >`); });

        $(elem).after(`<input type=hidden name="${name}_fd" value="${initFds}"/>`)
            .fileinput({
                showPreview: true,
                uploadAsync: false,
                uploadUrl: `/message/image/${name}`, // server upload action
                language: "zh",
                allowedFileExtensions: ['jpg', 'png', 'gif'],
                maxFileCount: fileCount,
            }).on('filebatchuploadsuccess', function (event, data, previewId, index) {
                var form = data.form, files = data.files, extra = data.extra,
                    response = data.response, reader = data.reader;

                //console.log('File uploaded');
                //console.log($(this).attr('name'));
                //console.log(response.files[0].fd);
                $(`input[name="${name}_fd"]`).val(response.files.map(function (_) { return _.fd }).join(','));
            });
    });



    // star2 ext.
    $('div.star5Ext').each((idx, elem) => {
        $(elem).addClass('stars').append('<form></form>');
        var uiid = $(elem).attr('id') || `ui${parseInt(Math.random() * 10000)}`;
        console.log(uiid);
        [5, 4, 3, 2, 1].forEach((i) => {
            $('form', elem).append(`<input name=${$(elem).attr('data-name')} class="star star-${i}" id="star-${uiid}-${i}" type="radio" value=${i} ${i == $(elem).attr('data-rating') ? 'checked' : ''} />`)
                .append(`<label class="star star-${i}" for="star-${uiid}-${i}"></label>`);
        });
    });

    // dropdown dynamic load
    loadDropdownOption('select[name=country]');
    $(document).on('change', 'select[name=country]', (evt) => {
        loadDropdownOption('select[name=city]', $(evt.target).val());
    });
});


var loadDropdownOption = function (jqSelector, parentValue) {
    $(jqSelector).each((idx, element) => {
        var id = $(element).attr('dpId').replace("dp-", "");
        $.post("/Dropdown/load", { id: id, parV: parentValue || '' }, (data) => {
            $("option:not(:disabled)", element).remove();
            data.forEach(function (_) {
                $(element).append(`<option value=${_.v}>${_.t}</option>`);
            });
        });
    });
}