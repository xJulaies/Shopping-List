const FEEDBACK_KEY = "shopping-list-feedback";
const ITEM_CREATED_KEY = "shopping-list-item-created";

export function setActionFeedback(message: string) {
  window.sessionStorage.setItem(FEEDBACK_KEY, message);
}

export function readActionFeedback() {
  return window.sessionStorage.getItem(FEEDBACK_KEY);
}

export function clearActionFeedback() {
  window.sessionStorage.removeItem(FEEDBACK_KEY);
}

export function markItemAsJustCreated() {
  window.sessionStorage.setItem(ITEM_CREATED_KEY, "true");
}

export function readItemJustCreated() {
  return window.sessionStorage.getItem(ITEM_CREATED_KEY) === "true";
}

export function clearItemJustCreated() {
  window.sessionStorage.removeItem(ITEM_CREATED_KEY);
}
