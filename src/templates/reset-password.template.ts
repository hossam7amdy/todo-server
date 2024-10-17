export default (link: string) =>
    `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                padding: 20px 0;
            }
            .header img {
                width: 100px;
            }
            .content {
                text-align: center;
                padding: 20px 0;
            }
            .button {
                display: inline-block;
                padding: 10px 20px;
                margin: 20px 0;
                background-color: #007bff;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
            }
            .footer {
                text-align: center;
                padding: 20px 0;
                font-size: 12px;
                color: #888888;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="logo.png" alt="Todo Logo">
            </div>
            <div class="content">
                <h1>Reset Your Password</h1>
                <p>Please click the button below to reset your password.</p>
                <a target="_blank" href="${link}" class="button">Reset Password</a>
            </div>
            <div class="footer">
                <p>If you did not reset for this account, you can ignore this email.</p>
            </div>
        </div>
    </body>
    </html>
`;
