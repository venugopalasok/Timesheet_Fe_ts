interface DateCellProps {
  date: number;
  isToday?: boolean;
  isCurrentMonth?: boolean;
}

const DateCell = ({ date, isToday = false, isCurrentMonth = true }: DateCellProps) => {
    const formattedDate = date < 10 ? `0${date}` : date;
    
    return (
        <>
            <div className={`slashed-zero text-5xl font-bold p-3 text-center 
                            flex items-center flex-col justify-center 
                            rounded-xl aspect-square shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer
                            ${isToday 
                              ? 'bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-blue-400 text-blue-800' 
                              : isCurrentMonth
                                ? 'bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 text-indigo-700'
                                : 'bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 text-gray-500'
                            }`}>
                {formattedDate}
            </div>
        </>
    )
}

export default DateCell;