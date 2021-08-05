// TODO this is incomplete, see
// https://developers.google.com/workspace/add-ons/concepts/event-objects#event_object_structure

declare namespace GoogleAppsScript {
  namespace AddonEvents {
    interface StringInput {
      /**
       * The value of the input. Contains only one element in the case of single-valued widgets (e.g. a
       * text box), or multiple in the case of multi-valued widgets (e.g. a checkbox group).
       */
      value: string[];
    }

    interface DateTimeInput {
      /**
       * `true` if the input date time includes a date; if `false` only a time is included.
       */
      hasDate: boolean;

      /**
       * `true` if the input date time includes a time; if `false` only a date is included.
       */
      hasTime: boolean;

      /**
       * The time selected by the user, in milliseconds since epoch (00:00:00 UTC on 1 January 1970).
       */
      msSinceEpoch: string;
    }

    interface DateInput {
      /**
       * The time selected by the user, in milliseconds since epoch (00:00:00 UTC on 1 January 1970).
       */
      msSinceEpoch: string;
    }

    interface TimeInput {
      /**
       * The hour number selected by the user.
       */
      hours: number;

      /**
       * The minute number selected by the user.
       */
       minutes: number;
    }

    interface EventObject {
      /**
       * An object containing information common to all event objects, regardless of the host
       * application.
       */
      commonEventObject: {
        /**
         * Indicates where the event originated from.
         */
        platform: 'WEB' | 'IOS' | 'ANDROID';

        /**
         * A map containing the current values of the widgets in the displayed card. The map keys
         * are the string IDs assigned with each widget, and each value is another wrapper object
         * with a single "" key. The structure of the map value object is dependent on the widget
         * type.
         */
        formInputs: {
          [name: string]: {
            "": StringInput | DateTimeInput | DateInput | TimeInput;
          };
        };

        /**
         * Indicates the host app the add-on is active in when the event object is generated.
         */
        hostApp: 'GMAIL' | 'CALENDAR' | 'DRIVE' | 'DOCS' | 'SHEETS' | 'SLIDES';

        /**
         * Any additional parameters you supply to the Action using Action.setParameters().
         */
        parameters: {
          [name: string]: string | undefined;
        };

        /**
         * To enable this field, you must set `addOns.common.useLocaleFromApp` to `true` in your
         * add-on's manifest. Your add-on's scope list must also include
         * `https://www.googleapis.com/auth/script.locale`. See [Accessing user locale and
         * timezone](https://developers.google.com/workspace/add-ons/how-tos/access-user-locale) for
         * more details.
         */
        timeZone: {
          /**
           * The timezone identifier of the user's timezone. Examples include: America/New_York,
           * Europe/Vienna, and Asia/Seoul.
           */
          id: string;

          /**
           * The time offset from Coordinated Universal Time (UTC) of the user's timezone, measured in
           * milliseconds. See Accessing user locale and timezone for more details.
           */
          offset: string;
        };
      }

      /**
       * Only present if the calling host is Gmail. An object containing Gmail information.
       */
      gmail?: {
        /**
         * The Gmail-specific access token. You can use this token with the
         * GmailApp.setCurrentMessageAccessToken(accessToken) method to grant your add-on temporary
         * access to a user's currently open Gmail message or let your add-on compose new drafts.
         */
        accessToken: string;

        /**
         * Disabled by default. The list of "BCC:" recipient email addresses currently included in a
         * draft the add-on is composing. To enable this field, you must set the
         * `addOns.gmail.composeTrigger.draftAccess` field in your manifest to `METADATA`.
         */
        bccRecipients?: string[];

        /**
         * Disabled by default. The list of "CC:" recipient email addresses currently included in a
         * draft the add-on is composing. To enable this field, you must set the
         * `addOns.gmail.composeTrigger.draftAccess` field in your manifest to `METADATA`.
         */
        ccRecipients?: string[];

        /**
         * The ID of the currently open Gmail message.
         */
        messageId: string;

        /**
         * The currently open Gmail thread ID.
         */
        threadId: string;

        /**
         * Disabled by default. The list of "To:" recipient email addresses currently included in a
         * draft the add-on is composing. To enable this field, you must set the
         * `addOns.gmail.composeTrigger.draftAccess` field in your manifest to `METADATA`.
         */
        toRecipients?: string[];
      }
    }
  }

  namespace Card_Service {
    interface CardService {
      newIconImage(): IconImage;
    }

    interface IconImage {
      setIcon(icon: GoogleAppsScript.Card_Service.Icon): IconImage;
    }

    interface DecoratedText {
      setEndIcon(icon: GoogleAppsScript.Card_Service.IconImage);
    }
  }
}
