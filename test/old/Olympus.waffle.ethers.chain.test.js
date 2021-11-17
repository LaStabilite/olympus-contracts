// // const { utils } = require("ethers").utils;
// const { expect } = require("chai");
// const { ethers, waffle } = require("hardhat");
// // const { waffle } = require("hardhat");
// // const { deployContract } = waffle;
// // const { expectRevert, time, BN } = require('@openzeppelin/test-helpers');
// // const { deployContract, loadFixture } = waffle;

// describe(
//   "StabiliteERC20Token",
//   function () {

//     // Wallets
//     let deployer;
//     let buyer1;
//     let buyer2;

//     let DAITokenContract;
//     let dai;

//     // Contracts
//     let StabiliteERC20TokenContract;
//     let oly;

//     beforeEach(
//       async function () {
//         [
//           deployer,
//           buyer1,
//           buyer2
//         ] = await ethers.getSigners();

//         console.log( "Test::StabiliteERC20Token::beforeEach:01 Loading DAI." );
//         DAITokenContract = await ethers.getContractFactory("DAI");
        
//         console.log( "Test::StabiliteERC20Token::beforeEach:02 Deploying DAI." );
//         dai = await DAITokenContract.connect( deployer ).deploy( 1 );
//         // await dai.deployed();
//         console.log( "Test::PreeStabiliteSale:beforeEach:03 DAI address is %s,", dai.address );

//         console.log( "Test::StabiliteERC20Token::beforeEach:04 Loading OLY." );
//         StabiliteERC20TokenContract = await ethers.getContractFactory("StabiliteERC20Token");
        
//         console.log( "Test::StabiliteERC20Token::beforeEach:02 Deploying OLY." );
//         oly = await StabiliteERC20TokenContract.connect( deployer ).deploy();
//         // await oly.deployed();

//       }
//     );

//     describe(
//       "Deployment",
//       function () {
//         it( 
//           "Success", 
//           async function() {
//             console.log( "Test::StabiliteERC20Token::Deployment::Success:01 token name." );
//             expect( await oly.name() ).to.equal("Stabilite");

//             console.log( "Test::StabiliteERC20Token::Deployment::Success:02 token symbol." );
//             expect( await oly.symbol() ).to.equal("OLY");

//             console.log( "Test::StabiliteERC20Token::Deployment::Success:03 token decimals." );
//             expect( await oly.decimals() ).to.equal(18);

//             console.log( "Test::StabiliteERC20Token::Deployment::Success:04 owner." );
//             expect( await oly.owner() ).to.equal(deployer.address);

//             console.log( "Test::StabiliteERC20Token::Deployment::Success:05 totalSupply." );
//             expect( await oly.totalSupply() ).to.equal( ethers.utils.parseUnits( String( 0 ), "ether" ) );

//             console.log( "Test::StabiliteERC20Token::Deployment::Success:06 owner balanceOf." );
//             expect( await oly.connect(deployer).balanceOf(deployer.address) ).to.equal( String( ethers.utils.parseUnits( String( 0 ), "ether" ) ) );

//             console.log( "Test::StabiliteERC20Token::Deployment::Success:07 buyer1 balanceOf." );
//             expect( await oly.connect(deployer).balanceOf(buyer1.address) ).to.equal( String( ethers.utils.parseUnits( String( 0 ), "ether" ) ) );

//             console.log( "Test::StabiliteERC20Token::Deployment::Success:08 buyer2 balanceOf." );
//             expect( await oly.connect(deployer).balanceOf(buyer2.address) ).to.equal( String( ethers.utils.parseUnits( String( 0 ), "ether" ) ) );
//           }
//         );
//       }
//     );

//     describe(
//       "Ownership",
//       function () {
//         it( 
//           "Minting", 
//           async function() {
//             console.log("Test::StabiliteERC20Token::Ownership::Minting:01 buyer1 can't mint.");
//             await expect( oly.connect(buyer1).mint( buyer1.address, ethers.utils.parseUnits( String( 1000000000 ), "ether" ) ) )
//               .to.be.revertedWith("Ownable: caller is not the owner");
            
//             console.log("Test::StabiliteERC20Token::Ownership::Minting:02 buyer1 balanceOf.");
//             expect( await oly.connect(deployer).balanceOf(buyer1.address) )
//               .to.equal( String( ethers.utils.parseUnits( String( 0 ), "ether" ) ) );

//             console.log("Test::StabiliteERC20Token::Ownership::Minting:03 only owner can mint.");
//             await expect( () => oly.connect(deployer).mint( deployer.address, ethers.utils.parseUnits( String( 1000000000 ), "ether" ) ) )
//               .to.changeTokenBalance( oly, deployer, ethers.utils.parseUnits( String( 1000000000 ), "ether" ) );

//             console.log("Test::StabiliteERC20Token::Ownership::Minting:04 totalSupply.");
//             expect( await oly.totalSupply() )
//               .to.equal( ethers.utils.parseUnits( String( 1000000000 ), "ether" ) );
//           }
//         );
//       }
//     );

//     // describe(
//     //   "PreStabiliteTokenOwnership",
//     //   function () {

//     //     it( 
//     //       "Post-Deployment Transfer", 
//     //       async function() {

//     //         // console.log("Test::StabiliteERC20TokenDeployment::DeploymentSuccess: owner is approvedSeller.");
//     //         // expect( await oly.isApprovedSeller(deployer.address) ).to.equal( true );
            
//     //         // console.log("Test::StabiliteERC20TokenDeployment::DeploymentSuccess: oly is approvedSeller.");
//     //         // expect( await oly.isApprovedSeller(oly.address) ).to.equal( true );
            
//     //         // console.log("Test::StabiliteERC20TokenDeployment::DeploymentSuccess: address(0) is approvedSeller.");
//     //         // expect( await oly.isApprovedSeller( ethers.constants.AddressZero ) ).to.equal( true );
            
//     //         // console.log("Test::StabiliteERC20TokenDeployment::DeploymentSuccess: address(0) is approvedSeller.");
//     //         // expect( await oly.isApprovedSeller( buyer1.address ) ).to.equal( false );
            
//     //         // console.log("Test::StabiliteERC20TokenDeployment::DeploymentSuccess: address(0) is approvedSeller.");
//     //         // expect( await oly.isApprovedSeller( buyer2.address ) ).to.equal( false );

//     //         // console.log("Test::StabiliteERC20TokenDeployment::DeploymentSuccess: totalSupply.");
//     //         // expect( await oly.totalSupply() ).to.equal( ethers.utils.parseUnits( String( 1000000000 ), "ether" ) );

//     //         // console.log("Test::StabiliteERC20TokenDeployment::DeploymentSuccess: owner balanceOf.");
//     //         // expect( await oly.connect(deployer).balanceOf(deployer.address) ).to.equal( String( ethers.utils.parseUnits( String( 1000000000 ), "ether" ) ) );

//     //         // console.log("Test::StabiliteERC20TokenDeployment::DeploymentSuccess: buyer1 balanceOf.");
//     //         // expect( await oly.connect(deployer).balanceOf(buyer1.address) ).to.equal( String( ethers.utils.parseUnits( String( 0 ), "ether" ) ) );

//     //         // console.log("Test::StabiliteERC20TokenDeployment::DeploymentSuccess: buyer2 balanceOf.");
//     //         // expect( await oly.connect(deployer).balanceOf(buyer2.address) ).to.equal( String( ethers.utils.parseUnits( String( 0 ), "ether" ) ) );
            
//     //         // console.log("Test::StabiliteERC20TokenDeployment::DeploymentSuccess: Confirm seller approval required.");
//     //         // expect( await oly.requireSellerApproval() ).to.equal( true );

//     //         // console.log("Test::PreStabiliteTokenOwnership::Minting: Confirming buyer1 can't transfer to buyer1 because they have no balance.");
//     //         // await expect( oly.connect(buyer1).transfer( buyer1.address, ethers.utils.parseUnits( String( 250000000 ), "ether" ) ) )
//     //         //   .to.be.revertedWith( "Account not approved to transfer pOLY." );

//     //         // console.log("Test::PreStabiliteTokenOwnershi::Minting: Confirming buyer1 can't transfer to buyer2 because they have no balance.");
//     //         // await expect( oly.connect(buyer1).transfer( buyer2.address, ethers.utils.parseUnits( String( 250000000 ), "ether" ) ) )
//     //         //   .to.be.revertedWith( "Account not approved to transfer pOLY." );

//     //         // console.log("Test::PreStabiliteTokenOwnership::Minting: Confirming buyer2 can't transfer to buyer1 because they have no balance.");
//     //         // await expect( oly.connect(buyer2).transfer( buyer1.address, ethers.utils.parseUnits( String( 250000000 ), "ether" ) ) )
//     //         //   .to.be.revertedWith( "Account not approved to transfer pOLY." );

//     //         // console.log("Test::PreStabiliteTokenOwnership::Minting: Confirming buyer2 can't transfer to buyer2 because they have no balance.");
//     //         // await expect( oly.connect(buyer2).transfer( buyer2.address, ethers.utils.parseUnits( String( 250000000 ), "ether" ) ) )
//     //         //   .to.be.revertedWith( "Account not approved to transfer pOLY." );

//     //         // console.log("Test::PreStabiliteTokenOwnership::Minting: Confirming deployer can transfer to buyer1.");
//     //         // await expect( () => oly.connect(deployer).transfer( buyer1.address, ethers.utils.parseUnits( String( 250000000 ), "ether" ) ) )
//     //         //   .to.changeTokenBalance( oly, buyer1, ethers.utils.parseUnits( String( 250000000 ), "ether" ) );
            
//     //         // console.log("Test::PreStabiliteTokenOwnership::Minting: Confirming deployer can transfer to buyer1.");
//     //         // await expect( () => oly.connect(deployer).transfer( buyer2.address, ethers.utils.parseUnits( String( 250000000 ), "ether" ) ) )
//     //         //   .to.changeTokenBalance( oly, buyer2, ethers.utils.parseUnits( String( 250000000 ), "ether" ) );

//     //         // console.log("Test::StabiliteERC20TokenDeployment::DeploymentSuccess: deployer balanceOf.");
//     //         // expect( await oly.connect(deployer).balanceOf(deployer.address) )
//     //         //   .to.equal( String( ethers.utils.parseUnits( String( 500000000 ), "ether" ) ) );
              
//     //         // console.log("Test::StabiliteERC20TokenDeployment::DeploymentSuccess: buyer1 balanceOf.");
//     //         // expect( await oly.connect(buyer1).balanceOf(buyer1.address) )
//     //         //   .to.equal( String( ethers.utils.parseUnits( String( 250000000 ), "ether" ) ) );

//     //         // console.log("Test::StabiliteERC20TokenDeployment::DeploymentSuccess: buyer2 balanceOf.");
//     //         // expect( await oly.connect(buyer2).balanceOf(buyer2.address) )
//     //         //   .to.equal( String( ethers.utils.parseUnits( String( 250000000 ), "ether" ) ) );

//     //       }
//     //     );

//     //     it( 
//     //       "Approved Seller Transfer", 
//     //       async function() {

//     //         // console.log("Test::StabiliteERC20TokenDeployment::DeploymentSuccess: owner is approvedSeller.");
//     //         // expect( await oly.isApprovedSeller(deployer.address) ).to.equal( true );
            
//     //         // console.log("Test::StabiliteERC20TokenDeployment::DeploymentSuccess: oly is approvedSeller.");
//     //         // expect( await oly.isApprovedSeller(oly.address) ).to.equal( true );
            
//     //         // console.log("Test::StabiliteERC20TokenDeployment::DeploymentSuccess: address(0) is approvedSeller.");
//     //         // expect( await oly.isApprovedSeller( ethers.constants.AddressZero ) ).to.equal( true );
            
//     //         // console.log("Test::StabiliteERC20TokenDeployment::DeploymentSuccess: address(0) is approvedSeller.");
//     //         // expect( await oly.isApprovedSeller( buyer1.address ) ).to.equal( false );
            
//     //         // console.log("Test::StabiliteERC20TokenDeployment::DeploymentSuccess: address(0) is approvedSeller.");
//     //         // expect( await oly.isApprovedSeller( buyer2.address ) ).to.equal( false );

//     //         // console.log("Test::StabiliteERC20TokenDeployment::DeploymentSuccess: totalSupply.");
//     //         // expect( await oly.totalSupply() ).to.equal( ethers.utils.parseUnits( String( 1000000000 ), "ether" ) );

//     //         // console.log("Test::StabiliteERC20TokenDeployment::DeploymentSuccess: owner balanceOf.");
//     //         // expect( await oly.connect(deployer).balanceOf(deployer.address) ).to.equal( String( ethers.utils.parseUnits( String( 1000000000 ), "ether" ) ) );

//     //         // console.log("Test::StabiliteERC20TokenDeployment::DeploymentSuccess: buyer1 balanceOf.");
//     //         // expect( await oly.connect(deployer).balanceOf(buyer1.address) ).to.equal( String( ethers.utils.parseUnits( String( 0 ), "ether" ) ) );

//     //         // console.log("Test::StabiliteERC20TokenDeployment::DeploymentSuccess: buyer2 balanceOf.");
//     //         // expect( await oly.connect(deployer).balanceOf(buyer2.address) ).to.equal( String( ethers.utils.parseUnits( String( 0 ), "ether" ) ) );

//     //         // console.log("Test::StabiliteERC20TokenDeployment::DeploymentSuccess: Approve buyer1 to sell.");
//     //         // expect( await oly.connect(deployer).addApprovedSeller(buyer1.address) );

//     //         // console.log("Test::PreStabiliteTokenOwnership::Minting: Confirming buyer2 can't transfer to buyer1 because they have no balance.");
//     //         // await expect( oly.connect(buyer2).transfer( buyer1.address, ethers.utils.parseUnits( String( 250000000 ), "ether" ) ) )
//     //         //   .to.be.revertedWith( "Account not approved to transfer pOLY." );

//     //         // console.log("Test::PreStabiliteTokenOwnership::Minting: Confirming deployer can transfer to buyer1.");
//     //         // await expect( () => oly.connect(deployer).transfer( buyer1.address, ethers.utils.parseUnits( String( 250000000 ), "ether" ) ) )
//     //         //   .to.changeTokenBalance( oly, buyer1, ethers.utils.parseUnits( String( 250000000 ), "ether" ) );

//     //         //   console.log("Test::PreStabiliteTokenOwnership::Minting: Confirming deployer can transfer to buyer1.");
//     //         // await expect( () => oly.connect(buyer1).transfer( buyer2.address, ethers.utils.parseUnits( String( 250000000 ), "ether" ) ) )
//     //         //   .to.changeTokenBalance( oly, buyer2, ethers.utils.parseUnits( String( 250000000 ), "ether" ) );
//     //       }
//     //     );

//     //     it( 
//     //       "Open Transfer", 
//     //       async function() {

//     //         // console.log("Test::StabiliteERC20TokenDeployment::DeploymentSuccess: owner is approvedSeller.");
//     //         // expect( await oly.isApprovedSeller(deployer.address) ).to.equal( true );
            
//     //         // console.log("Test::StabiliteERC20TokenDeployment::DeploymentSuccess: oly is approvedSeller.");
//     //         // expect( await oly.isApprovedSeller(oly.address) ).to.equal( true );
            
//     //         // console.log("Test::StabiliteERC20TokenDeployment::DeploymentSuccess: address(0) is approvedSeller.");
//     //         // expect( await oly.isApprovedSeller( ethers.constants.AddressZero ) ).to.equal( true );
            
//     //         // console.log("Test::StabiliteERC20TokenDeployment::DeploymentSuccess: address(0) is approvedSeller.");
//     //         // expect( await oly.isApprovedSeller( buyer1.address ) ).to.equal( false );
            
//     //         // console.log("Test::StabiliteERC20TokenDeployment::DeploymentSuccess: address(0) is approvedSeller.");
//     //         // expect( await oly.isApprovedSeller( buyer2.address ) ).to.equal( false );

//     //         // console.log("Test::StabiliteERC20TokenDeployment::DeploymentSuccess: totalSupply.");
//     //         // expect( await oly.totalSupply() ).to.equal( ethers.utils.parseUnits( String( 1000000000 ), "ether" ) );

//     //         // console.log("Test::StabiliteERC20TokenDeployment::DeploymentSuccess: owner balanceOf.");
//     //         // expect( await oly.connect(deployer).balanceOf(deployer.address) ).to.equal( String( ethers.utils.parseUnits( String( 1000000000 ), "ether" ) ) );

//     //         // console.log("Test::StabiliteERC20TokenDeployment::DeploymentSuccess: buyer1 balanceOf.");
//     //         // expect( await oly.connect(deployer).balanceOf(buyer1.address) ).to.equal( String( ethers.utils.parseUnits( String( 0 ), "ether" ) ) );

//     //         // console.log("Test::StabiliteERC20TokenDeployment::DeploymentSuccess: buyer2 balanceOf.");
//     //         // expect( await oly.connect(deployer).balanceOf(buyer2.address) ).to.equal( String( ethers.utils.parseUnits( String( 0 ), "ether" ) ) );
            
//     //         // console.log("Test::StabiliteERC20TokenDeployment::DeploymentSuccess: Confirm seller approval required.");
//     //         // expect( await oly.requireSellerApproval() ).to.equal( true );

//     //         // console.log("Test::PreStabiliteTokenOwnership::Minting: Confirming buyer1 can't transfer to buyer1 because they have no balance.");
//     //         // await expect( oly.connect(buyer1).transfer( buyer1.address, ethers.utils.parseUnits( String( 250000000 ), "ether" ) ) )
//     //         //   .to.be.revertedWith( "Account not approved to transfer pOLY." );

//     //         // console.log("Test::PreStabiliteTokenOwnershi::Minting: Confirming buyer1 can't transfer to buyer2 because they have no balance.");
//     //         // await expect( oly.connect(buyer1).transfer( buyer2.address, ethers.utils.parseUnits( String( 250000000 ), "ether" ) ) )
//     //         //   .to.be.revertedWith( "Account not approved to transfer pOLY." );

//     //         // console.log("Test::PreStabiliteTokenOwnership::Minting: Confirming buyer2 can't transfer to buyer1 because they have no balance.");
//     //         // await expect( oly.connect(buyer2).transfer( buyer1.address, ethers.utils.parseUnits( String( 250000000 ), "ether" ) ) )
//     //         //   .to.be.revertedWith( "Account not approved to transfer pOLY." );

//     //         // console.log("Test::PreStabiliteTokenOwnership::Minting: Confirming buyer2 can't transfer to buyer2 because they have no balance.");
//     //         // await expect( oly.connect(buyer2).transfer( buyer2.address, ethers.utils.parseUnits( String( 250000000 ), "ether" ) ) )
//     //         //   .to.be.revertedWith( "Account not approved to transfer pOLY." );

//     //         // console.log("Test::PreStabiliteTokenOwnership::Minting: Confirming deployer can transfer to buyer1.");
//     //         // await expect( () => oly.connect(deployer).transfer( buyer1.address, ethers.utils.parseUnits( String( 250000000 ), "ether" ) ) )
//     //         //   .to.changeTokenBalance( oly, buyer1, ethers.utils.parseUnits( String( 250000000 ), "ether" ) );
            
//     //         // console.log("Test::PreStabiliteTokenOwnership::Minting: Confirming deployer can transfer to buyer1.");
//     //         // await expect( () => oly.connect(deployer).transfer( buyer2.address, ethers.utils.parseUnits( String( 250000000 ), "ether" ) ) )
//     //         //   .to.changeTokenBalance( oly, buyer2, ethers.utils.parseUnits( String( 250000000 ), "ether" ) );

//     //         // console.log("Test::StabiliteERC20TokenDeployment::DeploymentSuccess: deployer balanceOf.");
//     //         // expect( await oly.connect(deployer).balanceOf(deployer.address) )
//     //         //   .to.equal( String( ethers.utils.parseUnits( String( 500000000 ), "ether" ) ) );
              
//     //         // console.log("Test::StabiliteERC20TokenDeployment::DeploymentSuccess: buyer1 balanceOf.");
//     //         // expect( await oly.connect(buyer1).balanceOf(buyer1.address) )
//     //         //   .to.equal( String( ethers.utils.parseUnits( String( 250000000 ), "ether" ) ) );

//     //         // console.log("Test::StabiliteERC20TokenDeployment::DeploymentSuccess: buyer2 balanceOf.");
//     //         // expect( await oly.connect(buyer2).balanceOf(buyer2.address) )
//     //         //   .to.equal( String( ethers.utils.parseUnits( String( 250000000 ), "ether" ) ) );

//     //         // console.log("Test::PreStabiliteTokenOwnership::Minting: Enable open trading of pOLY.");
//     //         // await oly.connect( deployer ).allowOpenTrading();

            
//     //         // console.log("Test::StabiliteERC20TokenDeployment::DeploymentSuccess: Confirm seller approval required.");
//     //         // expect( await oly.requireSellerApproval() ).to.equal( false );

//     //         // console.log("Test::PreStabiliteTokenOwnership::Minting: only owner can mint.");

//     //         // expect( await oly.connect(buyer1).transfer( buyer2.address, ethers.utils.parseUnits( String( 250000000 ), "ether" ) ) );
            
//     //         // console.log("Test::StabiliteERC20TokenDeployment::DeploymentSuccess: buyer1 balanceOf.");
//     //         // expect( await oly.connect(deployer).balanceOf(buyer1.address) ).to.equal( String( ethers.utils.parseUnits( String( 0 ), "ether" ) ) );

//     //         // console.log("Test::StabiliteERC20TokenDeployment::DeploymentSuccess: buyer2 balanceOf.");
//     //         // expect( await oly.connect(deployer).balanceOf(buyer2.address) ).to.equal( String( ethers.utils.parseUnits( String( 500000000 ), "ether" ) ) );
//     //       }
//     //     );
//     //   }
//     // );
//   }
// );