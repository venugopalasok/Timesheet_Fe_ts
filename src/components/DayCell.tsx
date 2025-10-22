const DayCell = ({day}:{day:any}) => {
    return (
    <div className='bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 text-xs font-semibold text-blue-700 p-1.5 text-center 
    flex items-center flex-col justify-center rounded-xl aspect-square shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200'>{day}</div>
    )
}

export default DayCell;