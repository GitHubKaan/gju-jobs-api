import { ENV } from "./envReader.util";

export class UserUtil {
    /**
     * Check if email is from student or company
     * @param email 
     * @returns boolean
     */
    public static emailIsStudent(email: string): boolean {
        return email.toLowerCase().endsWith(`@${ENV.ALLOWED_STUDENT_DOMAIN.toLowerCase()}`);
    }
}