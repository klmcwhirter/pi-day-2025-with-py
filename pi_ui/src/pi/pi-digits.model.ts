export class HistogramItemValues {
  constructor(
    public index: number,
    public value: number,
    public color: string,
    public shadow: string,
  ) { }
}

export class HistogramValues {
  _cachedValues: number[];

  constructor(
    public algo: string,
    public num_digits: number,
    public items: HistogramItemValues[],
  ) {
  }

  get _values(): number[] {
    if (!this._cachedValues) {
      this._cachedValues = this.items.map((i) => i.value);
    }
    return this._cachedValues;
  }

  get maxValue(): number {
    return Math.max(...this._values);
  }

  get minValue(): number {
    return Math.min(...this._values);
  }

  percent(value: number): string {
    return `${(this.ratio(value) * 100.0).toFixed(2)}%`;
  }

  ratio(value: number) {
    return value / this.num_digits;
  }
}
