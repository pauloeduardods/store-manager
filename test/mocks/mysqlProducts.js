const getAllMock =
[
  [
    { id: 1, name: 'Coca Cola', quantity: 10 },
    { id: 2, name: 'peps', quantity: 11 }
  ],
  [
    {}
  ],
];

const createMock =
[
  {
    fieldCount: 0,
    affectedRows: 1,
    insertId: 3,
    info: '',
    serverStatus: 2,
    warningStatus: 0
  },
  undefined
];

const getByNameMock =
[
  [
    { id: 1, name: 'Coca Cola', quantity: 10 },
  ],
  [
    {},
  ],
];

const getByIdMock =
[
  [
    { id: 1, name: 'Coca Cola', quantity: 10 },
  ],
  [
    {}
  ],
]

const updateMock = [
  {
    fieldCount: 0,
    affectedRows: 1,
    insertId: 0,
    info: 'Rows matched: 1  Changed: 0  Warnings: 0',
    serverStatus: 2,
    warningStatus: 0,
    changedRows: 0
  },
  undefined
]

const updateMockFalse = [
  {
    fieldCount: 0,
    affectedRows: 0,
    insertId: 0,
    info: 'Rows matched: 1  Changed: 0  Warnings: 0',
    serverStatus: 2,
    warningStatus: 0,
    changedRows: 0
  },
  undefined
]

const deleteMock = [
  {
    fieldCount: 0,
    affectedRows: 0,
    insertId: 0,
    info: 'Rows matched: 1  Changed: 0  Warnings: 0',
    serverStatus: 2,
    warningStatus: 0,
    changedRows: 0
  },
]

const deleteMockFalse = [
  {
    fieldCount: 0,
    affectedRows: 0,
    insertId: 0,
    info: 'Rows matched: 1  Changed: 0  Warnings: 0',
    serverStatus: 2,
    warningStatus: 0,
    changedRows: 0
  },
  undefined
]

const getAllMockSales = [
  [
    {
      saleId: 3,
      product_id: 1,
      quantity: 2,
      date: "2022-01-26T11:41:04.000Z"
    },
    {
      saleId: 4,
      product_id: 1,
      quantity: 2,
      date: "2022-01-26T11:41:23.000Z"
    },
    {
      saleId: 4,
      product_id: 2,
      quantity: 2,
      date: "2022-01-26T11:41:23.000Z"
    },
  ]
]

const getByIdMockSales = [
  [
    {
      product_id: 1,
      quantity: 2,
      date: "2022-01-26T11:41:04.000Z"
    },
    {
      product_id: 2,
      quantity: 3,
      date: "2022-01-26T11:41:04.000Z"
    }
  ]
]

const getQuantityMock = [
  [
    { quantity: 2 }
  ]
]

const updateQuantityMock = [
  {
    fieldCount: 0,
    affectedRows: 1,
    insertId: 0,
    info: 'Rows matched: 1  Changed: 0  Warnings: 0',
    serverStatus: 2,
    warningStatus: 0,
    changedRows: 0
  },
  undefined
]

const updateQuantityMockFalse = [
  {
    fieldCount: 0,
    affectedRows: 0,
    insertId: 0,
    info: 'Rows matched: 1  Changed: 0  Warnings: 0',
    serverStatus: 2,
    warningStatus: 0,
    changedRows: 0
  },
  undefined
]

module.exports = {
  getAllMock,
  createMock,
  getByNameMock,
  getByIdMock,
  updateMock,
  updateMockFalse,
  deleteMock,
  deleteMockFalse,
  getAllMockSales,
  getByIdMockSales,
  getQuantityMock,
  updateQuantityMock,
  updateQuantityMockFalse,
}