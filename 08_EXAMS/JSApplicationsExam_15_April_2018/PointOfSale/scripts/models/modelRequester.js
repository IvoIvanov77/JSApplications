let modelRequester = (() => {

    function createNewReceipt() {
        let receipt = {
            active : true,
            productCount: 0,
            total: 0
        };
        return receiptService.createItem(receipt)
            .then((res) => {
                sessionStorage.setItem('activeReceiptId', res._id);
            }).catch((reason) => {
                messages.handleError(reason);
            });
    }

    async function setCurrentReceipt() {
        if(sessionStorage.getItem('activeReceiptId')){
            return;
        }

        await receiptService
            .getQuery(`?query={"_acl.creator":"${sessionStorage.getItem('userId')}","active":"true"}`)
            .then((res) => {
                let result = res;
                if(result.length > 0){
                    sessionStorage.setItem('activeReceiptId', result[0]._id);
                }
            }).catch((reason) => {
                messages.handleError(reason);
            });

        if(sessionStorage.getItem('activeReceiptId')){
            console.log('have receipt')
            console.log(sessionStorage.getItem('activeReceiptId'));
        }

        if(!sessionStorage.getItem('activeReceiptId')){
            createNewReceipt();
        }
    }

    function getActiveEntries() {
        return entriesService
            .getQuery(`?query={"receiptId":"${sessionStorage.getItem('activeReceiptId')}"}`)
    }

    function getReceiptEntries(receiptId) {
        return entriesService
            .getQuery(`?query={"receiptId":"${receiptId}"}`)
    }

    function getReceipts() {
        return receiptService
            .getQuery(`?query={"_acl.creator":"${sessionStorage.getItem('userId')}","active":"false"}`)
    }

    return {
        setCurrentReceipt,
        getActiveEntries,
        getReceiptEntries,
        getReceipts
    }



})();