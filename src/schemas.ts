export interface Evento {
  id: number
  nome: string
  ingressos_disponiveis: number
}

export interface ReservaBody {
  evento_id: number
  usuario_id: number
}

export const reservaJsonSchema = {
  body: {
    type: 'object',
    required: ['evento_id', 'usuario_id'],
    additionalProperties: false,
    properties: {
      evento_id:  { type: 'integer', minimum: 1 },
      usuario_id: { type: 'integer', minimum: 1 },
    },
  },
  response: {
    201: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        reserva_id: { type: 'integer' },
      },
    },
    422: {
      type: 'object',
      properties: { error: { type: 'string' } },
    },
    400: {
      type: 'object',
      properties: { error: { type: 'string' } },
    },
  },
}

export const eventosJsonSchema = {
  response: {
    200: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id:                     { type: 'integer' },
          nome:                   { type: 'string' },
          ingressos_disponiveis:  { type: 'integer' },
        },
      },
    },
  },
}