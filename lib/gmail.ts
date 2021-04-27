/**
 * Callback for rendering the card for a specific Gmail message.
 */
function onGmailMessage(e: ActionEvent): Card {
  // Get the ID of the message the user has open.
  const messageId = e.gmail.messageId;

  // Get an access token scoped to the current message and use it for GmailApp
  // calls.
  const accessToken = e.gmail.accessToken;
  GmailApp.setCurrentMessageAccessToken(accessToken);

  // Get the subject of the email.
  const message = GmailApp.getMessageById(messageId);
  let subject = message.getThread().getFirstMessageSubject();

  // Remove labels and prefixes.
  subject = subject.replace(/^([rR][eE]|[fF][wW][dD]):\s*/, '').replace(/^\[.*?\]\s*/, '');

  // If neccessary, truncate the subject to fit in the image.
  subject = truncate(subject);

  return createCatCard(subject);
}

/**
 * Callback for rendering the card for the compose action dialog.
 */
function onGmailCompose(): Card {
  const header = CardService.newCardHeader()
    .setTitle('Insert cat')
    .setSubtitle('Add a custom cat image to your email message.');

  // Create text input for entering the cat's message.
  const input = CardService.newTextInput()
    .setFieldName('text')
    .setTitle('Caption')
    .setHint('What do you want the cat to say?');

  // Create a button that inserts the cat image when pressed.
  const action = CardService.newAction().setFunctionName('onGmailInsertCat');
  const button = CardService.newTextButton()
    .setText('Insert cat')
    .setOnClickAction(action)
    .setTextButtonStyle(CardService.TextButtonStyle.FILLED);
  const buttonSet = CardService.newButtonSet().addButton(button);

  // Assemble the widgets and return the card.
  const section = CardService.newCardSection().addWidget(input).addWidget(buttonSet);
  const card = CardService.newCardBuilder().setHeader(header).addSection(section);
  return card.build();
}

/**
 * Callback for inserting a cat into the Gmail draft.
 */
function onGmailInsertCat({
  commonEventObject,
}: ActionEvent): GoogleAppsScript.Card_Service.UpdateDraftActionResponse {
  // Get the text that was entered by the user.
  // const input: GoogleAppsScript.AddonEvents.StringInput = commonEventObject.formInputs.text[''];

  Logger.log(JSON.stringify(commonEventObject.formInputs));

  const text = 'test';
  // Use the "Cat as a service" API to get the cat image. Add a "time" URL
  // parameter to act as a cache buster.
  const now = new Date();
  let imageUrl = 'https://cataas.com/cat';
  if (text) {
    // Replace forward slashes in the text, as they break the CataaS API.
    const caption = text.replace(/\//g, ' ');
    imageUrl += Utilities.formatString(
      '/says/%s?time=%s',
      encodeURIComponent(caption),
      now.getTime()
    );
  }

  const imageHtmlContent =
    '<img style="display: block; max-height: 300px;" src="' + imageUrl + '"/>';
  return CardService.newUpdateDraftActionResponseBuilder()
    .setUpdateDraftBodyAction(
      CardService.newUpdateDraftBodyAction()
        .addUpdateContent(imageHtmlContent, CardService.ContentType.MUTABLE_HTML)
        .setUpdateType(CardService.UpdateDraftBodyType.IN_PLACE_INSERT)
    )
    .build();
}
