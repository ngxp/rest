export interface Multipart {
    [key: string]: BodyPart<any>;
}

export interface BodyPart<T> {
    data: T; contentType: string;
}
