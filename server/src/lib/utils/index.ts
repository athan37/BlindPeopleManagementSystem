import { sha256 } from "js-sha256";

export const clean = (word : string) : string => {
    return word.replace(/[\d .//!-+@#$%^&*()={}~`<>,;:'"]/g, "")
}

export const createHashFromUser = (input : any) : string =>  {
    const userString = clean(input.lastName + input.firstName) + input.birthYear + input.gender + input.education
    const hash = sha256.create();
    hash.update(userString)
    const hexString = hash.hex();

    return hexString
}