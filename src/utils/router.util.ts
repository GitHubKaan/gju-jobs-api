import auth from "../middlewares/auth.middleware";
import { Router } from "express";
import { ENV, getBackendPath } from "./envReader.util";
import { rateLimiter } from "../middlewares/rateLimiter.middleware";
import { TokenType, UserType } from "../enums";
import { uploadedFileHandler } from "./images.util";
import { app } from "../../Main";
import { routeWrapper } from "../middlewares/wrapper.middleware";
import { UserStudent } from "../routes/userStudent.routes";
import { UserCompany } from "../routes/userCompany.routes";
import { GeneralRoute } from "../routes/general.route";
import { UserRoute } from "../routes/user.route";
import { FileRoute } from "../routes/file.route";
import { JobsRoute } from "../routes/jobs.route";
import { ApplicationRoute } from "../routes/application.route";

/**
 * Endpoint routes
 */
export function routerHandler() {
    app.use(rateLimiter(ENV.HTTP_GLOBAL_WINDOW_MS, ENV.HTTP_GLOBAL_LIMIT)); // Global rate limit

    // API Path
    const router = Router();
    app.use(getBackendPath(), router);
    
    // General
    router.post(
        "/support",
        rateLimiter(ENV.SUPPORT_WINDOW_MS, ENV.SUPPORT_LIMIT),
        routeWrapper(GeneralRoute.handleSupport)
    );
    router.post(
        "/send-frontend-error",
        rateLimiter(ENV.SEND_FRONTEND_ERROR_WINDOW_MS, ENV.SEND_FRONTEND_ERROR_LIMIT),
        routeWrapper(GeneralRoute.handleSendFrontendError)
    );
    
    // User Student
    router.post(
        "/user/signup/student",
        rateLimiter(ENV.SIGNUP_WINDOW_MS, ENV.SIGNUP_LIMIT),
        routeWrapper(UserStudent.handleSignup)
    );

    // User Company
    router.post(
        "/user/signup/company",
        rateLimiter(ENV.SIGNUP_WINDOW_MS, ENV.SIGNUP_LIMIT),
        routeWrapper(UserCompany.handleSignup)
    );
   
    // User
    router.post(
        "/user/login",
        rateLimiter(ENV.LOGIN_WINDOW_MS, ENV.LOGIN_LIMIT),
        routeWrapper(UserRoute.handleLogin)
    );

    router.get(
        "/user",
        auth(TokenType.Access),
        routeWrapper(UserRoute.handleRetrieveUser)
    );

    router.post(
        "/user/auth",
        auth(TokenType.Auth),
        routeWrapper(UserRoute.handleAuth)
    );
    
    router.patch(
        "/user/update",
        auth(TokenType.Access),
        routeWrapper(UserRoute.handleUpdateUser)
    );
    
    router.get(
        "/user/recovery",
        rateLimiter(ENV.GET_RECOVERY_WINDOW_MS, ENV.GET_RECOVERY_LIMIT),
        routeWrapper(UserRoute.handleGetRecovery)
    );
    router.post(
        "/user/recovery",
        auth(TokenType.Recovery),
        routeWrapper(UserRoute.handleRecovery)
    );
    
    router.get(
        "/user/deletion",
        rateLimiter(ENV.GET_DELETE_WINDOW_MS, ENV.GET_DELETE_LIMIT),
        auth(TokenType.Access),
        routeWrapper(UserRoute.handleGetDeleteUser)
    );
    router.delete(
        "/user/deletion",
        auth(TokenType.Deletion),
        routeWrapper(UserRoute.handleDeleteUser)
    );

    // File
    router.get(
        "/files",
        auth(TokenType.Access, UserType.Student),
        routeWrapper(FileRoute.handleRetrieveFiles)
    );
    router.get(
        "/file",
        auth(TokenType.Access, UserType.Student),
        routeWrapper(FileRoute.handleRetrieveFile)
    );
    router.post(
        "/file",
        auth(TokenType.Access, UserType.Student),
        routeWrapper(FileRoute.handleUploadFile)
    );
    router.delete(
        "/file",
        auth(TokenType.Access, UserType.Student),
        routeWrapper(FileRoute.handleDeleteFile)
    );
    
    // Jobs
    router.post(
        "/jobs/create",
        rateLimiter(ENV.CREATE_JOB_WINDOW_MS, ENV.CREATE_JOB_LIMIT),
        auth(TokenType.Access, UserType.Company),
        routeWrapper(JobsRoute.handleCreate)
    );
    router.patch(
        "/jobs/update",
        auth(TokenType.Access, UserType.Company),
        routeWrapper(JobsRoute.handleUpdate)
    );
    router.delete(
        "/jobs/delete",
        auth(TokenType.Access, UserType.Company),
        routeWrapper(JobsRoute.handleDelete)
    );
    router.get(
        "/jobs",
        auth(TokenType.Access),
        routeWrapper(JobsRoute.handleRetrieve)
    );
    router.get(
        "/jobs/own",
        auth(TokenType.Access, UserType.Company),
        routeWrapper(JobsRoute.handleRetrieveOwn)
    );

    // Application
    router.post(
        "/application/apply",
        rateLimiter(ENV.APPLY_WINDOW_MS, ENV.APPLY_LIMIT),
        auth(TokenType.Access, UserType.Student),
        routeWrapper(ApplicationRoute.handleApply)
    );

    // Uploads
    app.use(
        `${getBackendPath()}/${ENV.FILE_UPLOAD_PATH}`, // If changed, do not forget to edit timeout.middleware.ts also
        routeWrapper(uploadedFileHandler)
    );
};