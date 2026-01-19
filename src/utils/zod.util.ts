import { z } from "zod";
import { FileType, fileTypes, JobsSortType, SupportType, supportTypes } from "../enums";
import { MESSAGE } from "../../responseMessage";
import { ENV } from "./envReader.util";

export class Schemas {
    static readonly UUID = (type?: string) =>
        z.string({ message: MESSAGE.ERROR.STRING(`${type}UUID`) })
            .uuid({ message: MESSAGE.ERROR.UUID(`${type}UUID`) });

    static readonly UUIDs = (minimum: number, maximum: number, type?: string) =>
        z.array(
            this.UUID(type),
            { message: MESSAGE.ERROR.ARRAY(`${type}UUIDs`) }
        )
            .min(minimum, { message: MESSAGE.ERROR.MIN_ELEMENT(minimum, `${type}UUIDs`) })
            .max(maximum, { message: MESSAGE.ERROR.MAX_ELEMENT(maximum, `${type}UUIDs`) })
            .refine((arr: string[]) => new Set(arr).size === arr.length, { message: MESSAGE.ERROR.UNIQUE(`${type}UUIDs`) });
    
    static readonly jobsSortType = z.nativeEnum(JobsSortType, {
        message: MESSAGE.ERROR.DECISION(`${Object.values(JobsSortType)}`),
    })

    static readonly Number = (value: string, minimum: number, maximum: number) =>
        z.number({ message: MESSAGE.ERROR.INT(value) })
            .min(minimum, { message: MESSAGE.ERROR.MIN_INT(minimum, value) })
            .max(maximum, { message: MESSAGE.ERROR.MAX_INT(maximum, value) });

    static readonly token =
        z.string({ message: MESSAGE.ERROR.STRING() })
            .regex(/^[A-Za-z0-9\-_. ]+$/, { message: MESSAGE.ERROR.REGEX() })
            .max(1000, { message: MESSAGE.ERROR.MAX_CHARACTERS(1000) });

    static readonly email =
        z.string({ message: MESSAGE.ERROR.STRING("email") })
            .email({ message: MESSAGE.ERROR.EMAIL("email") })
            .max(70, { message: MESSAGE.ERROR.MAX_CHARACTERS(70, "email") });

    static readonly boolean =
        z.boolean({ message: MESSAGE.ERROR.BOOLEAN() })

    static readonly phone =
        z.string({ message: MESSAGE.ERROR.STRING("phone") })
            .min(5, { message: MESSAGE.ERROR.MIN_CHARACTERS(5, "phone") })
            .max(20, { message: MESSAGE.ERROR.MAX_CHARACTERS(20, "phone") })
            .regex(/^\+?[0-9 -]+$/, { message: MESSAGE.ERROR.REGEX("phone") });

    static readonly authCode =
        z.string({ message: MESSAGE.ERROR.STRING("code") })
            .length(ENV.AUTH_CODE_LENGTH, { message: MESSAGE.ERROR.SPECIFIC_CHARACTER_LENGTH(ENV.AUTH_CODE_LENGTH, "code") })
            .regex(/^[A-Z0-9]+$/, { message: MESSAGE.ERROR.REGEX("code") });

    static readonly tags = z.array(
        z.number({ message: MESSAGE.ERROR.INT() })
            .min(0, { message: MESSAGE.ERROR.MIN_INT(0) })
            .max(100, { message: MESSAGE.ERROR.MAX_INT(100) }),
            { message: MESSAGE.ERROR.ARRAY() }
        )
        .max(100, { message: MESSAGE.ERROR.MAX_ELEMENT(100) })
        .refine((arr: (number | undefined)[]) => new Set(arr).size === arr.length, { message: MESSAGE.ERROR.UNIQUE() });
    
    static readonly apply =
        z.object({
            jobUUID: this.UUID("job"),
            message: z.string({ message: MESSAGE.ERROR.STRING() })
                .min(1, { message: MESSAGE.ERROR.MIN_CHARACTERS(1) })
                .max(500, { message: MESSAGE.ERROR.MAX_CHARACTERS(500) })
                //.regex(/^[a-zA-ZäöüÄÖÜß0-9.,'&\-\/\s]+$/, { message: MESSAGE.ERROR.REGEX() }) -- fix later
                .regex(/^(?!\s*$).+$/, { message: MESSAGE.ERROR.EMPTY })
                .optional()
        });

    static readonly job =
        z.object({
            title: z.string({ message: MESSAGE.ERROR.STRING() })
                .min(1, { message: MESSAGE.ERROR.MIN_CHARACTERS(1) })
                .max(50, { message: MESSAGE.ERROR.MAX_CHARACTERS(50) })
                .regex(/^[a-zA-ZäöüÄÖÜß0-9.,'&\-\/\s]+$/, { message: MESSAGE.ERROR.REGEX() })
                .regex(/^(?!\s*$).+$/, { message: MESSAGE.ERROR.EMPTY }),
            description: z.string({ message: MESSAGE.ERROR.STRING() })
                .min(15, { message: MESSAGE.ERROR.MIN_CHARACTERS(15) })
                .max(500, { message: MESSAGE.ERROR.MAX_CHARACTERS(500) })
                //.regex(/^[a-zA-ZäöüÄÖÜß0-9.,'&\-\/\s]+$/, { message: MESSAGE.ERROR.REGEX() }) -- fix later
                .regex(/^(?!\s*$).+$/, { message: MESSAGE.ERROR.EMPTY }),
            tags: this.tags
                .optional(),
            position: z.string({ message: MESSAGE.ERROR.STRING() })
                .min(1, { message: MESSAGE.ERROR.MIN_CHARACTERS(1) })
                .max(50, { message: MESSAGE.ERROR.MAX_CHARACTERS(50) })
                .regex(/^[a-zA-ZäöüÄÖÜß0-9.,'&\-\/\s]+$/, { message: MESSAGE.ERROR.REGEX() })
                .regex(/^(?!\s*$).+$/, { message: MESSAGE.ERROR.EMPTY }),
            exp: z.number()
                .min(1000000000)
                .max(9999999999)
                .refine((unixSeconds) => {
                    const inputDate = new Date(unixSeconds * 1000);
                    const today = new Date();

                    inputDate.setHours(0, 0, 0, 0);
                    today.setHours(0, 0, 0, 0);

                    return inputDate.getTime() >= today.getTime();
                }, {
                    message: MESSAGE.ERROR.TIMESTAMP_FUTURE,
                })
                .optional()
        });

    static readonly userStudent =
        z.object({
            email: z.string({ message: MESSAGE.ERROR.STRING("email") })
                .email({ message: MESSAGE.ERROR.EMAIL("email") })
                .max(70, { message: MESSAGE.ERROR.MAX_CHARACTERS(70, "email") })
                .refine(
                (value) => value.toLowerCase().endsWith(`@${ENV.ALLOWED_STUDENT_DOMAIN}`),
                { message: MESSAGE.ERROR.DOMAIN() }
            ),
            phone: this.phone
                .optional(),
            givenName: z.string({ message: MESSAGE.ERROR.STRING() })
                .min(1, { message: MESSAGE.ERROR.MIN_CHARACTERS(1) })
                .max(60, { message: MESSAGE.ERROR.MAX_CHARACTERS(60) })
                .regex(/^[a-zA-ZäöüÄÖÜß.\-\s]+$/, { message: MESSAGE.ERROR.REGEX() })
                .regex(/^(?!\s*$).+$/, { message: MESSAGE.ERROR.EMPTY }),
            surname: z.string({ message: MESSAGE.ERROR.STRING() })
                .min(1, { message: MESSAGE.ERROR.MIN_CHARACTERS(1) })
                .max(60, { message: MESSAGE.ERROR.MAX_CHARACTERS(60) })
                .regex(/^[a-zA-ZäöüÄÖÜß.\-\s]+$/, { message: MESSAGE.ERROR.REGEX() })
                .regex(/^(?!\s*$).+$/, { message: MESSAGE.ERROR.EMPTY }),
            //birthdate: z.coerce.date(), -- removed
            degree: z.string({ message: MESSAGE.ERROR.STRING() })
                .min(1, { message: MESSAGE.ERROR.MIN_CHARACTERS(1) })
                .max(100, { message: MESSAGE.ERROR.MAX_CHARACTERS(100) })
                .regex(/^[a-zA-ZäöüÄÖÜß.\-\s]+$/, { message: MESSAGE.ERROR.REGEX() })
                .regex(/^(?!\s*$).+$/, { message: MESSAGE.ERROR.EMPTY })
                .optional(),
            program: z.string({ message: MESSAGE.ERROR.STRING() })
                .min(1, { message: MESSAGE.ERROR.MIN_CHARACTERS(1) })
                .max(100, { message: MESSAGE.ERROR.MAX_CHARACTERS(100) })
                .regex(/^[a-zA-ZäöüÄÖÜß.\-\s]+$/, { message: MESSAGE.ERROR.REGEX() })
                .regex(/^(?!\s*$).+$/, { message: MESSAGE.ERROR.EMPTY })
                .optional(),
            tags: this.tags
                .optional(),
            jobPreferences: this.tags
                .optional(),
            languages: this.tags
                .optional(),
    });

    static readonly userCompany =
        z.object({
            email: this.email,
            phone: this.phone
                .optional(),
            company: z.string({ message: MESSAGE.ERROR.STRING() })
                .min(1, { message: MESSAGE.ERROR.MIN_CHARACTERS(1) })
                .max(50, { message: MESSAGE.ERROR.MAX_CHARACTERS(50) })
                .regex(/^[a-zA-ZäöüÄÖÜß0-9.,'&\-\/\s]+$/, { message: MESSAGE.ERROR.REGEX() })
                .regex(/^(?!\s*$).+$/, { message: MESSAGE.ERROR.EMPTY }),
            description: z.string({ message: MESSAGE.ERROR.STRING() })
                .min(15, { message: MESSAGE.ERROR.MIN_CHARACTERS(15) })
                .max(500, { message: MESSAGE.ERROR.MAX_CHARACTERS(500) })
                //.regex(/^[a-zA-ZäöüÄÖÜß0-9.,'&\-\/\s]+$/, { message: MESSAGE.ERROR.REGEX() }) -- fix later
                .regex(/^(?!\s*$).+$/, { message: MESSAGE.ERROR.EMPTY })
                .optional(),
            givenName: z.string({ message: MESSAGE.ERROR.STRING() })
                .min(1, { message: MESSAGE.ERROR.MIN_CHARACTERS(1) })
                .max(60, { message: MESSAGE.ERROR.MAX_CHARACTERS(60) })
                .regex(/^[a-zA-ZäöüÄÖÜß.\-\s]+$/, { message: MESSAGE.ERROR.REGEX() })
                .regex(/^(?!\s*$).+$/, { message: MESSAGE.ERROR.EMPTY }),
            surname: z.string({ message: MESSAGE.ERROR.STRING() })
                .min(1, { message: MESSAGE.ERROR.MIN_CHARACTERS(1) })
                .max(60, { message: MESSAGE.ERROR.MAX_CHARACTERS(60) })
                .regex(/^[a-zA-ZäöüÄÖÜß.\-\s]+$/, { message: MESSAGE.ERROR.REGEX() })
                .regex(/^(?!\s*$).+$/, { message: MESSAGE.ERROR.EMPTY }),
            street: z.string({ message: MESSAGE.ERROR.STRING() })
                .min(1, { message: MESSAGE.ERROR.MIN_CHARACTERS(1) })
                .max(50, { message: MESSAGE.ERROR.MAX_CHARACTERS(50) })
                .regex(/^[a-zA-ZäöüÄÖÜß.,'&\-\/\s]+$/, { message: MESSAGE.ERROR.REGEX() })
                .regex(/^(?!\s*$).+$/, { message: MESSAGE.ERROR.EMPTY }),
            streetNumber: z.string({ message: MESSAGE.ERROR.STRING() })
                .min(1, { message: MESSAGE.ERROR.MIN_CHARACTERS(1) })
                .max(5, { message: MESSAGE.ERROR.MAX_CHARACTERS(5) })
                .regex(/^[a-zA-Z0-9\-\/\s]+$/, { message: MESSAGE.ERROR.REGEX() })
                .regex(/^(?!\s*$).+$/, { message: MESSAGE.ERROR.EMPTY }),
            ZIPCode: z.number({ message: MESSAGE.ERROR.SPECIFIC_INT_LENGTH(5) })
                .min(10000, { message: MESSAGE.ERROR.MIN_INT(10000) })
                .max(99999, { message: MESSAGE.ERROR.MAX_INT(99999) }),
            city: z.string({ message: MESSAGE.ERROR.STRING() })
                .min(1, { message: MESSAGE.ERROR.MIN_CHARACTERS(1) })
                .max(30, { message: MESSAGE.ERROR.MAX_CHARACTERS(30) })
                .regex(/^[a-zA-ZäöüÄÖÜß\s]+$/, { message: MESSAGE.ERROR.REGEX() })
                .regex(/^(?!\s*$).+$/, { message: MESSAGE.ERROR.EMPTY }),
            country: z.string({ message: MESSAGE.ERROR.STRING() })
                .min(3, { message: MESSAGE.ERROR.MIN_CHARACTERS(3) })
                .max(30, { message: MESSAGE.ERROR.MAX_CHARACTERS(30) })
                .regex(/^[a-zA-ZäöüÄÖÜß\s]+$/, { message: MESSAGE.ERROR.REGEX() })
                .regex(/^(?!\s*$).+$/, { message: MESSAGE.ERROR.EMPTY }),
            size: z.string({ message: MESSAGE.ERROR.STRING() })
                .min(1, { message: MESSAGE.ERROR.MIN_CHARACTERS(1) })
                .max(50, { message: MESSAGE.ERROR.MAX_CHARACTERS(50) })
                .regex(/^(?:\d+(?:[.,]\d+)?)(?:\s*-\s*(?:\d+(?:[.,]\d+)?))?$/, { message: MESSAGE.ERROR.REGEX() })
                .regex(/^(?!\s*$).+$/, { message: MESSAGE.ERROR.EMPTY }),
            industry: z.string({ message: MESSAGE.ERROR.STRING() })
                .min(1, { message: MESSAGE.ERROR.MIN_CHARACTERS(1) })
                .max(100, { message: MESSAGE.ERROR.MAX_CHARACTERS(100) })
                .regex(/^[a-zA-ZäöüÄÖÜß.,'&\-\/\s]+$/, { message: MESSAGE.ERROR.REGEX() })
                .regex(/^(?!\s*$).+$/, { message: MESSAGE.ERROR.EMPTY }),
        });

    static readonly support =
        z.object({
            email: this.email,
            phone: this.phone
                .optional(),
            type: z.string({ message: MESSAGE.ERROR.STRING() })
                .refine((value: string) => {
                    return supportTypes.includes(value as SupportType);
                }, { message: MESSAGE.ERROR.AVAILABLE() }),
            message: z.string({ message: MESSAGE.ERROR.STRING() })
                .min(15, { message: MESSAGE.ERROR.MIN_CHARACTERS(15) })
                .max(1000, { message: MESSAGE.ERROR.MAX_CHARACTERS(1000) })
                .regex(/^[a-zA-ZäöüÄÖÜß0-9.,'"&!?%+*\-\/\s]+$/, { message: MESSAGE.ERROR.REGEX() })
                .regex(/^(?!\s*$).+$/, { message: MESSAGE.ERROR.EMPTY })
        });

    static readonly frontendError =
        z.string({ message: MESSAGE.ERROR.STRING("errorMessage") })
            .min(15, { message: MESSAGE.ERROR.MIN_CHARACTERS(15) })
            .max(10000, { message: MESSAGE.ERROR.MAX_CHARACTERS(10000) })
            .regex(/^[a-zA-Z0-9_\s.,;:!?(){}\[\]<>'"`~\-=+|\\/@&%*$^#]+$/, { message: MESSAGE.ERROR.REGEX() });


    static readonly fileType =
        z.string({ message: MESSAGE.ERROR.STRING("fileType") })
            .refine((value: string) => {
                return fileTypes.includes(value as FileType);
            }, { message: MESSAGE.ERROR.AVAILABLE("fileType") });

}