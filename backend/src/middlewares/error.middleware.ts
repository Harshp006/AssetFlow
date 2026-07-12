import { Request, Response, NextFunction } from "express";

const errorMiddleware = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";
    const errors: any[] = [];

    // Handle Prisma errors
    if (err.code) {
        switch (err.code) {
            case "P2002":
                statusCode = 400;
                const target = err.meta?.target ? ` (${err.meta.target.join(", ")})` : "";
                message = `Unique constraint failed${target}. A record with this value already exists.`;
                break;
            case "P2025":
                statusCode = 404;
                message = "Record not found.";
                break;
            case "P2003":
                statusCode = 400;
                message = "Foreign key constraint failed. Invalid reference key.";
                break;
            default:
                statusCode = 500;
                message = `Database error: ${err.message}`;
        }
    }

    // Handle JWT validation errors
    if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid JSON Web Token.";
    } else if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "JSON Web Token has expired.";
    }

    res.status(statusCode).json({
        success: false,
        message,
        errors
    });
};

export default errorMiddleware;