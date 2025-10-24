interface DayCellProps {
  day: string;
  isSelected?: boolean;
  onToggle?: () => void;
}

const DayCell = ({ day, isSelected = false, onToggle }: DayCellProps) => {
  // Convert full day name to 3-character abbreviation
  const getDayAbbreviation = (fullDay: string): string => {
    return fullDay.substring(0, 3).toUpperCase();
  };

  const dayAbbr = getDayAbbreviation(day);

  return (
    <button
      onClick={onToggle}
      className={`text-xs font-semibold p-1.5 text-center 
      flex items-center flex-col justify-center rounded-xl shadow-sm 
      transition-all duration-200 cursor-pointer
      ${isSelected 
        ? 'bg-gradient-to-br from-indigo-500 to-purple-600 border-2 border-indigo-600 text-white shadow-md scale-105' 
        : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 text-blue-700 hover:shadow-md hover:scale-105'
      }`}
    >
      {dayAbbr}
    </button>
  );
};

export default DayCell;