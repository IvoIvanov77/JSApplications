function attachEvents() {

    async function fillTemplate() {
        let townsHtml = await $('#towns-template').html();
        let townsTemplate = Handlebars.compile(townsHtml);
        let input = $('#towns');
        if(!input.val()){
            return
        }
        let townsArray =input.val().split(', ');

        let html = townsTemplate({townsArray : townsArray});
        console.log(html);
        $('#root').append(html);
        input.val('');
    }

    $('#btnLoadTowns').on('click', fillTemplate)
    
}