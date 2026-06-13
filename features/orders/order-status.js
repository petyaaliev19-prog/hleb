export const ORDER_STATUS_FLOW = {
  new: ["confirmed", "cancelled"],
  confirmed: ["ready", "cancelled"],
  ready: ["picked_up", "not_picked_up"],
  picked_up: [],
  not_picked_up: [],
  cancelled: [],
};

export const ORDER_STATUS_OPTIONS = Object.keys(ORDER_STATUS_FLOW);

export function isKnownOrderStatus(status) {
  return ORDER_STATUS_OPTIONS.includes(status);
}

export function getNextOrderStatuses(status) {
  return ORDER_STATUS_FLOW[status] ?? [];
}

export function canTransitionOrderStatus(currentStatus, nextStatus) {
  if (!isKnownOrderStatus(nextStatus)) {
    return false;
  }

  if (currentStatus === nextStatus) {
    return true;
  }

  return getNextOrderStatuses(currentStatus).includes(nextStatus);
}
