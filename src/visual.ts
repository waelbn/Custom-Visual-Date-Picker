
"use strict";

import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;

import "./style.css"

import * as React from "react";
import * as ReactDOM from "react-dom";
import DatePicker from "./component/DatePicker";

export class Visual implements IVisual {
    private target: HTMLElement;
    private reactRoot: React.ReactElement;

    constructor(options: VisualConstructorOptions) {
        this.reactRoot = React.createElement(DatePicker, {});
        this.target = options.element;

        ReactDOM.render(this.reactRoot, this.target);
    }

    public update(options: VisualUpdateOptions) {

    }
}
