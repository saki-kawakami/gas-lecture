function authorize() {
  // メール送信
  MailApp.sendEmail({
    to: "test@test.com",
    subject: "TEIS IS TEST",
    body: "",
  });
  FormApp.openById("");
}
