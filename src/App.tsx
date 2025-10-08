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
      <div className='grid grid-cols-[150px_repeat(7,1fr)] gap-[5px] 
      bg-gray-300 border border-gray-300 rounded-[5px] 
      w-full box-border p-5 mt-20'>
        {/* Row 1 */}
        <div className='flex justify-center items-center gap-[5px]'>
                <button className='bg-orange-500 text-white px-4 py-2 rounded'>&lt;</button>
                <button className='bg-orange-500 text-white px-4 py-2 rounded'>&gt;</button>
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
      
    </>
  )
}

export default App
