export const SeverityEnum = {
    'GRAVE': 1,
    'MODERADO': 2,
}as const;

export const getSeverityLabel = (value: number) => {
    return Object.keys(SeverityEnum).find(
      (key) => SeverityEnum[key as keyof typeof SeverityEnum] === value
    ) || 'DESCONHECIDO';
  };

export type SeveirtyEnumType = keyof typeof SeverityEnum;

