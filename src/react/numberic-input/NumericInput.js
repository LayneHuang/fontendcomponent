import {Input} from 'antd';
import React from "react";
import StringUtils from "../utils/StringUtils";

/**
 * 数字输入器
 */
export default class NumericInput extends React.Component {

    onChange = (e) => {
        const {value} = e.target;
        let reg = /^([1-9][0-9]*)$/;

        if (!StringUtils.isEmpty(this.props.isdecimal) && this.props.isdecimal) {
            reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
        }

        if ((!Number.isNaN(value) && reg.test(value)) || value === '' || value === '-') {
            let result = value;
            let s = value.split('.');

            if (!StringUtils.isEmpty(this.props.prelen)) {
                let pre = s[0];
                if (pre.length > this.props.prelen) {
                    result = value.substr(0, this.props.prelen);
                }
            }

            if (!StringUtils.isEmpty(s[1])) {
                console.log(s[1]);
                result = s[0] + '.' + s[1].substr(0, 2);
            }
            console.log('r: ' + result);
            this.props.onChange(result);
        }
    };

    // '.' at the end or only '-' in the input box.
    onBlur = () => {
        const {value, onBlur} = this.props;
        if (!StringUtils.isEmpty(value) && value.length > 0 && (value[value.length - 1] === '.' || value === '-')) {
            let s = value.substr(0, value.length - 1);
            console.log('s: ' + s);
            this.props.onChange(s);
        }
        if (onBlur) {
            onBlur();
        }
    };

    render() {
        return (
            <Input
                {...this.props}
                onChange={this.onChange}
                onBlur={this.onBlur}
            />
        );
    }
}

