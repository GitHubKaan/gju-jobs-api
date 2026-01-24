import { Request, Response } from "express";
import { ParsedQs } from "qs";
import { checkFormat } from "../utils/format.util";
import { Schemas } from "../utils/zod.util";
import { StatusCodes } from "http-status-codes";
import { MESSAGE, TITLE } from "../../responseMessage";
import { Applicants, Apply } from "../types/application.type";
import { FileService } from "../services/file.service";
import { FileType } from "../enums";
import { getFileURL } from "../utils/envReader.util";
import { JobsService } from "../services/jobs.service";
import { UserService } from "../services/user.service";
import { sendApplicationToCompany } from "../mail/templates/companyApplication.mail";
import { ApplicationService } from "../services/applications.service";

export class ApplicationRoute {
    /**
     * Apply for job (as a student)
     */
    static async handleApply(
        req: Request<any, any, Apply, ParsedQs, Record<string, any>>,
        res: Response
    ) {
        const payload: Apply = req.body;
        checkFormat(payload, Schemas.apply);

        // Add application to db and check if student already applied for this job
        await ApplicationService.add(payload.jobUUID, req.userUUID);

        // Get student Data
        const studentData = await UserService.getUser(req.userUUID, true);
        const studentEmail = studentData?.email;
        const studentPhone = studentData?.phone;
        const studentGivenName = studentData?.givenName;
        const studentSurname = studentData?.surname;
        const studentDegree = studentData?.degree;
        const studentProgram = studentData?.program;

        // Get student CV
        const cvFile = await FileService.getSpecificFile(req.userUUID, FileType.CV);
        const cvUrl = getFileURL(req.userUUID, (cvFile?.name ?? ""));

        // Get Company email
        const companyUUID = await JobsService.getUserUUID(payload.jobUUID); // userUUID from company
        const companyData = await UserService.getUser(companyUUID, false);
        const companyEmail = companyData?.email;
        
        // Send application to company
        sendApplicationToCompany(companyEmail, studentEmail, studentGivenName, studentSurname, studentPhone, payload.message, studentDegree, studentProgram, (cvFile ? cvUrl : undefined));

        return res
            .status(StatusCodes.OK)
            .json({
                description: MESSAGE.SUCCESS(TITLE.APPLICATION),
            });
    }

    /**
     * Retrieve all Applicants of a Job
     */
    static async handleRetrieveApplicants(
        req: Request<any, any, Applicants, ParsedQs, Record<string, any>>,
        res: Response
    ) {
        const payload: Applicants = req.body;
        checkFormat(payload, Schemas.applicants);

        const applicants = await ApplicationService.getApplicantsByJob(payload.jobUUID);

        return res
            .status(StatusCodes.OK)
            .json({
                description: MESSAGE.RETRIEVED(TITLE.USER),
                applicants
            })
    }

    /**
     * Retrieve all Applications of a Student
     */
    static async handleRetrieveApplications(
        req: Request<any, any, any, ParsedQs, Record<string, any>>,
        res: Response
    ) {
        const jobs = await ApplicationService.getApplicationsByStudent(req.userUUID);

        return res
            .status(StatusCodes.OK)
            .json({
                description: MESSAGE.RETRIEVED(TITLE.APPLICATION),
                jobs
            })
    }
}