$(() => {

    const app = Sammy('#container', function () {

        this.use('Handlebars', 'hbs');

        this.before('', function () {
            this.username = sessionStorage.getItem('username');
        });


        function renderMainPage(context, page, templates) {
            let obj= {
                header: 'templates/header.hbs',
                footer: 'templates/footer.hbs',
                page: page
            };
            for (let key in templates) {
                obj[key] = templates[key];
            }
            return context.loadPartials(obj)
                .then(function () {
                    this.partial('templates/main_page.hbs')
                })
        }

        this.get('index.html', function(){
            if(!sessionStorage.getItem('userId')){
                this.redirect('#/login');
            }else {
                this.redirect('#/create')
            }
        });

        this.get('#/create',async function(){
            if(!checkLoggedInUser()){
                this.redirect('#/login');
                return;
            }

            messages.showLoading();

            await modelRequester.setCurrentReceipt()
                .catch((reason) => {
                    messages.handleError(reason);
                });

            let result = await modelRequester.getActiveEntries()
                .catch((reason) => {
                    messages.handleError(reason);
                });

            let total = 0;
            let count = 0;
            result.forEach((entry) => {
                entry.subTotal = (entry.qty * entry.price).toFixed(2);
                entry.isEditor = true;
                total += Number(entry.subTotal);
                count += Number(entry.qty);
            });
            this.activeEntries = result;
            this.hasEntries = result.length > 0;
            this.total = total.toFixed(2);
            this.count = count;
            this.receiptId = sessionStorage.getItem('activeReceiptId');

            await renderMainPage(this, 'templates/createItem/createPage.hbs',
                {
                    createForm: 'templates/createItem/createReceiptForm.hbs',
                    entryRow: 'templates/createItem/entryRow.hbs',
                    addEntryForm: 'templates/createItem/addEntryForm.hbs',
                    createReceiptForm: 'templates/createItem/createReceiptForm.hbs',
                }).then((res) => {
                    messages.hideLoading()

            });

        });

        this.get('#/login', function(context){
            context.loadPartials({
                loginForm: 'templates/login/loginForm.hbs',
                registerForm: 'templates/register/registerForm.hbs'
            }).then(function () {
                this.partial('templates/login_register.hbs')
            })
        });

        this.get('#/myReceipts', async function(){

            if(!checkLoggedInUser()){
                this.redirect('#/login');
                return;
            }

            messages.showLoading();

            let result = await modelRequester.getReceipts()
                .catch((reason) => {
                    messages.hideLoading();
                    messages.handleError(reason);
                });
            let totalPrice = 0;
            result.forEach((receipt) => {
                let date =  new Date(receipt._kmd.ect);
                receipt.creationDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
                    +` ${date.getHours()}:${date.getMinutes()}`;
                totalPrice += Number(receipt.total);

            });

            this.receipts = result;
            this.totalPrice = totalPrice.toFixed(2);

            await renderMainPage(this, 'templates/receipts/allReceipts.hbs', {
                singleReceipt: 'templates/receipts/singleReceipt.hbs'
            });

            messages.hideLoading();

        });

        this.get('#/details/:id', async function(){

            if(!checkLoggedInUser()){
                this.redirect('#/login');
                return;
            }

            messages.showLoading();

            let result =  await modelRequester
                .getReceiptEntries(this.params['id'])
                .catch((reason) => {
                    messages.hideLoading();
                    messages.handleError(reason);
                });
            result.forEach((entry) => {
                entry.subTotal = (entry.qty * entry.price).toFixed(2);
            });

            this.receiptEntries = result;

            await renderMainPage(this, 'templates/receipts/details.hbs', {
                entryRow: 'templates/createItem/entryRow.hbs'
            });

            messages.hideLoading();

        });

        this.post('register', function () {

            let username = this.params['username-register'];
            let password = this.params['password-register'];
            let repeatPassword = this.params['password-register-check'];

            if(!validator.register(username, password, repeatPassword)){
                return;
            }
            messages.showLoading();

            auth.register(username, password, repeatPassword)
                .then((res) => {
                    messages.hideLoading();
                    auth.saveSession(res);
                    this.redirect('#/create')
                    messages.showInfo('User registration successful');
                }).catch((reason) => {
                    messages.handleError(reason);
            })
        });


        this.post('login', function () {
            let username = this.params['username-login'];
            let password = this.params['password-login'];

            if(!validator.login(username, password)){
                return;
            }
            messages.showLoading();

            auth.login(username, password)
                .then((res) => {
                    messages.hideLoading();
                    auth.saveSession(res);
                    this.redirect('#/create');
                    messages.showInfo('Login successful');
                }).catch((reason) => {
                    messages.hideLoading();
                    messages.handleError(reason);
                });


        });

        this.get('#/logout', function(){
            messages.showLoading();
            auth.logout()
                .then(() => {
                    messages.hideLoading();
                    sessionStorage.clear();
                    this.redirect('#/login');
                    messages.showInfo('Logout successful');

                }).catch((reason) => {
                    messages.handleError(reason);
            });
        });

        this.post('add_entry', function () {

            let type = this.params['type'];
            let qty = this.params['qty'];
            let price = this.params['price'];

            if(!validator.entry(type, qty, price)){
                return;
            }

            this.$element('#addItemBtn').attr('disabled', 'disabled');
            messages.showLoading();

            let obj = {
                type: type,
                qty: qty,
                price: price,
                receiptId: sessionStorage.getItem('activeReceiptId')
            };

            entriesService.createItem(obj)
                .then((res) =>{
                    messages.hideLoading();
                    messages.showInfo('Entry added');
                    this.redirect('#/create');
                }).catch((reason) => {
                messages.handleError(reason);
            })
        });

        this.post('checkout', function () {
            messages.showLoading();
            let receipt = {
                active: false,
                total: this.params['total'],
                productCount: this.params['productCount']
            };

            receiptService.edit(this.params['receiptId'], receipt)
                .then((res) => {
                    sessionStorage.removeItem('activeReceiptId');
                    messages.showInfo('Receipt checked out');
                    this.redirect('#/create');
                    messages.hideLoading();
                }).catch((reason) => {
                    messages.hideLoading();
                    messages.handleError(reason);
                })
        });

        this.get('#/delete/:id', function () {
            messages.showLoading();
            console.log(this.params['id']);
            entriesService.remove(this.params['id'])
                .then((res) => {
                    this.redirect('#/create');
                    messages.hideLoading();
                    messages.showInfo(' Entry removed');
                }).catch((reason) => {
                    messages.handleError(reason);
                    messages.hideLoading();
                })
        });

        function checkLoggedInUser() {
            if(!sessionStorage.getItem('userId')){
                messages.showError('Please login');
                return false;
            }
            return true;
        }

    });

    app.run();
});