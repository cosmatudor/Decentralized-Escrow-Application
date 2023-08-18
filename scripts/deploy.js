const ethers = require('ethers');
const { Contract } = require('hardhat/internal/hardhat-network/stack-traces/model');
require('dotenv').config();

async function main() {
    // required for a signer
    const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_URL);
    const privateKey = process.env.PRIVATE_KEY;

    // 1. now we can have a signer(wallet)
    const wallet = new ethers.Wallet(privateKey, provider);
    
    // 2. additionaly, we need the contract's artifacts for abi and bytecode
    const artifacts = await hre.artifacts.readArtifact("Escrow");

    // Now, with that 1.signer and 2.artifacts ->
    // we can get the Contract Factory and deploy the contract
    let Escrow = new ethers.ContractFactory(artifacts.abi, artifacts.bytecode, wallet);


    const arbiter = '0x29bF60733474180d5D82d4DA52Ad7ba290124666';
    const beneficiary = '0xd779D0c641ad602E09d732684746506855BB5aFE';
    let escrow = await Escrow.deploy(arbiter, beneficiary, { value: ethers.utils.parseEther('0.1') });

    console.log(`Contract deployed at: ${escrow.address}`);

    await escrow.deployed();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });