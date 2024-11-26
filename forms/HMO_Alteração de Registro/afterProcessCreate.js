function afterProcessCreate(processId) {
  hAPI.setCardValue("requestNumber", processId);
}
