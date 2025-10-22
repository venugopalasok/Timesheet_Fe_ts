const HoursCell = ({hours}:{hours:any}) => {
    const isZero = hours === 0;
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const timeFormat = `${formattedHours}:00`;
    return (
        <div className={`${isZero ? 'bg-gradient-to-br from-gray-50 to-slate-50 border-gray-300 text-gray-400' : 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-300 text-emerald-700'} border-2 text-2xl font-bold p-2 text-center 
        flex items-center flex-col justify-center rounded-lg aspect-square shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer`}>{timeFormat}
        </div>
    )
}

export default HoursCell;