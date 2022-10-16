/**
 * Bühlmann ZH-L16C values for theoretical tissue compartments.
 *
 * For convenience, the term k is pre-computed. It stands for ln(2)/half-time.
 */
const compartments = [
  {
    name: '1',
    nitrogen: {
      half_time: 4,
      k: 0.17328679513998632,
      a: 1.2599,
      b: 0.524
    },
    helium: {
      half_time: 1.51,
      k: 0.45903786792049356,
      a: 1.7424,
      b: 0.4245
    }
  },
  {
    name: '1b',
    nitrogen: {
      half_time: 5,
      k: 0.13862943611198905,
      a: 1.1696,
      b: 0.5578
    },
    helium: {
      half_time: 1.88,
      k: 0.36869530880848156,
      a: 1.6189,
      b: 0.477
    }
  },
  {
    name: '2',
    nitrogen: {
      half_time: 8,
      k: 0.08664339756999316,
      a: 1,
      b: 0.6514
    },
    helium: {
      half_time: 3.02,
      k: 0.22951893396024678,
      a: 1.383,
      b: 0.5747
    }
  },
  {
    name: '3',
    nitrogen: {
      half_time: 12.5,
      k: 0.055451774444795626,
      a: 0.8618,
      b: 0.7222
    },
    helium: {
      half_time: 4.72,
      k: 0.1468532162203274,
      a: 1.1919,
      b: 0.6527
    }
  },
  {
    name: '4',
    nitrogen: {
      half_time: 18.5,
      k: 0.037467415165402446,
      a: 0.7562,
      b: 0.7825
    },
    helium: {
      half_time: 6.99,
      k: 0.09916268677538559,
      a: 1.0458,
      b: 0.7223
    }
  },
  {
    name: '5',
    nitrogen: {
      half_time: 27,
      k: 0.025672117798516494,
      a: 0.6491,
      b: 0.8126
    },
    helium: {
      half_time: 10.21,
      k: 0.06788904804700736,
      a: 0.922,
      b: 0.7582
    }
  },
  {
    name: '6',
    nitrogen: {
      half_time: 38.3,
      k: 0.01809783761253121,
      a: 0.5316,
      b: 0.8434
    },
    helium: {
      half_time: 14.48,
      k: 0.04786928042541058,
      a: 0.8205,
      b: 0.7957
    }
  },
  {
    name: '7',
    nitrogen: {
      half_time: 54.3,
      k: 0.012765141446776157,
      a: 0.4681,
      b: 0.8693
    },
    helium: {
      half_time: 20.53,
      k: 0.03376264883389894,
      a: 0.7305,
      b: 0.8279
    }
  },
  {
    name: '8',
    nitrogen: {
      half_time: 77,
      k: 0.009001911435843446,
      a: 0.4301,
      b: 0.891
    },
    helium: {
      half_time: 29.11,
      k: 0.023811308160767614,
      a: 0.6502,
      b: 0.8553
    }
  },
  {
    name: '9',
    nitrogen: {
      half_time: 109,
      k: 0.006359148445504085,
      a: 0.4049,
      b: 0.9092
    },
    helium: {
      half_time: 41.2,
      k: 0.016823960693202553,
      a: 0.595,
      b: 0.8757
    }
  },
  {
    name: '10',
    nitrogen: {
      half_time: 146,
      k: 0.004747583428492776,
      a: 0.3719,
      b: 0.9222
    },
    helium: {
      half_time: 55.19,
      k: 0.012559289374160995,
      a: 0.5545,
      b: 0.8903
    }
  },
  {
    name: '11',
    nitrogen: {
      half_time: 187,
      k: 0.0037066694147590657,
      a: 0.3447,
      b: 0.9319
    },
    helium: {
      half_time: 70.69,
      k: 0.009805448869146206,
      a: 0.5333,
      b: 0.8997
    }
  },
  {
    name: '12',
    nitrogen: {
      half_time: 239,
      k: 0.002900197408200608,
      a: 0.3176,
      b: 0.9403
    },
    helium: {
      half_time: 90.34,
      k: 0.007672649773743029,
      a: 0.5189,
      b: 0.9073
    }
  },
  {
    name: '13',
    nitrogen: {
      half_time: 305,
      k: 0.002272613706753919,
      a: 0.2828,
      b: 0.9477
    },
    helium: {
      half_time: 115.29,
      k: 0.006012205573423066,
      a: 0.5181,
      b: 0.9122
    }
  },
  {
    name: '14',
    nitrogen: {
      half_time: 390,
      k: 0.0017773004629742187,
      a: 0.2716,
      b: 0.9544
    },
    helium: {
      half_time: 147.42,
      k: 0.0047018530766513725,
      a: 0.5176,
      b: 0.9171
    }
  },
  {
    name: '15',
    nitrogen: {
      half_time: 498,
      k: 0.0013918618083533039,
      a: 0.2523,
      b: 0.9602
    },
    helium: {
      half_time: 188.24,
      k: 0.0036822523404161987,
      a: 0.5172,
      b: 0.9217
    }
  },
  {
    name: '16',
    nitrogen: {
      half_time: 635,
      k: 0.0010915703630865281,
      a: 0.2327,
      b: 0.9653
    },
    helium: {
      half_time: 240.03,
      k: 0.002887752283297693,
      a: 0.5119,
      b: 0.9267
    }
  }
]

export default compartments
