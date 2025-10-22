const DateCell = ({date}:{date:any}) => {
    const formattedDate = date < 10 ? `0${date}` : date;
    return (
        <>
            <div className='bg-gradient-to-br slashed-zero from-indigo-50 to-purple-50 border-2 border-indigo-200 text-5xl font-bold text-indigo-700 p-3 text-center 
                            flex items-center flex-col justify-center 
                            rounded-xl aspect-square shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer'>
                {formattedDate}
            </div>
        </>
    )
}

export default DateCell;