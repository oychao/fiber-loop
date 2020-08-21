export const queue = [];

let outerRes: () => void;
let endpoint: () => Promise<unknown>;

const genEndpoint = function () {
  const endpointPromise = new Promise(res => {
    outerRes = function () {
      endpoint = genEndpoint();
      queue.push(endpoint);
      res();
    };
  });

  return function () {
    return endpointPromise;
  };
};

export const trigger = function () {
  outerRes();
};

export const pushFiber = function (fiber) {
  queue.push(fiber);
};

export const pushAndTrigger = function (fiber) {
  queue.push(fiber);
  trigger();
};

endpoint = genEndpoint();
queue.push(endpoint);

(async function () {
  while (queue.length) {
    const fiber = queue.shift();
    await fiber();
  }
})();
