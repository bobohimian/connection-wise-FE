import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearActiveDropdownId, selectActiveDropdownId, toggleActiveDropdownId } from '../../store/slices/ui';
const Dropdown = ({ id, label, alignTo = 'left', children }) => {
  const dispatch = useDispatch();
  const activeDropdown = useSelector(selectActiveDropdownId);
  const ref = useRef(null);
  const positionStyle = alignTo === 'right' ? 'right-0' : 'left-0';
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (activeDropdown !== id) return;
      if (ref.current && !ref.current.contains(e.target)) {
        dispatch(clearActiveDropdownId());
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => { window.removeEventListener('mousedown', handleClickOutside); };
  }, [activeDropdown, dispatch, id]);
  return (
    <div className="relative" ref={ref}>
      <button key={`${id}`}
        className="px-2 py-1 h-8 text-xs rounded hover:bg-gray-100 flex items-center gap-1"
        onClick={() => dispatch(toggleActiveDropdownId(id))}
      >
        {label}
      </button>
      <div className={`absolute ${positionStyle} mt-1 w-40 z-10 transform transition-all duration-200 ease-in-out origin-top-left ${activeDropdown === id
        ? 'opacity-100 scale-100 translate-x-0 translate-y-0'
        : 'opacity-0 scale-75 translate-x-5 -translate-y-2 pointer-events-none'
      }`}
      >
        <div className="rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dropdown;