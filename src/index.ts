import Fastify from 'fastify'

const app = Fastify({
  logger: false,
  disableRequestLogging: true,
})

app.get('/health', async (_req, reply) => {
  return reply.code(200).send({ status: 'ok' })
})

const shutdown = async () => {
  await app.close()
  process.exit(0)
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)

const start = async () => {
  try {
    await app.listen({ port: 8080, host: '0.0.0.0' })
    process.stdout.write('API ouvindo na porta 8080\n')
  } catch (err) {
    process.stderr.write(`Erro ao iniciar: ${(err as Error).message}\n`)
    process.exit(1)
  }
}

start()