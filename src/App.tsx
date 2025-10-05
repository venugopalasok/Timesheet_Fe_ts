import Header from './components/Header'
import { DarkModeProvider } from './contexts/DarkModeContext'
import './App.css'

function App() {

  return (
    <DarkModeProvider>
      <title>Timesheet</title>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
            <Header />
            <div className="grid grid-cols-[150px_repeat(7,1fr)] gap-[5px] bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-[5px] w-full box-border p-5 mt-20">
            <div className=" text-white p-4 font-bold flex flex-row gap-2 items-center rounded-[5px]">
              <button className="bg-orange-500 text-white px-4 py-2 rounded">&lt;</button>
              <button className="bg-orange-500 text-white px-4 py-2 rounded">&gt;</button>
            </div>
            <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 text-center flex items-center flex-col justify-center rounded-[5px]">
            05</div>
            <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 text-center flex items-center flex-col justify-center rounded-[5px]">
            06</div>
            <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 text-center flex items-center flex-col justify-center rounded-[5px]">
            07</div>
            <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 text-center flex items-center flex-col justify-center rounded-[5px]">
            08</div>
            <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 text-center flex items-center flex-col justify-center rounded-[5px]">
            09</div>
            <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 text-center flex items-center flex-col justify-center rounded-[5px]">
            10</div>
            <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 text-center flex items-center flex-col justify-center rounded-[5px]">
            11</div>

              <div className="bg-[#4a90e2] dark:bg-blue-600 text-white p-4 font-bold flex flex-col items-center rounded-[5px]">Day</div>
              <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 text-center flex items-center flex-col justify-center rounded-[5px]">Sunday</div>
              <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 text-center flex items-center flex-col justify-center rounded-[5px]">Monday</div>
              <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 text-center flex items-center flex-col justify-center rounded-[5px]">Tuesday</div>
              <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 text-center flex items-center flex-col justify-center rounded-[5px]">Wednesday</div>
              <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 text-center flex items-center flex-col justify-center rounded-[5px]">Thursday</div>
              <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 text-center flex items-center flex-col justify-center rounded-[5px]">Friday</div>
              <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 text-center flex items-center flex-col justify-center rounded-[5px]">Saturday</div>

            <div className="bg-[#4a90e2] dark:bg-blue-600 text-white p-4 font-bold flex flex-col items-center rounded-[5px]">Billable Hours</div>
            <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 text-center flex items-center flex-col justify-center rounded-[5px]">0</div>
            <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 text-center flex items-center flex-col justify-center rounded-[5px]">8</div>
            <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 text-center flex items-center flex-col justify-center rounded-[5px]">8</div>
            <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 text-center flex items-center flex-col justify-center rounded-[5px]">8</div>
            <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 text-center flex items-center flex-col justify-center rounded-[5px]">8</div>
            <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 text-center flex items-center flex-col justify-center rounded-[5px]">8</div>
            <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 text-center flex items-center flex-col justify-center rounded-[5px]">0</div>

            <div className="bg-[#4a90e2] dark:bg-blue-600 text-white p-4 font-bold flex flex-col items-center rounded-[5px]">Non-Billable Hours</div>
            <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 text-center flex items-center flex-col justify-center rounded-[5px]">0</div>
            <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 text-center flex items-center flex-col justify-center rounded-[5px]">0</div>
            <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 text-center flex items-center flex-col justify-center rounded-[5px]">0</div>
            <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 text-center flex items-center flex-col justify-center rounded-[5px]">0</div>
            <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 text-center flex items-center flex-col justify-center rounded-[5px]">0</div>
            <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 text-center flex items-center flex-col justify-center rounded-[5px]">0</div>
            <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 text-center flex items-center flex-col justify-center rounded-[5px]">0</div>
        </div>
      </div>
    </DarkModeProvider>

  )
}

export default App
