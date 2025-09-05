
"use strict";

import powerbi from "powerbi-visuals-api";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import IVisualHost = powerbi.extensibility.visual.IVisualHost;
import DataView = powerbi.DataView;

import "./style.css"

import * as React from "react";
import * as ReactDOM from "react-dom";
import DatePicker from "./component/DatePicker";

export class Visual implements IVisual {
    private target: HTMLElement;
    private reactRoot: React.ReactElement;
    private host: IVisualHost;
    private dataView: DataView | undefined;


    constructor(options: VisualConstructorOptions) {
        this.reactRoot = React.createElement(DatePicker, {onDateSelection: (startDate: Date, endDate: Date) =>
                this.applyDateFilter(startDate,endDate)
        });
        this.target = options.element;
        this.host = options.host;

        ReactDOM.render(this.reactRoot, this.target);
    }

 private async applyDateFilter(startInput: string | number | Date, endInput: string | number | Date): Promise<void> {
        try {
            const tableName = this.getTableName();
            const columnName = this.getColumnName();

            console.log("Table:", tableName);
            console.log("Column:", columnName);
            if (!tableName || !columnName) return;

            // Normalize dates
            const startDate = this.normalizeDate(startInput);
            const endDate = this.normalizeDate(endInput);

            if (!startDate || !endDate) {
                console.warn(" Invalid date inputs:", startInput, endInput);
                return;
            }

            // Convert to UTC dates at the start and end of the day
            const startUTC = new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0, 0));
            const endUTC = new Date(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 23, 59, 59, 999));

            console.log("UTC dates for filter:", startUTC.toISOString(), "to", endUTC.toISOString());

            const filter: powerbi.IFilter = {
                $schema: "http://powerbi.com/product/schema#advanced",
                target: { table: tableName, column: columnName },
                logicalOperator: "And",
                conditions: [
                    { operator: "GreaterThanOrEqual", value: startUTC.toISOString() },
                    { operator: "LessThanOrEqual", value: endUTC.toISOString() }
                ]
            };

            // Apply the filter
            this.host.applyJsonFilter(filter, "general", "filter", powerbi.FilterAction.merge);
            console.log("✅ UTC date filter applied successfully");

          

        } catch (error) {
            console.error("❌ Error applying filter:", error);
        }
    }

    private normalizeDate(input: string | number | Date): Date | null {
        if (input instanceof Date) return input;
        if (typeof input === "string" || typeof input === "number") {
            const date = new Date(input);
            if (!isNaN(date.getTime())) return date;
        }
        return null;
    }
    private getTableName(): string {
        if (this.dataView?.metadata?.columns?.length) {
            const firstColumn = this.dataView.metadata.columns[0];
            if (firstColumn?.queryName) {
                return firstColumn.queryName.split(".")[0] || "Table";
            }
        }
        return "Date";
    }

    private getColumnName(): string {
        if (this.dataView?.metadata?.columns?.length) {
            const firstColumn = this.dataView.metadata.columns[0];
            if (firstColumn?.queryName) {
                return firstColumn.queryName.split(".")[1] || firstColumn.displayName || "";
            }
        }
        return "Date";
    }
    public update(options: VisualUpdateOptions) {

 if (options.dataViews && options.dataViews.length > 0) {
            this.dataView = options.dataViews[0];
        }

         ReactDOM.render(this.reactRoot, this.target);
    }
    public destroy(): void {
        ReactDOM.unmountComponentAtNode(this.target);
    }
}
