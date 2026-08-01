export async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function doNothing(..._args: unknown[]) {
  return _args;
}

export class DummyMoney {
  static amountToStringComma = (amount: number) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  static getRandomAmount = (range = 1000, offset = 1000) => {
    return Math.floor(Math.random() * range) + offset;
  };

  static getRandomMoney(range = 1000, offset = 1000) {
    return (
      '$' +
      DummyMoney.amountToStringComma(DummyMoney.getRandomAmount(range, offset))
    );
  }
}
