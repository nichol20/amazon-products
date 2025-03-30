import puppeteer from "puppeteer";

const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
];

// Rotate User-Agents as Amazon may be blocking requests based on them.
const randomUserAgent = (): string => userAgents[Math.floor(Math.random() * userAgents.length)]!;

// use puppeteer to mimic browser behavior
export const fetchPage = async (url: string) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setUserAgent(randomUserAgent());
    const response = await page.goto(url, { waitUntil: "domcontentloaded" });

    if(response?.status() === 503) {
        throw new Error("Amazon blocked the request!")
    }
    
    const html = await page.content();
    await browser.close();

    return html
}