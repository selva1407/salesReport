import { useEffect, useRef, useState } from "react"
import { DateRangePicker,defaultStaticRanges, defaultInputRanges, createStaticRanges } from "react-date-range";
import format from "date-fns/format";
import { startOfDay, endOfDay } from 'date-fns';
import "./DateRangeComponent.css"

const DateRangeComponent = ({range, setRange}) => {
  
  // open close
  const [open, setOpen] = useState(false)
  
  // get the target element to toggle 
  const refOne = useRef(null)
  
  function getFinancialYearRange() {
  const today = new Date();
  const year = today.getFullYear();

  let startYear = year;
  let endYear = year + 1;

  // If today's month is before April (i.e., Jan, Feb, March),
  // then we are still in the previous financial year
  if (today.getMonth() < 3) {
    startYear = year - 1;
    endYear = year;
  }

  const startDate = startOfDay(new Date(startYear, 3, 1)); // April 1st
  const endDate = endOfDay(new Date(endYear, 2, 31)); // March 31st

  return { startDate, endDate };
  }
  
  const customStaticRanges = createStaticRanges([
  ...defaultStaticRanges,
  {
    label: 'This Financial Year',
    range: getFinancialYearRange
  }
  ]);
  
  useEffect(() => {
    // event listeners
    document.addEventListener("keydown", hideOnEscape, true)
    document.addEventListener("click", hideOnClickOutside, true)
    // Clean up event listeners
    return () => {
      document.removeEventListener("keydown", hideOnEscape, true);
      document.removeEventListener("click", hideOnClickOutside, true);
    }
  }, [])

  // hide dropdown on ESC press
  const hideOnEscape = (e) => {
    // console.log(e.key)
    if( e.key === "Escape" ) {
      setOpen(false)
    }
  }

  // Hide dropdown on outside click
  const hideOnClickOutside = (e) => {
    // console.log(refOne.current)
    // console.log(e.target)
    if( refOne.current && !refOne.current.contains(e.target) ) {
      setOpen(false)
    }
  }
  
  return (
    <div className="calendarWrap">
      <input
        value={`${format(range[0].startDate, "dd/MM/yyyy")} to ${format(range[0].endDate, "dd/MM/yyyy")}`}
        readOnly
        className="inputBox"
        onClick={ () => setOpen(open => !open) }
      />

      <div ref={refOne}>
        {open && 
          <DateRangePicker
            onChange={item => setRange([item.selection])}
            editableDateInputs={true}
            moveRangeOnFirstSelection={false}
            ranges={range}
            months={1}
            direction="horizontal"
            className="calendarElement"
            staticRanges={customStaticRanges}
            inputRanges={defaultInputRanges}
          />
        }
      </div>

    </div>
  )
}
export default DateRangeComponent;