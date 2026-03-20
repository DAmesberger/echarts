/*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import { ECUnitOption } from '../util/types';
import { isTouchDevice } from '../util/touch';
import { isArray } from 'zrender/src/core/util';

export default function touchGesturesPreprocessor(option: ECUnitOption): void {
    if (!isTouchDevice()) {
        return;
    }

    if ((option as any).touchGestures === false) {
        return;
    }

    // Don't inject if user already has inside dataZoom configured
    const dataZoom = option.dataZoom as any;
    if (dataZoom) {
        const dzArr = isArray(dataZoom) ? dataZoom : [dataZoom];
        for (let i = 0; i < dzArr.length; i++) {
            if (dzArr[i] && dzArr[i].type === 'inside') {
                return;
            }
        }
    }

    const injected: any[] = [];

    const xAxisArr = option.xAxis as any;
    if (xAxisArr) {
        const axes = isArray(xAxisArr) ? xAxisArr : [xAxisArr];
        for (let i = 0; i < axes.length; i++) {
            injected.push({
                type: 'inside',
                xAxisIndex: i,
                moveOnMouseMove: 'touch',
                zoomOnMouseWheel: false,
                moveOnMouseWheel: false,
                preventDefaultMouseMove: true,
                __autoTouch: true
            });
        }
    }

    const yAxisArr = option.yAxis as any;
    if (yAxisArr) {
        const axes = isArray(yAxisArr) ? yAxisArr : [yAxisArr];
        for (let i = 0; i < axes.length; i++) {
            injected.push({
                type: 'inside',
                yAxisIndex: i,
                moveOnMouseMove: 'touch',
                zoomOnMouseWheel: false,
                moveOnMouseWheel: false,
                preventDefaultMouseMove: true,
                __autoTouch: true
            });
        }
    }

    if (injected.length) {
        const existing = option.dataZoom as any;
        if (existing) {
            option.dataZoom = (isArray(existing) ? existing : [existing]).concat(injected);
        }
        else {
            option.dataZoom = injected;
        }
    }
}
