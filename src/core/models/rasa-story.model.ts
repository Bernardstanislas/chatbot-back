export class RasaStoryModel {
  story: string;
  steps: any[];

  constructor(intentId) {
    this.story = intentId.startsWith('st_') ? `chitchat/${intentId}` : `faq/${intentId}`
    this.steps = [];
  }
}
