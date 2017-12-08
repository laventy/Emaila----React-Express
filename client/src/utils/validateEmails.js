const regExpression = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

// The type of parameter is String
export default emails => {
  const invalidEmails = emails
    .split(",")
    .map(email => email.trim())
    .filter(email => !regExpression.test(email));

  if (invalidEmails.length) {
    return `These emails are invalid: ${invalidEmails}`;
  }

  return;
};
