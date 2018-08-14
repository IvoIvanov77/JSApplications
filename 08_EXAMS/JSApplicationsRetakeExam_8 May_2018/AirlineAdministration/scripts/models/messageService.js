let messages = (() => {

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

    function showLoading() {
        $('#loadingBox').show();
    }

    function hideLoading() {
        $('#loadingBox').hide();
    }

    return {
        showLoading,
        hideLoading,
        showInfo,
        showError,
        handleError
    }
})();