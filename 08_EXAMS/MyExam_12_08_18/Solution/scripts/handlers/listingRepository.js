REPO.getAllListings = function (context) {
    models.carService
        .getQuery('?query={}&sort={"_kmd.ect": -1}')
        .then((res) => {            ;
            let userId = sessionStorage.getItem('userId');
            res.forEach(car => car.isCreator = car._acl.creator === userId);
            context.cars = res;
            render.allListing(context)
        })
        .catch((reason) => {
            messages.handleError(reason);
            context.redirect('#/home')
        });
};

REPO.getUserListings = function (context) {
    let username = sessionStorage.getItem('username');
    models.carService
        .getQuery(`?query={"seller":"${username}"}&sort={"_kmd.ect": -1}`)
        .then((res) => {
            context.cars = res;
            render.userListings(context)
        })
        .catch((reason) => {
            messages.handleError(reason);
            context.redirect('#/home')
        });
};

REPO.getListingForDetails = function (context) {
    let id = context.params['id'];
    models.carService.loadDetails(id)
        .then((res) => {
            context.car = res;
            this.isCreator = this.car._acl.creator === sessionStorage.getItem('userId');
            render.listingDetails(context);
        })
        .catch((reason) => {
            messages.handleError(reason);
            this.redirect('#/home')
        });
};

REPO.getListingForEditing = function (context) {
    let id = context.params['id'];
    models.carService.loadDetails(id)
        .then((res) => {
            context.car = res;
            render.editListing(context);
        })
        .catch((reason) => {
            messages.handleError(reason);
            this.redirect('#/home')
        });
};

REPO.createListing = function (context) {
    let listing = getObject(context);
    if(!listing){
        return
    }
    context.$element('.registerbtn').attr('disabled', 'disabled');

    models.carService.createItem(listing)
        .then((res) =>{
        messages.showInfo('listing created.');
        context.redirect('#/home')
    }).catch(messages.handleError);
};

REPO.editListing = function (context) {
    let listing = getObject(context);
    if(!listing){
        return
    }
    context.$element('.registerbtn').attr('disabled', 'disabled');
    let id = context.params['carId'];
    models.carService.edit(id, listing)
        .then((res) =>{
        messages.showInfo('listing created.');
        context.redirect('#/home')
    }).catch(messages.handleError);
};

REPO.deleteListing = function (context) {
    let id = context.params['id'];
    models.carService.remove(id)
        .then(() => {
            messages.showInfo('Listing deleted.');
            this.redirect('#/home')
        })
        .catch((reason) => {
            messages.handleError(reason);
            this.redirect('#/home')
        });
};
function getObject(context) {
    let title = context.params['title'];
    let description = context.params['description'];
    let brand = context.params['brand'];
    let fuel = context.params['fuelType'];
    let model = context.params['model'];
    let year = context.params['year'];
    let price = context.params['price'];
    let imageUrl = context.params['imageUrl'];
    let seller = sessionStorage.getItem('username');

    if(!validator.car(title,description, brand, fuel, model, year, price, imageUrl)){
        return null;
    }
    return {title,description, brand, fuel, model, year, price, imageUrl, seller};
}


