export function firstLetterToUppercase (str:string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function isValidUrl(str: string) {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}


export function extractHost(str: string) {
  if (isValidUrl(str)) {
    return new URL(str).host;
  } else  {
    return str; // return the full string is not an URL instead of an error
  }
  
}