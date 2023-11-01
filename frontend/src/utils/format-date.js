export default function formatDate(date) {
  const dateObj = new Date(date);
  const options = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };

  return dateObj.toLocaleDateString(dateObj, options);
}
