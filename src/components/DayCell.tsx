const DayCell = ({day}:{day:any}) => {
    return (
    <div className='bg-white text-xl font-mono text-black p-4 text-center 
    flex items-center flex-col justify-center rounded-[5px]'>{day}</div>
    )
}

export default DayCell;