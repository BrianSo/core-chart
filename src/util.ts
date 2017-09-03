
export interface DataValue<T>{
  [key: string]: T;
}

export type DataPoint = DataValue<number>;

export interface Range{
  min: number,
  max: number
}

export const viewPortMove = ({min, max}:Range, amount: number):Range => ({
  min: min + amount,
  max: max + amount
});
export const viewPortZoom = ({min, max}:Range, scale: number, mid: number):Range => {
  //const mid = (max + min)/2;
  return {
    min: (min - mid) * scale + mid,
    max: (max - mid) * scale + mid
  }
};
export const viewPortLength = ({min, max}:Range):number => {
  return max - min;
};
