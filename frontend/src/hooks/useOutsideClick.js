import { useEffect, useRef } from 'react';

function useOutsideClick(callback) {
  const ref = useRef();

  useEffect(() => {
    const handleClick = e => {
      if (ref.current && !ref.current.contains(e.target)) callback(e);
    };
    document.addEventListener('click', handleClick, true);

    return () => document.removeEventListener('click', handleClick, true);
  }, [ref, callback]);
  return ref;
}

export default useOutsideClick;
