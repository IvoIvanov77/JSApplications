let messages = (() => {

    $(document).on({
        ajaxStart: () => $("#loadingBox").show(),
        ajaxStop: () => $('#loadingBox').fadeOut()
    });

    function handleError(reason) {
        showError(reason.responseJSON.description);
    }
    function showInfo(message) {
        let infoBox = $('#infoBox');
        // infoBox.insertAfter($('#menu')).show();
        infoBox.find('span').text(message);
        infoBox.show();
        setTimeout(() => infoBox.fadeOut(), 3000);
    }

    function showError(message) {
        let errorBox = $('#errorBox');
        errorBox.find('span').text(message);
        errorBox.show();
        errorBox.on('click', function () {
            $(this).fadeOut();
        })
    }

    return {
        showInfo,
        showError,
        handleError
    }
})();