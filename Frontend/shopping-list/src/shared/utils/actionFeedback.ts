const FEEDBACK_KEY = "shopping-list-feedback";

export function setActionFeedback(message: string) {
  window.sessionStorage.setItem(FEEDBACK_KEY, message);
}

export function takeActionFeedback() {
  const message = window.sessionStorage.getItem(FEEDBACK_KEY);
  window.sessionStorage.removeItem(FEEDBACK_KEY);
  return message;
}
