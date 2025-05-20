export interface ContactInterface {
    _id: string,
    name: string,
    email: string,
    message: string,
}

export interface LoginInterface {
    _id: string,
    email: string,
    password: string,
}

export interface UsersInterface {
    fullName: string;
    email: string;
    phone: string;
    position: string;
    password: string;
    base64Image?: string;
    image?: File;
}
