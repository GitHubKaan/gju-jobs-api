// User
interface BaseUser {
    email: string;
    givenName: string;
    surname: string;
    company: string;
    street: string;
    streetNumber: string;
    ZIPCode: number;
    city: string;
    country: string;
    phone?: string;
    isStudent: boolean;
}
export type User = BaseUser; //Make interface to type
export type OptionalUser = Partial<BaseUser>; //Make all "BaseUser" values optional

// Update User
export type UpdateUser = Omit<OptionalUser, "email">;