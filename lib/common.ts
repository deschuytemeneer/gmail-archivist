/**
 * The maximum number of characters that can fit in the cat image.
 */
const MAX_MESSAGE_LENGTH = 40;

/**
 * Callback for rendering the homepage card.
 */
function onHomepage({ commonEventObject }: ActionEvent): Card {
  const hour = Number(Utilities.formatDate(new Date(), commonEventObject.timeZone.id, 'H'));

  let greeting: string;
  if (hour >= 6 && hour < 12) {
    greeting = 'Good morning';
  } else if (hour >= 12 && hour < 18) {
    greeting = 'Good afternoon';
  } else {
    greeting = 'Good night';
  }

  return createCatCard(`${greeting}, ${commonEventObject.hostApp}`, true);
}

/**
 * Creates a card with an image of a cat, overlayed with the text.
 */
function createCatCard(text: string, isHomepage = false): Card {
  // Use the "Cat as a service" API to get the cat image. Add a "time" URL
  // parameter to act as a cache buster.
  const now = new Date();

  // Replace formward slashes in the text, as they break the CataaS API.
  const caption = text.replace(/\//g, ' ');
  const imageUrl = Utilities.formatString(
    'https://cataas.com/cat/says/%s?time=%s',
    encodeURIComponent(caption),
    now.getTime()
  );
  const image = CardService.newImage().setImageUrl(imageUrl).setAltText('Meow');

  // Create a button that changes the cat image when pressed.
  // Note: Action parameter keys and values must be strings.
  const action = CardService.newAction()
    .setFunctionName('onChangeCat')
    .setParameters({ text: text, isHomepage: isHomepage.toString() });
  const button = CardService.newTextButton()
    .setText('Change cat')
    .setOnClickAction(action)
    .setTextButtonStyle(CardService.TextButtonStyle.FILLED);
  const buttonSet = CardService.newButtonSet().addButton(button);

  // Create a footer to be shown at the bottom.
  const footer = CardService.newFixedFooter().setPrimaryButton(
    CardService.newTextButton()
      .setText('Powered by cataas.com')
      .setOpenLink(CardService.newOpenLink().setUrl('https://cataas.com'))
  );

  // Assemble the widgets and return the card.
  const section = CardService.newCardSection().addWidget(image).addWidget(buttonSet);
  const card = CardService.newCardBuilder().addSection(section).setFixedFooter(footer);

  if (!isHomepage) {
    // Create the header shown when the card is minimized,
    // but only when this card is a contextual card. Peek headers
    // are never used by non-contexual cards like homepages.
    const peekHeader = CardService.newCardHeader()
      .setTitle('Contextual Cat')
      .setImageUrl('https://www.gstatic.com/images/icons/material/system/1x/pets_black_48dp.png')
      .setSubtitle(text);
    card.setPeekCardHeader(peekHeader);
  }

  return card.build();
}

/**
 * Callback for the "Change cat" button.
 */
function onChangeCat({ commonEventObject }: ActionEvent): Card {
  // Get the text that was shown in the current cat image. This was passed as a
  // parameter on the Action set for the button.
  const text = commonEventObject.parameters.text;

  // The isHomepage parameter is passed as a string, so convert to a Boolean.
  const isHomepage = commonEventObject.parameters.isHomepage === 'true';

  // Create a new card with the same text.
  const card = createCatCard(text, isHomepage);

  // Create an action response that instructs the add-on to replace
  // the current card with the new one.
  const navigation = CardService.newNavigation().updateCard(card);
  const actionResponse = CardService.newActionResponseBuilder().setNavigation(navigation);
  return actionResponse.build();
}

/**
 * Truncate a message to fit in the cat image.
 */
function truncate(message: string): string {
  if (message.length > MAX_MESSAGE_LENGTH) {
    message = message.slice(0, MAX_MESSAGE_LENGTH);
    message = message.slice(0, message.lastIndexOf(' ')) + '...';
  }
  return message;
}
