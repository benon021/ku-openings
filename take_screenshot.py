import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        print("Navigating to simah2026.lovable.app...")
        await page.goto("https://simah2026.lovable.app/")
        
        # Wait a bit for the page to render
        await page.wait_for_timeout(3000)
        
        # Look for username and password fields (or input type text and password)
        # Check if we are on a login page
        inputs = await page.locator("input").count()
        if inputs >= 2:
            print("Found input fields, attempting to login...")
            # Let's hope the first text input is username and the password input is password
            text_inputs = page.locator("input[type='text'], input:not([type])")
            password_inputs = page.locator("input[type='password']")
            
            if await text_inputs.count() > 0:
                await text_inputs.first.fill("greensharks")
            if await password_inputs.count() > 0:
                await password_inputs.first.fill("team123")
                
            # Press Enter or find a submit button
            submit_btn = page.locator("button[type='submit']")
            if await submit_btn.count() > 0:
                await submit_btn.first.click()
            else:
                await page.keyboard.press("Enter")
                
            print("Waiting after login...")
            await page.wait_for_timeout(5000)
            
        print("Taking screenshot...")
        await page.screenshot(path="screenshot_full.png", full_page=True)
        await page.screenshot(path="screenshot_viewport.png")
        print("Done.")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
