/**
 * Bühlmann ZH-L16C values for theoretical tissue compartments.
 *
 * For convenience, the term k is pre-computed. It stands for ln(2)/half-time.
 */

interface InertGasBuhlmannConstants {
  a: number
  b: number
  halfTime: number
}

interface BuhlmannCompartment {
  N2: InertGasBuhlmannConstants
  He: InertGasBuhlmannConstants
}

export const buhlmannCompartments: BuhlmannCompartment[] = [
  {
    N2: {
      halfTime: 5,
      a: 1.1696,
      b: 0.5578
    },
    He: {
      halfTime: 1.88,
      a: 1.6189,
      b: 0.4770
    }
  },
  {
    N2: {
      halfTime: 8,
      a: 1,
      b: 0.6514
    },
    He: {
      halfTime: 3.02,
      a: 1.383,
      b: 0.5747
    }
  },
  {
    N2: {
      halfTime: 12.5,
      a: 0.8618,
      b: 0.7222
    },
    He: {
      halfTime: 4.72,
      a: 1.1919,
      b: 0.6527
    }
  },
  {
    N2: {
      halfTime: 18.5,
      a: 0.7562,
      b: 0.7825
    },
    He: {
      halfTime: 6.99,
      a: 1.0458,
      b: 0.7223
    }
  },
  {
    N2: {
      halfTime: 27,
      a: 0.6491,
      b: 0.8126
    },
    He: {
      halfTime: 10.21,
      a: 0.922,
      b: 0.7582
    }
  },
  {
    N2: {
      halfTime: 38.3,
      a: 0.5316,
      b: 0.8434
    },
    He: {
      halfTime: 14.48,
      a: 0.8205,
      b: 0.7957
    }
  },
  {
    N2: {
      halfTime: 54.3,
      a: 0.4681,
      b: 0.8693
    },
    He: {
      halfTime: 20.53,
      a: 0.7305,
      b: 0.8279
    }
  },
  {
    N2: {
      halfTime: 77,
      a: 0.4301,
      b: 0.891
    },
    He: {
      halfTime: 29.11,
      a: 0.6502,
      b: 0.8553
    }
  },
  {
    N2: {
      halfTime: 109,
      a: 0.4049,
      b: 0.9092
    },
    He: {
      halfTime: 41.2,
      a: 0.595,
      b: 0.8757
    }
  },
  {
    N2: {
      halfTime: 146,
      a: 0.3719,
      b: 0.9222
    },
    He: {
      halfTime: 55.19,
      a: 0.5545,
      b: 0.8903
    }
  },
  {
    N2: {
      halfTime: 187,
      a: 0.3447,
      b: 0.9319
    },
    He: {
      halfTime: 70.69,
      a: 0.5333,
      b: 0.8997
    }
  },
  {
    N2: {
      halfTime: 239,
      a: 0.3176,
      b: 0.9403
    },
    He: {
      halfTime: 90.34,
      a: 0.5189,
      b: 0.9073
    }
  },
  {
    N2: {
      halfTime: 305,
      a: 0.2828,
      b: 0.9477
    },
    He: {
      halfTime: 115.29,
      a: 0.5181,
      b: 0.9122
    }
  },
  {
    N2: {
      halfTime: 390,
      a: 0.2716,
      b: 0.9544
    },
    He: {
      halfTime: 147.42,
      a: 0.5176,
      b: 0.9171
    }
  },
  {
    N2: {
      halfTime: 498,
      a: 0.2523,
      b: 0.9602
    },
    He: {
      halfTime: 188.24,
      a: 0.5172,
      b: 0.9217
    }
  },
  {
    N2: {
      halfTime: 635,
      a: 0.2327,
      b: 0.9653
    },
    He: {
      halfTime: 240.03,
      a: 0.5119,
      b: 0.9267
    }
  }
]
