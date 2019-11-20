import {Select} from 'antd';
import React from "react";
import "./BirthdayRangePicker.css";
import {StringUtils} from 'fontendcomponent';

const Option = Select.Option;
/**
 * 城市选择器
 * @Param style: DIV 的样式 , the style of div
 * @Param cities: 城市信息JON , 格式如下 the json of city info
 * Sample :
 *    {
 *      " id": "0",
 *      "pinyin": "beijing",
 *      "province": "北京市",
 *      "display": "北京",
 *      "query": "北京市"
 *    }
 * @Param id: 当前城市对应的id, id var in your code
 *
 * @Param onChange(id)[callback function]: 变化时回调函数, callback when province change
 */
export default class CitySelector extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            provinceList: [],
            bIndex: [],
            eIndex: [],
            cities: new Map(),         // id -> display
            citiesP: new Map(),        // id -> province
            onChange: null,
        };
    }

    componentDidMount() {
        let cities = new Map();
        let citiesP = new Map();
        let provinces = [];
        let bIndex = [];
        let eIndex = [];
        console.log(this.props.cities);
        for (let i = 0; i < this.props.cities.length; ++i) {
            let city = this.props.cities[i];
            if (i === 0 || (i > 0 && city.province !== this.props.cities[i - 1].province)) {
                provinces.push(city.province);
                bIndex[provinces.length - 1] = i;
            }
            eIndex[provinces.length - 1] = i;
            cities.set(city.id, city.display);
            citiesP.set(city.id, city.province + city.display);
        }
        this.setState({
            bIndex: bIndex,
            eIndex: eIndex,
            provinceList: provinces,
            cities: cities,
            citiesP: citiesP,
            onChange: this.props.onChange,
        });
    }

    change0 = (value) => {
        // console.log(value);
        let id = this.state.bIndex[value < this.state.bIndex.length ? value : 0];
        this.props.onChange(id);
    };

    change1 = (value) => {
        this.props.onChange(value);
    };

    render() {

        let aCode = this.props.id;
        if (StringUtils.isEmpty(aCode)) {
            aCode = 0;
        }
        // console.log('update aCode:' + aCode);
        let pIdx = 0;
        let ps = [];
        for (let i = 0; i < this.state.provinceList.length; ++i) {
            ps.push(<Option key={i} value={i}>{this.state.provinceList[i]}</Option>);
            if (aCode >= this.state.bIndex[i] && aCode <= this.state.eIndex[i]) {
                pIdx = i;
            }
        }
        let cs = [];
        for (let i = 0; i < this.state.provinceList.length; ++i) {
            if (aCode >= this.state.bIndex[i] && aCode <= this.state.eIndex[i]) {
                for (let j = this.state.bIndex[i]; j <= this.state.eIndex[i]; ++j) {
                    cs.push(<Option key={j} value={j}>{this.state.cities.get(j.toString())}</Option>);
                }
                break;
            }
        }

        return (
            <div style={this.props.style}>
                <Select onChange={this.change0} value={pIdx}>{ps}</Select>
                <Select onChange={this.change1} value={aCode}>{cs}</Select>
            </div>
        );
    }
}
