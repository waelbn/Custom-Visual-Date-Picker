import * as React from "react";
import { useState,useEffect } from "react";
import { DateRangePicker  } from "react-date-range";
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
<div className="max-w-max mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
  
      
      
      <div className="  p-4 rounded-lg mb-6 flex justify-between items-center">
        <p>Date Picker Power Bi</p>
         <button
          onClick={()=>handleApplyFilter()}
          className="bg-blue-500 hover:bg-blue-300 text-white font-bold py-2 px-4 rounded"
        >
          {state.isApplied ? "✅ Applyed" : "🚀 Apply"}
        </button>
      {/* Date picker */}
</div>
      <div className=" rounded-lg mx-auto">
     <DateRangePicker 
        ranges={[selectionRange]}
        onChange={(ranges:any)=>handleDateChange(ranges)}
        moveRangeOnFirstSelection={false}
        months={1}
        direction="horizontal"
      />
      </div>
      </div>
    
  


</>)





    

         

    
    
    

      
      
        
    
}

