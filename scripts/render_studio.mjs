import { createRequire } from "node:module";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";
const require = createRequire(import.meta.url);
const { chromium } = require(join(tmpdir(), "alysa-portfolio-qa", "node_modules", "playwright-core"));
const browser = await chromium.launch({ channel: "msedge", headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 480, height: 360 }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(join(process.cwd(), "assets", "studio.svg")).href);
  await page.locator("svg").screenshot({ path: join(process.cwd(), "assets", "studio-base.png") });
} finally {
  await browser.close();
}
