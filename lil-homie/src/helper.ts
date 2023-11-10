
export const titleCase = ( input : string ) => {
  let words : string[] = input.split(' ')
  return words.map( word => {
    if (word.length < 3) return word
    return word.charAt(0).toLocaleUpperCase() + word.slice(1)
  })
} 
