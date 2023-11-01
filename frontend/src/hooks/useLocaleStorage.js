import { useEffect, useState } from 'react';

function getStoredValue(key, initialState) {
  const storedValue = localStorage.getItem(key) || initialState;
  let parsedValue;

  try {
    parsedValue = JSON.parse(storedValue);
    return parsedValue;
  } catch (err) {
    return storedValue;
  }
}

export function useLocalStorageState(key, initialState = null) {
  const [value, setValue] = useState(getStoredValue(key, initialState));

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
