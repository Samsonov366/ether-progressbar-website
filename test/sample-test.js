const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ProgressbarDonation", function () {
  it("Should set new donation limit", async function () {
    const ProgressbarDonation = await ethers.getContractFactory("ProgressbarDonation");
    const progressbarDonation = await ProgressbarDonation.deploy("1000");
    await progressbarDonation.deployed();

    expect(await progressbarDonation.donationLimit()).to.equal(1000);

    const setDonationLimitTx = await progressbarDonation.setDonationLimit(2000);

    // wait until the transaction is mined
    await setDonationLimitTx.wait();

    expect(await progressbarDonation.donationLimit()).to.equal(2000);
  });
});
