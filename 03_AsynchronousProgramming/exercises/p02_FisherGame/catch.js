function attachEvents() {
    const URL = 'https://baas.kinvey.com/appdata/kid_H1m3eoVfQ/biggestCatches';
    const USER = 'ivo';
    const PASS = 'ivo';
    const AUTHORIZATION = 'Basic ' +  btoa(`${USER}:${PASS}`);
    const ADD_BTN = $('#addForm .add');
    const LOAD_BTN = $('#aside .load');
    const CATCHES = $('#catches');

    function request(method, id, data) {
        return $.ajax({
            url : URL + '/' + id,
            method : method,
            headers : {
                Authorization : AUTHORIZATION,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data)
        });
    }

    // This function works correctly, but judge gives 60/100:
    // function request(method, id, data) {
    //     return $.ajax({
    //         url : URL + '/' + id,
    //         method : method,
    //         headers : {
    //             Authorization : AUTHORIZATION
    //         },
    //         data: data
    //     })
    // }

    ADD_BTN.on('click', create);
    LOAD_BTN.on('click', list);

    function getData(selector) {
        return{
            angler : $(`${selector} .angler`).val(),
            weight : Number($(`${selector} .weight`).val()),
            species : $(`${selector} .species`).val(),
            location : $(`${selector} .location`).val(),
            bait : $(`${selector} .bait`).val(),
            captureTime : Number($(`${selector} .captureTime`).val())
        }
    }
    
    function create() {
        ADD_BTN.attr('disabled', true);
        let data = getData('#addForm');

        function clearData() {
            $('#addForm :not(.add)').val('');
            ADD_BTN.removeAttr('disabled');
        }

        request('POST', '', data).then(list).then(clearData);
    }

    function list() {
        CATCHES.empty();
        function listAllCatches(res) {
            res.forEach(c => {
                CATCHES
                    .append($('<div>').addClass('catch').attr('data-id', c._id)
                        .append(createInput('Angler', 'text', 'angler', c.angler))
                        .append(createInput('Weight', 'number', 'weight', c.weight))
                        .append(createInput('Species', 'text', 'species', c.species))
                        .append(createInput('Location', 'text', 'location', c.location))
                        .append(createInput('Bait', 'text', 'bait', c.bait))
                        .append(createInput('Capture Time', 'number', 'captureTime', c.captureTime))
                        .append($('<button>').addClass('update').text('Update').on('click', () => updateCatch(c._id)))
                        .append($('<button>').addClass('delete').text('Delete').on('click', () => deleteCatch(c._id)))
                    )
            })
        }
        request('GET', '')
            .then(listAllCatches)
    }

    function createInput(label, type, clas, value) {
        let element = document.createDocumentFragment();
        return $(element)
            .append($('<label>').text(label))
            .append($('<input>').addClass(clas).attr('type', type).val(value));
    }

    function deleteCatch(id) {
        request('DELETE', id).then(list)
    }

    function updateCatch(id) {
        let data = getData(`[data-id=${id}]`);
        request('PUT', id, data).then(list)
    }
}

