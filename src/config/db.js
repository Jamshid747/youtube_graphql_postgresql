import pg from 'pg'
const pool = new pg.Pool({
    port: 5432,
    host: 'arjuna.db.elephantsql.com',
    password: '2WVAiuP_Z2WDxlkyOegExwAUt_-vZXhJ',
    user: 'jcaunjha',
    database: 'jcaunjha'
})
    
async function db (query, ...params) {
    const client = await pool.connect()
    try {
        const { rows } = await client.query(query, params.length ? params : null)
        return rows
    } catch (error) {
        console.log('Database error:', error.message)
        throw new Error(error)
    } finally {
        client.release()
    }
}

export default db