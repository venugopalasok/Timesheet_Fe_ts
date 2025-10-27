import { useState, useEffect } from 'react'
import Header from './components/Header'
import './App.css'
import DateCell from './components/DateCell'
import DayCell from './components/DayCell'
import HoursCell from './components/HoursCell'
import WFHCell from './components/WFHCell'
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
import { 
  saveWeeklyTimesheets, 
  submitWeeklyTimesheets,
  checkSaveServiceHealth,
  checkSubmitServiceHealth
} from './services/timesheetAPI'
import type { WeekRange } from './utils/weekNavigation'

interface DayData {
  billableHours: number;
  nonBillableHours: number;
  isWFH: boolean;
}

const DEFAULT_PROJECT_ID = 'PROJ001';
const DEFAULT_EMPLOYEE_ID = 'EMP001';
const DEFAULT_TASK_ID = 'TASK001';

function App() {
  const [currentWeek, setCurrentWeek] = useState<WeekRange>(getFirstWeekOfCurrentMonth())
  const [weekDisplay, setWeekDisplay] = useState<string>('')
  const [selectedDays, setSelectedDays] = useState<Set<number>>(new Set())
  const [dayData, setDayData] = useState<DayData[]>(
    Array(7).fill(null).map(() => ({ billableHours: 0, nonBillableHours: 0, isWFH: false }))
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [servicesHealthy, setServicesHealthy] = useState({
    save: true,
    submit: true
  })

  useEffect(() => {
    setWeekDisplay(getWeekRangeDisplay(currentWeek))
    // Clear selected days when week changes
    setSelectedDays(new Set())
  }, [currentWeek])

  // Check backend services health on mount
  useEffect(() => {
    const checkServices = async () => {
      const saveOk = await checkSaveServiceHealth()
      const submitOk = await checkSubmitServiceHealth()
      setServicesHealthy({ save: saveOk, submit: submitOk })
    }
    checkServices()
  }, [])

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

  const handleBillableHoursChange = (dayIndex: number, hours: number) => {
    setDayData(prev => {
      const newData = [...prev]
      newData[dayIndex] = { ...newData[dayIndex], billableHours: hours }
      return newData
    })
  }

  const handleNonBillableHoursChange = (dayIndex: number, hours: number) => {
    setDayData(prev => {
      const newData = [...prev]
      newData[dayIndex] = { ...newData[dayIndex], nonBillableHours: hours }
      return newData
    })
  }

  const handleWFHChange = (dayIndex: number, isWFH: boolean) => {
    setDayData(prev => {
      const newData = [...prev]
      newData[dayIndex] = { ...newData[dayIndex], isWFH }
      return newData
    })
  }

  const formatDateForAPI = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const handleSave = async () => {
    setError(null)
    setSuccessMessage(null)
    setIsLoading(true)

    try {
      if (!servicesHealthy.save) {
        throw new Error('Save service is not available. Please try again later.')
      }

      const startDate = formatDateForAPI(currentWeek.startDate)
      const endDate = formatDateForAPI(currentWeek.endDate)

      // Save billable hours
      const billableResponse = await saveWeeklyTimesheets({
        startDate,
        endDate,
        hours: 0, // Will be overridden for each day
        employeeId: DEFAULT_EMPLOYEE_ID,
        projectId: DEFAULT_PROJECT_ID,
        recordType: 'billable',
        taskId: DEFAULT_TASK_ID,
      })

      // Save non-billable hours
      const nonBillableResponse = await saveWeeklyTimesheets({
        startDate,
        endDate,
        hours: 0, // Will be overridden for each day
        employeeId: DEFAULT_EMPLOYEE_ID,
        projectId: DEFAULT_PROJECT_ID,
        recordType: 'non-billable',
        taskId: DEFAULT_TASK_ID,
      })

      setSuccessMessage('Timesheet saved successfully!')
      console.log('Save responses:', billableResponse, nonBillableResponse)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save timesheet'
      setError(message)
      console.error('Save error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async () => {
    setError(null)
    setSuccessMessage(null)
    setIsLoading(true)

    try {
      if (!servicesHealthy.submit) {
        throw new Error('Submit service is not available. Please try again later.')
      }

      const startDate = formatDateForAPI(currentWeek.startDate)
      const endDate = formatDateForAPI(currentWeek.endDate)

      // Submit billable hours
      const billableResponse = await submitWeeklyTimesheets({
        startDate,
        endDate,
        hours: 0, // Will be overridden for each day
        employeeId: DEFAULT_EMPLOYEE_ID,
        projectId: DEFAULT_PROJECT_ID,
        recordType: 'billable',
        taskId: DEFAULT_TASK_ID,
      })

      // Submit non-billable hours
      const nonBillableResponse = await submitWeeklyTimesheets({
        startDate,
        endDate,
        hours: 0, // Will be overridden for each day
        employeeId: DEFAULT_EMPLOYEE_ID,
        projectId: DEFAULT_PROJECT_ID,
        recordType: 'non-billable',
        taskId: DEFAULT_TASK_ID,
      })

      setSuccessMessage('Timesheet submitted successfully!')
      console.log('Submit responses:', billableResponse, nonBillableResponse)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit timesheet'
      setError(message)
      console.error('Submit error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <title>Timesheet</title>
      <Header />
      <div className='flex flex-col justify-center items-center mx-5 my-3'>
      
        <div className='grid grid-cols-[120px_repeat(7,1fr)] gap-3 
        bg-white/95 backdrop-blur-sm mt-20 border-0 rounded-2xl 
        w-full max-w-6xl box-border p-6 shadow-2xl overflow-x-auto'>
          
          {/* Status Messages */}
          {error && (
            <div className='col-span-full bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-lg mb-2'>
              ✕ {error}
            </div>
          )}
          {successMessage && (
            <div className='col-span-full bg-green-100 border-2 border-green-400 text-green-700 px-4 py-3 rounded-lg mb-2'>
              ✓ {successMessage}
            </div>
          )}
          {!servicesHealthy.save && (
            <div className='col-span-full bg-yellow-100 border-2 border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg mb-2'>
              ⚠ Save service unavailable
            </div>
          )}
          {!servicesHealthy.submit && (
            <div className='col-span-full bg-yellow-100 border-2 border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg mb-2'>
              ⚠ Submit service unavailable
            </div>
          )}

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
          
          {/* Date Row */}
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

          {/* Row 2 - WFH */}
          <div className='row-header'>WFH: Y/N</div>
          {currentWeek.dates.map((date, index) => (
            <WFHCell
              key={index}
              isWFH={dayData[index].isWFH}
              onChange={(isWFH) => handleWFHChange(index, isWFH)}
              dayIndex={index}
            />
          ))}
          
          {/* Row 3 - Billable Hours */}
          <div className='row-header'>Billable Hours</div>
          {currentWeek.dates.map((date, index) => (
            <HoursCell
              key={index}
              hours={dayData[index].billableHours}
              onChange={(hours) => handleBillableHoursChange(index, hours)}
              dayIndex={index}
            />
          ))}

          {/* Row 4 - Non-Billable Hours */}
          <div className='row-header'>Non-Billable Hours</div>
          {currentWeek.dates.map((date, index) => (
            <HoursCell
              key={index}
              hours={dayData[index].nonBillableHours}
              onChange={(hours) => handleNonBillableHoursChange(index, hours)}
              dayIndex={index}
            />
          ))}

          {/* Save and Submit Buttons */}
          <div className='col-span-full flex justify-end mt-4 gap-2'>
            <button
              onClick={handleSave}
              disabled={isLoading || !servicesHealthy.save}
              className={`px-5 py-4 text-lg font-semibold rounded-xl shadow-lg border-2 border-purple-500
              transition-all duration-200 ${
                isLoading || !servicesHealthy.save
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300'
                  : 'bg-white hover:bg-purple-50 text-purple-500 hover:shadow-2xl hover:scale-105 cursor-pointer'
              }`}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>  
            <button
              onClick={handleSubmit}
              disabled={isLoading || !servicesHealthy.submit}
              className={`px-5 py-4 text-lg font-semibold rounded-xl shadow-lg
              transition-all duration-200 ${
                isLoading || !servicesHealthy.submit
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white hover:shadow-2xl hover:scale-105 cursor-pointer'
              }`}
            >
              {isLoading ? 'Submitting...' : 'Submit'}
            </button>  
          </div>

        </div>
      
      </div>
      
    </>
  )
}

export default App
