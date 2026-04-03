import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        print("Navigating to simah2026.lovable.app...")
        await page.goto("https://simah2026.lovable.app/")
        await page.wait_for_timeout(2000)
        
        print("Clicking Login button...")
        login_btn = page.locator("button, a").filter(has_text="Login")
        if await login_btn.count() > 0:
            await login_btn.first.click()
            await page.wait_for_timeout(2000)
            
            print("Clicking Team tab...")
            team_tab = page.locator("button").filter(has_text="Team")
            if await team_tab.count() > 0:
                await team_tab.first.click()
                await page.wait_for_timeout(1000)
            
            print("Looking for input fields...")
            text_inputs = page.locator("input[type='text'], input[placeholder*='sername'], input[placeholder*='mail'], input:not([type])")
            password_inputs = page.locator("input[type='password']")
            
            if await text_inputs.count() > 0:
                print("Filling username...")
                await text_inputs.first.fill("greensharks")
            if await password_inputs.count() > 0:
                print("Filling password...")
                await password_inputs.first.fill("team123")
                
            submit_btn = page.locator("button[type='submit']")
            if await submit_btn.count() > 0:
                print("Clicking submit...")
                await submit_btn.first.click()
            else:
                print("Pressing enter...")
                await page.keyboard.press("Enter")
                
            print("Waiting after login...")
            await page.wait_for_timeout(5000)
        else:
            print("Login button not found!")
            
        print("Taking screenshot...")
        await page.screenshot(path="screenshot_dashboard.png", full_page=True)
        print("Done.")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
