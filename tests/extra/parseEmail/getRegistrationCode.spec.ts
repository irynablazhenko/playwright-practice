import { expect, test } from '@playwright/test';
import { getMailWithSubjectAndRecipient } from '../../../utils/gmail';

test('Parse code from email', async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc/#/');

    const html = `<!DOCTYPE html>
    <!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Реєстраційний код</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f7f7f7;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding: 10px 0;
        }
        .header h1 {
            margin: 0;
            color: #4CAF50;
        }
        .content {
            padding: 20px 0;
        }
        .code {
            font-size: 1.5em;
            color: #4CAF50;
            text-align: center;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            font-size: 0.9em;
            color: #777777;
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px solid #dddddd;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Вітаємо в нашому сервісі!</h1>
        </div>
        <div class="content">
            <p>Доброго дня,</p>
            <p>Дякуємо за реєстрацію. Ваш реєстраційний код:</p>
            <div class="code">ABC123</div>
            <p>Будь ласка, використовуйте цей код для завершення процесу реєстрації на нашому сайті.</p>
            <p>Якщо у вас виникли будь-які питання, не соромтеся звертатися до нашої служби підтримки.</p>
        </div>
        <div class="footer">
            <p>З найкращими побажаннями,<br>Команда нашого сервісу</p>
            <p><a href="https://www.example.com" target="_blank">www.example.com</a></p>
        </div>
    </div>
</body>
</html>

    `
    await page.setContent(html);

    const text = await page.locator('.code').textContent() ?? 'DEFAULT';
    await page.goto('https://demo.playwright.dev/todomvc/#/');

    await page.waitForTimeout(10000);
    await page.locator('input.new-todo').fill(text);
    await page.pause()
    // await page.
});




