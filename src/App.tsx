import Header from './components/Header'
import './App.css'
import DateCell from './components/DateCell'
import DayCell from './components/DayCell'

function App() {

  return (
    <>
      <title>Timesheet</title>
      <Header />
      <div className='timesheet-container'>
        {/* Row 1 */}
        <div className='prev-button-container'>
                <button className='button'>&lt;</button>
                <button className='button'>&gt;</button>
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
        <div className='hours-cell'>0</div>
        <div className='hours-cell'>8</div>
        <div className='hours-cell'>8</div>
        <div className='hours-cell'>8</div>
        <div className='hours-cell'>8</div>
        <div className='hours-cell'>8</div>
        <div className='hours-cell'>0</div>
        {/* Row 4 */}
        <div className='row-header'>Non-Billable Hours</div>
        <div className='hours-cell'>0</div>
        <div className='hours-cell'>0</div>
        <div className='hours-cell'>0</div>
        <div className='hours-cell'>0</div>
        <div className='hours-cell'>0</div>
        <div className='hours-cell'>0</div>
        <div className='hours-cell'>0</div>

      </div>
      
    </>
  )
}

export default App
