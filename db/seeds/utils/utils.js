const randomIntArrayInRange = (min, max, n = 1) =>
  console.log(
    Array.from(
      { length: n },
      () => Math.floor(Math.random() * (max - min + 1)) + min
    )
  );

randomIntArrayInRange(1, 1000, 100);
