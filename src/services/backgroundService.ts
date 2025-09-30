type Subscriber = (isVisible: boolean) => void;

class BackgroundService {
  private isVisible = true;
  private subscribers: Subscriber[] = [];

  subscribe(callback: Subscriber) {
    this.subscribers.push(callback);
    callback(this.isVisible);

    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  private notify() {
    this.subscribers.forEach(callback => callback(this.isVisible));
  }

  show() {
    if (!this.isVisible) {
      this.isVisible = true;
      this.notify();
    }
  }

  hide() {
    if (this.isVisible) {
      this.isVisible = false;
      this.notify();
    }
  }

  toggle() {
    this.isVisible = !this.isVisible;
    this.notify();
  }

  getState() {
    return this.isVisible;
  }
}

export const backgroundService = new BackgroundService();
