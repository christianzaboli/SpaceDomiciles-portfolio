export const SHIPPING_FIELDS = [
  "nome",
  "cognome",
  "email",
  "telefono",
  "indirizzo",
  "civico",
  "città",
  "CAP",
  "provincia",
  "paese",
];

export const COMPANY_FIELDS = ["azienda", "piva", "pec", "sdi"];

export const BILLING_FIELDS = [...SHIPPING_FIELDS, ...COMPANY_FIELDS];

export const INITIAL_SHIPPING = {
  nome: "",
  cognome: "",
  email: "",
  telefono: "",
  indirizzo: "",
  civico: "",
  città: "",
  CAP: "",
  provincia: "",
  paese: "",
};

export const INITIAL_BILLING = {
  ...INITIAL_SHIPPING,
  azienda: "",
  piva: "",
  pec: "",
  sdi: "",
};
