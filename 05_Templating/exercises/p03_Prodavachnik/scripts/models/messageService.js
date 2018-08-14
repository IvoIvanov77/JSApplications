let messages = (() => {

    const INFO_BOX = $('#infoBox');
    const ERROR_BOX = $('#errorBox');
    const LOADING_BOX = $('#loadingBox');



    function handleError(reason) {
        showError(reason.responseJSON.description);
    }

    function showInfo(message) {
        let infoBox = $('#infoBox');
        // infoBox.insertAfter($('#menu')).show();
        infoBox.text(message);
        infoBox.show();
        setTimeout(() => infoBox.fadeOut(), 3000);
    }

    function showError(message) {
        let errorBox = $('#errorBox');
        errorBox.text(message);
        errorBox.show();
        setTimeout(() => errorBox.fadeOut(), 3000);
    }

    function showLoading() {
        $('#loadingBox').removeAttr('hidden');
    }

    function hideLoading() {
        $('#loadingBox').fadeOut();
    }

    return {
        show: showLoading,
        hide: hideLoading,
        showInfo,
        showError,
        handleError
    }
})();