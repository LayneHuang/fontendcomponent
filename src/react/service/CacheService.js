let instance = null;

export default class CacheService {

    constructor() {
        if (!instance) {
            instance = this;
        }
        return instance;
    }

    /***
     * 类方法
     */
    static ShareInstance() {
        let singleton = new CacheService();
        return singleton;
    }

    static setLocalStorage(key, value) {
        if (!window.localStorage) {
            console.log("can't not use local storage");
        } else {
            window.localStorage.setItem(key, value);
        }
    }

    static getLocalStorage(key) {
        if (!window.localStorage) {
            console.log("can't not use local storage");
        } else {
            // console.log('get store :' + window.localStorage.getItemByKey(key));
            return window.localStorage.getItem(key);
        }
        return null;
    }

    static deleteLocalStorage(key) {
        if (!window.localStorage) {
            console.log("can't not use local storage");
        } else {
            // console.log('get store :' + window.localStorage.getItemByKey(key));
            return window.localStorage.removeItem(key);
        }
    }

    static clearLocalStorage() {
        if (!window.localStorage) {
            console.log("can't not use local storage");
        } else {
            // console.log('get store :' + window.localStorage.getItemByKey(key));
            return window.localStorage.clear();
        }
    }

}
