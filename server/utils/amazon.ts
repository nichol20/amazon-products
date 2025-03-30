import { JSDOM } from "jsdom";

export const AMAZON_URL = "https://www.amazon.com"

interface Product {
    title: string
    rating: number
    reviewsNumber: number
    image: string
}

export const scrapeSearchResultsPage = (page: string) => {
    const dom = new JSDOM(page);
    const document = dom.window.document;
    
    // Helper function to extract products from a given selector
    const extractProducts = (selector: string) => 
        Array.from(document.querySelectorAll(selector))
            .map(extractData)
            .filter(Boolean) as Product[]; // Filter out null/undefined values

    return [
        ...extractProducts('div[role="listitem"]'),  // Extract main product listings
        ...extractProducts('li.a-carousel-card')     // Extract suggested products from carousel
    ];
}

const extractData = (item: Element): Product | null => {
    const fullTitle = item.querySelector('h2')?.querySelector('span')?.innerHTML;
    // if the div doesn't have a title it probably won't have any data
    if(!fullTitle) {
        return null
    }

    const image = item.querySelector('img')?.src;
    let rating = 0, reviewsNumber = 0
    
    const anchors = item.querySelectorAll('a[aria-label]')

    Array.from(anchors??[]).forEach(a =>{
        const label = a.getAttribute('aria-label')
        if(label?.endsWith("ratings")) {
            // label example: "421 ratings"
            const value = label.split(" ")[0]
            reviewsNumber = value ? parseInt(value) : 0 
        }

        if(label?.endsWith("rating details")) {
            // label example: "4.4 out of 5 stars, rating details"
            const value = label.split(" ")[0]
            rating = value ? parseFloat(value) : 0
        }
    });

    return {
        image: image ? image : "",
        rating,
        reviewsNumber,
        title: fullTitle
    }
}