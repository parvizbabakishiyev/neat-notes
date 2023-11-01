export default function capitalizeFirstLetter(sentence) {
  if (typeof sentence !== 'string' || sentence.length === 0) {
    return sentence; // return the input as-is if it's not a valid string
  }

  // capitalize the first letter and concatenate the rest of the sentence
  return sentence.charAt(0).toUpperCase() + sentence.slice(1);
}
