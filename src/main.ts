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

export const pushTask = function (task) {
  queue.push(task);
};

export const trigger = function () {
  outerRes();
};

endpoint = genEndpoint();
queue.push(endpoint);

(async function () {
  while (queue.length) {
    const task = queue.shift();
    await task();
  }
})();
