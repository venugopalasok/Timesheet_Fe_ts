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
      <div className='flex justify-center items-center mx-5 my-3'>
      
        <div className='grid grid-cols-[100px_repeat(7,1fr)] gap-[3px] 
        bg-white mt-20 border border-gray-200 rounded-[5px] 
        w-full max-w-5xl box-border p-3'>
          {/* Row 1 */}
          <div className='flex flex-col justify-center items-center gap-[3px]'>
                  <button className='bg-gray-400 text-white px-2 py-1 text-sm rounded w-20'>Previous</button>
                  <button className='bg-white text-black border-black-400 border px-2 py-1 text-sm rounded '>Next</button>
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

        </div>
      </div>
      
    </>
  )
}

export default App
