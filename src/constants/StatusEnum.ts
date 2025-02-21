export const StatusEnum = {
    'REPORTADO': 1,
    'AVALIADO': 2,
    'CONCLUIDO': 3
}as const;

export type StatusEnumType = keyof typeof StatusEnum;