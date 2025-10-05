import Header from './components/Header'
import './App.css'

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
        <div className='date-cell'>05</div>
        <div className='date-cell'>06</div>
        <div className='date-cell'>07</div>
        <div className='date-cell'>08</div>
        <div className='date-cell'>09</div>
        <div className='date-cell'>10</div>
        <div className='date-cell'>11</div>
        {/* Row 2 */}
        <div className='row-header'>Day</div>
        <div className='day-cell'>Sunday</div>
        <div className='day-cell'>Monday</div>
        <div className='day-cell'>Tuesday</div>
        <div className='day-cell'>Wednesday</div>
        <div className='day-cell'>Thursday</div>
        <div className='day-cell'>Friday</div>
        <div className='day-cell'>Saturday</div>
        
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
