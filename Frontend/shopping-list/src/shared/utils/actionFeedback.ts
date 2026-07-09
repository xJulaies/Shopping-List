const FEEDBACK_KEY = "shopping-list-feedback";
const ITEM_CREATED_KEY = "shopping-list-item-created";

export function setActionFeedback(message: string) {
  window.sessionStorage.setItem(FEEDBACK_KEY, message);
}

export function takeActionFeedback() {
  const message = window.sessionStorage.getItem(FEEDBACK_KEY);
  window.sessionStorage.removeItem(FEEDBACK_KEY);
  return message;
}

export function markItemAsJustCreated() {
  window.sessionStorage.setItem(ITEM_CREATED_KEY, "true");
}

export function takeItemJustCreated() {
  const wasJustCreated = window.sessionStorage.getItem(ITEM_CREATED_KEY) === "true";
  window.sessionStorage.removeItem(ITEM_CREATED_KEY);
  return wasJustCreated;
}
