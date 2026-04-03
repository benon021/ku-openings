import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        # Open local
        await page.goto("http://localhost:8888/")
        await page.wait_for_timeout(2000)
        
        await page.screenshot(path="local_screenshot.png", full_page=True)
        
        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
