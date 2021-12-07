const puppeteer = require("puppeteer");
(async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // fix the size of window
    await page._client.send("Emulation.clearDeviceMetricsOverride");
    await page.goto("https://collegedunia.com/btech/pune-colleges");
    await page.waitForSelector(".lead-close-icon.pointer");
    // const [closeBtn] = await page.$x(".lead-close-icon.pointer");
    // await closeBtn.click();
    await page.waitForSelector(
      "a.college_name.text-white.font-weight-bold.text-md"
    );

    const halfLink = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll(
          "a.college_name.text-white.font-weight-bold.text-md"
        ),
        (a) => a.getAttribute("href")
      )
    );
    const link2College = halfLink.map(
      (link) => `https://collegedunia.com${link}`
    );
    link2College.forEach(async (singlelink) => {
      try {
        singlelink =
          "https://collegedunia.com/college/28215-college-of-engineering-coep-pune";
        await page.goto(singlelink);
        await page.waitForXPath(
          `//*[@id="__next"]/div[3]/section/div/div[1]/div/div[3]/div[2]/div/div[1]/p[3]/text()`
        );
        const [summaryP] = await page.$x(
          `//*[@id="__next"]/div[3]/section/div/div[1]/div/div[3]/div[2]/div/div[1]/p[3]/text()`
        );

        let summaryText = await page.evaluate((el) => el.textContent, summaryP);
        let collegeNametext = await page.evaluate(
          () => document.querySelector("#collegePageTitle.text-white").innerText
        );
        //   console.log(collegeNametext);

        await page.waitForSelector(
          `#__next > div.jsx-1150928046.jsx-4018657965.page-min-height > section > div > div.jsx-29629026.col-9.college-content.col_8.mb-5 > div > section > div > table > tbody > tr > td:nth-child(1) > a`
        );

        const courses = await page.evaluate(() =>
          Array.from(
            document.querySelectorAll(
              "#__next > div.jsx-1150928046.jsx-4018657965.page-min-height > section > div > div.jsx-29629026.col-9.college-content.col_8.mb-5 > div > section > div > table > tbody > tr > td:nth-child(1) > a"
            ),
            (a) => a.innerText
          )
        );
        const fees = await page.evaluate(() =>
          Array.from(
            document.querySelectorAll(
              "#__next > div.jsx-1150928046.jsx-4018657965.page-min-height > section > div > div.jsx-29629026.col-9.college-content.col_8.mb-5 > div > section > div > table > tbody > tr > td:nth-child(2)"
            ),
            (a) => a.innerText
          )
        );
        const eligibility = await page.evaluate(() =>
          Array.from(
            document.querySelectorAll(
              "#__next > div.jsx-1150928046.jsx-4018657965.page-min-height > section > div > div.jsx-29629026.col-9.college-content.col_8.mb-5 > div > section > div > table > tbody > tr > td:nth-child(3)"
            ),
            (a) => a.innerText
          )
        );
        const singleCollegeData = [];
        for (let index = 0; index < courses.length; index++) {
          const eachCourse = {
            summary: summaryText,
            course: courses[index],
            fee: fees[index],
            eligibility: eligibility.length
              ? eligibility[index]
              : "no data found at the server",
          };
          singleCollegeData.push(eachCourse);
        }
        console.log(singleCollegeData);
      } catch (error) {
        console.log(error);
      }
    });

    // await browser.close();
  } catch (error) {
    console.log(error);
  }
})();
