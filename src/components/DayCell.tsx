const DayCell = ({day}:{day:any}) => {
    return (
    <div className='bg-white border-black-400 border text-sm font-mono text-black p-2 text-center 
    flex items-center flex-col justify-center rounded-[5px] aspect-square'>{day}</div>
    )
}

export default DayCell;