export class RasaNluModel {
  intent: string;
  examples: string;

  constructor(intentId) {
    this.intent = intentId.startsWith('st_') ? `chitchat/${intentId}` : `faq/${intentId}`;
    this.examples = '';
  }
}
