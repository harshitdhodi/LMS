const getEmailTemplate = ( name ,email, password) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f3f4f6;
      padding: 16px;
      margin: 0;
    }

    .container {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
    }

    .email-content {
      max-width: 600px;
      width: 100%;
      padding: 24px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #e53e3e; /* Red background color */
      color: #ffffff;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 24px;
      text-align: center;
    }

    .header h1 {
      font-size: 30px;
      font-weight: bold;
      margin: 0;
      width: 100%;
    }

    .title {
      font-size: 24px;
      font-weight: bold;
      color: #2d3748;
      margin-bottom: 16px;
      text-align: center;
    }

    .greeting, .message, .details, .contact, .closing, .signature {
      font-size: 16px;
      margin-bottom: 16px;
    }

    .details-list {
      list-style-type: none;
      padding-left: 0;
      margin-bottom: 16px;
    }

    .details-list li {
      color: #4a5568;
    }

    .email {
      color: #3182ce;
      text-decoration: none;
    }

    .signature {
      font-weight: bold;
      color: #2d3748;
    }

    .social-media {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin: 20px 0;
    }

    .social-icon {
      color: #333;
      font-size: 24px;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="email-content">
      <header class="header">
        <h1>B-CONN</h1>
      </header>
      <h1 class="title">Welcome to Our Company!</h1>
      <p class="greeting">Hi ${name},</p>
      <p class="message">Thank you for registering with us. Your account has been successfully created.</p>
      <p class="details">Here are your details:</p>
      <ul class="details-list">
        <li><strong>User Name:</strong> ${email}</li>
        <li><strong>Password:</strong> ${password}</li>
      </ul>
      <p class="contact">We are excited to have you on board. If you have any questions, feel free to contact us at <a href="mailto:support@ourcompany.com" class="email">support@ourcompany.com</a>.</p>
      <p class="closing">Best Regards,</p>
      <p class="signature">Our Company</p>
      <div class="social-media">
        <a href="https://facebook.com" class="social-icon" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
        <a href="https://instagram.com" class="social-icon" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
        <a href="https://whatsapp.com" class="social-icon" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>
        <a href="https://twitter.com" class="social-icon" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
      </div>
    </div>
  </div>
</body>
</html>
`;

module.exports = {
  getEmailTemplate,
};
