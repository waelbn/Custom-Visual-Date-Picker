import * as React from "react";
import { useState,useEffect } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export default function DatePicker ({onDateSelection}) {
 
  const today = new Date();

  const [state, setState] = useState({
    startDate: today as Date | null,
    endDate: today as Date | null,
    tempStartDate: today as Date | null,
    tempEndDate: today as Date | null,
    deltaDays: 0,
    isApplied: false,
  });


  const selectionRange = {
         startDate: state.tempStartDate,
         endDate: state.tempEndDate,
         key: "selection",
    };


function calculateDelta(start: Date, end: Date): number {
    const timeDiff = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }


const  handleApplyFilter = () => {
    setState(state=>(
      {...state,
        startDate: state.tempStartDate,
        endDate: state.tempEndDate,
        isApplied: true,
      }))
     
      
      }
    
 

const setRelativeDate = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - (days - 1));

    const deltaDays = calculateDelta(start, end);

   setState(prev => ({
    ...prev,
    tempStartDate: start,
    tempEndDate: end,
    deltaDays,
    isApplied: false,
  }));
  };


 const handleDateChange = (ranges: any) => {
    const tempStartDate = ranges.selection.startDate;
    const tempEndDate = ranges.selection.endDate;
    const deltaDays = calculateDelta(tempStartDate, tempEndDate);
    setState(state=>({...state,
      tempStartDate,
      tempEndDate,
      deltaDays,
      isApplied: false,
    }));
  };

   useEffect(() => {
    if (state.isApplied) {
      onDateSelection(state.startDate, state.endDate);
    }
  }, [state.isApplied, state.startDate, state.endDate, onDateSelection]);
return(
<>
<div className="bg-stone-100 flex justify-center p-6 min-h-screen">
  <div className="bg-white rounded-2xl shadow-lg flex w-full max-w-5xl overflow-hidden">
    {/* Sidebar */}
    <div className="flex flex-col justify-center w-1/5 p-4 space-y-4 bg-stone-50 border-r border-stone-200">
      <button
        onClick={() => setRelativeDate(7)}
        className="bg-amber-600 hover:bg-amber-800 text-white font-semibold py-2 rounded"
      >
        Last 7 Days
      </button>
      <button
        onClick={() => setRelativeDate(30)}
        className="bg-amber-600 hover:bg-amber-800 text-white font-semibold py-2 rounded"
      >
        Last 30 Days
      </button>
      <button
        onClick={() => setRelativeDate(90)}
        className="bg-amber-600 hover:bg-amber-800 text-white font-semibold py-2 rounded"
      >
        Last 90 Days
      </button>
    </div>

    
    <div className="flex-1 flex flex-col p-6 space-y-6">
      
      <div className="flex justify-center mb-4">
        <button
          onClick={()=>handleApplyFilter()}
          className="bg-amber-400 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          {state.isApplied ? "✅ Applyed" : "🚀 Apply"}
        </button>
      </div>

      {/* Date picker */}
     <DateRange
        ranges={[selectionRange]}
        onChange={(ranges:any)=>handleDateChange(ranges)}
        moveRangeOnFirstSelection={false}
        months={1}
        direction="horizontal"
      />
    </div>
  </div>
</div>

</>)





    

         

    
    
    

      
      
        
    
}

