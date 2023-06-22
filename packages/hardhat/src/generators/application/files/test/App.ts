import { expect } from 'chai';
import { ethers } from "hardhat";
describe('App', async function () {
  it('When calling hello should return "world!"', async () => {
    const [contractOwner] = await ethers.getSigners();
    const appInstance = await ethers.getContractFactory('App');
    
    const app = await appInstance.connect(contractOwner).deploy();
    
    const res = await app.hello();
    
    return expect(res).to.be.equal('world');
  });
});
