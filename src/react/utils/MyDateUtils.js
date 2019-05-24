import StringUtils from "./StringUtils";
import moment from "moment";

export default class MyDateUtils {

    static getDateString(date) {
        if (StringUtils.isEmpty(date)) {
            return '2019-1-1';
        }
        return moment(date.getTime()).format("YYYY-MM-DD");
    }

    static getDateDurationString(ms1, ms2) {
        return MyDateUtils.getDateStringByTimestamp(ms1) + '至' + MyDateUtils.getDateStringByTimestamp(ms2);
    }

    static getTimestampByMoment(m) {
        return new Date(m.format('YYYY-MM-DD')).getTime();
    }

    static getDateStringByTimestamp(ms) {
        if (ms === null) {
            return '-';
        }
        let date = new Date(ms);
        return MyDateUtils.getDateString(date);
    }

    static getBeginOfDate(ms) {
        const date = new Date(ms);
        date.setHours(0, 0, 0);
        return date;
    }

    static getEndOfDate(ms) {
        const date = new Date(ms);
        date.setHours(23, 59, 59);
        return date;
    }

}
