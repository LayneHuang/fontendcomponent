import StringUtils from "./StringUtils";
import moment from "moment";

export default class TransUtils {


    static getDateString(date) {
        if (StringUtils.isEmpty(date)) {
            return '2018-1-1';
        }
        return moment(date.getTime()).format("YYYY-MM-DD");
    }

    static getDateDurationString(ms1, ms2) {
        return TransUtils.getDateStringByTimestamp(ms1) + '至' + TransUtils.getDateStringByTimestamp(ms2);
    }

    static getTimestampByMoment(m) {
        return new Date(m.format('YYYY-MM-DD')).getTime();
    }

    static getDateStringByTimestamp(ms) {
        if (ms === null) {
            return '-';
        }
        let date = new Date(ms);
        return TransUtils.getDateString(date);
    }

}