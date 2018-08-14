function attachEvents() {
   const URL = 'https://baas.kinvey.com/appdata/kid_BJSs6XzMQ/';
   const USER_NAME = 'peter';
   const PASS = 'p';
   const LOAD_BTN = $('#btnLoadPosts');
   const VIEW_POST_BTN = $('#btnViewPost');
   const SELECT_POST = $('#posts');
   const POST_TITLE = $('#post-title');
   const POST_BODY = $('#post-body');
   const POST_COMMENTS = $('#post-comments');
   const AUTHORISATION = 'Basic ' +  btoa(`${USER_NAME}:${PASS}`);

    LOAD_BTN.on('click', loadPosts);
    VIEW_POST_BTN.on('click', loadPostDetails);

    function request(address) {
        return $.ajax({
            url: URL + address,
            headers: {
                Authorization: AUTHORISATION
            }
        });
    }

    function loadPosts() {
        LOAD_BTN.attr('disabled', true);
        request('posts')
            .then(addOptions)
            .then(() => LOAD_BTN.attr('disabled', false));


        function addOptions(res) {
            SELECT_POST.empty();
            res.forEach(p => {
                let id = p._id;
                let title =  p.title;
                let option = $('<option>').attr('value',id).text(title);
                SELECT_POST.append(option);
            })
        }
    }

    function loadPostDetails() {
        VIEW_POST_BTN.attr('disabled', true);
        let id = SELECT_POST.find(":selected").val();
        let post = request('posts' + '/' + id);
        let comments = request('comments' +  `/?query={"postId":"${id}"}`);

        Promise.all([post, comments])
            .then(loadDetails)
            .then(() => VIEW_POST_BTN.attr('disabled', false));

        function loadDetails([post, comments]) {
            POST_TITLE.empty().append(post.title);
            POST_BODY.text(post.body);
            POST_COMMENTS.empty();
            comments.forEach(c => {
                let text =  c.text;
                let li = $('<li>').text(text);
                POST_COMMENTS.append(li);
            })
        }
    }
}

