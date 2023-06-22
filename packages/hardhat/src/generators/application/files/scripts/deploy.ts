import { ethers } from 'hardhat';

async function main() {
  const accounts = await ethers.getSigners();
  const contractOwner = accounts[0];
  const appFactory = await ethers.getContractFactory(
    'App'
  );

  const appInstance = await appFactory
    .connect(contractOwner)
    .deploy();
  
  const { blockNumber } = await appInstance.deploymentTransaction().wait();
  const address = await appInstance.getAddress();

  console.log(
    'App deployed to:',
    address,
    'at block',
    blockNumber
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
