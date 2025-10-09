const HoursCell = ({hours}:{hours:any}) => {
    return (
        <div className='bg-white text-xl font-mono slashed-zero text-black p-4 text-center 
        flex items-center flex-col justify-center rounded-[5px]'>{hours}
        </div>
    )
}

export default HoursCell;