import { transporter } from "../apps/mail.js";
import { applyTemplate } from "../utils/template.js";

// export const sendEmail = async (
//   nodeConfig: { to: string; subject: string; text: string },
//   triggerData: any,
// ) => {
//   try {
//     let { to, subject, text } = nodeConfig;
//     to = applyTemplate(nodeConfig.to, triggerData);
//     subject = applyTemplate(nodeConfig.subject, triggerData);
//     text = applyTemplate(nodeConfig.text, triggerData);
//     text = nodeConfig.text.replace("{{email}}", triggerData.email);
//     subject = nodeConfig.subject.replace("{{name}}", triggerData.name);
//     const info = await transporter.sendMail({
//       from: `"ZAP APP" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       text,
//     });
//     console.log("email sent ", info.messageId);
//     return {
//       success: true,
//       message: "Email sent",
//     };
//   } catch (error) {
//     console.error("error sending mail", error);
//     throw error;
//   }
// };
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
