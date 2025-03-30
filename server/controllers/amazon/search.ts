import type { NextFunction, Request, Response } from 'express';

import { AMAZON_URL, scrapeSearchResultsPage } from "../../utils/amazon";
import { BadRequestError, InternalServerError } from "../../helpers/apiError";
import { fetchPage } from '../../utils/puppeteer';

export default async function search(req: Request, res: Response, next: NextFunction) {
    const keyword = req.query.keyword;

    if (!keyword) {
        return next(new BadRequestError("Try to use the \"keyword\" query!"));
    }

    try {
        const html = await fetchPage(`${AMAZON_URL}/s?k=${keyword}`)
        const products = scrapeSearchResultsPage(html);
        res.status(200).json(products);
    } catch (error: any) {
        console.error("Error fetching Amazon page: ", error.message);
        return next(new InternalServerError());
    }
}
