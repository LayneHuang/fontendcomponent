export default class StringUtils {

    static isEmpty(s) {
        return s === null || s === undefined || s.length === 0;
    }

    static checkPhoneValidate(phone) {
        return !StringUtils.isEmpty(phone) && phone.length === 11 && phone[0] === '1';
    }

    static isChinese(str) {
        if (/^[\u3220-\uFA29]+$/.test(str)) {
            return true;
        } else {
            return false;
        }
    }

    static count(s) {
        let result = 0;
        for (let i = 0; i < s.length; ++i) {
            if (this.isChinese(s[i])) {
                result += 4;
            } else {
                result++;
            }
        }
        return result / 4 + (result % 4 > 0 ? 1 : 0);
    }

    static sub(s, len) {
        if (this.count(s) <= len) {
            return s;
        }
        let result = '';
        for (let i = 0; i < s.length; ++i) {
            let subs = s.substr(0, i + 1);
            if (this.count(subs) <= len) {
                result = subs;
            }
        }
        return result;
    }

}

