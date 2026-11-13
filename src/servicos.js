import { origemReserva } from './dados.js';

const baseRegistros = 'https://jsonplaceholder.typicode.com/posts';
const baseMapa = 'https://nominatim.openstreetmap.org/search';
const baseRota = 'https://routing.openstreetmap.de/routed-foot/route/v1/driving';

async function obterJson(url, opcoes) {
  const resposta = await fetch(url, opcoes);
  if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
  return resposta.json();
}

export async function ouvirDestino() {
  const Reconhecedor = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Reconhecedor) throw new Error('Reconhecimento de voz indisponível neste navegador.');

  return new Promise((resolver, rejeitar) => {
    const ouvinte = new Reconhecedor();
    ouvinte.lang = 'pt-BR';
    ouvinte.interimResults = false;
    ouvinte.maxAlternatives = 1;
    ouvinte.onresult = evento => resolver(evento.results[0][0].transcript);
    ouvinte.onerror = evento => rejeitar(new Error(
      evento.error === 'not-allowed' ? 'Permita o uso do microfone.' : 'Não foi possível reconhecer o endereço.'
    ));
    ouvinte.start();
  });
}

export function obterOrigem() {
  return new Promise(resolver => {
    if (!navigator.geolocation) return resolver(origemReserva);
    navigator.geolocation.getCurrentPosition(
      posicao => resolver({ lat: posicao.coords.latitude, lon: posicao.coords.longitude }),
      () => resolver(origemReserva),
      { enableHighAccuracy: true, timeout: 7000, maximumAge: 15000 }
    );
  });
}

export async function buscarDestino(endereco) {
  const consulta = new URLSearchParams({
    format: 'jsonv2', limit: '1', 'accept-language': 'pt-BR', q: endereco
  });
  const lugares = await obterJson(`${baseMapa}?${consulta}`);
  if (!lugares.length) throw new Error('Endereço não encontrado. Tente falar novamente.');
  return {
    lat: Number(lugares[0].lat),
    lon: Number(lugares[0].lon),
    nome: lugares[0].display_name.split(',').slice(0, 3).join(',')
  };
}

export async function buscarRota(origem, destino, intermediarios = []) {
  const pontos = [origem, ...intermediarios, destino].map(ponto => `${ponto.lon},${ponto.lat}`).join(';');
  const consulta = new URLSearchParams({ overview: 'full', geometries: 'geojson', steps: 'true' });
  const dados = await obterJson(`${baseRota}/${pontos}?${consulta}`);
  if (dados.code !== 'Ok' || !dados.routes?.length) throw new Error('Não foi possível calcular a rota.');
  return dados.routes[0];
}

export async function listarRegistros() {
  return obterJson(`${baseRegistros}?userId=1`);
}

export async function criarRegistro() {
  return obterJson(baseRegistros, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Navegação iniciada', body: 'simulador-pulseira', userId: 1 })
  });
}

export async function atualizarRegistro(id, texto = 'Rota recalculada') {
  return obterJson(`${baseRegistros}/${id}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: texto, body: 'simulador-pulseira', userId: 1 })
  });
}

export async function apagarRegistro(id) {
  const resposta = await fetch(`${baseRegistros}/${id}`, { method: 'DELETE' });
  if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
  return true;
}

export function emitirFala(texto) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const fala = new SpeechSynthesisUtterance(texto);
  fala.lang = 'pt-BR';
  window.speechSynthesis.speak(fala);
}
