/**
 * Callback that gets executed whenever an 'update card' gets confirmed (by clicking the primary
 * button).
 */
 function onConfirmCard({
  commonEventObject,
}: GoogleAppsScript.AddonEvents.EventObject): GoogleAppsScript.Card_Service.ActionResponse {
  Logger.log(commonEventObject.formInputs);

  const navigation = CardService.newNavigation().popCard();
  return CardService.newActionResponseBuilder().setNavigation(navigation).build();
}

/**
 * Callback that gets executed whenever an 'update card' gets canceled (by clicking the secondary
 * button).
 */
function onCancelCard(): GoogleAppsScript.Card_Service.ActionResponse {
  const navigation = CardService.newNavigation().popCard();
  return CardService.newActionResponseBuilder().setNavigation(navigation).build();
}

/**
 * Callback that gets executed whenever the 'add new filter' button is clicked on the homepage card.
 */
function onAddNewFilter(): GoogleAppsScript.Card_Service.ActionResponse {
  // Create the card that gets pushed on top of the navigation stack.
  const card = GmailAutoArchiver.Interface.createAddNewFilterCard({
    onConfirm: CardService.newAction().setFunctionName(onConfirmCard.name),
    onCancel: CardService.newAction().setFunctionName(onCancelCard.name),
  });

  // Push the created card on the stack and build an action response for it.
  const navigation = CardService.newNavigation().pushCard(card);
  return CardService.newActionResponseBuilder().setNavigation(navigation).build();
}

/**
 * Callback that gets executed whenever the homepage needs to be constructed.
 */
function onHomepage(): GoogleAppsScript.Card_Service.Card {
  return GmailAutoArchiver.Interface.createHomepageCard({
    onAddNewFilterAction: CardService.newAction().setFunctionName(onAddNewFilter.name),
  });
}
