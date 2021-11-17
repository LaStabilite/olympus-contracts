// @dev. This script will deploy this V1.1 of Stabilite. It will deploy the whole ecosystem except for the LP tokens and their bonds. 
// This should be enough of a test environment to learn about and test implementations with the Stabilite as of V1.1.
// Not that the every instance of the Treasury's function 'valueOf' has been changed to 'valueOfToken'... 
// This solidity function was conflicting w js object property name

const { ethers, network } = require("hardhat");

const SWAP_FACTORY = "0x62d5b84bE28a183aBB507E125B384122D2C25fAE"

async function main() {
    const [deployer] = await ethers.getSigners();
    const DAO = deployer
    const { chainId } = network.config

    console.log(`Deploying contracts to chainId ${chainId} with the account: ${deployer.address}`);

    // First block epoch occurs
    const firstEpochBlock = chainId === 44787 ? '8331372' : '9800000';

    // What epoch will be first epoch
    const firstEpochNumber = '1';

    // How many blocks are in each epoch. (1 hour testnet, 24 hours mainnet)
    const epochLengthInBlocks = chainId === 44787 ? (60 * 60 / 5).toString() : (60 * 60 * 24 / 5).toString();

    // Initial reward rate for epoch. (0.3%)
    const initialRewardRate = '3000';

    // Ethereum 0 address, used when toggling changes in treasury
    const zeroAddress = '0x0000000000000000000000000000000000000000';

    // stabilUSD bond BCV
    const stabilUSDBondBCV = '369';
    // STABIL-stabilUSD bond BCV
    const stabilStabilUSDBondBCV = '369';

    // Bond vesting length in blocks. 86400 ~ 5 days
    const bondVestingLength = '86400';

    // Min bond price
    const minBondPrice = '1'; // TODO

    // Max bond payout (50/100000 = 0.05% of STABIL total supply)
    const maxBondPayout = '50'

    // DAO fee for bond (100/10000 = 1%)
    const bondFee = '100';

    // Max debt bond can take on (1M in 9 decimals)
    const maxBondDebt = '1000000000000000';

    // Initial Bond debt
    const intialBondDebt = '0'

    // Deploy STABIL
    const STABIL = await ethers.getContractFactory('StabiliteERC20Token');
    const stabil = await STABIL.deploy();

    const StabilUSD = await ethers.getContractFactory('StabilUSD');
    let stabilUSD = await StabilUSD.attach("0x0a60c25Ef6021fC3B479914E6bcA7C03c18A97f1")
    // Deploy stabilUSD
    if (chainId === 44787) {
        stabilUSD = await StabilUSD.deploy(0);

        // Deploy 10,000,000 mock stabilUSD
        const initialMint = '10000000000000000000000000'; // 10M in 18 decimals
        await stabilUSD.mint(deployer.address, initialMint);
    }
    const swapFactory = await ethers.getContractAt("IUniswapV2Factory", SWAP_FACTORY)
    await (await swapFactory.createPair(stabil.address, stabilUSD.address)).wait(5) // 5 confirmations
    const stabilStabilUSDPair = await swapFactory.getPair(stabil.address, stabilUSD.address)

    // Deploy treasury
    //@dev changed function in treaury from 'valueOf' to 'valueOfToken'... solidity function was coflicting w js object property name
    const Treasury = await ethers.getContractFactory('StabiliteTreasury');
    const treasury = await Treasury.deploy(stabil.address, stabilUSD.address, stabilStabilUSDPair, 0);

    // Deploy bonding calc
    const StabiliteBondingCalculator = await ethers.getContractFactory('StabiliteBondingCalculator');
    const stabiliteBondingCalculator = await StabiliteBondingCalculator.deploy(stabil.address);

    // Deploy staking distributor
    const Distributor = await ethers.getContractFactory('Distributor');
    const distributor = await Distributor.deploy(treasury.address, stabil.address, epochLengthInBlocks, firstEpochBlock);

    // Deploy sSTABIL
    const SSTABIL = await ethers.getContractFactory('sStabilite');
    const sSTABIL = await SSTABIL.deploy();

    // Deploy Staking
    const Staking = await ethers.getContractFactory('StabiliteStaking');
    const staking = await Staking.deploy(stabil.address, sSTABIL.address, epochLengthInBlocks, firstEpochNumber, firstEpochBlock);

    // Deploy staking warmpup
    const StakingWarmpup = await ethers.getContractFactory('StakingWarmup');
    const stakingWarmup = await StakingWarmpup.deploy(staking.address, sSTABIL.address);

    // Deploy staking helper
    const StakingHelper = await ethers.getContractFactory('StakingHelper');
    const stakingHelper = await StakingHelper.deploy(staking.address, stabil.address);

    // Deploy stabilUSD bond
    const StabilUSDBond = await ethers.getContractFactory('StabiliteBondDepository');
    const stabilUSDBond = await StabilUSDBond.deploy(stabil.address, stabilUSD.address, treasury.address, DAO.address, zeroAddress);

    // Deploy STABIL-stabilUSD bond
    const StabilStabilUSDBond = await ethers.getContractFactory('StabiliteBondDepository');
    const stabilStabilUSDBond = await StabilStabilUSDBond.deploy(
        stabil.address,
        stabilStabilUSDPair,
        treasury.address,
        DAO.address,
        stabiliteBondingCalculator.address,
    );

    // queue and toggle DAI and Frax bond reserve depositor
    await treasury.queue('0', stabilUSD.address);
    await treasury.queue('0', stabilStabilUSDBond.address);
    await treasury.toggle('0', stabilUSD.address, zeroAddress);
    await treasury.toggle('0', stabilStabilUSDBond.address, zeroAddress);

    // Set bond terms
    await stabilUSDBond.initializeBondTerms(stabilUSDBondBCV, bondVestingLength, minBondPrice, maxBondPayout, bondFee, maxBondDebt, intialBondDebt);
    await stabilStabilUSDBond.initializeBondTerms(stabilStabilUSDBondBCV, bondVestingLength, minBondPrice, maxBondPayout, bondFee, maxBondDebt, intialBondDebt);

    // Set staking for bonds
    await stabilUSDBond.setStaking(staking.address, stakingHelper.address);
    await stabilStabilUSDBond.setStaking(staking.address, stakingHelper.address);

    // Initialize sSTABIL and set the index
    await sSTABIL.initialize(staking.address);

    // set distributor contract and warmup contract
    await staking.setContract('0', distributor.address);
    await staking.setContract('1', stakingWarmup.address);

    // Set treasury for STABIL token
    await stabil.setVault(treasury.address);

    // Add staking contract as distributor recipient
    await distributor.addRecipient(staking.address, initialRewardRate);

    // queue and toggle reward manager
    await treasury.queue('8', distributor.address);
    await treasury.toggle('8', distributor.address, zeroAddress);

    // queue and toggle deployer reserve depositor
    await treasury.queue('0', deployer.address);
    await treasury.toggle('0', deployer.address, zeroAddress);

    // queue and toggle liquidity depositor
    await treasury.queue('4', deployer.address,);
    await treasury.toggle('4', deployer.address, zeroAddress);

    const amount = '1000000000000000000'
    // Approve the treasury to spend stabilUSD
    await stabilUSD.approve(treasury.address, amount);

    // Approve stabilUSD bond to spend deployer's stabilUSD
    await stabilUSD.approve(stabilUSDBond.address, amount);

    // Approve staking and staking helper contact to spend deployer's STABIL
    await stabil.approve(staking.address, amount);
    await stabil.approve(stakingHelper.address, amount);

    // Deposit 1 stabilUSD to treasury, 0.5 STABIL gets minted to deployer and 0.5 are in treasury as excesss reserves
    await treasury.deposit(amount, stabilUSD.address, '500000000');

    // Stake STABIL through helper
    await stakingHelper.stake('500000000');

    console.log("STABIL: " + stabil.address);
    console.log("stabilUSD: " + stabilUSD.address);
    console.log("STABIL-stabilUSD LP: " + stabilStabilUSDPair);
    console.log("Treasury: " + treasury.address);
    console.log("Calc: " + stabiliteBondingCalculator.address);
    console.log("Staking: " + staking.address);
    console.log("sSTABIL: " + sSTABIL.address);
    console.log("Distributor " + distributor.address);
    console.log("Staking Wawrmup " + stakingWarmup.address);
    console.log("Staking Helper " + stakingHelper.address);
    console.log("stabilUSD Bond: " + stabilUSDBond.address);
    console.log("STABIL-stabilUSD LP Bond: " + stabilStabilUSDBond.address);
}

main()
    .then(() => process.exit())
    .catch(error => {
        console.error(error);
        process.exit(1);
    })