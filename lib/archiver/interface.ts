namespace GmailAutoArchiver {
  type Action = GoogleAppsScript.Card_Service.Action;
  type Card = GoogleAppsScript.Card_Service.Card;

  interface HomepageCardSettings {
    archivers: Archiver[];
    onAddNewFilterAction: Action;
  }

  interface UpdateCardSettings {
    onConfirm: Action;
    onCancel: Action;
  }

  export class Interface {
    static createAddNewFilterCard(options: UpdateCardSettings): Card {
      const builder = CardService.newCardBuilder();

      // Construct the header.
      const header = CardService.newCardHeader();
      header
        .setTitle('Create a filter')
        .setSubtitle(
          'Create a new filter. Fill in a filter name, and set whether the filter should mark incoming\
      mails as read and/or as important'
        );

      // Construct the main body section.
      const mainSection = CardService.newCardSection();
      mainSection.addWidget(
        CardService.newTextInput()
          .setFieldName('filterName')
          .setTitle('Name')
          .setHint('<b>this is a hint</b>')
      );
      mainSection.addWidget(
        CardService.newDecoratedText()
          .setTopLabel('Mark as read')
          .setText('Mark incoming emails automatically as read.')
          .setWrapText(true)
          .setSwitchControl(CardService.newSwitch().setFieldName('markAsRead').setValue('true'))
      );

      // Construct the footer.
      const footer = CardService.newFixedFooter();
      footer.setPrimaryButton(
        CardService.newTextButton().setText('Confirm').setOnClickAction(options.onConfirm)
      );
      footer.setSecondaryButton(
        CardService.newTextButton().setText('Cancel').setOnClickAction(options.onCancel)
      );

      // Assemble the card.
      builder.setHeader(header);
      builder.addSection(mainSection);
      builder.setFixedFooter(footer);
      return builder.build();
    }

    static createHomepageCard(settings: HomepageCardSettings): Card {
      const builder = CardService.newCardBuilder();

      // const description = CardService.newTextParagraph().setText(
      //   'Hello this is the homepage for AWESOME STUFF TO HAPPEN'
      // );
      // builder.addSection(
      //   CardService.newCardSection().addWidget(description).addWidget(filterDecoratedText)
      // );

      const mainSection = CardService.newCardSection();

      if (settings.archivers.length > 0) {
        for (const archiver of settings.archivers) {
          mainSection.addWidget(
            CardService.newDecoratedText()
              .setText(archiver.name)
              .setEndIcon(CardService.newIconImage().setIcon(CardService.Icon.OFFER))
          );
        }
      } else {
        mainSection.addWidget(
          CardService.newTextParagraph().setText(
            'You have no filters yet. Click the <b>Add a new filter</b> button below to get started.'
          )
        );
      }

      builder.addSection(mainSection);

      const footer = CardService.newFixedFooter().setPrimaryButton(
        CardService.newTextButton()
          .setText('Add a new filter')
          .setOnClickAction(settings.onAddNewFilterAction)
      );
      builder.setFixedFooter(footer);

      return builder.build();
    }
  }
}
