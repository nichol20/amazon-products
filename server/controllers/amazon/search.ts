import axios from "axios";
import type { NextFunction, Request, Response } from "express";
import { AMAZON_URL, scrapeSearchResultsPage } from "../../utils/amazon";
import { BadRequestError, InternalServerError } from "../../helpers/apiError";

export default async function search(req: Request, res: Response, next: NextFunction) {
    const keyword = req.query.keyword;

    if(!keyword) {
        return next(new BadRequestError("Try to use the \"keyword\" query!"))
    }

    try {
        const { data } = await axios.get(`${AMAZON_URL}/s?k=${keyword}`, {
            headers: {
                'User-Agent': req.headers["user-agent"],
                'Accept-Language': 'en-US,en;q=0.9',
            }   
        });
        const products = scrapeSearchResultsPage(data);

        res.status(200).json(products);
        return
    } catch (error: any) {
        console.error("Error fetching Amazon page: ", error.message);
        return next(new InternalServerError());
    }
}