import { expect } from 'chai';
import 'mocha-sinon';

import { pushTask, trigger } from '../bin';

const sleep = time => new Promise(res => setTimeout(res, time));

const genDemoTask = function (id) {
  return async function () {
    await sleep(1e2);
    console.info(`task ${id}`);
  }
}

describe('task loop', () => {
  beforeEach(function () {
    this.sinon.stub(console, 'info');
  });

  it('should run correctly', done => {
    (async function () {
      pushTask(genDemoTask(1));
      pushTask(genDemoTask(2));
      pushTask(genDemoTask(3));
      pushTask(async function () {
        expect(console.info.calledThrice).to.be.true;
        expect(console.info.calledWith('task 1')).to.be.true;
        expect(console.info.calledWith('task 2')).to.be.true;
        expect(console.info.calledWith('task 3')).to.be.true;
        done();
      });
      trigger();
    })();
  });
});
