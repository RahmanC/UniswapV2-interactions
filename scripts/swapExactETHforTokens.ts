import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-network-helpers");

const main = async () => {
  const ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
  const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
  const TOKEN_HOLDER = "0xf584f8728b874a6a5c7a8d4d387c9aae9172d621";

  await helpers.impersonateAccount(TOKEN_HOLDER);
  const impersonatedSigner = await ethers.getSigner(TOKEN_HOLDER);

  const amountETH = ethers.parseUnits("180", 18);
  const path = [WETH, DAI];

  const DAI_CONTRACT = await ethers.getContractAt("IERC20", DAI);
  const ROUTER = await ethers.getContractAt(
    "IUniswapV2Router",
    ROUTER_ADDRESS,
    impersonatedSigner
  );

  const amounts = await ROUTER.getAmountsOut(amountETH, path);
  const amountOutMin = ethers.parseUnits("1980", 18);

  const ETH_BAL_BEFORE = await ethers.provider.getBalance(
    impersonatedSigner.address
  );
  const DAI_BAL_BEFORE = await DAI_CONTRACT.balanceOf(
    impersonatedSigner.address
  );
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

  console.log({
    ETH_BAL_BEFORE: ethers.formatUnits(ETH_BAL_BEFORE.toString(), 18),
  });

  console.log({
    DAI_BAL_BEFORE: ethers.formatUnits(DAI_BAL_BEFORE.toString(), 18),
  });

  await ROUTER.swapExactETHForTokens(
    amountOutMin,
    path,
    impersonatedSigner.address,
    deadline,
    { value: amountETH }
  );

  const ETH_BAL_AFTER = await ethers.provider.getBalance(
    impersonatedSigner.address
  );
  const DAI_BAL_AFTER = await DAI_CONTRACT.balanceOf(
    impersonatedSigner.address
  );

  console.log({
    ETH_BAL_AFTER: ethers.formatUnits(ETH_BAL_AFTER.toString(), 18),
  });

  console.log({
    DAI_BAL_AFTER: ethers.formatUnits(DAI_BAL_AFTER.toString(), 18),
  });
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
