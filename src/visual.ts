"use strict";

import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import DataView = powerbi.DataView;

import * as React from "react";
import * as ReactDOM from "react-dom";


import DatePicker from "./component/DatePicker";
import "./style.css"


interface DateFilter {
    startDate: Date;
    endDate: Date;
}

interface TableColumnInfo {
    tableName: string;
    columnName: string;
}

const VISUAL_NAME = "DateFilterVisual";
const FILTER_TARGET = "general";
const FILTER_TYPE = "filter";

 function normalizeDate(input: string | number | Date): Date | null {
        if (input instanceof Date) return input;
        if (typeof input === "string" || typeof input === "number") {
            const date = new Date(input);
            if (!isNaN(date.getTime())) return date;
        }
        return null;
    }


    function  getTableColumnInfo(dataView:DataView): TableColumnInfo {
        const defaultInfo: TableColumnInfo = { 
            tableName: "Date", 
            columnName: "Date" 
        };

        if (!dataView?.metadata?.columns?.length) {
            return defaultInfo;
        }

        const firstColumn = dataView.metadata.columns[0];
        if (!firstColumn?.queryName) {
            return defaultInfo;
        }

        // Parse query name (typically in "Table.Column" format)
        const queryParts = firstColumn.queryName.split('.');
        
        return {
            tableName: queryParts[0] || defaultInfo.tableName,
            columnName: queryParts[1] || firstColumn.displayName || defaultInfo.columnName
        };
    }



export class Visual implements IVisual {

    private target: HTMLElement;
    private datePickerComponent: React.ReactElement;
    private host: IVisualHost;
    private dataView: DataView | undefined;




    constructor(options: VisualConstructorOptions) {

        this.target = options.element;
        this.host = options.host;
        this.datePickerComponent = React.createElement(DatePicker, {
            onDateSelection: this.handleDateSelection.bind(this)
        });
        

         this.renderReactComponent();
    }


    private handleDateSelection(startDate: Date | null, endDate: Date | null): void {
        if (!startDate || !endDate) {
            console.warn(`${VISUAL_NAME}: Invalid date selection - start or end date is null`);
            return;
        }
    
        this.applyDateFilter(startDate, endDate)

            .catch(error => {
                console.error(`${VISUAL_NAME}: Error applying date filter:`, error);
            });
    }




 private async applyDateFilter(startInput: string | number | Date, endInput: string | number | Date): Promise<void> {
        try {
             const tableColumnInfo = getTableColumnInfo(this.dataView);

             if (!tableColumnInfo.tableName || !tableColumnInfo.columnName) {
                console.warn(`${VISUAL_NAME}: Unable to determine table or column name`);
                return;
            }

           console.debug(`${VISUAL_NAME}: Filtering ${tableColumnInfo.tableName}.${tableColumnInfo.columnName}`);
     
            const startDate = normalizeDate(startInput);
            const endDate = normalizeDate(endInput);

            if (!startDate || !endDate) {
                console.warn(" Invalid date inputs:", startInput, endInput);
                return;
            }

            // Convert to UTC dates at the start and end of the day
            const startUTC = new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0, 0));
            const endUTC = new Date(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59, 999));

            console.debug("UTC dates for filter:", startUTC.toISOString(), "to", endUTC.toISOString());

            const filter: powerbi.IFilter = {
                $schema: "http://powerbi.com/product/schema#advanced",
                target: { table: tableColumnInfo.tableName, column: tableColumnInfo.columnName },
                logicalOperator: "And",
                conditions: [
                    { operator: "GreaterThanOrEqual", value: startUTC.toISOString() },
                    { operator: "LessThanOrEqual", value: endUTC.toISOString() }
                ]
            };

            // Apply the filter
            this.host.applyJsonFilter(filter,FILTER_TARGET , FILTER_TYPE, powerbi.FilterAction.merge);
            console.debug("✅ UTC date filter applied successfully");

          

        } catch (error) {
            console.error("❌ Error applying filter:", error);
        }
    }



  
    private renderReactComponent(): void {
        try {
            ReactDOM.render(this.datePickerComponent, this.target);
        } catch (error) {
            console.error(`${VISUAL_NAME}: Error rendering React component:`, error);
        }
    }




    public update(options: VisualUpdateOptions) {

 if (options.dataViews && options.dataViews.length > 0) {
            this.dataView = options.dataViews[0];
        }

       this.renderReactComponent();
    }



    public destroy(): void {
        ReactDOM.unmountComponentAtNode(this.target);
    }
}
