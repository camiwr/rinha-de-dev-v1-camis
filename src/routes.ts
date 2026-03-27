import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { pool } from './db'
import { eventosJsonSchema, ReservaBody, reservaJsonSchema } from './schemas'

export async function routes(app: FastifyInstance) {

  app.get('/eventos', { schema: eventosJsonSchema }, async (_req: FastifyRequest, reply: FastifyReply) => {
    const { rows } = await pool.query(
      'SELECT id, nome, ingressos_disponiveis FROM eventos'
    )
    return reply.code(200).send(rows)
  })

  app.post<{ Body: ReservaBody }>(
    '/reservas',
    { schema: reservaJsonSchema },
    async (req: FastifyRequest<{ Body: ReservaBody }>, reply: FastifyReply) => {
      const { evento_id, usuario_id } = req.body

      const updateResult = await pool.query<{ id: number }>(
        `UPDATE eventos
            SET ingressos_disponiveis = ingressos_disponiveis - 1
          WHERE id = $1
            AND ingressos_disponiveis > 0
          RETURNING id`,
        [evento_id]
      )

      if (updateResult.rowCount === 0) {
        const exists = await pool.query<{ id: number }>(
          'SELECT id FROM eventos WHERE id = $1',
          [evento_id]
        )
        if (exists.rowCount === 0) {
          return reply.code(400).send({ error: 'Evento não encontrado.' })
        }
        return reply.code(422).send({ error: 'Ingressos esgotados.' })
      }

      const insertResult = await pool.query<{ id: number }>(
        'INSERT INTO reservas (evento_id, usuario_id) VALUES ($1, $2) RETURNING id',
        [evento_id, usuario_id]
      )

      return reply.code(201).send({
        message: 'Reserva garantida!',
        reserva_id: insertResult.rows[0].id,
      })
    }
  )
}