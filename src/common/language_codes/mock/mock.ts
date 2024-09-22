const mockCountryData = [
  {
    id: 'c1',
    name: 'test country',
    language: 'english',
    banks: [],
    attributes: [],
  },
];
const mockCountryAttributeData = [
  {
    id: 'ca1',
    name: 'test country attr name',
    value: 'test country attr value',
    country: mockCountryData[0],
  },
];

const mockBankData = [
  {
    id: 'b1',
    name: 'test bank',
    country: [mockCountryData[0]],
    currencies: [],
    attributes: [],
  },
];

const mockBankAttributeData = [
  {
    id: 'ba1',
    bank: mockBankData[0],
    name: 'test bank attr name',
    value: 'test bank attr value',
  },
];
const mockCurencyData = [
  {
    id: 'cu1',
    symbol: 'usd',
    banks: [mockBankData[0]],
    attributes: [],
  },
];
const mockCurencyAttributeData = [
  {
    id: 'cua1',
    name: 'symbol2',
    value: 'dollar',
    currency: mockCurencyData[0],
  },
];

mockCountryData[0].banks.push(mockBankData[0]);
mockCountryData[0].attributes.push(mockCountryAttributeData[0]);
// mockCountryAttributeData[0].country=mockCountryData[0]
mockBankData[0].currencies.push(mockCurencyData[0]);
mockBankData[0].attributes.push(mockBankAttributeData[0]);
mockCurencyData[0].attributes.push(mockCurencyAttributeData[0]);

export const mockData = {
  mockCountryData,
  mockBankData,
  mockCurencyData,
  mockCountryAttributeData,
  mockBankAttributeData,
  mockCurencyAttributeData,
};
