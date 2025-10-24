import { useState, useEffect } from 'react'
import Header from './components/Header'
import './App.css'
import DateCell from './components/DateCell'
import DayCell from './components/DayCell'
import HoursCell from './components/HoursCell'
import { 
  getFirstWeekOfCurrentMonth,
  getNextWeek, 
  getPreviousWeek, 
  formatDateForDisplay, 
  getDayName,
  getWeekRangeDisplay,
  isToday,
  canNavigateNext,
  canNavigatePrevious,
  isWeekCompletelyInCurrentMonth
} from './utils/weekNavigation'
import type { WeekRange } from './utils/weekNavigation'

function App() {
  const [currentWeek, setCurrentWeek] = useState<WeekRange>(getFirstWeekOfCurrentMonth())
  const [weekDisplay, setWeekDisplay] = useState<string>('')
  const [selectedDays, setSelectedDays] = useState<Set<number>>(new Set())

  useEffect(() => {
    setWeekDisplay(getWeekRangeDisplay(currentWeek))
    // Clear selected days when week changes
    setSelectedDays(new Set())
  }, [currentWeek])

  const handleNextWeek = () => {
    const nextWeek = getNextWeek(currentWeek)
    if (nextWeek) {
      setCurrentWeek(nextWeek)
    }
  }

  const handlePrevWeek = () => {
    const prevWeek = getPreviousWeek(currentWeek)
    if (prevWeek) {
      setCurrentWeek(prevWeek)
    }
  }

  const handleDayToggle = (dayIndex: number) => {
    setSelectedDays(prev => {
      const newSet = new Set(prev)
      if (newSet.has(dayIndex)) {
        newSet.delete(dayIndex)
      } else {
        newSet.add(dayIndex)
      }
      return newSet
    })
  }

  return (
    <>
      <title>Timesheet</title>
      <Header />
      <div className='flex flex-col justify-center items-center mx-5 my-3'>
      
        <div className='grid grid-cols-[120px_repeat(7,1fr)] gap-3 
        bg-white/95 backdrop-blur-sm mt-20 border-0 rounded-2xl 
        w-full max-w-6xl box-border p-6 shadow-2xl'>
          {/* Row 1 - Navigation and Week Display */}
          <div className='flex flex-col justify-center items-center gap-2'>
            <div className='flex flex-row justify-center items-center gap-2'>
              <button 
                onClick={handlePrevWeek}
                disabled={!canNavigatePrevious(currentWeek)}
                className={`px-4 py-3 text-sm rounded-lg shadow-md transition-all duration-200 ${
                  canNavigatePrevious(currentWeek)
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white hover:shadow-lg hover:scale-105 cursor-pointer'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                &lt;
              </button>
              <button 
                onClick={handleNextWeek}
                disabled={!canNavigateNext(currentWeek)}
                className={`px-4 py-3 text-sm rounded-lg shadow-md transition-all duration-200 ${
                  canNavigateNext(currentWeek)
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white hover:shadow-lg hover:scale-105 cursor-pointer'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                &gt;
              </button>
            </div>
            <div className='text-sm font-medium text-gray-600 text-center'>
              {weekDisplay}
            </div>
            {selectedDays.size > 0 && (
              <div className='text-xs text-indigo-600 font-medium text-center'>
                {selectedDays.size} day{selectedDays.size !== 1 ? 's' : ''} selected
              </div>
            )}
            {(!canNavigatePrevious(currentWeek) || !canNavigateNext(currentWeek)) && (
              <div className='text-xs text-gray-500 text-center mt-1'>
                {!canNavigatePrevious(currentWeek) && !canNavigateNext(currentWeek) 
                  ? 'Only week in current month'
                  : !canNavigatePrevious(currentWeek) 
                    ? 'First week of month' + (!isWeekCompletelyInCurrentMonth(currentWeek) ? ' (includes previous month days)' : '')
                    : 'Last week of month' + (!isWeekCompletelyInCurrentMonth(currentWeek) ? ' (includes next month days)' : '')
                }
              </div>
            )}
          </div>
          {currentWeek.dates.map((date, index) => {
            const currentDate = new Date();
            const isCurrentMonth = date.getMonth() === currentDate.getMonth() && 
                                 date.getFullYear() === currentDate.getFullYear();
            return (
              <DateCell 
                key={index} 
                date={formatDateForDisplay(date)} 
                isToday={isToday(date)} 
                isCurrentMonth={isCurrentMonth}
              />
            );
          })}
          {/* Row 2 */}
          <div className='row-header'>WFH: Y/N</div>
          {currentWeek.dates.map((date, index) => (
            <DayCell 
              key={index} 
              day={getDayName(date)} 
              isSelected={selectedDays.has(index)}
              onToggle={() => handleDayToggle(index)}
            />
          ))}
          
          {/* Row 3 */}
          <div className='row-header'>Billable Hours</div>
          <HoursCell hours={0}/>
          <HoursCell hours={8}/>
          <HoursCell hours={8}/>
          <HoursCell hours={8}/>
          <HoursCell hours={8}/>
          <HoursCell hours={8}/>
          <HoursCell hours={0}/>
          {/* Row 4 */}
          <div className='row-header'>Non-Billable Hours</div>
          <HoursCell hours={0}/>    
          <HoursCell hours={0}/>
          <HoursCell hours={0}/>
          <HoursCell hours={0}/>
          <HoursCell hours={0}/>
          <HoursCell hours={0}/>
          <HoursCell hours={0}/>

        {/*Submit Button*/}
        
          <div className='col-span-full flex justify-end mt-4 gap-2'>
            <button className='bg-white hover:from-white 
            hover:to-purple-400 text-purple-500 px-5 py-4 text-lg font-semibold rounded-xl shadow-lg border-2 border-purple-500
            transition-all duration-200 hover:shadow-2xl hover:scale-105'>
              Save
            </button>  
            <button className='bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 
            hover:to-purple-700 text-white px-5 py-4 text-lg font-semibold rounded-xl shadow-lg 
            transition-all duration-200 hover:shadow-2xl hover:scale-105'>
              Submit
            </button>  
          </div>

        </div>
      
      </div>
      
    </>
  )
}

export default App
