/*
// User TEMPLATE
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
*/

// --------------------------- User STUDENT ------------------------------
interface BaseUserStudent {
    email: string;
    phone?: string;
    givenName: string;
    surname: string;
    degree?: string;
    program?: string;
    tags?: number[],
    jobPreferences?: number[],
    languages?: number[],
}
export type UserStudentType = BaseUserStudent; //Make interface to type
export type OptionalUserStudentType = Partial<BaseUserStudent>; //Make all "BaseUser" values optional

// Update User
export type UpdateUserStudentType = Omit<OptionalUserStudentType, "email">;

// ------------------------------ User COMPANY ------------------------------
interface BaseUserCompany {
    email: string;
    phone?: string;
    company: string;
    description?: string;
    givenName: string;
    surname: string;
    street: string;
    streetNumber: string;
    ZIPCode: number;
    city: string;
    country: string;
    size: string;
    industry: string;
}
export type UserCompanyType = BaseUserCompany; //Make interface to type
export type OptionalUserCompanyType = Partial<BaseUserCompany>; //Make all "BaseUser" values optional

// Update User
export type UpdateUserCompanyType = OptionalUserCompanyType;
