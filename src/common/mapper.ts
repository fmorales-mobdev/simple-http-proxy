export abstract class Mapper<FromClass, ToClass> {
  abstract map(value: FromClass): ToClass;
  abstract reverseMap(value: ToClass): FromClass;

  mapArray(values: FromClass[]): ToClass[] {
    return values.map(value => this.map(value));
  }

  reverseMapArray(values: ToClass[]): FromClass[] {
    return values.map(value => this.reverseMap(value));
  }
}
