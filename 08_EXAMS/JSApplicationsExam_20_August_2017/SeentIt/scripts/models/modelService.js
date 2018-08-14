let models = (() => {

    class ModelService{
        constructor(collection){
            this._collection = collection + '/';
        }

        loadItems() {
            return requester.get('appdata', this._collection, 'kinvey');
        }

        createItem(obj) {
            return requester.post('appdata', this._collection, 'kinvey', obj);
        }

        loadDetails(id) {
            return requester.get('appdata', this._collection + id, 'kinvey');
        }

        edit(id, obj) {
            return requester.update('appdata', this._collection + id, 'kinvey', obj);
        }

        remove(id){
            return requester.remove('appdata', this._collection + id, 'kinvey');
        }

        getQuery(query) {
            return requester.get('appdata', this._collection + query, 'kinvey');
        }
    }

    let postService = new ModelService('posts');
    let commentService = new ModelService('comments');
    return {
        postService,
        commentService
    }
})();