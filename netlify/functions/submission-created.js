import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const handler = async (event) => {
  try {
    const payload = JSON.parse(event.body).payload;

    // Only send welcome emails for the beta-signup form
    if (payload.form_name !== "beta-signup") {
      console.log(`Ignoring submission from form: ${payload.form_name}`);
      return { statusCode: 200, body: "Not a beta-signup form" };
    }

    const name = payload.data?.name || payload.name || "there";
    const email = payload.data?.email || payload.email;

    if (!email) {
      console.error("No email found in submission payload");
      return { statusCode: 400, body: "No email in submission" };
    }

    const { data, error } = await resend.emails.send({
      from: "Danny at MycoStudio <danny@mycoplugins.com>",
      to: [email],
      replyTo: "danny@mycoplugins.com",
      subject: `Welcome to TonEase, ${name}!`,
      html: buildWelcomeEmail(name),
    });

    if (error) {
      console.error("Resend error:", error);
      return { statusCode: 500, body: JSON.stringify(error) };
    }

    console.log(`Welcome email sent to ${email}, id: ${data.id}`);
    return { statusCode: 200, body: JSON.stringify({ emailId: data.id }) };
  } catch (err) {
    console.error("Function error:", err);
    return { statusCode: 500, body: err.message };
  }
};

function buildWelcomeEmail(name) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to TonEase</title>
</head>
<body style="margin:0;padding:0;background-color:#040810;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#040810;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- HEADER -->
          <tr>
            <td style="padding-bottom:32px;border-bottom:1px solid #152035;">
              <span style="font-family:'Courier New',monospace;font-size:18px;font-weight:bold;color:#e8ecf4;letter-spacing:3px;">
                Ton<span style="color:#40c8b0;">Ease</span>
              </span>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:32px 0;">
              <h1 style="margin:0 0 16px;font-size:24px;font-weight:700;color:#e8ecf4;">
                Welcome aboard, ${name}.
              </h1>
              <p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:#8a9ab8;">
                You're one of the first people to try TonEase. That means a lot to us.
              </p>
              <p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:#8a9ab8;">
                We started MycoStudio with a simple belief: <strong style="color:#e8ecf4;">musicians should spend their time making music, not fighting their tools.</strong> Every plugin we build is designed to take a tedious, technical problem and make it disappear &mdash; so you can focus on what actually matters: your craft.
              </p>
              <p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:#8a9ab8;">
                TonEase is our first step toward that vision. It uses modern signal processing wrapped in an interface that takes about 5 seconds to learn. No manual required.
              </p>

              <!-- DIVIDER -->
              <div style="border-top:1px solid #152035;margin:28px 0;"></div>

              <h2 style="margin:0 0 12px;font-size:18px;font-weight:600;color:#40c8b0;">
                Your feedback shapes this plugin.
              </h2>
              <p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:#8a9ab8;">
                As an early adopter, your experience is the most valuable input we have. We genuinely want to hear from you:
              </p>
              <ul style="margin:0 0 24px;padding-left:20px;color:#8a9ab8;font-size:15px;line-height:1.8;">
                <li>Something feel off? Tell us.</li>
                <li>Have a feature idea? We're listening.</li>
                <li>Found a bug? We want to know immediately.</li>
                <li>Love something about it? That helps us too.</li>
              </ul>

              <!-- CTA BUTTON -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
                <tr>
                  <td style="background-color:#40c8b0;border-radius:6px;">
                    <a href="https://mycoplugins.com/feedback"
                       style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:600;color:#040810;text-decoration:none;letter-spacing:0.5px;">
                      Share your feedback
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:#8a9ab8;">
                Or just hit reply to this email &mdash; it comes straight to me.
              </p>
              <p style="margin:0;font-size:16px;line-height:1.6;color:#8a9ab8;">
                Thanks for being here early,<br>
                <strong style="color:#e8ecf4;">Danny</strong><br>
                <span style="font-size:14px;color:#4a5a7a;">MycoStudio LLC</span>
              </p>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding-top:24px;border-top:1px solid #152035;">
              <p style="margin:0;font-size:12px;color:#4a5a7a;line-height:1.6;">
                You're receiving this because you signed up for the TonEase beta at mycoplugins.com.
                <br>&copy; 2026 MycoStudio LLC
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
