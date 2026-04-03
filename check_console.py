import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        # Capture console messages
        page.on("console", lambda msg: print(f"Console {msg.type}: {msg.text}"))
        
        await page.goto("http://localhost:8888/")
        await page.wait_for_timeout(2000)
        
        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
