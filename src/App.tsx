import Header from './components/Header'
import './App.css'
import DateCell from './components/DateCell'
import DayCell from './components/DayCell'
import HoursCell from './components/HoursCell'

function App() {

  return (
    <>
      <title>Timesheet</title>
      <Header />
      <div className='flex flex-col justify-center items-center mx-5 my-3'>
      
        <div className='grid grid-cols-[120px_repeat(7,1fr)] gap-3 
        bg-white/95 backdrop-blur-sm mt-20 border-0 rounded-2xl 
        w-full max-w-6xl box-border p-6 shadow-2xl'>
          {/* Row 1 */}
          <div className='flex flex-row justify-center items-center gap-2'>
                  <button className='bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-3 text-sm rounded-lg shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105'>&lt;</button>
                  <button className='bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-3 text-sm rounded-lg shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105'>&gt;</button>
          </div>
          <DateCell date={5}/>
          <DateCell date={6}/>
          <DateCell date={7}/>
          <DateCell date={8}/>
          <DateCell date={9}/>
          <DateCell date={10}/>
          <DateCell date={11}/>
          {/* Row 2 */}
          <div className='row-header'>Day</div>
          <DayCell day="Sunday"/>
          <DayCell day="Monday"/>
          <DayCell day="Tuesday"/>
          <DayCell day="Wednesday"/>
          <DayCell day="Thursday"/>
          <DayCell day="Friday"/>
          <DayCell day="Saturday"/>
          
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
