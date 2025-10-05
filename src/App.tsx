import { useState } from 'react'

import './App.css'

function App() {

  return (
    <>
      <title>Timesheet</title>
      <div className='timesheet-container'>
        {/* Row 1 */}
        <div className='row-header'>Day</div>
        <div className='day-cell'>Sunday</div>
        <div className='day-cell'>Monday</div>
        <div className='day-cell'>Tuesday</div>
        <div className='day-cell'>Wednesday</div>
        <div className='day-cell'>Thursday</div>
        <div className='day-cell'>Friday</div>
        <div className='day-cell'>Saturday</div>
        
        {/* Row 2 */}
        <div className='row-header'>Billable Hours</div>
        <div className='hours-cell'>0</div>
        <div className='hours-cell'>8</div>
        <div className='hours-cell'>8</div>
        <div className='hours-cell'>8</div>
        <div className='hours-cell'>8</div>
        <div className='hours-cell'>8</div>
        <div className='hours-cell'>0</div>
      </div>    
    </>
  )
}

export default App
