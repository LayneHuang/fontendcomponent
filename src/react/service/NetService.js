import CacheService from "./CacheService";

export default class NetService {

    static parseJSON(response) {
        return response.json();
    }

    //检查请求状态
    static checkStatus(response) {
        // 授权失败
        if (response.status === 401) {
            // back to login
            const error = new Error(response.statusText);
            error.response = response;
            throw error;
        }

        if (response.status >= 200 && response.status < 500) {
            return response;
        }
        const error = new Error(response.statusText);
        error.response = response;
        throw error;
    }

    static getPostOption(args, needToken = true) {
        let headers = {
            'Content-Type': 'application/json'
        };
        if (needToken) {
            headers = {
                'Content-Type': 'application/json',
                'Authorization': CacheService.getLocalStorage('token')
            }
        }
        return {
            method: 'POST',
            mode: 'cors',
            headers: headers,
            body: JSON.stringify(args)
        };
    }

    static getGetOption(args) {
        let headers = {
            'Content-Type': 'application/json',
            'Authorization': CacheService.getLocalStorage('token')
        };
        return {
            method: 'GET',
            mode: 'cors',
            headers: headers
        };
    }

    static myFetch(url, option, onSuccess, onFailure, onFinish) {
        console.log(option);
        fetch(url, option)
            .then(NetService.checkStatus)
            .then(NetService.parseJSON)
            .then((baseResponse) => {
                console.log(baseResponse);
                if (baseResponse.code === 0) {
                    if (baseResponse.data === null) {
                        onSuccess(null);
                    } else {
                        onSuccess(Object.assign(baseResponse.data));
                    }
                } else if (onFailure) {
                    let result = Object.assign(baseResponse.msg);
                    // if (baseResponse.code === TextUtils.ACCOUNT_ALREADY_EXIST_CODE) {
                    //     result = TextUtils.ACCOUNT_ALREADY_EXIST_HINT;
                    // }
                    // if (baseResponse.code === TextUtils.EXCEEDING_AMOUNT_LIMIT_CODE) {
                    //     result = TextUtils.EXCEEDING_AMOUNT_LIMIT_HINT;
                    // }
                    // if (baseResponse.code === TextUtils.PASSWORD_ERROR_CODE) {
                    //     result = TextUtils.PASSWORD_ERROR_HINT;
                    // }
                    // if (baseResponse.code === TextUtils.EXPIRE_CODE) {
                    //     result = TextUtils.EXPIRE_ERROR_HINT;
                    // }
                    onFailure(result);
                }
                if (onFinish) {
                    onFinish(baseResponse);
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    // url
    static getUrl(urlString) {
        return global.constants.api_url + global.constants.crm_user_router + urlString;
    }

    static userSearchImpl(args, onSuccess, onFailure, onFinish) {
        const option = NetService.getPostOption(args);
        let url = this.getUrl('/searchUser');
        this.myFetch(url, option, onSuccess, onFailure, onFinish);
    }

}