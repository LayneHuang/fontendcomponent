import {Select} from 'antd';
import React from "react";
import "./BirthdayRangePicker.css";
import moment from "moment";

const Option = Select.Option;

export default class BirthdayRangePicker extends React.Component {

    constructor(props) {
        super(props);
        // console.log(props);
        let value = this.props.value;
        this.month = parseInt(value.split('-')[0]);
        this.date = parseInt(value.split('-')[1]);
        console.log(this.month + ',' + this.date);
        this.disabled = this.props.disabled;
    }

    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.disabled = nextProps.disabled;
        }
    }

    getResult() {
        let leapYear = 1992;
        return moment(leapYear + '-' + this.month + '-' + this.date, "YYYY-MM-DD").format("MM-DD");
    }

    onMonthChange = (value) => {
        this.month = value;
        this.date = 1;
        return this.props.onChange(this.getResult());
    };

    onDateChange = (value) => {
        this.date = value;
        return this.props.onChange(this.getResult());
    };

    static monthOption() {
        let items = [];
        for (let i = 1; i <= 12; ++i) {
            items.push(<Option key={i} value={i}>{i}</Option>);
        }
        return items;
    };

    dayOption() {
        let d = 0;
        switch (this.month) {
            case 2:
                d = 29;
                break;
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
                d = 31;
                break;
            default:
                d = 30;
                break;
        }
        let items = [];
        for (let i = 1; i <= d; ++i) {
            items.push(<Option key={i} value={i}>{i}</Option>);
        }
        return items;
    }

    render() {
        return (
            <div className="container-div">
                <Select style={{minWidth: '55px'}}
                        disabled={this.disabled}
                        value={this.month}
                        onChange={this.onMonthChange}>
                    {BirthdayRangePicker.monthOption()}
                </Select>月

                <Select style={{minWidth: '55px'}}
                        disabled={this.disabled}
                        value={this.date}
                        onChange={this.onDateChange}>
                    {this.dayOption()}
                </Select>
                日
            </div>
        );
    }
}
