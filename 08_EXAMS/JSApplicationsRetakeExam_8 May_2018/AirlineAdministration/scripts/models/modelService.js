let modelService = (() => {
    const COLLECTION = 'flights/';

    function loadItems() {
        return requester.get('appdata', COLLECTION, 'kinvey');
    }

    function createItem(obj) {
        return requester.post('appdata', COLLECTION, 'kinvey', obj);
    }

    function loadDetails(id) {
        return requester.get('appdata', COLLECTION + id, 'kinvey');
    }

    function edit(id, obj) {
        return requester.update('appdata', COLLECTION + id, 'kinvey', obj);
    }

    function remove(id){
        return requester.remove('appdata', COLLECTION + id, 'kinvey');
    }

    function getQuery(query) {
        return requester.get('appdata', COLLECTION + query, 'kinvey');
    }


    return {
        loadItems,
        createItem,
        loadDetails,
        edit,
        remove,
        getQuery
    }
})();