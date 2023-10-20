import { AsyncAnyFunction } from './types';

export class FiberLoop {
  private queue: Array<AsyncAnyFunction>;

  private outerRes: (value?: unknown) => void;

  private endpoint: () => Promise<unknown>;

  constructor() {
    this.queue = [];
    this.endpoint = this.genEndpoint();
    this.queue.push(this.endpoint);

    (async () => {
      while (this.queue.length) {
        const fiber = this.queue.shift();
        await fiber();
      }
    })();
  }

  private genEndpoint(): () => Promise<unknown> {
    const endpointPromise = new Promise(res => {
      this.outerRes = () => {
        this.endpoint = this.genEndpoint();
        this.queue.push(this.endpoint);
        res(undefined);
      };
    });

    return async function (): Promise<unknown> {
      return endpointPromise;
    };
  }

  public trigger(): void {
    this.outerRes();
  }

  public pushFiber(fiber: AsyncAnyFunction): void {
    this.queue.push(fiber);
  }

  public pushAndTrigger(fiber: AsyncAnyFunction): void {
    this.queue.push(fiber);
    this.trigger();
  }
}

export const loop = new FiberLoop();
