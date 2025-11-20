const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: false }); // Launch browser with GUI
  const context = await browser.newContext();
  const page = await context.newPage();

  // Step 1: Open site
  await page.goto("https://www.saucedemo.com/");
  await page.waitForTimeout(1000);

  // Step 2: Login
  await page.fill("#user-name", "error_user"); // userName
  await page.waitForTimeout(500);
  await page.fill("#password", "secret_sauce"); // password
  await page.waitForTimeout(500);
  await page.click("#login-button"); // login button click
  await page.waitForTimeout(1000);

  // Step 3: Add to cart
  await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
  await page.waitForTimeout(1000);

  // Step 4: Wait for remove button
  await page.waitForSelector('[data-test="remove-sauce-labs-backpack"]', { state: "visible" });
  await page.waitForTimeout(1000);

  // Step 5: Try clicking remove (normal + fallback)
  try {
    await page.click('[data-test="remove-sauce-labs-backpack"]');
    await page.waitForTimeout(1000);
  } catch (err) {
    console.log("Normal click failed, trying force click...");
    await page.click('[data-test="remove-sauce-labs-backpack"]', { force: true });
    await page.click('[data-test="remove-sauce-labs-backpack"]', { force: true });

  }

  // Step 6: Validate result
  const addVisible = await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').isVisible();

  if (addVisible) {
    console.log("✅ Product successfully removed from cart!");
    await page.screenshot({ path: "remove_success.png" }); // If the screenshot is saved successfully
  } else {
    console.log("❌ Remove button click did not work (maybe error_user issue).");
    await page.screenshot({ path: "remove_fail.png" }); // If the screenshot is saved successfully
  }

  await page.waitForTimeout(2000);
  await browser.close();
})();
