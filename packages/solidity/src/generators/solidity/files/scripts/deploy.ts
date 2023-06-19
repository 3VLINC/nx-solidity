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

  const {
    deployTransaction: { blockNumber },
  } = await appInstance.deployed();

  console.log(
    'App deployed to:',
    appInstance.address,
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
