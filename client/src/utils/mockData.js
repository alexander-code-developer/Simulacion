export const INITIAL_MOCK_SIMULATION = {
  _id: 'avance-2-oficial',
  nombre: 'Calibración Oficial Avance 2 (600 réplicas)',
  createdAt: '2026-10-27T10:00:00.000Z',
  parametros: { scale: 1.0, plocal_mult: 1.0, lt_mult: 1.0, reps: 600 },
  results: [
    // ESCENARIO BASE - (Q,R)
    { Producto: 'Aceite de motor (1 L)', Clase: 'A', Politica: '(Q,R)', Escenario: 'Base', Param: '{"R":10,"Q":41}', fill: 0.996, orders: 8.5, inv_cap: 2850, hold: 712, ordc: 510, lost: 45, total: 1267, rop_doc: 63, ss_doc: 61, mu: 0.95 },
    { Producto: 'Filtro de aceite', Clase: 'A', Politica: '(Q,R)', Escenario: 'Base', Param: '{"R":7,"Q":42}', fill: 0.995, orders: 6.2, inv_cap: 2100, hold: 525, ordc: 372, lost: 35, total: 932, rop_doc: 53, ss_doc: 51, mu: 0.71 },
    { Producto: 'Balatas delanteras', Clase: 'A', Politica: '(Q,R)', Escenario: 'Base', Param: '{"R":2,"Q":10}', fill: 0.988, orders: 7.8, inv_cap: 2450, hold: 612, ordc: 468, lost: 140, total: 1220, rop_doc: 21, ss_doc: 21, mu: 0.21 },
    { Producto: 'Bujías (pieza)', Clase: 'A', Politica: '(Q,R)', Escenario: 'Base', Param: '{"R":7,"Q":52}', fill: 0.996, orders: 5.2, inv_cap: 1650, hold: 412, ordc: 312, lost: 20, total: 744, rop_doc: 53, ss_doc: 51, mu: 0.74 },
    { Producto: 'Amortiguador delantero', Clase: 'B', Politica: '(Q,R)', Escenario: 'Base', Param: '{"R":2,"Q":5}', fill: 0.992, orders: 6.5, inv_cap: 2250, hold: 562, ordc: 390, lost: 95, total: 1047, rop_doc: 11, ss_doc: 10, mu: 0.08 },
    { Producto: 'Disco de freno', Clase: 'B', Politica: '(Q,R)', Escenario: 'Base', Param: '{"R":1,"Q":5}', fill: 0.977, orders: 6.8, inv_cap: 1757, hold: 441, ordc: 408, lost: 93, total: 942, rop_doc: 11, ss_doc: 10, mu: 0.06 },

    // ESCENARIO BASE - Periódica Mensual
    { Producto: 'Aceite de motor (1 L)', Clase: 'A', Politica: 'Periódica mensual', Escenario: 'Base', Param: '{"S":45,"T":30}', fill: 0.992, orders: 12, inv_cap: 2800, hold: 700, ordc: 720, lost: 90, total: 1510, rop_doc: 63, ss_doc: 61, mu: 0.95 },
    { Producto: 'Filtro de aceite', Clase: 'A', Politica: 'Periódica mensual', Escenario: 'Base', Param: '{"S":35,"T":30}', fill: 0.991, orders: 12, inv_cap: 2050, hold: 512, ordc: 720, lost: 75, total: 1307, rop_doc: 53, ss_doc: 51, mu: 0.71 },
    { Producto: 'Balatas delanteras', Clase: 'A', Politica: 'Periódica mensual', Escenario: 'Base', Param: '{"S":12,"T":30}', fill: 0.985, orders: 12, inv_cap: 2500, hold: 625, ordc: 720, lost: 180, total: 1525, rop_doc: 21, ss_doc: 21, mu: 0.21 },
    { Producto: 'Bujías (pieza)', Clase: 'A', Politica: 'Periódica mensual', Escenario: 'Base', Param: '{"S":37,"T":30}', fill: 0.993, orders: 12, inv_cap: 1600, hold: 400, ordc: 720, lost: 45, total: 1165, rop_doc: 53, ss_doc: 51, mu: 0.74 },
    { Producto: 'Amortiguador delantero', Clase: 'B', Politica: 'Periódica mensual', Escenario: 'Base', Param: '{"S":6,"T":30}', fill: 0.988, orders: 11, inv_cap: 2316, hold: 579, ordc: 660, lost: 110, total: 1349, rop_doc: 11, ss_doc: 10, mu: 0.08 },
    { Producto: 'Disco de freno', Clase: 'B', Politica: 'Periódica mensual', Escenario: 'Base', Param: '{"S":5,"T":30}', fill: 0.984, orders: 11, inv_cap: 1700, hold: 425, ordc: 660, lost: 69, total: 1154, rop_doc: 11, ss_doc: 10, mu: 0.06 },

    // ESCENARIO BASE - Periódica Quincenal
    { Producto: 'Aceite de motor (1 L)', Clase: 'A', Politica: 'Periódica quincenal', Escenario: 'Base', Param: '{"S":24,"T":14}', fill: 0.990, orders: 24, inv_cap: 2000, hold: 500, ordc: 1440, lost: 110, total: 2050, rop_doc: 63, ss_doc: 61, mu: 0.95 },
    { Producto: 'Filtro de aceite', Clase: 'A', Politica: 'Periódica quincenal', Escenario: 'Base', Param: '{"S":19,"T":14}', fill: 0.989, orders: 24, inv_cap: 1500, hold: 375, ordc: 1440, lost: 95, total: 1910, rop_doc: 53, ss_doc: 51, mu: 0.71 },
    { Producto: 'Balatas delanteras', Clase: 'A', Politica: 'Periódica quincenal', Escenario: 'Base', Param: '{"S":7,"T":14}', fill: 0.985, orders: 23, inv_cap: 1800, hold: 450, ordc: 1380, lost: 170, total: 2000, rop_doc: 21, ss_doc: 21, mu: 0.21 },
    { Producto: 'Bujías (pieza)', Clase: 'A', Politica: 'Periódica quincenal', Escenario: 'Base', Param: '{"S":20,"T":14}', fill: 0.991, orders: 24, inv_cap: 1172, hold: 293, ordc: 1440, lost: 55, total: 1788, rop_doc: 53, ss_doc: 51, mu: 0.74 },
    { Producto: 'Amortiguador delantero', Clase: 'B', Politica: 'Periódica quincenal', Escenario: 'Base', Param: '{"S":4,"T":14}', fill: 0.987, orders: 21, inv_cap: 1650, hold: 412, ordc: 1260, lost: 95, total: 1767, rop_doc: 11, ss_doc: 10, mu: 0.08 },
    { Producto: 'Disco de freno', Clase: 'B', Politica: 'Periódica quincenal', Escenario: 'Base', Param: '{"S":3,"T":14}', fill: 0.985, orders: 20, inv_cap: 1250, hold: 312, ordc: 1200, lost: 54, total: 1566, rop_doc: 11, ss_doc: 10, mu: 0.06 },

    // ESCENARIO BASE - Periódica Semanal
    { Producto: 'Aceite de motor (1 L)', Clase: 'A', Politica: 'Periódica semanal', Escenario: 'Base', Param: '{"S":14,"T":7}', fill: 0.991, orders: 42, inv_cap: 1700, hold: 425, ordc: 2520, lost: 95, total: 3040, rop_doc: 63, ss_doc: 61, mu: 0.95 },
    { Producto: 'Filtro de aceite', Clase: 'A', Politica: 'Periódica semanal', Escenario: 'Base', Param: '{"S":11,"T":7}', fill: 0.990, orders: 41, inv_cap: 1300, hold: 325, ordc: 2460, lost: 80, total: 2865, rop_doc: 53, ss_doc: 51, mu: 0.71 },
    { Producto: 'Balatas delanteras', Clase: 'A', Politica: 'Periódica semanal', Escenario: 'Base', Param: '{"S":4,"T":7}', fill: 0.986, orders: 39, inv_cap: 1500, hold: 375, ordc: 2340, lost: 155, total: 2870, rop_doc: 21, ss_doc: 21, mu: 0.21 },
    { Producto: 'Bujías (pieza)', Clase: 'A', Politica: 'Periódica semanal', Escenario: 'Base', Param: '{"S":12,"T":7}', fill: 0.992, orders: 42, inv_cap: 1000, hold: 250, ordc: 2520, lost: 45, total: 2815, rop_doc: 53, ss_doc: 51, mu: 0.74 },
    { Producto: 'Amortiguador delantero', Clase: 'B', Politica: 'Periódica semanal', Escenario: 'Base', Param: '{"S":3,"T":7}', fill: 0.988, orders: 35, inv_cap: 1400, hold: 350, ordc: 2100, lost: 70, total: 2520, rop_doc: 11, ss_doc: 10, mu: 0.08 },
    { Producto: 'Disco de freno', Clase: 'B', Politica: 'Periódica semanal', Escenario: 'Base', Param: '{"S":2,"T":7}', fill: 0.986, orders: 33, inv_cap: 1100, hold: 275, ordc: 1980, lost: 75, total: 2330, rop_doc: 11, ss_doc: 10, mu: 0.06 }
  ]
};

export const MONTHLY_PROJECTION_DATA = [
  { mes: 'Mes 1', Pesimista: 13650, Base: 17120, Optimista: 20750 },
  { mes: 'Mes 2', Pesimista: 13720, Base: 17450, Optimista: 21310 },
  { mes: 'Mes 3', Pesimista: 13780, Base: 17810, Optimista: 21920 },
  { mes: 'Mes 4', Pesimista: 13920, Base: 17890, Optimista: 22350 },
  { mes: 'Mes 5', Pesimista: 13800, Base: 18150, Optimista: 22810 },
  { mes: 'Mes 6', Pesimista: 14050, Base: 18380, Optimista: 23320 },
  { mes: 'Mes 7', Pesimista: 14130, Base: 18590, Optimista: 24100 },
  { mes: 'Mes 8', Pesimista: 14220, Base: 18890, Optimista: 24450 },
  { mes: 'Mes 9', Pesimista: 14200, Base: 19310, Optimista: 24910 },
  { mes: 'Mes 10', Pesimista: 14190, Base: 19380, Optimista: 25560 },
  { mes: 'Mes 11', Pesimista: 14230, Base: 19490, Optimista: 26010 },
  { mes: 'Mes 12', Pesimista: 14180, Base: 19780, Optimista: 26450 }
];