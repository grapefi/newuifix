import {useCallback, useEffect, useState} from 'react';
import {BigNumber} from 'ethers';
import ERC20 from '../grape-finance/ERC20';
import useGrapeFinance from './useGrapeFinance';
import config from '../config';

const usePoolBalance = (token: ERC20, poolAddress: string) => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const grapeFinance = useGrapeFinance();
  const isUnlocked = grapeFinance?.isUnlocked;

  const fetchBalance = useCallback(async () => {
    setBalance(await token.balanceOf(poolAddress));
  }, [token, grapeFinance.myAccount]);

  useEffect(() => {
    if (isUnlocked) {
      fetchBalance().catch((err) => console.error(`Failed to fetch token balance: ${err.stack}`));
      let refreshInterval = setInterval(fetchBalance, config.refreshInterval);
      return () => clearInterval(refreshInterval);
    }
  }, [isUnlocked, token, fetchBalance, grapeFinance]);

  return balance;
};

export default usePoolBalance;
