import { Fixed18 , debitToStableCoin, debitToUSD, USDToDebit, stableCoinToDebit, collateralToUSD, USDToCollateral, calcCollateralRatio, calcStableFeeAPR, calcRequiredCollateral, calcLiquidationPrice, calcCanGenerate, LoanHelper} from '@acala-network/app-util'

describe('calculate loan properties', () => {
  // stableCoin = debit * debitExchangeRate = 100 * 1/10 = 10
  const debitExchangeRate = Fixed18.fromRational(1, 10);
  const debits = Fixed18.fromNatural(100);
  const stableCoin = Fixed18.fromNatural(10);
  const stableCoinPrice = Fixed18.fromNatural(1);
  const debitAmount = Fixed18.fromNatural(10);

  test('debitToStableCoin should work', () => {
    expect(debitToStableCoin(debits, debitExchangeRate)).toEqual(stableCoin);
  });

  test('stableCoinToDebit should work', () => {
    expect(stableCoinToDebit(stableCoin, debitExchangeRate)).toEqual(debits);
    expect(stableCoinToDebit(stableCoin, Fixed18.ZERO)).toEqual(Fixed18.ZERO);
  });

  test('debitToUSD should work', () => {
    expect(debitToUSD(debits, debitExchangeRate, stableCoinPrice)).toEqual(debitAmount);
    expect(debitToUSD(debits, Fixed18.ZERO, stableCoinPrice)).toEqual(Fixed18.ZERO);
    expect(debitToUSD(debits, debitExchangeRate, Fixed18.ZERO)).toEqual(Fixed18.ZERO);
  });

  test('USDToDebit should work', () => {
    expect(USDToDebit(debitAmount, debitExchangeRate, stableCoinPrice)).toEqual(debits);
    expect(USDToDebit(debitAmount, Fixed18.ZERO, stableCoinPrice)).toEqual(Fixed18.ZERO);
    expect(USDToDebit(debitAmount, debitExchangeRate, Fixed18.ZERO)).toEqual(Fixed18.ZERO);
  });

  // debitAmount = collateral * collateralPrice = 100 * 100 = 10000
  const collaterals = Fixed18.fromNatural(1);
  const collateralPrice = Fixed18.fromNatural(100);
  const collateralAmount = Fixed18.fromNatural(100);
  test('collaterToUSD should work', () => {
    expect(collateralToUSD(collaterals, collateralPrice)).toEqual(collateralAmount);
  });

  test('USDToCollateral should work', () => {
    expect(USDToCollateral(collateralAmount, collateralPrice)).toEqual(collaterals);
  });

  // collateralRatio = collateralAmount / debitAmount = 100 / 10 = 10
  const collateralRatio = Fixed18.fromNatural(10);
  test('calcCollateralRatio should work', () => {
    expect(calcCollateralRatio(collateralAmount, debitAmount)).toEqual(collateralRatio);
    expect(calcCollateralRatio(collateralAmount, Fixed18.ZERO)).toEqual(Fixed18.fromNatural(Infinity));
  });

  // stableFee APR approximate 5%
  const stableFee = Fixed18.fromRational(618850393, 100000000000000000);
  const globalStableFee = Fixed18.fromParts(0);
  const expectedBlockTime = 4000;
  test('calcStableFeeAPR should work', () => {
    expect(calcStableFeeAPR(stableFee, expectedBlockTime).toNumber(2, 3)).toEqual(0.05);
  });

  const requiredCollateralRatio = Fixed18.fromRational(150, 100);
  // requiredCollatearl = debitAmount * requiredCollateral / collatearlPrice = 10 * 1.5 / 100 = 0.15
  const requiredCollateral = Fixed18.fromNatural(0.15);
  test('calcRequiredCollateral should work', () => {
    expect(calcRequiredCollateral(debitAmount, requiredCollateralRatio, collateralPrice)).toEqual(
      requiredCollateral
    );
  });

  test('calcRequiredCollateral should not return negative number', () => {
    expect(
      calcRequiredCollateral(Fixed18.fromNatural(-10), Fixed18.fromNatural(-10), Fixed18.fromNatural(-10))
    ).toEqual(Fixed18.ZERO);
    expect(calcRequiredCollateral(Fixed18.ZERO, requiredCollateralRatio, collateralPrice)).toEqual(Fixed18.ZERO);
    expect(calcRequiredCollateral(Fixed18.fromNatural(NaN), requiredCollateralRatio, collateralPrice)).toEqual(
      Fixed18.ZERO
    );
    expect(
      calcRequiredCollateral(Fixed18.fromNatural(Infinity), requiredCollateralRatio, collateralPrice)
    ).toEqual(Fixed18.ZERO);
    expect(calcRequiredCollateral(debitAmount, Fixed18.ZERO, collateralPrice)).toEqual(Fixed18.ZERO);
    expect(calcRequiredCollateral(debitAmount, Fixed18.fromNatural(NaN), collateralPrice)).toEqual(Fixed18.ZERO);
    expect(calcRequiredCollateral(debitAmount, Fixed18.fromNatural(Infinity), collateralPrice)).toEqual(
      Fixed18.ZERO
    );
    expect(calcRequiredCollateral(debitAmount, requiredCollateralRatio, Fixed18.ZERO)).toEqual(Fixed18.ZERO);
    expect(calcRequiredCollateral(debitAmount, requiredCollateralRatio, Fixed18.fromNatural(NaN))).toEqual(
      Fixed18.ZERO
    );
    expect(calcRequiredCollateral(debitAmount, requiredCollateralRatio, Fixed18.fromNatural(Infinity))).toEqual(
      Fixed18.ZERO
    );
  });

  const liquidationRatio = Fixed18.fromRational(120, 100);
  // liquidationPrice = debitAmount * liquidationRatio / collateral = 10 * 1.2 / 1 = 12
  const liquidationPrice = Fixed18.fromNatural(12);
  test('calcLiquidationPrice should work', () => {
    expect(calcLiquidationPrice(collaterals, debitAmount, liquidationRatio)).toEqual(liquidationPrice);
  });

  test('calcLiquidationPrice should return NaN if passing wrong parameters', () => {
    expect(calcLiquidationPrice(Fixed18.ZERO, debitAmount, liquidationRatio)).toEqual(Fixed18.fromNatural(NaN));
    expect(calcLiquidationPrice(collaterals, Fixed18.fromNatural(-10), liquidationRatio)).toEqual(
      Fixed18.fromNatural(NaN)
    );
    expect(calcLiquidationPrice(collaterals, Fixed18.ZERO, liquidationRatio)).toEqual(Fixed18.fromNatural(NaN));
    expect(calcLiquidationPrice(collaterals, debitAmount, Fixed18.ZERO)).toEqual(Fixed18.fromNatural(NaN));
  });

  // canGenerate = (collateralAmount / requiredCollatearl - debitAmount) / stableCoinPrice = (100 / 1.5 - 10) / 1 ≈ 56.66;
  const canGenerate = 56.66;
  test('calcCanGenerate should work', () => {
    expect(
      calcCanGenerate(collateralAmount, debitAmount, requiredCollateralRatio, stableCoinPrice).toNumber(2, 3)
    ).toEqual(canGenerate);
  });

  test('calcCanGenerate should return 0 if passing wrong parameters', () => {
    expect(
      calcCanGenerate(Fixed18.ZERO, debitAmount, requiredCollateralRatio, stableCoinPrice).toNumber(2, 3)
    ).toEqual(0);
    expect(calcCanGenerate(collateralAmount, debitAmount, Fixed18.ZERO, stableCoinPrice).toNumber(2, 3)).toEqual(
      0
    );
    expect(
      calcCanGenerate(collateralAmount, debitAmount, requiredCollateralRatio, Fixed18.ZERO).toNumber(2, 3)
    ).toEqual(0);
    expect(
      calcCanGenerate(
          collateralAmount,
          debitAmount,
          requiredCollateralRatio,
          stableCoinPrice,
          Fixed18.fromNatural(100)
        )
        .toNumber(2, 3)
    ).toEqual(0);
  });

  test('Loan class should work', () => {
    const userLoan = new LoanHelper({
      debits,
      collaterals,
      requiredCollateralRatio,
      liquidationRatio,
      debitExchangeRate,
      stableFee,
      globalStableFee,
      expectedBlockTime,
      collateralPrice,
      stableCoinPrice
    });
    expect(userLoan.debitAmount).toEqual(debitAmount);
    expect(userLoan.collateralAmount).toEqual(collateralAmount);
    expect(userLoan.stableFeeAPR.toNumber(2, 3)).toEqual(0.05);
    expect(userLoan.collateralRatio).toEqual(collateralRatio);
    expect(userLoan.requiredCollateral).toEqual(requiredCollateral);
    expect(userLoan.liquidationPrice).toEqual(liquidationPrice);
    expect(userLoan.canGenerate.toNumber(2, 3)).toEqual(canGenerate);
    expect(userLoan.canPayBack).toEqual(debitAmount);
  });
});