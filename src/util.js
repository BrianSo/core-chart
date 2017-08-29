export const viewPortMove = ({min, max}, amount) => ({
  min: min + amount,
  max: max + amount
});
export const viewPortZoom = ({min, max}, scale, mid) => {
  //const mid = (max + min)/2;
  return {
    min: (min - mid) * scale + mid,
    max: (max - mid) * scale + mid
  }
};
export const viewPortLength = ({min, max}) => {
  return max - min;
};
