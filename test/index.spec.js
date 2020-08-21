import { expect } from 'chai';
import 'mocha-sinon';

import { pushFiber, trigger, pushAndTrigger } from '../bin';

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
      pushFiber(genDemoFiber(1));
      pushFiber(genDemoFiber(2));
      pushFiber(genDemoFiber(3));
      pushFiber(async function () {
        expect(console.info.calledThrice).to.be.true;
        expect(console.info.calledWith('fiber 1')).to.be.true;
        expect(console.info.calledWith('fiber 2')).to.be.true;
        expect(console.info.calledWith('fiber 3')).to.be.true;
        done();
      });
      trigger();
    })();
  });

  it('automatic trigger should run correctly', done => {
    (async function () {
      pushAndTrigger(genDemoFiber(1));
      pushAndTrigger(genDemoFiber(2));
      pushAndTrigger(genDemoFiber(3));
      pushAndTrigger(async function () {
        expect(console.info.calledThrice).to.be.true;
        expect(console.info.calledWith('fiber 1')).to.be.true;
        expect(console.info.calledWith('fiber 2')).to.be.true;
        expect(console.info.calledWith('fiber 3')).to.be.true;
        done();
      });
    })()
  })
});
