export const PROPERTY_CATEGORIES = [
  "Fundos y parcelas agrícolas",
  "Terrenos urbanos",
  "Terrenos y propiedades industriales",
  "Parcelas de agrado",
] as const;

export type PropertyCategory = (typeof PROPERTY_CATEGORIES)[number];
