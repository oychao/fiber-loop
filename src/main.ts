const queue = [];

let outerRes, endpoint;

const genEndpoint = function () {
  return function () {
    return new Promise(res => {
      outerRes = function () {
        endpoint = genEndpoint();
        queue.push(endpoint);
        res();
      };
    });
  };
};

export const pushFiber = function (fiber) {
  queue.push(fiber);
};

export const trigger = function () {
  outerRes();
};

endpoint = genEndpoint();
queue.push(endpoint);

(async function () {
  while (queue.length) {
    const fiber = queue.shift();
    await fiber();
  }
})();
