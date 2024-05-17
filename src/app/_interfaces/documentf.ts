import { Author } from "./author";
import { FileType } from "./fileType.enum";

export interface Documentf{
    id?: number;
    title?: string;
    theme?: string;
    resume?: string;
    createdDate?: string;
    type?: FileType;
    author?: Author;
    authorFullName?:string;
    authorId?: number;
    keyWords?: string;
    
}