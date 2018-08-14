function attachEvents() {
    const URL = 'https://messanger-ivanov.firebaseio.com/';
    const TEXT_AREA = $('#messages');
    const AUTHOR = $('#author');
    const MESSAGE = $('#content');
    const SUBMIT_BTN = $('#submit');
    const REFRESH_BTN = $('#refresh');

    // refresh();
    REFRESH_BTN.on('click', refresh);
    SUBMIT_BTN.on('click', addMessage);

    function addMessage() {
        let message = {
            author: AUTHOR.val(),
            content: MESSAGE.val(),
            timestamp: Date.now()
        };
        $.post(URL + '.json', JSON.stringify(message))
            .then(refresh)

        MESSAGE.val('');
    }


    function refresh() {
        $.get(URL + '.json')
            .then(getMessages);

        function getMessages(res) {
            TEXT_AREA.empty();
            for (let r in res) {
                let message = res[r];
                TEXT_AREA.append(`${message.author}: ${message.content}\n`);
            }
        }
    }

}

