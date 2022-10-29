export function createGraphqlEffect (dependencies = {}) {
  const { client } = dependencies

  async function query (query, options) {
    const { data } = await client.query({ query, ...options })
    return data
  }

  return { query }
}
