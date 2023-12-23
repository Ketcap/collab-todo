import { customAlphabet, urlAlphabet } from "nanoid";

export const nanoId = customAlphabet(urlAlphabet, 8);
