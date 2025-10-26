import { useState } from 'react';

interface HoursCellProps {
  hours: number;
  onChange?: (hours: number) => void;
  dayIndex?: number;
}

const HoursCell = ({ hours, onChange, dayIndex }: HoursCellProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(String(hours));
  const isZero = hours === 0;
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const timeFormat = `${formattedHours}:00`;

  const handleClick = () => {
    setIsEditing(true);
    setInputValue(String(hours));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers, max 2 digits, max value 24
    if (value === '' || (/^\d{1,2}$/.test(value) && parseInt(value) <= 24)) {
      setInputValue(value);
    }
  };

  const handleBlur = () => {
    const newHours = inputValue === '' ? 0 : Math.min(parseInt(inputValue), 24);
    if (newHours !== hours && onChange) {
      onChange(newHours);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        type="number"
        min="0"
        max="24"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoFocus
        className="w-full h-full rounded-lg border-2 border-indigo-500 text-center text-2xl font-bold
        focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent
        aspect-square"
      />
    );
  }

  return (
    <div
      onClick={handleClick}
      className={`${
        isZero
          ? 'bg-gradient-to-br from-gray-50 to-slate-50 border-gray-300 text-gray-400'
          : 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-300 text-emerald-700'
      } border-2 text-2xl font-bold p-2 text-center 
      flex items-center flex-col justify-center rounded-lg aspect-square shadow-sm 
      hover:shadow-md hover:scale-105 transition-all duration-200 cursor-pointer`}
      title={`Day ${dayIndex !== undefined ? dayIndex + 1 : ''} - Click to edit`}
    >
      {timeFormat}
    </div>
  );
};

export default HoursCell;