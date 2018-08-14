class Promise {
    constructor(executor){
        this._resolve = function (data) {};
        this._reject = function (reason) {};
        this.resolve = this.resolve.bind(this);
        this.reject = this.reject.bind(this);
        try{
            setTimeout(() => executor(this.resolve, this.reject), 0);
        }catch (err) {
            this._reject(err);
        }
       
    }

    resolve(data){
        this._resolve(data)
    }

    reject(reason){
        this._reject(reason)
    }

    then(func){
        this._resolve = func;
        return this;
    }

    catch(func){
        this._reject = func;
        return this;
    }
}

module.exports = Promise