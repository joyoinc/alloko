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
        [5, 4, 3, 2, 1].forEach((i) => {
            $('form', elem).append(`<input name=${$(elem).attr('data-name')} class="star star-${i}" id="star-${uiid}-${i}" type="radio" value=${i} ${i == $(elem).attr('data-rating') ? 'checked' : ''} />`)
                .append(`<label class="star star-${i}" for="star-${uiid}-${i}"></label>`);
        });
    });

    // linked dropdown ext. 
    var bindLinkedDropdown = function (lvl1UL, lvl2UL, lvl1INPUT, lvl2INPUT, lvl1Data, lvl2Data) {
        lvl1Data.forEach(function (e, idx) {
            $(lvl1UL).append(`<li><a id=${e.id} class='input-link' target='${$(lvl1INPUT).attr('name')}'>${e.text}</a></li>`);
        });

        lvl2Data.forEach(function (e, idx) {
            $(lvl2UL).append(`<li><a id=${e.id} parent=${e.parent} class='input-link' target='${$(lvl2INPUT).attr('name')}'>${e.text}</a></li>`);
        });

        $(document).on('click', 'a.input-link', function (evt) {
            evt.preventDefault();
            var t = $(this).attr('target');
            var oldValue = $(`input[name=${t}]`).val();
            if (oldValue !== $(this).text()) {
                $(`input[name=${t}]`).val($(this).text()).trigger('change');
            }
        });

        $(lvl1INPUT).on('change', function (evt) {
            evt.preventDefault();
            $(lvl2INPUT).val("");
            $('a.input-link', lvl2UL).hide();

            var currentLvl1Value = lvl1Data.find((elem) => { return elem.text === $(evt.target).val() });

            $('a.input-link', lvl2UL).filter((idx, elem) => {
                return $(elem).attr('parent') === currentLvl1Value.id;
            }).show();
        });
    };

    $.get('/location', (data) => {
        var uniq = {};
        var cities = [], countries = [];
        data.forEach(function (elem, idx) {
            if (!uniq.hasOwnProperty(elem.country)) {
                countries.push({ id: `country-${idx}`, text: elem.country });
                uniq[elem.country] = `country-${idx}`;
            }

            cities.push({ id: `city-${idx}`, text: elem.city, parent: uniq[elem.country] });
        });

        bindLinkedDropdown($('#country-menu'), $('#city-menu'),
            $('input[name=country]'), $('input[name=city]'),
            countries, cities);
    });

});