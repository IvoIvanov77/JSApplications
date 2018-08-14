$(() => {

    const CONTEXT = {
        cats: window.cats
    };

    const CONTAINER = $('#allCats');

    const SOURCE = $('#cat-template').html();

    const TEMPLATE = $.get('templates/cat.hbs');

    async function loadTemplates(){
        let partialTemplate = await TEMPLATE;

        Handlebars.registerPartial('cat', partialTemplate);
        let template = Handlebars.compile(SOURCE);

        let table = template(CONTEXT);

        console.log(CONTEXT.cats);

        CONTAINER.append(table);

        $('.btn').on('click', function(){
            $(this).siblings('div').toggle();
        });
    }

    loadTemplates();



})
