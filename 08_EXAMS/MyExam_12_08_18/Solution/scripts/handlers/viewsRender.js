let render = (() => {
    
    const MAIN_PAGE = './templates/main_page.hbs';
    const NAVIGATION = './templates/common/navigation.hbs';
    const FOOTER = './templates/common/footer.hbs';
    const HOME_SCREEN = './templates/homeScreen.hbs';
    const LOGIN_PAGE = './templates/login/loginForm.hbs';
    const REGISTER_PAGE = './templates/register/registerForm.hbs';
    const CATALOG_PAGE =  './templates/items/showItems.hbs';
    const SINGLE_CATALOG_ITEM = './templates/items/singleItem.hbs';
    const USER_LISTINGS_PAGE = './templates/items/MyItems.hbs';
    const SINGLE_USER_ITEM = './templates/items/mySingleItem.hbs';
    const CREATE_ITEM_PAGE = './templates/createItem/createForm.hbs';
    const EDIT_ITEM_PAGE = './templates/editItem/editForm.hbs';
    const ITEM_DETAILS_PAGE = './templates/items/details.hbs';

    function renderMainPage(context, page, templates) {        
        let obj= {
            navigation: NAVIGATION,
            footer: FOOTER,
            page: page
        };
        for (let key in templates) {
            obj[key] = templates[key];
        }
        return context.loadPartials(obj)
            .then(function () {
                this.partial(MAIN_PAGE)
            })
    }
    
    function homeScreen(context) {
        renderMainPage(context, HOME_SCREEN)
    }

    function register(context) {
        renderMainPage(context, REGISTER_PAGE)
    }

    function login(context) {
        renderMainPage(context, LOGIN_PAGE)
    }

    function allListing(context) {
        renderMainPage(context, CATALOG_PAGE, {car: SINGLE_CATALOG_ITEM});
    }

    function userListings(context) {
        renderMainPage(context, USER_LISTINGS_PAGE, {car: SINGLE_USER_ITEM});
    }

    function createListing(context) {
        renderMainPage(context, CREATE_ITEM_PAGE);
    }

    function editListing(context) {
        renderMainPage(context, EDIT_ITEM_PAGE);
    }

    function listingDetails(context) {
        renderMainPage(context, ITEM_DETAILS_PAGE);
    }

    return {
        homeScreen,
        register,
        login,
        allListing,
        userListings,
        createListing,
        editListing,
        listingDetails
    }
})();