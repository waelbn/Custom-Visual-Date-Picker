import * as React from "react";
import { useState,useEffect } from "react";
import { DateRangePicker  } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";



interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface DatePickerProps {
  onDateSelection: (startDate: Date | null, endDate: Date | null) => void;
}

interface DatePickerState extends DateRange {
  tempStartDate: Date | null;
  tempEndDate: Date | null;
  deltaDays: number;
  isApplied: boolean;
}

function calculateDelta(start: Date, end: Date): number {
    const timeDiff = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }


export default function DatePicker ({ onDateSelection }: DatePickerProps) {
 
 const today =  new Date();

  const [state, setState] = useState<DatePickerState>({
    startDate: today ,
    endDate: today ,
    tempStartDate: today ,
    tempEndDate: today,
    deltaDays: 0,
    isApplied: false,
  });


  const selectionRange = {
         startDate: state.tempStartDate,
         endDate: state.tempEndDate,
         key: "selection",
    };


 const handleDateChange = (ranges: any) => {
    const tempStartDate = ranges.selection.startDate;
    const tempEndDate = ranges.selection.endDate;
    const deltaDays = calculateDelta(tempStartDate, tempEndDate);
    setState(prevState=>({...prevState,
      tempStartDate,
      tempEndDate,
      deltaDays,
      isApplied: false,
    }));
  };


const  handleApplyFilter = () => {
    setState(prevState =>(
      {...prevState ,
        startDate: prevState.tempStartDate,
        endDate: prevState.tempEndDate,
        isApplied: true,
      })) 
      }
    

   useEffect(() => {
    if (state.isApplied) {
      onDateSelection(state.startDate, state.endDate);
    }
  }, [state.isApplied, state.startDate, state.endDate, onDateSelection]);



return(

<div className="max-w-max mx-auto my-auto bg-white rounded-xl shadow-md shadow-slate-800/45 p-6 ">

      <div className="  p-4 rounded-lg mb-6 flex justify-between items-center">

        <p className="text-bold">Date Picker Power Bi</p>

         <button
          onClick={handleApplyFilter}
          disabled={state.isApplied}
          className="bg-blue-500 hover:bg-blue-300 text-white font-bold py-2 px-4 rounded"
        >
          {state.isApplied ? "✅ Applyed" : "🚀 Apply"}
        </button>
     

      </div>
      <div>
     <DateRangePicker 
        ranges={[selectionRange]}
        onChange={(ranges:any)=>handleDateChange(ranges)}
        moveRangeOnFirstSelection={false}
        months={1}
        direction="horizontal"
      />
      </div>
      </div>
    
  


)

}

