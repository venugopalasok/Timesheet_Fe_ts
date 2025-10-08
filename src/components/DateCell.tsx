const DateCell = ({date}:{date:any}) => {
    return (
        <>
            <div className='bg-white text-black p-4 text-center 
                            flex items-center flex-col justify-center 
                            rounded-[5px]'>
                {date}
            </div>
        </>
    )
}

export default DateCell;