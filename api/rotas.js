import { randomUUID } from 'node:crypto';
import { neon } from '@neondatabase/serverless';

const rotaExemplo = {
  id: 'rota-1', nome: 'Rota 1',
  inicio: { texto: 'Alameda Santos, São Paulo - SP', lat: -23.5654, lon: -46.6572 },
  destino: { texto: 'FIAP Paulista · Av. Paulista, 1106', lat: -23.5640843, lon: -46.6523865 }
};
const idValido = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i;

function validarPonto(ponto) {
  return ponto && typeof ponto.texto === 'string' && ponto.texto.trim().length > 0
    && ponto.texto.length <= 240 && Number.isFinite(Number(ponto.lat))
    && Number.isFinite(Number(ponto.lon)) && Math.abs(Number(ponto.lat)) <= 90
    && Math.abs(Number(ponto.lon)) <= 180;
}
function mapear(linha) {
  return { id: linha.id, nome: linha.nome, exemplo: linha.exemplo,
    inicio: { texto: linha.inicio_texto, lat: Number(linha.inicio_lat), lon: Number(linha.inicio_lon) },
    destino: { texto: linha.destino_texto, lat: Number(linha.destino_lat), lon: Number(linha.destino_lon) }, criadoEm: linha.criado_em };
}
function responder(res, codigo, dados) { res.status(codigo).json(dados); }

export default async function handler(req, res) {
  const urlBanco = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.NEON_DATABASE_URL;
  if (!urlBanco) return responder(res, 503, { message: 'banco n configurado' });
  const usuario = req.headers['x-pulseira-usuario'] || '';
  if (!idValido.test(usuario)) return responder(res, 400, { message: 'identificador local invalido.' });
  try {
    const sql = neon(urlBanco);
    await sql`CREATE TABLE IF NOT EXISTS rotas_salvas (
      id TEXT NOT NULL, usuario_id TEXT NOT NULL, nome TEXT NOT NULL,
      inicio_texto TEXT NOT NULL, inicio_lat DOUBLE PRECISION NOT NULL, inicio_lon DOUBLE PRECISION NOT NULL,
      destino_texto TEXT NOT NULL, destino_lat DOUBLE PRECISION NOT NULL, destino_lon DOUBLE PRECISION NOT NULL,
      exemplo BOOLEAN NOT NULL DEFAULT FALSE, criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(), PRIMARY KEY (usuario_id, id)
    )`;
    await sql`INSERT INTO rotas_salvas (id, usuario_id, nome, inicio_texto, inicio_lat, inicio_lon, destino_texto, destino_lat, destino_lon, exemplo)
      VALUES ('rota-1', ${usuario}, ${rotaExemplo.nome}, ${rotaExemplo.inicio.texto}, ${rotaExemplo.inicio.lat}, ${rotaExemplo.inicio.lon}, ${rotaExemplo.destino.texto}, ${rotaExemplo.destino.lat}, ${rotaExemplo.destino.lon}, TRUE)
      ON CONFLICT (usuario_id, id) DO NOTHING`;

    const colunas = 'id, nome, inicio_texto, inicio_lat, inicio_lon, destino_texto, destino_lat, destino_lon, exemplo, criado_em';
    if (req.method === 'GET') {
      const linhas = await sql`SELECT id, nome, inicio_texto, inicio_lat, inicio_lon, destino_texto, destino_lat, destino_lon, exemplo, criado_em FROM rotas_salvas WHERE usuario_id = ${usuario} ORDER BY exemplo DESC, criado_em DESC`;
      return responder(res, 200, { rotas: linhas.map(mapear) });
    }
    if (req.method === 'POST') {
      const dados = req.body || {};
      if (typeof dados.nome !== 'string' || !dados.nome.trim() || dados.nome.trim().length > 80 || !validarPonto(dados.inicio) || !validarPonto(dados.destino))
        return responder(res, 400, { message: 'Informe nome, início e destino válidos.' });
      const id = randomUUID();
      const [linha] = await sql`INSERT INTO rotas_salvas (id, usuario_id, nome, inicio_texto, inicio_lat, inicio_lon, destino_texto, destino_lat, destino_lon)
        VALUES (${id}, ${usuario}, ${dados.nome.trim()}, ${dados.inicio.texto.trim()}, ${Number(dados.inicio.lat)}, ${Number(dados.inicio.lon)}, ${dados.destino.texto.trim()}, ${Number(dados.destino.lat)}, ${Number(dados.destino.lon)})
        RETURNING id, nome, inicio_texto, inicio_lat, inicio_lon, destino_texto, destino_lat, destino_lon, exemplo, criado_em`;
      return responder(res, 201, { rota: mapear(linha) });
    }
    const id = String(req.query?.id || '');
    if (!id) return responder(res, 400, { message: 'informe o identificador da rota' });
    if (id === 'rota-1') return responder(res, 409, { message: 'a rota de exemplo n pode ser editada ou excluída.' });
    if (req.method === 'PUT') {
      const dados = req.body || {};
      if (typeof dados.nome !== 'string' || !dados.nome.trim() || dados.nome.trim().length > 80 || !validarPonto(dados.inicio) || !validarPonto(dados.destino))
        return responder(res, 400, { message: 'informe nome, inicio e destino validos.' });
      const [linha] = await sql`UPDATE rotas_salvas SET nome = ${dados.nome.trim()}, inicio_texto = ${dados.inicio.texto.trim()}, inicio_lat = ${Number(dados.inicio.lat)}, inicio_lon = ${Number(dados.inicio.lon)}, destino_texto = ${dados.destino.texto.trim()}, destino_lat = ${Number(dados.destino.lat)}, destino_lon = ${Number(dados.destino.lon)}, atualizado_em = NOW()
        WHERE usuario_id = ${usuario} AND id = ${id} AND exemplo = FALSE
        RETURNING id, nome, inicio_texto, inicio_lat, inicio_lon, destino_texto, destino_lat, destino_lon, exemplo, criado_em`;
      if (!linha) return responder(res, 404, { message: 'Rota não encontrada.' });
      return responder(res, 200, { rota: mapear(linha) });
    }
    if (req.method === 'DELETE') {
      const removidas = await sql`DELETE FROM rotas_salvas WHERE usuario_id = ${usuario} AND id = ${id} AND exemplo = FALSE RETURNING id`;
      if (!removidas.length) return responder(res, 404, { message: 'rota n encontrada.' });
      return responder(res, 200, { removida: true, id });
    }
    res.setHeader('Allow', 'GET, POST, PUT, DELETE');
    return responder(res, 405, { message: 'metodo não permitido.' });
  } catch (erro) {
    console.error('falha na API de rotas:', erro);
    return responder(res, 500, { message: 'n foi possivel acessar as rotas salvas. verifique o banco.' });
  }
}
