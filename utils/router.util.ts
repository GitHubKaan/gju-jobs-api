import auth from "../middlewares/auth.middleware";
import { Router } from "express";
import { ENV, getBackendPath } from "./envReader.util";
import { rateLimiter } from "../middlewares/rateLimiter.middleware";
import { TokenType } from "../enums";
import { uploadedImageHandler } from "./images.util";
import { app } from "../Main";
import { handleDeleteFile, handleRetrieveFile, handleRetrieveFiles, handleUploadFile } from "../routes/file.route";
import { handleRetrieveUser, handleAuth, handleUpdateUser, handleGetRecovery, handleRecovery, handleGetDeleteUser, handleDeleteUser, handleLogin } from "../routes/user.route";
import { handleSendFrontendError, handleSupport } from "../routes/general.route";
import { routeWrapper } from "../middlewares/wrapper.middleware";
import { UserStudent } from "../routes/userStudent.routes";
import { UserCompany } from "../routes/userCompany.routes";

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
        routeWrapper(handleSupport)
    );
    router.post(
        "/send-frontend-error",
        rateLimiter(ENV.SEND_FRONTEND_ERROR_WINDOW_MS, ENV.SEND_FRONTEND_ERROR_LIMIT),
        routeWrapper(handleSendFrontendError)
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
        routeWrapper(handleLogin)
    );

    router.get(
        "/user",
        auth(TokenType.Access),
        routeWrapper(handleRetrieveUser)
    );

    router.post(
        "/user/auth",
        auth(TokenType.Auth),
        routeWrapper(handleAuth)
    );
    
    router.patch(
        "/user/update",
        auth(TokenType.Access),
        routeWrapper(handleUpdateUser)
    );
    
    router.get(
        "/user/recovery",
        rateLimiter(ENV.GET_RECOVERY_WINDOW_MS, ENV.GET_RECOVERY_LIMIT),
        routeWrapper(handleGetRecovery)
    );
    router.post(
        "/user/recovery",
        auth(TokenType.Recovery),
        routeWrapper(handleRecovery)
    );
    
    router.get(
        "/user/deletion",
        rateLimiter(ENV.GET_DELETE_WINDOW_MS, ENV.GET_DELETE_LIMIT),
        auth(TokenType.Access),
        routeWrapper(handleGetDeleteUser)
    );
    router.delete(
        "/user/deletion",
        auth(TokenType.Deletion),
        routeWrapper(handleDeleteUser)
    );

    // File
    router.get(
        "/files",
        auth(TokenType.Access),
        routeWrapper(handleRetrieveFiles)
    );
    router.get(
        "/file",
        auth(TokenType.Access),
        routeWrapper(handleRetrieveFile)
    );
    router.post(
        "/file",
        auth(TokenType.Access),
        routeWrapper(handleUploadFile)
    );
    router.delete(
        "/file",
        auth(TokenType.Access),
        routeWrapper(handleDeleteFile)
    );
    
    // Image
    app.use(
        `${getBackendPath()}/${ENV.IMAGE_UPLOAD_PATH}`, // If changed, do not forget to edit timeout.middleware.ts also
        routeWrapper(uploadedImageHandler)
    );
};