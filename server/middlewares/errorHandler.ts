import type { NextFunction, Request, Response } from "express"
import { ApiError } from "../helpers/apiError"

export const errorHandler = async (
    err: Error | ApiError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if ("statusCode" in err) {
        return res.status(err.statusCode).json({ message: err.message })
    }

    return res.status(500).json({ message: "internal server error." })
}