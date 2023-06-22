import '@nomicfoundation/hardhat-toolbox';
import { HardhatUserConfig } from 'hardhat/types';

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
<% makeNetwork = function(network) {
  switch(network) { 
    case 'localhost': %>{ url: "http://127.0.0.1:8545" }<%
    break;
    case 'mainnet':%>{ chainId: 1, url: "https://ethereum.publicnode.com" }<%
    break;
    case 'goerli':%>{ chainId: 5, url: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161" }<%
    break;
    case 'polygon':%>{ chainId: 137, url: "https://polygon-bor.publicnode.com" }<%
    break;
    case 'polygon-mumbai':%>{ chainId: 80001, url: "https://polygon-mumbai-bor.publicnode.com	" }<%
    break;
    case 'sepolia':%>{ chainId: 11155111, url: "https://ethereum-sepolia.blockpi.network/v1/rpc/public" }<%
    break;
    case 'localhost':%>{ }<%
    break;
    default: %>{}<%
  }
}
%>

const config: HardhatUserConfig = {
  solidity: {
    version: '<%= compiler %>',
    settings: {
      optimizer: {
        enabled: true,
        runs: 1e9,
      },
    },
  },
  etherscan: {
    apiKey: {
      mainnet: ETHERSCAN_API_KEY,
      goerli: ETHERSCAN_API_KEY,
    },
  },
  networks: {<% for(let i = 0; i < networks.length; i++) {%>
  <%= networks[i] %>: <% makeNetwork(networks[i]) %>,
  <%}%>
  }
};

export default config;