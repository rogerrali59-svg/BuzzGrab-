/**
 * @copyright : ToXSL Technologies Pvt. Pvt. Ltd. < www.toxsl.com >
 * @author     : Shiv Charan Panjeta
 *
 * All Rights Reserved.
 * Proprietary and confidential :  All information contained herein is, and remains
 * the property of ToXSL Technologies Pvt. Pvt. Ltd. and its partners.
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 */

let dotenv = require("dotenv");
let year = new Date().getFullYear();
dotenv.config();

module.exports = {
  ACCOUNT_VERIFICATION_TEMPLATE(username, otp) {
    return `<html>

<head>
    <title>Welcome</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700&display=swap');

        body {
            font-family: 'Roboto', sans-serif;
        }
    </style>
</head>

<body
    style="background-color:#f4f8fb;color: #202020;padding: 20px 0;font-size: 15px;line-height: 24px; font-family: 'Roboto', sans-serif;margin: 0;">
    <table style="width: 650px; background: #fff;box-shadow: 2px 2px 20px 4px rgba(0, 0, 0, 0.07);border-collapse: collapse;border-radius: 16px;" align="center">
        <tbody>
                <td>
                    <table
                        style=" width: 100%;border-spacing: 0;  font-family: 'Roboto', sans-serif;border-collapse: collapse;">
                        <tr>

                            <td
                                style="border-top-left-radius: 16px;border-top-right-radius: 16px; background: #005CDC; width: 100%; font-weight: 400;padding: 25px;text-align : center;">
                                <img src=${
                                  process.env.LIVE_IP
                                }/api/public/images/logo.svg width="80px"
                                    style="margin: 0; padding: 8px;" />
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td style="padding: 30px 30px 0 30px;">
                    <table style="width:100%;border-bottom: 1px solid #fff;background: #fff;padding: 0;">
                        <tr>
                            <td style="width: 50%;"><b
                                    style="color: #000; text-decoration: none; font-weight: 800;font-size: 17px;line-height: 27px;">${
                                      process.env.PROJECT_NAME
                                    }
                                </b></td>


                            <td
                                style="color: #4a4a4a; width: 70%; font-weight: 400; text-align: right; font-size: 15px;line-height: 25px;">
                                <p id="date" style="margin: 0;"></p>

                                <script>
                                    // Get the current date
                                    const currentDate = moment();

                                    // Format the date as "July 15th, 2024"
                                    const formattedDate = currentDate.format("MMMM Do, YYYY");

                                    // Display the formatted date in the HTML
                                    document.getElementById("date").innerHTML = formattedDate;
                                </script>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td style="padding: 30px;">
                    <table style="width: 100%;">
                        <tr>
                            <td>
                                <h2 style="margin: 0;font-size: 18px;line-height: 28px;">Hi, ${
                                  username ? username : "User"
                                }
                                </h2>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding-top: 10px;padding-bottom: 10px;">
                                <span style="margin: 0; font-weight: 400; font-size: 17px;line-height: 27px;">
                                    Welcome to <b style="color: #005CDC;">${
                                      process.env.PROJECT_NAME
                                    }</b>
                                </span>

                            </td>
                        </tr>

                        <tr>
                            <td>
                                <p style="margin: 0;line-height: 26px;"> Thanks for
                                    signing up. To continue, please confirm your otp by entering it
                                </p>
                                <h3 style="text-align: center;margin: 0;padding: 25px 0 0 0;">OTP <span
                                        style="font-size:16px; font-weight:400;">is</span> <span
                                        style="font-size:16px; font-weight:400;color: #005CDC;">${otp}</span> </h3>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td style="padding: 0 30px 0 30px;">
                    <table style="background-color:#005CDC40; width: 100%; padding: 15px;border-radius: 10px;">
                        <tr>
                            <td style=" color: #005CDC;padding: 0;" align="center">
                                <span style="margin: 0; font-weight: 500; font-size: 14px;line-height: 21px;">
                                    Thank you for joining the <b>${
                                      process.env.PROJECT_NAME
                                    } </b>
                                </span>

                            </td>
                        </tr>

                    </table>
                </td>
            </tr>
            <!--body end-->
            <tr>
                <td>
                    <table style=" width: 100%; padding-top: 30px;">
                        <tr>
                            <td align="center">
                                <table border="0" cellupacing="0" cellpadding="0" style="width: auto !important">
                                    <tbody>
                                        <tr>
                                            <td align="center">
                                                <a style="margin:0; text-decoration-none !important;"
                                                    href="https://web.facebook.com/profile.php?id=61575017431414"
                                                    target="_blank">

                                                    <img style="width: 32px; height: 32px;"
                                                        src="${
                                                          process.env.LIVE_IP
                                                        }/api/public/images/fackbook.png"
                                                        alt="Facebook">

                                                </a>
                                            </td>
                                            <td align="center" style="padding:0 10px;">
                                                <a style="margin:0; text-decoration-none !important;"
                                                    href="https://www.instagram.com/alcoholdelivery?igsh=MXFvcmRkZG5ucnFy"
                                                    target="_blank">

                                                    <img style="width: 32px; height: 32px;"
                                                        src="${
                                                          process.env.LIVE_IP
                                                        }/api/public/images/instagram.png"
                                                        alt="Instagram">
                                                </a>
                                            </td>
                                            <td align="center" style="padding:0 10px;">
                                                <a style="margin:0; text-decoration-none !important;"
                                                    href=https://play.google.com/store/apps"
                                                    target="_blank">

                                                    <img style="width: 32px; height: 32px;"
                                                        src="${
                                                          process.env.LIVE_IP
                                                        }/api/public/images/playstore.png"
                                                        alt="playStore">
                                                </a>
                                            </td>
                                             
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="padding: 30px;">
                                <hr style="border: none; margin: 0; height: 1px; background-color: #ddd;">
                                <p style="margin: 0;font-size: 15px;padding-top: 20px;color:#000;">
                                    Copyright ${year} <strong
                                        style="color: #005CDC;text-transform: capitalize;">${
                                          process.env.PROJECT_NAME
                                        }</strong>
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
    </table>
    <br>
</body>

</html>`;
  },

  WELCOME_EMAIL_TEMPLATE(name, email, countryCode, mobile) {
    return `<html>

<head>
    <title>Welcome</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"></script>

    <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700&display=swap');

        body {
            font-family: 'Roboto', sans-serif;
        }
    </style>
</head>

<body
    style="background-color:#f4f8fb;color: #202020;padding: 20px 0;font-size: 15px;line-height: 24px; font-family: 'Roboto', sans-serif;margin: 0;">
    <table style="width: 650px; background: #fff;box-shadow: 2px 2px 20px 4px rgba(0, 0, 0, 0.07);border-collapse: collapse;border-top-left-radius: 16px;
border-top-right-radius: 16px;border-bottom-left-radius: 16px;border-bottom-right-radius: 16px;" align="center">
        <tbody>
            <tr>
                <td>
                    <table
                        style=" width: 100%;border-spacing: 0;  font-family: 'Roboto', sans-serif;border-collapse: collapse;">
                        <tr>

                            <td
                                style="border-top-left-radius: 16px;border-top-right-radius: 16px; background: #005CDC; width: 100%; font-weight: 400;padding: 25px;text-align : center;">
                                <img src=${
                                  process.env.LIVE_IP
                                }/api/public/images/logo.svg width="80px"
                                    style="margin: 0; padding: 8px;" />
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td style="padding: 30px; ">
                    <table style="width: 100%;">
                        <tr>
                            <td>
                                <h2 style="margin: 0;font-size: 18px;line-height: 28px;">Hi, ${
                                  name ? name : "User"
                                }
                                </h2>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding-top: 10px;padding-bottom: 10px;">
                                <span style="margin: 0; font-weight: 400; font-size: 17px;line-height: 27px;">
                                    Welcome to <b style="color: #005CDC;">${
                                      process.env.PROJECT_NAME
                                    }</b>
                                </span>

                            </td>
                        </tr>
                        <tr>
                            <td style="padding:0;">
                                <span style="margin: 0; font-weight: 400; font-size: 17px;line-height: 27px;">
                                    Email : <b style="color: #005CDC;">${email}</b>
                                </span>


                            </td>
                        </tr>
                        <tr>
                            <td style="padding-top: 10px; ">
                                <span style="margin: 0; font-weight: 400; font-size: 17px;line-height: 27px;">
                                    Phone Number : <b style="color: #005CDC;">${
                                      countryCode + " " + mobile
                                    }</b>
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding-top: 0; color: #3c3c3c;">
                                <span style="margin: 0; font-weight: 400; font-size: 16px;">
                                </span>

                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td style="padding: 0 30px 0 30px;">
                    <table style="background-color: #005CDC40; width: 100%; padding: 15px;border-radius: 10px;">
                        <tr>
                            <td style=" color: #005CDC;padding: 0;" align="center">
                                <span style="margin: 0; font-weight: 500; font-size: 14px;line-height: 21px;">
                                    Thank you for joining the <b>${
                                      process.env.PROJECT_NAME
                                    } </b>
                                </span>

                            </td>
                        </tr>

                    </table>
                </td>
            </tr>
            <!--body end-->

            <tr>
                <td style="border-bottom-left-radius: 16px;border-bottom-right-radius: 16px;">
                    <table style=" width: 100%; padding-top: 30px;">

                        <tr>
                            <td align="center" style="padding-top: 0px">
                                <table border="0" cellspacing="0" cellpadding="0" style="width: auto !important">
                                    <tbody>
                                        <tr>
                                            <td align="center">
                                                <a style="margin:0; text-decoration-none !important;"
                                                    href="https://web.facebook.com/profile.php?id=61575017431414"
                                                    target="_blank">
                                                    <img style="width: 32px; height: 32px;"
                                                        src="${
                                                          process.env.LIVE_IP
                                                        }/api/public/images/fackbook.png"
                                                        alt="Facebook">

                                                </a>
                                            </td>
                                            <td align="center" style="padding:0 10px;">
                                                <a style="margin:0; text-decoration-none !important;"
                                                    href="https://www.instagram.com/alcoholdelivery?igsh=MXFvcmRkZG5ucnFy"
                                                    target="_blank">
                                                    <img style="width: 32px; height: 32px;"
                                                        src="${
                                                          process.env.LIVE_IP
                                                        }/api/public/images/instagram.png"
                                                        alt="Instagram">
                                                </a>
                                            </td>
                                              <td align="center" style="padding:0 10px;">
                                                <a style="margin:0; text-decoration-none !important;"
                                                    href=https://play.google.com/store/apps"
                                                    target="_blank">

                                                    <img style="width: 32px; height: 32px;"
                                                        src="${
                                                          process.env.LIVE_IP
                                                        }/api/public/images/playstore.png"
                                                        alt="playStore">
                                                </a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="padding: 30px;">
                                <hr style="border: none; margin: 0; height: 1px; background-color: #ddd;">
                                <p style="margin: 0;font-size: 15px;padding-top: 20px;color:#000;">
                                    Copyright ${year} <strong
                                        style="color: #005CDC;text-transform: capitalize;">${
                                          process.env.PROJECT_NAME
                                        }</strong>
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
    </table>
    </td>
    </tr>
    </tbody>
    </table>
    <br>
</body>

</html>`;
  },

  ACCOUNT_VERIFY_TEMPLATE(name, email, countryCode, mobile) {
    return `<html>

<head>
    <title>Welcome</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"></script>

    <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700&display=swap');

        body {
            font-family: 'Roboto', sans-serif;
        }
    </style>
</head>

<body
    style="background-color:#f4f8fb;color: #202020;padding: 20px 0;font-size: 15px;line-height: 24px; font-family: 'Roboto', sans-serif;margin: 0;">
    <table style="width: 650px; background: #fff;box-shadow: 2px 2px 20px 4px rgba(0, 0, 0, 0.07);border-collapse: collapse;border-top-left-radius: 16px;
        border-top-right-radius: 16px;border-bottom-left-radius: 16px;border-bottom-right-radius: 16px;"
        align="center">
        <tbody>
            <tr>
                <td>
                    <table
                        style=" width: 100%;border-spacing: 0;  font-family: 'Roboto', sans-serif;border-collapse: collapse;">
                        <tr>

                            <td
                                style="border-top-left-radius: 16px;border-top-right-radius: 16px; background: #005CDC; width: 100%; font-weight: 400;padding: 25px;text-align : center;">
                                <img src=${
                                  process.env.LIVE_IP
                                }/api/public/images/logo.svg width="80px"
                                    style="margin: 0; padding: 8px;" />
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <!--- body start-->

            <tr>
                <td style="padding: 30px; ">
                    <table style="width: 100%;">
                        <tr>
                            <td>
                                <h2 style="margin: 0;font-size: 18px;line-height: 28px;">Hi, ${
                                  name ? name : "User"
                                }
                                </h2>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 5px 0;">
                                <span style="margin: 0; font-weight: 400; font-size: 17px;line-height: 27px;">
                                    Your account is now verified. Log in and enjoy the benefits.
                                </span>

                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 0;">
                                <span style="margin: 0; font-weight: 400; font-size: 17px;line-height: 27px;">
                                    Email : <b style="color: #005CDC;">${email}</b>
                                </span>


                            </td>
                        </tr>
                        <tr>
                            <td style="padding-top: 5px;">
                                <span style="margin: 0; font-weight: 400; font-size: 17px;line-height: 27px;">
                                    Phone Number : <b style="color: #005CDC;">${
                                      countryCode + " " + mobile
                                    }</b>
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding-top: 0; color: #3c3c3c;">
                                <span style="margin: 0; font-weight: 400; font-size: 16px;">
                                </span>

                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td style="padding: 0 30px 0 30px;">
                    <table style="background-color: #005CDC40; width: 100%; padding: 15px;border-radius: 10px;">
                        <tr>
                            <td style=" color: #005CDC;padding: 0;" align="center">
                                <span style="margin: 0; font-weight: 500; font-size: 14px;line-height: 21px;">
                                    Thank you for joining the <b>${
                                      process.env.PROJECT_NAME
                                    } </b>
                                </span>

                            </td>
                        </tr>

                    </table>
                </td>
            </tr>
            <!--body end-->

            <tr>
                <td style="border-bottom-left-radius: 16px;border-bottom-right-radius: 16px;">
                    <table style=" width: 100%; padding-top: 30px;">

                        <tr>
                            <td align="center" style="padding-top: 0px">
                                <table border="0" cellspacing="0" cellpadding="0" style="width: auto !important">
                                    <tbody>
                                        <tr>
                                            <td align="center">
                                                <a style="margin:0; text-decoration-none !important;"
                                                    href="https://web.facebook.com/profile.php?id=61575017431414"
                                                    target="_blank">
                                                    <img style="width: 32px; height: 32px;"
                                                        src="${
                                                          process.env.LIVE_IP
                                                        }/api/public/images/fackbook.png"
                                                        alt="Facebook">

                                                </a>
                                            </td>
                                            <td align="center" style="padding:0 10px;">
                                                <a style="margin:0; text-decoration-none !important;"
                                                    href="https://www.instagram.com/alcoholdelivery?igsh=MXFvcmRkZG5ucnFy"
                                                    target="_blank">
                                                    <img style="width: 32px; height: 32px;"
                                                        src="${
                                                          process.env.LIVE_IP
                                                        }/api/public/images/instagram.png"
                                                        alt="Instagram">
                                                </a>
                                            </td>
                                               <td align="center" style="padding:0 10px;">
                                                <a style="margin:0; text-decoration-none !important;"
                                                    href=https://play.google.com/store/apps"
                                                    target="_blank">

                                                    <img style="width: 32px; height: 32px;"
                                                        src="${
                                                          process.env.LIVE_IP
                                                        }/api/public/images/playstore.png"
                                                        alt="playStore">
                                                </a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="padding: 30px;">
                                <hr style="border: none; margin: 0; height: 1px; background-color: #ddd;">
                                <p style="margin: 0;font-size: 15px;padding-top: 20px;color:#000;">
                                    Copyright ${year} <strong
                                        style="color: #005CDC;text-transform: capitalize;">${
                                          process.env.PROJECT_NAME
                                        }</strong>
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

    </table>
    </td>
    </tr>
    </tbody>
    </table>
    <br>
</body>

</html>`;
  },

  FORGOT_PASSWORD_OTP(username, otp) {
    return ` <html>

<head>
    <title>Welcome</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"></script>

    <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700&display=swap');

        body {
            font-family: 'Roboto', sans-serif;
        }
    </style>
</head>

<body
    style="background-color:#f4f8fb;color: #202020;padding: 20px 0;font-size: 15px;line-height: 24px; font-family: 'Roboto', sans-serif;margin: 0;">
    <table style="width: 650px; background: #fff;box-shadow: 2px 2px 20px 4px rgba(0, 0, 0, 0.07);border-collapse: collapse;border-top-left-radius: 16px;
       border-top-right-radius: 16px;border-bottom-left-radius: 16px;border-bottom-right-radius: 16px;" align="center">
        <tbody>
            <tr>
                <td>
                    <table
                        style=" width: 100%;border-spacing: 0;  font-family: 'Roboto', sans-serif;border-collapse: collapse;">
                        <tr>

                            <td
                                style="border-top-left-radius: 16px;border-top-right-radius: 16px; background: #005CDC; width: 100%; font-weight: 400;padding: 25px;text-align : center;">
                                <img src=${process.env.LIVE_IP}/api/public/images/logo.svg width="80px"
                                    style="margin: 0; padding: 8px;" />
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td style="padding: 30px;">
                    <table style="width: 100%;">
                        <tr>
                            <td style="padding: 0;">
                                <span style="margin: 0; font-weight: 400; font-size: 17px;line-height: 27px;">
                                    Welcome to <b style="color: #005CDC;">${process.env.PROJECT_NAME}</b>
                                </span>

                            </td>
                        </tr>

                        <tr>
                            <td style="padding-top: 5px;">
                                <p style="margin: 0; font-weight: 400; font-size: 17px;line-height: 27px;"> Enter below
                                    otp to restore your password.
                                </p>
                                <h3 style="margin: 0;padding-top: 10px;">OTP <span
                                        style="margin: 0; font-weight: 400; font-size: 17px;line-height: 27px;">is</span>
                                    <span style="font-size:16px; font-weight:400;color: #005CDC;">${otp}</span>
                                </h3>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td style="padding: 0 30px 0 30px;">
                    <table style="background-color: #005CDC40; width: 100%; padding: 15px;border-radius: 10px;">
                        <tr>
                            <td style=" color: #005CDC;padding: 0;" align="center">
                                <span style="margin: 0; font-weight: 500; font-size: 14px;line-height: 21px;">
                                    Thank you for joining the <b>${process.env.PROJECT_NAME} </b>
                                </span>

                            </td>
                        </tr>

                    </table>
                </td>
            </tr>

            <!--body end-->

            <tr>
                <td style="border-bottom-left-radius: 16px;border-bottom-right-radius: 16px;">
                    <table style=" width: 100%; padding-top: 30px;">

                        <tr>
                            <td align="center" style="padding-top: 0px">
                                <table border="0" cellspacing="0" cellpadding="0" style="width: auto !important">
                                    <tbody>
                                        <tr>
                                            <td align="center">
                                                <a style="margin:0; text-decoration-none !important;"
                                                    href="https://web.facebook.com/profile.php?id=61575017431414"
                                                    target="_blank">
                                                    <img style="width: 32px; height: 32px;"
                                                        src="${process.env.LIVE_IP}/api/public/images/fackbook.png"
                                                        alt="Facebook">

                                                </a>
                                            </td>
                                            <td align="center" style="padding:0 10px;">
                                                <a style="margin:0; text-decoration-none !important;"
                                                    href="https://www.instagram.com/alcoholdelivery?igsh=MXFvcmRkZG5ucnFy"
                                                    target="_blank">
                                                    <img style="width: 32px; height: 32px;"
                                                        src="${process.env.LIVE_IP}/api/public/images/instagram.png"
                                                        alt="Instagram">
                                                </a>
                                            </td>
                                              <td align="center" style="padding:0 10px;">
                                                <a style="margin:0; text-decoration-none !important;"
                                                    href=https://play.google.com/store/apps"
                                                    target="_blank">

                                                    <img style="width: 32px; height: 32px;"
                                                        src="${process.env.LIVE_IP}/api/public/images/playstore.png"
                                                        alt="playStore">
                                                </a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="padding: 30px;">
                                <hr style="border: none; margin: 0; height: 1px; background-color: #ddd;">
                                <p style="margin: 0;font-size: 15px;padding-top: 20px;color:#000;">
                                    Copyright ${year} <strong
                                        style="color: #005CDC;text-transform: capitalize;">${process.env.PROJECT_NAME}</strong>
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
    </table>
    </td>
    </tr>
    </tbody>
    </table>
    <br>
</body>

</html>`;
  },

  REPLY_MESSAGE_TEMPLATE(message) {
    return `<html>

<head>
    <title>Welcome</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"></script>

    <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700&display=swap');

        body {
            font-family: 'Roboto', sans-serif;
        }
    </style>
</head>

<body
    style="background-color:#f4f8fb;color: #202020;padding: 20px 0;font-size: 15px;line-height: 24px; font-family: 'Roboto', sans-serif;margin: 0;">
    <table style="width: 650px; background: #fff;box-shadow: 2px 2px 20px 4px rgba(0, 0, 0, 0.07);border-collapse: collapse;border-top-left-radius: 16px;
       border-top-right-radius: 16px;border-bottom-left-radius: 16px;border-bottom-right-radius: 16px;" align="center">
        <tbody>
            <tr>
                <td>
                    <table
                        style=" width: 100%;border-spacing: 0;  font-family: 'Roboto', sans-serif;border-collapse: collapse;">
                        <tr>

                            <td
                                style="border-top-left-radius: 16px;border-top-right-radius: 16px; background: #005CDC; width: 100%; font-weight: 400;padding: 25px;text-align : center;">
                                <img src=${process.env.LIVE_IP}/api/public/images/logo.svg width="80px"
                                    style="margin: 0; padding: 8px;" />
                                <h2
                                    style="margin: 0; font-size: 22px; font-weight: 700;padding-top: 10px; color: #fff;">
                                    Thank you for contacting our support ! !
                                </h2>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <!--- body start-->
            <tr>
                <td style="padding: 30px;">
                    <table style="width: 100%">
                        <tr>
                            <td style="padding-top: 0; color: #000">
                                <p style="margin: 0; font-weight: 400; font-size: 17px;line-height: 27px;">
                                    <span style="font-size:16px; font-weight:400;"> ${message}</span>
                                </p>

                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <!--body end-->

            <tr>
                <td style="border-bottom-left-radius: 16px;border-bottom-right-radius: 16px;">
                    <table style=" width: 100%; padding-top: 0;">

                        <tr>
                            <td align="center" style="padding-top: 0px">
                                <table border="0" cellspacing="0" cellpadding="0" style="width: auto !important">
                                    <tbody>
                                        <tr>
                                            <td align="center">
                                                <a style="margin:0; text-decoration-none !important;"
                                                    href="https://web.facebook.com/profile.php?id=61575017431414"
                                                    target="_blank">
                                                    <img style="width: 32px; height: 32px;"
                                                        src="${process.env.LIVE_IP}/api/public/images/fackbook.png"
                                                        alt="Facebook">

                                                </a>
                                            </td>
                                            <td align="center" style="padding:0 10px;">
                                                <a style="margin:0; text-decoration-none !important;"
                                                    href="https://www.instagram.com/alcoholdelivery?igsh=MXFvcmRkZG5ucnFy"
                                                    target="_blank">
                                                    <img style="width: 32px; height: 32px;"
                                                        src="${process.env.LIVE_IP}/api/public/images/instagram.png"
                                                        alt="Instagram">
                                                </a>
                                            </td>
                                              <td align="center" style="padding:0 10px;">
                                                <a style="margin:0; text-decoration-none !important;"
                                                    href=https://play.google.com/store/apps"
                                                    target="_blank">

                                                    <img style="width: 32px; height: 32px;"
                                                        src="${process.env.LIVE_IP}/api/public/images/playstore.png"
                                                        alt="playStore">
                                                </a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="padding: 30px;">
                                <hr style="border: none; margin: 0; height: 1px; background-color: #ddd;">
                                <p style="margin: 0;font-size: 15px;padding-top: 20px;color:#000;">
                                    Copyright ${year} <strong
                                        style="color: #005CDC;text-transform: capitalize;">${process.env.PROJECT_NAME}</strong>
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
</body>

</html>
        `;
  },

  FORGOT_PASSWORD_TEMPLATE(email, forgotPasswordLink) {
    return `<html>

<head>
    <title>Welcome</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700&display=swap');

        body {
            font-family: 'Roboto', sans-serif;
        }
    </style>
</head>

<body style="margin:0; padding:0; background-color:#f4f8fb;">
    <table width="100%" bgcolor="#f4f8fb" cellpadding="0" cellspacing="0"
        style="font-family: 'Roboto', Arial, sans-serif; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="480" bgcolor="#ffffff" cellpadding="0" cellspacing="0"
                    style="border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.10); max-width: 100%; overflow: hidden;">
                    <tr>
                        <td align="center" style="background: #005CDC; padding: 32px 24px 16px 24px; color: #fff;">
                            <img src=${process.env.LIVE_IP}/api/public/images/logo.svg width="80px"
                                style="margin: 0; padding: 8px;" />
                            <h2 style="margin: 0; font-size: 22px; font-weight: 700;padding-top: 10px;">
                                Reset Your Password</h2>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 30px">
                            <p style="margin: 0;font-size: 17px;line-height: 27px;padding-bottom: 5px;">
                                Hello,<br>
                                We received a request to reset the password for your account:
                                <strong style="color: #005CDC;">${email}</strong>.<br>
                                Click the button below to set a new password.
                                <strong>This link will expire in 1 hour for your security.</strong>
                            </p>
                            <a href=" ${forgotPasswordLink}"
                                style="display: inline-block; background: #005CDC; color: #fff; text-decoration: none; padding: 15px 20px; border-radius: 6px; font-size: 17px; font-weight: bold; margin: 18px 0 0 0; transition: background 0.3s;">
                                Reset Password
                            </a>
                            <p style="height: 30px; margin: 0;"></p>
                            <p
                                style="background-color: #005CDC40; padding: 15px;border-radius: 10px; margin: 0; font-weight: 500; font-size: 12px;line-height: 21px;color: #005CDC;">
                                If you did not request a password reset, please ignore this email or contact our support
                                team.<br>
                                For your security, do not share this email with anyone.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 0 ;">
                            <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                                <tr>
                                    <td align="center">
                                        <a style="margin:0; text-decoration: none !important;"
                                            href="https://web.facebook.com/profile.php?id=61575017431414"
                                            target="_blank">
                                            <img style="width: 32px; height: 32px;"
                                                src="${process.env.LIVE_IP}/api/public/images/fackbook.png" alt="Facebook">
                                        </a>
                                    </td>
                                    <td align="center" style="padding:0 10px;">
                                        <a style="margin:0; text-decoration: none !important;"
                                            href="https://www.instagram.com/alcoholdelivery?igsh=MXFvcmRkZG5ucnFy"
                                            target="_blank">
                                            <img style="width: 32px; height: 32px;"
                                                src="${process.env.LIVE_IP}/api/public/images/instagram.png"
                                                alt="Instagram">
                                        </a>
                                    </td>

                                       <td align="center" style="padding:0 10px;">
                                                <a style="margin:0; text-decoration-none !important;"
                                                    href=https://play.google.com/store/apps"
                                                    target="_blank">

                                                    <img style="width: 32px; height: 32px;"
                                                        src="${process.env.LIVE_IP}/api/public/images/playstore.png"
                                                        alt="playStore">
                                                </a>
                                            </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 30px;">
                            <hr style="border: none; margin: 0; height: 1px; background-color: #ddd;">
                            <p style="margin: 0;font-size: 15px;padding-top: 20px;color:#000;">
                                Copyright ${year} <strong
                                    style="color: #005CDC;text-transform: capitalize;">${process.env.PROJECT_NAME}</strong>
                            <p style="margin: 0;height: 10px;"></p>
                            <a href="mailto:support@yourdomain.com"
                                style="color: #005CDC; text-decoration: none;font-size: 15px;font-weight: 500;">Contact
                                Support</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>`;
  },

  EXPIRE_SUBSCRIPTION(email, name, amount, date) {
    return `<html>

<head>
    <title>Subscription Notice</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700&display=swap');

        body {
            font-family: 'Roboto', sans-serif;
        }
    </style>
</head>

<body style="margin:0; padding:0; background-color:#f4f8fb; font-family: 'Roboto', Arial, sans-serif;">
    <table width="100%" bgcolor="#f4f8fb" cellpadding="0" cellspacing="0" style="padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="480" bgcolor="#ffffff" cellpadding="0" cellspacing="0"
                    style="border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.10); max-width: 100%; overflow: hidden;">
                    <tr>
                    
                        <td align="center" style="background: #005CDC; padding: 24px;">

                            <img src="${process.env.LIVE_IP}/api/public/images/logo.svg" width="80" alt="Logo"
                                style="margin: 0; padding: 8px;" />
                            <h2 style="margin: 0; font-size: 22px; font-weight: 700;padding-top: 10px;">
                                Subscription Expiry Notice
                            </h2>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 30px 30px 30px 30px; color: #000;">
                            <p style="margin: 0;font-size: 17px;line-height: 27px;padding-bottom: 5px;">Dear
                                <strong>${email}</strong>,
                            </p>
                            <p style="margin: 0;font-size: 14px;line-height: 24px;padding-bottom: 10px;">Your
                                subscription is about to expire
                                soon. Please find your subscription details below:</p>
                                
                            <img src="${process.env.LIVE_IP}/api/public/images/mail.jpg" style="width: 120px;border-radius: 12px;">

                            <p style="margin: 0; height: 10px;"></p>
                            <p style="font-weight: 700; font-size: 18px; margin: 0;">
                                Subscription: ${name}
                            </p>
                            <p style="margin: 0; font-size: 15px; color: #005CDC; font-weight: 600;padding: 10px 0;">
                                Amount: <strong>${amount}</strong>
                            </p>
                            <p style="margin: 0; font-size: 15px; color: #005CDC; font-weight: 600;">
                                Expires on: <strong>${date}</strong>
                            </p>
                            <p style="margin: 0; height: 30px;"></p>
                            <p
                                style="margin: 0;font-size: 14px;background-color: #005CDC40;padding: 15px;border-radius: 10px;line-height: 21px;color: #005CDC;font-weight: 500;">
                                Please renew your
                                subscription before the expiry date
                                to continue enjoying our services.</p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 0;">
                            <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                                <tr>
                                    <td align="center">
                                        <a style="margin:0; text-decoration: none !important;" href="#" target="_blank">

                                            <img style="width: 28px; height: 28px;" src="${process.env.LIVE_IP}/api/public/images/fackbook.png"
                                          
                                                alt="Facebook">
                                        </a>
                                    </td>
                                    <td align="center" style="padding:0 15px;">
                                        <a style="margin:0; text-decoration: none !important;" href="#" target="_blank">

                                            <img style="width: 28px; height: 28px;" src="${process.env.LIVE_IP}/api/public/images/instagram.png"

                                                alt="Instagram">
                                        </a>
                                    </td>
                                    <td align="center">
                                        <a style="margin:0; text-decoration: none !important;" href="#" target="_blank">

                                            <img style="width: 35px; height: 35px;" src="${process.env.LIVE_IP}/api/public/images/linkdin.png"
                                            
                                                alt="Instagram">
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 24px;color: #000;text-align: center;">
                            <hr style="border: none; margin: 0; height: 1px; background-color: #ddd;">
                            <p style="margin: 0;font-size: 15px;padding-top: 20px;"> &copy; Copyright 2025 <b
                                    style="color: #005CDC;text-transform: capitalize;">${process.env.PROJECT_NAME}</b>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html> 
`;
  },

  ADD_USER_MAIL(email, password) {
    return `<html>

<head>
    <title>Welcome</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"></script>

    <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700&display=swap');

        body {
            font-family: 'Roboto', sans-serif;
        }
    </style>
</head>


<body
    style="background-color:#f4f8fb;color: #202020;padding: 20px 0;font-size: 15px;line-height: 24px; font-family: 'Roboto', sans-serif;margin: 0;">
    <table style="width: 650px; background: #fff;box-shadow: 2px 2px 20px 4px rgba(0, 0, 0, 0.07);border-collapse: collapse;border-top-left-radius: 16px;
       border-top-right-radius: 16px;border-bottom-left-radius: 16px;border-bottom-right-radius: 16px;" align="center">
        <tbody>
                       <tr>
                <td>
                    <table
                        style=" width: 100%;border-spacing: 0;  font-family: 'Roboto', sans-serif;border-collapse: collapse;">
                        <tr>

                            <td
                                style="border-top-left-radius: 16px;border-top-right-radius: 16px; background: #005CDC; width: 100%; font-weight: 400;padding: 25px;text-align : center;">
                                <img src=${process.env.LIVE_IP}/api/public/images/logo.svg width="80px"
                                    style="margin: 0; padding: 8px;" />
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td className="success-img" style="padding: 30px  30px 0 30px;">
                    <h2 style="margin: 0;font-size: 18px;line-height: 28px;">
                        Hi! Your credentials for <span style="color: #5e5ef4;">${process.env.PROJECT_NAME}</span> are :
                    </h2>
                </td>
            </tr>
            <tr>
                <td className="success-img" style="padding: 5px 30px;">
                    <p style="margin: 0; font-weight: 400; font-size: 17px;line-height: 27px;">
                        Email: <span style="color: #5e5ef4;"> ${email}</span></p>
                </td>
            </tr>
            <tr>
                <td className="success-img" style="padding: 0 30px 30px 30px;">
                    <p style="margin: 0; font-weight: 400; font-size: 17px;line-height: 27px;">
                        Password: <span style="color: #5e5ef4;">${password}</span></p>
                </td>
            </tr>
            <tr>
                <td style="padding: 0 30px 0 30px;">
                    <table style="background-color:#5e5ef430; width: 100%; padding: 15px;border-radius: 10px;">
                        <tr>
                            <td style=" color: #5e5ef4;padding: 0;" align="center">
                                <span style="margin: 0; font-weight: 500; font-size: 14px;line-height: 21px;">
                                    Thank you for joining the <b>${process.env.PROJECT_NAME} </b>
                                </span>

                            </td>
                        </tr>

                    </table>
                </td>
            </tr>
            <!--body end-->
            <tr>
                <td style="border-bottom-left-radius: 16px;border-bottom-right-radius: 16px;">
                    <table style=" width: 100%; padding-top: 30px;">

                        <tr>
                            <td align="center" style="padding-top: 0px">
                                <table border="0" cellspacing="0" cellpadding="0" style="width: auto !important">
                                    <tbody>
                                        <tr>
                                            <td align="center">
                                                <a style="margin:0; text-decoration-none !important;"
                                                    href="https://web.facebook.com/profile.php?id=61575017431414"
                                                    target="_blank">
                                                    <img style="width: 32px; height: 32px;"
                                                        src="${process.env.LIVE_IP}/api/public/images/fackbook.png"
                                                        alt="Facebook">

                                                </a>
                                            </td>
                                            <td align="center" style="padding:0 10px;">
                                                <a style="margin:0; text-decoration-none !important;"
                                                    href="https://www.instagram.com/basenode?igsh=MXFvcmRkZG5ucnFy"
                                                    target="_blank">
                                                    <img style="width: 32px; height: 32px;"
                                                        src="${process.env.LIVE_IP}/api/public/images/instagram.png"
                                                        alt="Instagram">
                                                </a>
                                            </td>
                                            <td align="center" style="padding:0 10px;">
                                                <a style="margin:0; text-decoration-none !important;"
                                                    href=https://play.google.com/store/apps"
                                                    target="_blank">

                                                    <img style="width: 32px; height: 32px;"
                                                        src="${process.env.LIVE_IP}/api/public/images/playstore.png"
                                                        alt="playStore">
                                                </a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="padding: 30px;">
                                <hr style="border: none; margin: 0; height: 1px; background-color: #ddd;">
                                <p style="margin: 0;font-size: 15px;padding-top: 20px;color:#000;">
                                    Copyright ${year} <strong
                                        style="color:  #5e5ef4;text-transform: capitalize;">basenode</strong>
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
    </table>
    <br>
</body>

</html>
    `;
  },

  REPLY_MESSAGE_TEMPLATE(message) {
    return `<html>

<head>
    <title>Welcome</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"></script>

    <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700&display=swap');

        body {
            font-family: 'Roboto', sans-serif;
        }
    </style>
</head>

<body
    style="background-color:#f4f8fb;color: #202020;padding: 20px 0;font-size: 15px;line-height: 24px; font-family: 'Roboto', sans-serif;margin: 0;">
    <table style="width: 650px; background: #fff;box-shadow: 2px 2px 20px 4px rgba(0, 0, 0, 0.07);border-collapse: collapse;border-top-left-radius: 16px;
       border-top-right-radius: 16px;border-bottom-left-radius: 16px;border-bottom-right-radius: 16px;" align="center">
        <tbody>
            <tr>
                <td>
                    <table
                        style=" width: 100%;border-spacing: 0;  font-family: 'Roboto', sans-serif;border-collapse: collapse;">
                        <tr>

                            <td
                                style="border-top-left-radius: 16px;border-top-right-radius: 16px; background: #5e5ef4; width: 100%; font-weight: 400;padding: 25px;text-align : center;">
                                <img src=${process.env.LIVE_IP}/api/public/images/logo.svg width="80px"
                                    style="margin: 0; border-radius: 100px; background: #fff; padding: 8px;" />
                                <h2
                                    style="margin: 0; font-size: 22px; font-weight: 700;padding-top: 10px; color: #fff;">
                                    Thank you for contacting our support ! !
                                </h2>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <!--- body start-->
            <tr>
                <td style="padding: 30px;">
                    <table style="width: 100%">
                        <tr>
                            <td style="padding-top: 0; color: #000">
                                <p style="margin: 0; font-weight: 400; font-size: 17px;line-height: 27px;">
                                    <span style="font-size:16px; font-weight:400;"> ${message}</span>
                                </p>

                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <!--body end-->

            <tr>
                <td style="border-bottom-left-radius: 16px;border-bottom-right-radius: 16px;">
                    <table style=" width: 100%; padding-top: 0;">

                        <tr>
                            <td align="center" style="padding-top: 0px">
                                <table border="0" cellspacing="0" cellpadding="0" style="width: auto !important">
                                    <tbody>
                                        <tr>
                                            <td align="center">
                                                <a style="margin:0; text-decoration-none !important;"
                                                    href="https://web.facebook.com/profile.php?id=61575017431414"
                                                    target="_blank">
                                                    <img style="width: 32px; height: 32px;"
                                                        src="${process.env.LIVE_IP}/api/public/images/fackbook.png"
                                                        alt="Facebook">

                                                </a>
                                            </td>
                                            <td align="center" style="padding:0 10px;">
                                                <a style="margin:0; text-decoration-none !important;"
                                                    href="https://www.instagram.com/basenode?igsh=MXFvcmRkZG5ucnFy"
                                                    target="_blank">
                                                    <img style="width: 32px; height: 32px;"
                                                        src="${process.env.LIVE_IP}/api/public/images/instagram.png"
                                                        alt="Instagram">
                                                </a>
                                            </td>
                                            <td align="center" style="padding:0 10px;">
                                                <a style="margin:0; text-decoration-none !important;"
                                                    href=https://play.google.com/store/apps"
                                                    target="_blank">

                                                    <img style="width: 32px; height: 32px;"
                                                        src="${process.env.LIVE_IP}/api/public/images/playstore.png"
                                                        alt="playStore">
                                                </a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="padding: 30px;">
                                <hr style="border: none; margin: 0; height: 1px; background-color: #ddd;">
                                <p style="margin: 0;font-size: 15px;padding-top: 20px;color:#000;">
                                    Copyright ${year} <strong
                                        style="color: #5e5ef4;text-transform: capitalize;">basenode</strong>
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
</body>

</html>
        `;
  },

  CONTACTUS_MESSAGE_TEMPLATE(message) {
    return `<html>

<head>
    <title>Welcome</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"></script>

    <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700&display=swap');

        body {
            font-family: 'Roboto', sans-serif;
        }
    </style>
</head>

<body
    style="background-color:#f4f8fb;color: #202020;padding: 20px 0;font-size: 15px;line-height: 24px; font-family: 'Roboto', sans-serif;margin: 0;">
    <table style="width: 650px; background: #fff;box-shadow: 2px 2px 20px 4px rgba(0, 0, 0, 0.07);border-collapse: collapse;border-top-left-radius: 16px;
       border-top-right-radius: 16px;border-bottom-left-radius: 16px;border-bottom-right-radius: 16px;" align="center">
        <tbody>
            <tr>
                <td>
                    <table
                        style=" width: 100%;border-spacing: 0;  font-family: 'Roboto', sans-serif;border-collapse: collapse;">
                        <tr>

                            <td
                                style="border-top-left-radius: 16px;border-top-right-radius: 16px; background: #5e5ef4; width: 100%; font-weight: 400;padding: 25px;text-align : center;">
                                <img src=${process.env.LIVE_IP}/api/public/images/logo.svg width="80px"
                                    style="margin: 0; border-radius: 100px; background: #fff; padding: 8px;" />
                                <h2
                                    style="margin: 0; font-size: 22px; font-weight: 700;padding-top: 10px; color: #fff;">
                                    Contact Us Message ! !
                                </h2>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <!--- body start-->
            <tr>
                <td style="padding: 30px 28px">
                    <table style="width: 100%">
                        <tr>

                            <td style="padding-top: 0; color: #000">
                                <p style="margin: 0; font-weight: 400; font-size: 17px;line-height: 27px;">Message :
                                    <span style="font-size:16px; font-weight:400;"> ${message}</span>
                                </p>

                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <!--body end-->

            <tr>
                <td style="border-bottom-left-radius: 16px;border-bottom-right-radius: 16px;">
                    <table style=" width: 100%; padding-top: 0;">

                        <tr>
                            <td align="center" style="padding-top: 0px">
                                <table border="0" cellspacing="0" cellpadding="0" style="width: auto !important">
                                    <tbody>
                                        <tr>
                                            <td align="center">
                                                <a style="margin:0; text-decoration-none !important;"
                                                    href="https://web.facebook.com/profile.php?id=61575017431414"
                                                    target="_blank">
                                                    <img style="width: 32px; height: 32px;"
                                                        src="${process.env.LIVE_IP}/api/public/images/fb.png"
                                                        alt="Facebook">

                                                </a>
                                            </td>
                                            <td align="center" style="padding:0 10px;">
                                                <a style="margin:0; text-decoration-none !important;"
                                                    href="https://www.instagram.com/basenode?igsh=MXFvcmRkZG5ucnFy"
                                                    target="_blank">
                                                    <img style="width: 32px; height: 32px;"
                                                        src="${process.env.LIVE_IP}/api/public/images/insta.png"
                                                        alt="Instagram">
                                                </a>
                                            </td>
                                            <td align="center">

                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="padding: 30px;">
                                <hr style="border: none; margin: 0; height: 1px; background-color: #ddd;">
                                <p style="margin: 0;font-size: 15px;padding-top: 20px;color:#000;">
                                    Copyright ${year} <strong
                                        style="color: #5e5ef4;text-transform: capitalize;">basenode</strong>
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
</body>

</html>`;
  },

  FORGOT_PASSWORD_TEMPLATE(email, forgotPasswordLink) {
    return `<html>

<head>
    <title>Welcome</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700&display=swap');

        body {
            font-family: 'Roboto', sans-serif;
        }
    </style>
</head>

<body style="margin:0; padding:0; background-color:#f4f8fb;">
    <table width="100%" bgcolor="#f4f8fb" cellpadding="0" cellspacing="0"
        style="font-family: 'Roboto', Arial, sans-serif; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="480" bgcolor="#ffffff" cellpadding="0" cellspacing="0"
                    style="border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.10); max-width: 100%; overflow: hidden;">
                    <tr>
                        <td align="center" style="background: #B3696E; padding: 32px 24px 16px 24px; color: #fff;">
                            <img src=${process.env.LIVE_IP}/api/public/images/logo.svg width="80px"
                                style="margin: 0; border-radius: 100px; background: #fff; padding: 8px;" />
                            <h2 style="margin: 0; font-size: 22px; font-weight: 700;padding-top: 10px;">
                                Reset Your Password</h2>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 30px">
                            <p style="margin: 0;font-size: 17px;line-height: 27px;padding-bottom: 5px;">
                                Hello,<br>
                                We received a request to reset the password for your account:
                                <strong style="color: #B3696E;">${email}</strong>.<br>
                                Click the button below to set a new password.
                                <strong>This link will expire in 1 hour for your security.</strong>
                            </p>
                            <a href=" ${forgotPasswordLink}"
                                style="display: inline-block; background: #B3696E; color: #fff; text-decoration: none; padding: 15px 20px; border-radius: 6px; font-size: 17px; font-weight: bold; margin: 18px 0 0 0; transition: background 0.3s;">
                                Reset Password
                            </a>
                            <p style="height: 30px; margin: 0;"></p>
                            <p
                                style="background-color: #B3696E2b; padding: 15px;border-radius: 10px; margin: 0; font-weight: 500; font-size: 12px;line-height: 21px;color: #B3696E;">
                                If you did not request a password reset, please ignore this email or contact our support
                                team.<br>
                                For your security, do not share this email with anyone.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 0 ;">
                            <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                                <tr>
                                    <td align="center">
                                        <a style="margin:0; text-decoration: none !important;"
                                            href="https://web.facebook.com/profile.php?id=61575017431414"
                                            target="_blank">
                                            <img style="width: 32px; height: 32px;"
                                                src="${process.env.LIVE_IP}/api/public/images/fb.png" alt="Facebook">
                                        </a>
                                    </td>
                                    <td align="center" style="padding:0 10px;">
                                        <a style="margin:0; text-decoration: none !important;"
                                            href="https://www.instagram.com/basenode?igsh=MXFvcmRkZG5ucnFy"
                                            target="_blank">
                                            <img style="width: 32px; height: 32px;"
                                                src="${process.env.LIVE_IP}/api/public/images/insta.png"
                                                alt="Instagram">
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 30px;">
                            <hr style="border: none; margin: 0; height: 1px; background-color: #ddd;">
                            <p style="margin: 0;font-size: 15px;padding-top: 20px;color:#000;">
                                Copyright ${year} <strong
                                    style="color: #B3696E;text-transform: capitalize;">basenode</strong>
                            <p style="margin: 0;height: 10px;"></p>
                            <a href="mailto:support@yourdomain.com"
                                style="color: #B3696E; text-decoration: none;font-size: 15px;font-weight: 500;">Contact
                                Support</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>`;
  },
};
