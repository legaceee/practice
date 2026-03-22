import { transporter } from "../apps/mail.js";
import { applyTemplate } from "../utils/template.js";

export const sendEmail = async (
  nodeConfig: { to: string; subject: string; text: string },
  context: any,
) => {
  try {
    let { to, subject, text } = nodeConfig;

    to = applyTemplate(to, context);
    subject = applyTemplate(subject, context);
    text = applyTemplate(text, context);

    const info = await transporter.sendMail({
      from: `"ZAP APP" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log("email sent ", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("error sending mail", error);
    throw error;
  }
};
