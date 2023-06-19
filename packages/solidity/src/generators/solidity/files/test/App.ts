import { ethers } from '@nomiclabs/hardhat-ethers';
import { expect } from 'chai';
describe('App', async function () {
  it('When calling hello should return "world"', async () => {
    const [contractOwner] = await ethers.getSigners();
    const App = (await ethers.getContractFactory(
        'App'
      ));
    const appInstance = await App.connect(contractOwner).deploy();

    await appInstance.deployed();

    const res = await appInstance.hello();
    
    return expect(res).to.be('world');
  });
});
