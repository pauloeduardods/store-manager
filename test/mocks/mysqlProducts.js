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

module.exports = {
  getAllMock,
  createMock,
  getByNameMock,
  getByIdMock
}