import { expect } from 'chai';
import 'mocha-sinon';

import { loop } from '../bin';

const sleep = time => new Promise(res => setTimeout(res, time));

const genDemoFiber = function (id) {
  return async function () {
    await sleep(1e2);
    console.info(`fiber ${id}`);
  }
}

describe('fiber loop', () => {
  beforeEach(function () {
    this.sinon.stub(console, 'info');
  });

  it('manual trigger should run correctly', done => {
    (async function () {
      loop.pushFiber(genDemoFiber(1));
      loop.pushFiber(genDemoFiber(2));
      loop.pushFiber(genDemoFiber(3));
      loop.pushFiber(async function () {
        expect(console.info.calledThrice).to.be.true;
        expect(console.info.calledWith('fiber 1')).to.be.true;
        expect(console.info.calledWith('fiber 2')).to.be.true;
        expect(console.info.calledWith('fiber 3')).to.be.true;
        done();
      });
      loop.trigger();
    })();
  });

  it('automatic trigger should run correctly', done => {
    (async function () {
      loop.pushAndTrigger(genDemoFiber(1));
      loop.pushAndTrigger(genDemoFiber(2));
      loop.pushAndTrigger(genDemoFiber(3));
      loop.pushAndTrigger(async function () {
        expect(console.info.calledThrice).to.be.true;
        expect(console.info.calledWith('fiber 1')).to.be.true;
        expect(console.info.calledWith('fiber 2')).to.be.true;
        expect(console.info.calledWith('fiber 3')).to.be.true;
        done();
      });
    })()
  })
});
