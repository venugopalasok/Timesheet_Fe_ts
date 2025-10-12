const DateCell = ({date}:{date:any}) => {
    return (
        <>
            <div className='bg-white border-black-400 border text-base font-mono slashed-zero text-black p-2 text-center 
                            flex items-center flex-col justify-center 
                            rounded-[5px] aspect-square'>
                {date}
            </div>
        </>
    )
}

export default DateCell;