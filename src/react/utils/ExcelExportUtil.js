import ExportJsonExcel from 'js-export-excel';
import StringUtils from './StringUtils';

/**
 * 调用导出成Excel文件
 * @Author: laynehuang
 * @CreatedAt: 3/7/2019
 * @ModifiedAt 6/5/2019
 */
export default class ExcelExportUtil {

    constructor() {
        this.duration = 2000;
    }

    /**
     * 设置查询间隔
     * @param ms(时间单位毫秒)
     */
    setDuration(ms) {
        this.duration = ms;
    }

    /**
     * 直接给出数据单次导出
     * @param dataList          导出的数据,二维数组 , [[Sheet1_Data],[Sheet2Data]]
     * @param exportFileName    导出文件名, 如  AA店-订单统计
     * @param sheetNameList     导出Excel文件中的表单(Sheet)的名称列表， [Sheet1_Name,Sheet2_Name] 如['订单汇总信息','订单明细', ....]
     * @param filterList        导出行对应的字段名列表, 如 ['key', 'orderNumber' , ... ]
     * @param filterMap         相应字段名对应的列名显示(一个Map用于所有表单), 如 map[ ('key','序号'), ('orderNumber','订单编号'), ...]
     * @param onPercentChange   导出百分比变化回调函数，返回 -1 表示导出失败
     * @param onFinish          完成回调函数
     */
    exportStart(
        dataList,
        exportFileName,
        sheetNameList,
        filterList,
        filterMap,
        onPercentChange,
        onFinish
    ) {
        let percent = 0;

        // 调用前先stop掉旧的timer
        this.stopTimer();

        this.reqTimer = setInterval(() => {
            percent++;
            onPercentChange(percent);
            if (percent === 100) {
                this.stopTimer();
            }
        }, 1000);

        let option = {};
        option.datas = [];
        dataList.forEach((list, index) => {
            list.forEach((item, index) => {
                item.key = index + 1;
            });

            option.datas.push({
                sheetData: list,
                sheetName: sheetNameList[index],
                sheetFilter: filterList[index],
                sheetHeader: ExcelExportUtil.getHeaderByFilter(filterList[index], filterMap),
            });
        });

        option.fileName = exportFileName;
        let toExcel = new ExportJsonExcel(option);
        toExcel.saveExcel();
        onPercentChange(100);
        onFinish();
    }


    /**
     * 通过网络查询单次导出
     * @param args              请求参数
     * @param reqFunc           请求函数,格式  [ reqFuc(args,onSuccess, onFailure) ]
     *                                          onSuccess为成功回调
     *                                          onFailure为失败回调
     *
     * @param transformFuncList 数据转换函数列表,作用: onSuccess(res) 中 res 转换成对应导出的列表
     *                          如 res.date.orderList[item1,item2,...,itemN] -> list[item1,item2,...,itemN]
     *                          转换后 item 中需要设置一个行唯一的 unionKey 来解决可能出现的分页去重问题
     *
     * @param exportFileName    导出文件名, 如  AA店-订单统计
     * @param sheetNameList     导出Excel文件中的表单(Sheet)的名称列表， 如['订单汇总信息','订单明细', ....]
     * @param filterList        导出行对应的字段名列表, 如 ['key', 'orderNumber' , ... ]
     * @param filterMap         相应字段名对应的列名显示(一个Map用于所有表单), 如 map[ ('key','序号'), ('orderNumber','订单编号'), ...]
     * @param onPercentChange   导出百分比变化回调函数，返回 -1 表示导出失败
     * @param onFinish          完成回调函数
     */
    exportQueryStart(
        args,
        reqFunc,
        transformFuncList,
        exportFileName,
        sheetNameList,
        filterList,
        filterMap,
        onPercentChange,
        onFinish
    ) {
        // 调用前先stop掉旧的timer
        this.stopTimer();
        let percent = 0;
        // console.log(filterList);
        // console.log(filterMap);
        reqFunc(
            args,
            res => {
                // console.log(res);

                let data = [];
                for (let transformFunc of transformFuncList) {
                    data.push(transformFunc(res));
                }

                // console.log('data', data);

                let option = {};
                option.datas = [];

                data.forEach((list, index) => {
                    list.forEach((item, index) => {
                        item.key = index + 1;
                    });

                    option.datas.push({
                        sheetData: list,
                        sheetName: sheetNameList[index],
                        sheetFilter: filterList[index],
                        sheetHeader: ExcelExportUtil.getHeaderByFilter(filterList[index], filterMap),
                    });
                });
                option.fileName = exportFileName;
                let toExcel = new ExportJsonExcel(option);
                toExcel.saveExcel();
                onPercentChange(100);
                onFinish();
            },
            () => {
                onPercentChange(-1);
            }
        );

        this.reqTimer = setInterval(() => {
            percent++;
            onPercentChange(percent);
        }, 1000);
    }

    /**
     * 通过网络查询分页导出的,开始导出函数
     * @param args              请求参数
     *                          args中页数定义为 page / currentPage
     *
     * @param reqFunc           请求函数,格式  [ reqFuc(args,onSuccess, onFailure) ]
     *                                          onSuccess为成功回调
     *                                         【回调函数参数中必须包含 （pageAmount | totalAmount or totalCount）字段描述结果集数量】
     *                                          onFailure为失败回调
     *
     *
     * @param transformFuncList 数据转换函数列表,作用: onSuccess(res) 中 res 转换成对应导出的列表
     *                          如 res.date.orderList[item1,item2,...,itemN] -> list[item1,item2,...,itemN]
     *                          转换后 item 中需要设置一个行唯一的 unionKey 来解决可能出现的分页去重问题
     *
     * @param exportFileName    导出文件名, 如  AA店-订单统计
     * @param sheetNameList     导出Excel文件中的表单(Sheet)的名称列表， 如['订单汇总信息','订单明细', ....]
     * @param filterList        导出行对应的字段名列表, 如 ['key', 'orderNumber' , ... ]
     * @param filterMap         相应字段名对应的列名显示(一个Map用于所有表单), 如 map[ ('key','序号'), ('orderNumber','订单编号'), ...]
     * @param onPercentChange   导出百分比变化回调函数，返回 -1 表示导出失败
     * @param onFinish          完成回调函数
     */
    exportQueryByPageStart(
        args,
        reqFunc,
        transformFuncList,
        exportFileName,
        sheetNameList,
        filterList,
        filterMap,
        onPercentChange,
        onFinish
    ) {
        // 调用前先stop掉旧的timer
        this.stopTimer();
        let percent = 0;
        let totalCount = Number.MAX_VALUE;
        let totalPage = Number.MAX_VALUE;
        let finished = false;
        let nowPage = 0;
        let pageSize = 20;
        let results = [];
        let receivePage = 0;
        let maxPageSize = 0;    // 网络查询中最大的页大小,用于异步返回后数据排序

        let onSuccess = res => {
            // console.log(res);
            // set Total count
            if (!StringUtils.isEmpty(res.pageAmount)) {
                totalPage = res.pageAmount;
                totalCount = res.pageAmount * pageSize;
            }
            if (!StringUtils.isEmpty(res.totalAmount)) {
                totalCount = res.totalAmount;
            }
            if (!StringUtils.isEmpty(res.totalCount)) {
                totalCount = res.totalCount;
                totalPage = totalCount / pageSize + (totalCount % pageSize === 0 ? 0 : 1);
            }

            let data = [];
            for (let transformFunc of transformFuncList) {
                data.push(transformFunc(res));
            }
            // console.log('data:', data);
            for (let i = 0; i < Math.max(data.length - results.length); ++i) {
                results.push(new Map());
            }

            data.forEach((list, index) => {
                if (maxPageSize < list.length) {
                    maxPageSize = list.length;
                }
                list.forEach((item, index2) => {
                    // item.idForSort = res.currentPage * pageSize + index2;
                    item.nowPage = res.currentPage;
                    item.index = index2;
                    // map去掉后台返回的重复数据
                    results[index].set(item.unionKey, item);
                });
            });

            receivePage++;
            let receiveCount = Math.min(totalCount, receivePage * pageSize);
            let tempPercent = ((receiveCount * 100) / totalCount).toFixed(2).valueOf();

            if (percent === tempPercent) {
                percent = Math.max(99, percent + 1);
            } else {
                percent = tempPercent;
            }

            if (receiveCount >= totalCount && !finished) {
                finished = true;
                let option = {};
                option.datas = [];
                results.forEach((mp, index) => {
                    let list = [];

                    mp.forEach(v => {
                        v.idForSort = v.nowPage * maxPageSize + v.index;
                        list.push(v);
                    });

                    list.sort((a, b) => {
                        return a.idForSort > b.idForSort ? 1 : a.idForSort === b.idForSort ? 0 : -1;
                    });

                    list.forEach((item, index) => {
                        item.key = index + 1;
                    });

                    option.datas.push({
                        sheetData: list,
                        sheetName: sheetNameList[index],
                        sheetFilter: filterList[index],
                        sheetHeader: ExcelExportUtil.getHeaderByFilter(filterList[index], filterMap),
                    });
                });

                option.fileName = exportFileName;
                let toExcel = new ExportJsonExcel(option);
                toExcel.saveExcel();
                onPercentChange(100);
                onFinish();
            } else {
                onPercentChange(percent);
            }
        };

        this.reqTimer = setInterval(() => {
            args.page = nowPage;
            args.currentPage = nowPage;
            args.pageSize = pageSize;
            reqFunc(args, onSuccess, () => {
                this.stopTimer();
                onPercentChange(-1);
            });
            nowPage++;
            if (finished || nowPage > totalPage) {
                this.stopTimer();
            }
        }, this.duration);
    }

    /**
     * 终止导出
     */
    exportStop() {
        this.stopTimer();
    }

    /**
     * 时钟结束
     */
    stopTimer() {
        if (this.reqTimer !== null) {
            console.log('stop exporting');
            clearInterval(this.reqTimer);
            this.reqTimer = null;
        }
    }

    static getHeaderByFilter(filter, map) {
        let result = [];
        filter.forEach(key => {
            result.push(map.get(key));
        });
        return result;
    }
}
