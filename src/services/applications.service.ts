import { v4 as uuidv4 } from "uuid";
import { DBPool } from "../configs/postgreSQL.config";
import { UUID } from "node:crypto";
import { ApplicationQueries } from "../queries/application.queries";
import { DefaultError } from "../utils/error.util";
import { StatusCodes } from "http-status-codes";
import { MESSAGE } from "../../responseMessage";
import { formatDBTimestamp } from "../utils/time.util";
import { decrypt } from "../utils/encryption.util";
import { getFileURL } from "../utils/envReader.util";

export class ApplicationService {
    /**
     * Add application
     * @param jobUUID
     * @param studentUUID
     * @param message
     * @throws {DefaultError} Already applied for that job
    */
    static async add(
        jobUUID: UUID,
        studentUUID: UUID,
        message: String | undefined
    ): Promise<
        void
    > {
        const existsResult = await DBPool.query(
            ApplicationQueries.exists,
            [
                jobUUID,
                studentUUID
            ]
        );

        if (existsResult.rowCount && existsResult.rowCount >= 1) throw new DefaultError(StatusCodes.CONFLICT, MESSAGE.ERROR.ALREADY_APPLIED);

        await DBPool.query(
            ApplicationQueries.add,
            [
                uuidv4(),
                jobUUID,
                studentUUID,
                message ?? null
            ]
        );
    };

    /**
     * Retrieve all Applicants of a Job offer
     * @param jobUUID
     */
    static async getApplicantsByJob(jobUUID: UUID) {
        const result = await DBPool.query(ApplicationQueries.getApplicantsByJob, [jobUUID]);

        if (result.rowCount === 0) {
            return { applicants: [] };
        }

        const applicantsMap = new Map<string, any>();

        for (const row of result.rows) {
            const studentUUID: UUID = row.user_uuid;
            const cvUrl: string = getFileURL(row.user_uuid, (row.cv_name ?? ""));

            if (!applicantsMap.has(studentUUID)) {
                applicantsMap.set(studentUUID, {
                    UUID: row.uuid,
                    email: row.email,
                    phone: row.phone,
                    givenName: row.given_name,
                    surname: row.surname,
                    degree: row.degree,
                    program: row.program,
                    cv: (row.cv_name ? cvUrl : undefined),
                    tags: [] as number[],
                    jobPreferences: [] as string[],
                    languages: [] as string[],
                    message: row.message ?? undefined
                });
            }

            const student = applicantsMap.get(studentUUID);

            // Tags
            if (row.student_tag_id != null && !student.tags.includes(row.student_tag_id)) {
                student.tags.push(row.student_tag_id);
            }

            // Job preferences
            if (row.student_job_preference != null && !student.jobPreferences.includes(row.student_job_preference)) {
                student.jobPreferences.push(row.student_job_preference);
            }

            // Languages
            if (row.student_language != null && !student.languages.includes(row.student_language)) {
                student.languages.push(row.student_language);
            }
        }

        return Array.from(applicantsMap.values());
    }

    /**
     * Retrieve all Applications of a Student
     * @param userUUID
     */
    static async getApplicationsByStudent(userUUID: UUID): Promise<any[]> {
        const result = await DBPool.query(ApplicationQueries.getApplicationsByStudent, [userUUID]);

        // Group jobs by UUID and collect their tags
        const jobsMap = new Map<UUID, any>();

        for (const row of result.rows) {
            const jobUUID = row.uuid as UUID;

            // Build job object with tags and company info
            if (!jobsMap.has(jobUUID)) {
                jobsMap.set(jobUUID, {
                    uuid: jobUUID,
                    title: row.title,
                    description: row.description,
                    location: row.location,
                    position: row.position,
                    exp: row.exp ? formatDBTimestamp(row.exp) : undefined,
                    created: row.created ? formatDBTimestamp(row.created) : undefined,
                    tags: [],
                    companyInfo: {
                        userUUID: row.company_uuid,
                        email: row.email,
                        company: decrypt(row.company),
                        size: decrypt(row.size),
                        industry: decrypt(row.industry),
                        country: decrypt(row.country),
                    },
                    studentInfo: {
                        message: row.message ?? undefined
                    }
                });
            }

            // Add tag if it exists
            if (row.tag_id !== null) {
                jobsMap.get(jobUUID)!.tags.push(row.tag_id);
            }
        }

        return Array.from(jobsMap.values());
    }
}