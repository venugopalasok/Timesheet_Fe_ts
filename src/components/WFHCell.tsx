interface WFHCellProps {
  isWFH: boolean;
  onChange?: (isWFH: boolean) => void;
  dayIndex?: number;
}

const WFHCell = ({ isWFH, onChange, dayIndex }: WFHCellProps) => {
  const handleToggle = () => {
    if (onChange) {
      onChange(!isWFH);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`${
        isWFH
          ? 'bg-gradient-to-br from-blue-100 to-blue-200 border-blue-400 text-blue-700'
          : 'bg-gradient-to-br from-gray-50 to-slate-50 border-gray-300 text-gray-500'
      } border-2 text-lg font-bold p-2 text-center 
      flex items-center flex-col justify-center rounded-lg aspect-square shadow-sm 
      hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer`}
      title={`Day ${dayIndex !== undefined ? dayIndex + 1 : ''} - Click to toggle WFH status`}
    >
      {isWFH ? 'Y' : 'N'}
    </button>
  );
};

export default WFHCell;
