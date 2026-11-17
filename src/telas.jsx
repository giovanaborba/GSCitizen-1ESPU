import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import braille from './dados/braille.json';
import { modos } from './dados.js';
import * as Servicos from './servicos.js';
import { useNavegacao, usePulseira } from './ganchos.js';

function BotaoPulseira({ nome, acao, ativo, piscar = false, dica }) {
  return <button className={`botao-pulseira ${ativo ? 'botao-ativo' : ''} ${piscar && ativo ? 'botao-pisca' : ''}`} onClick={acao} aria-label={dica || nome} data-dica={dica || nome} />;
}

function MenuModos({ modo, aberto, escolher }) {
  if (!aberto) return null;
  return <div className="menu-modos" role="group" aria-label="Modos da pulseira">
    {modos.map(item => <button key={item} className={item === modo ? 'modo-selecionado' : ''} onClick={() => escolher(item)}>{item}</button>)}
  </div>;
}

function PontosBraille({ numero, chegada = false }) {
  const ativos = braille[String(numero)] || [];
  return <div className="pontos-braille" aria-label={`Braille ${numero}`} data-dica="Pinos retráteis para Braille">
    {[1, 2, 3, 4, 5, 6].map(ponto => <i key={ponto} className={chegada || ativos.includes(ponto) ? 'ponto-erguido' : ''} />)}
  </div>;
}

function JanelaBraille({ completo = false }) {
  return <div className="janela-braille-pulseira" aria-label="Pinos retráteis para Braille" data-dica="Pinos retráteis para Braille">
    {[1, 2, 3, 4, 5, 6].map(ponto => <i key={ponto} className={completo ? 'pino-braille-erguido' : ''} />)}
  </div>;
}

function Pulseira({ modo, menuAberto, alternarMenu, escolherModo, iniciarVoz, estado, lado, legenda = '', erro, transporte, horizontal = false, brailleAberto, numero, focarBraille, mostrarFalante = false, chegouTransporte = false }) {
  const Tela = transporte ? 'button' : 'div';
  const vibrarParada = estado === 'semaforo' && modo === modos[1];
  const pressaoAtiva = estado === 'pressionando' && modo === modos[1];
  const classePulseira = [
    'pulseira-conjunto',
    transporte ? 'pulseira-transporte' : '',
    chegouTransporte ? 'pulseira-chegou-transporte' : '',
    horizontal ? 'pulseira-horizontal' : '',
    pressaoAtiva ? 'pulseira-sinal-pressao' : '',
    vibrarParada ? 'pulseira-sinal-parada' : ''
  ].filter(Boolean).join(' ');
  return <section className={classePulseira}>
    {legenda && <div className="sinal-pulseira">{legenda}</div>}
    <div className="pulseira-faixa">
      <div className="pulseira-fivela" />
      <div className={`pulseira-corpo ${pressaoAtiva ? 'pulseira-aperta' : ''}`}>
        <Tela type={transporte ? 'button' : undefined} className="tela-pulseira" onClick={transporte ? focarBraille : undefined} aria-label={transporte ? 'Mostrar pinos Braille' : undefined}>
          {transporte ? <>
            <PontosBraille numero={numero} chegada={chegouTransporte} />
            {mostrarFalante && <span className="icone-falante-pulseira" data-dica="Alto-falante" aria-label="Alto-falante" role="img"><i /><i /><i /></span>}
            <span className="luz-lado luz-esquerda pulso-transporte" />
            <span className="luz-lado luz-direita pulso-transporte" />
          </> : <>
            <JanelaBraille completo={estado === 'chegada' && modo === modos[1]} />
            {mostrarFalante && <span className="icone-falante-pulseira" data-dica="Alto-falante" aria-label="Alto-falante" role="img"><i /><i /><i /></span>}
            {lado === 'esquerda' ? <span className="luz-lado luz-esquerda luz-ativa" /> : null}
            {lado === 'direita' ? <span className="luz-lado luz-direita luz-ativa" /> : null}
          </>}
        </Tela>
      </div>
      <div className="pulseira-fivela pulseira-base" />
      <div className="botoes-pulseira">
        <div className="seletor-embrulho">
          <BotaoPulseira nome="Modo" dica="Troca de modo" acao={alternarMenu} ativo={menuAberto} piscar />
          <MenuModos modo={modo} aberto={menuAberto} escolher={escolherModo} />
        </div>
        <BotaoPulseira nome="Voz" dica="Reconhecimento de voz" acao={iniciarVoz} ativo={estado === 'ouvindo'} />
      </div>
    </div>
    {transporte && <span className="legenda-aguarde-transporte">3 vibrações rápidas</span>}
    {erro && <div className="erro-voz" role="alert">{erro}</div>}
  </section>;
}

function MapaRota({ rota, origem, destino, progresso, passos }) {
  const elemento = useRef(null);
  const mapaRef = useRef(null);
  const camadasRef = useRef([]);
  const jogadorRef = useRef(null);

  useEffect(() => {
    if (!elemento.current || mapaRef.current) return undefined;
    const mapa = L.map(elemento.current, { zoomControl: true, scrollWheelZoom: false }).setView([-23.5614, -46.6562], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19, attribution: '© OpenStreetMap'
    }).addTo(mapa);
    mapaRef.current = mapa;
    return () => { mapa.remove(); mapaRef.current = null; };
  }, []);

  useEffect(() => {
    const mapa = mapaRef.current;
    if (!mapa || !rota || !origem || !destino) return;
    camadasRef.current.forEach(cam => mapa.removeLayer(cam));
    camadasRef.current = [];
    const coords = rota.geometry.coordinates;
    const linha = L.polyline(coords.map(([lon, lat]) => [lat, lon]), { color: '#2878ff', weight: 6, opacity: .95 }).addTo(mapa);
    const atual = pontoNaRota(coords, progresso);
    const marcador = L.circleMarker([atual[1], atual[0]], { radius: 8, color: '#fff', weight: 3, fillColor: '#2878ff', fillOpacity: 1 }).addTo(mapa);
    const fim = L.circleMarker([destino.lat, destino.lon], { radius: 8, color: '#fff', weight: 3, fillColor: '#f04452', fillOpacity: 1 }).addTo(mapa).bindTooltip(destino.nome);
    const travessias = passos.filter(passo => passo.tipo === 'semaforo').map(passo => {
      const ponto = pontoNaRota(coords, passo.progresso);
      return L.marker([ponto[1], ponto[0]], {
        icon: L.divIcon({ className: 'marcador-travessia', html: '<i></i>', iconSize: [22, 22], iconAnchor: [11, 11] })
      }).addTo(mapa);
    });
    jogadorRef.current = marcador;
    camadasRef.current = [linha, marcador, fim, ...travessias];
    mapa.fitBounds(linha.getBounds().pad(.15));
    window.setTimeout(() => mapa.invalidateSize(), 50);
  }, [rota, origem, destino, passos]);

  useEffect(() => {
    if (!jogadorRef.current || !rota?.geometry?.coordinates) return;
    const [lon, lat] = pontoNaRota(rota.geometry.coordinates, progresso);
    jogadorRef.current.setLatLng([lat, lon]);
  }, [rota, progresso]);

  return <div ref={elemento} className="mapa-rota" aria-label="Mapa com rota" />;
}

function pontoNaRota(coords, progresso) {
  const distancias = [0];
  const rad = Math.PI / 180;
  for (let i = 1; i < coords.length; i++) {
    const a = coords[i - 1], b = coords[i];
    const dLat = (b[1] - a[1]) * rad, dLon = (b[0] - a[0]) * rad;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(a[1] * rad) * Math.cos(b[1] * rad) * Math.sin(dLon / 2) ** 2;
    distancias.push(distancias[i - 1] + 6371000 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h)));
  }
  const alvo = (distancias.at(-1) || 0) * Math.max(0, Math.min(1, progresso));
  let i = 1;
  while (i < distancias.length - 1 && distancias[i] < alvo) i++;
  const a = coords[i - 1], b = coords[i];
  const trecho = distancias[i] - distancias[i - 1] || 1;
  const fracao = (alvo - distancias[i - 1]) / trecho;
  return [a[0] + (b[0] - a[0]) * fracao, a[1] + (b[1] - a[1]) * fracao];
}

function BotoesRota({ comando, bloqueados }) {
  return <div className="botoes-rota">
    {[
      ['continuar', 'CONTINUAR'], ['parar', 'PARAR'], ['esquerda', 'ESQUERDA'], ['direita', 'DIREITA']
    ].map(([id, texto]) => <button key={id} disabled={bloqueados && id !== 'continuar'} onClick={() => comando(id)}>{texto}</button>)}
  </div>;
}

function AvisoSemaforo({ estado, segundos }) {
  if (!['semaforo', 'contando', 'pressionando'].includes(estado)) return null;
  return <div className="aviso-semaforo" role="status" aria-live="assertive">
    <span className="luz-semaforo" />
    <span>FECHA EM</span>
    <strong>{estado === 'pressionando' ? 0 : segundos}</strong>
    <span>SEGUNDOS</span>
  </div>;
}

const sinaisVitrine = [
  { grupo: 'Tátil', nome: 'Continue', tipo: 'pressao', detalhe: 'Pressão contínua no pulso.' },
  { grupo: 'Tátil', nome: 'Pare', tipo: 'parar', detalhe: 'Vibração contínua até parar.' },
  { grupo: 'Tátil', nome: 'Vire à esquerda', tipo: 'esquerda', detalhe: 'Vibração no lado esquerdo.' },
  { grupo: 'Tátil', nome: 'Vire à direita', tipo: 'direita', detalhe: 'Vibração no lado direito.' },
  { grupo: 'Tátil', nome: 'Aguarde', tipo: 'aguarde', detalhe: 'Três vibrações curtas, repetidas após uma pausa.' },
  { grupo: 'Sonoro', nome: 'Continue', tipo: 'grave', detalhe: 'Som grosso e curto.' },
  { grupo: 'Sonoro', nome: 'Pare', tipo: 'agudo', detalhe: 'Som agudo e contínuo.' }
];

function PulseiraVitrine({ tipo, somAtivo = false }) {
  return <div className={`vitrine-pulseira vitrine-${tipo}`}>
    <div className="vitrine-faixa" />
    <div className="vitrine-corpo">
      <div className="vitrine-tela">
        <span className="vitrine-luz vitrine-luz-esq" />
        <span className="vitrine-luz vitrine-luz-dir" />
        <div className="vitrine-braille">{[1, 2, 3, 4, 5, 6].map(p => <i key={p} />)}</div>
        <span className={`vitrine-falante ${somAtivo ? 'vitrine-falante-ativo' : ''}`}><i /><i /><i /></span>
      </div>
    </div>
    <span className="vitrine-botao vitrine-modo" /><span className="vitrine-botao vitrine-voz" />
  </div>;
}

function CartaoVitrine({ sinal }) {
  const [somLigado, definirSom] = useState(false);
  const audioRef = useRef(null);
  const sonoro = sinal.tipo === 'grave' || sinal.tipo === 'agudo';
  const alternarSom = () => {
    if (audioRef.current) {
      const som = audioRef.current;
      if (som.intervalo) clearInterval(som.intervalo);
      try { som.oscilador.stop(); som.contexto.close(); } catch {}
      audioRef.current = null; definirSom(false); return;
    }
    const AudioApi = window.AudioContext || window.webkitAudioContext;
    if (!AudioApi) return;
    const contexto = new AudioApi();
    if (contexto.state === 'suspended') contexto.resume().catch(() => {});
    if (sinal.tipo === 'agudo') {
      const oscilador = contexto.createOscillator(), ganho = contexto.createGain();
      oscilador.type = 'sine'; oscilador.frequency.value = 980; ganho.gain.value = .035;
      oscilador.connect(ganho); ganho.connect(contexto.destination); oscilador.start();
      audioRef.current = { contexto, oscilador };
    } else {
      const tocar = () => { const oscilador = contexto.createOscillator(), ganho = contexto.createGain(); oscilador.type = 'square'; oscilador.frequency.value = 185; ganho.gain.value = .04; oscilador.connect(ganho); ganho.connect(contexto.destination); oscilador.start(); oscilador.stop(contexto.currentTime + .22); };
      tocar(); const intervalo = setInterval(tocar, 1700);
      audioRef.current = { contexto, intervalo, oscilador: { stop: () => clearInterval(intervalo) } };
    }
    definirSom(true);
  };
  useEffect(() => () => {
    const som = audioRef.current;
    if (!som) return;
    if (som.intervalo) clearInterval(som.intervalo);
    try { som.oscilador.stop(); som.contexto.close(); } catch {}
  }, []);
  return <article className="cartao-vitrine">
    <header><span>{sinal.grupo}</span><h2>{sinal.nome}</h2>{sonoro && <button className={`controle-vitrine ${somLigado ? 'ligado' : ''}`} onClick={alternarSom} aria-pressed={somLigado} aria-label={`Som ${somLigado ? 'ligado' : 'desligado'}`}><i />Som<span /></button>}</header>
    <div className="vitrine-cena"><PulseiraVitrine tipo={sinal.tipo} somAtivo={somLigado} /></div>
    <p>{sinal.detalhe}</p>
  </article>;
}

function Vitrine({ voltar }) {
  return <main className="tela-vitrine">
    <header className="topo-vitrine"><button onClick={voltar} aria-label="Voltar">‹</button></header>
    <section className="grade-vitrine" aria-label="Comandos da pulseira">{sinaisVitrine.map(sinal => <CartaoVitrine key={sinal.tipo} sinal={sinal} />)}</section>
  </main>;
}

function TelaInicial({ pulso, nav, abrirVitrine, abrirRotas }) {
  return <main className="tela-inicial">
    <section className="inicio-apresentacao">
      <aside className="post-it post-it-esquerdo">
        <p>Para armazenar um caminho recorrente, toque no botão de reconhecimento de voz e diga <strong>“salvar rota”</strong>. Será solicitado o início, destino e nome, você pode nomear como quiser, por exemplo <strong>“casa”</strong> ou <strong>“trabalho”</strong>. Depois, diga <strong>“destino [nome dado a rota]”</strong> para carregar a rota salva.</p>
      </aside>
      <Pulseira modo={pulso.modo} menuAberto={pulso.menuAberto} alternarMenu={() => pulso.definirMenu(v => !v)} escolherModo={pulso.escolherModo} iniciarVoz={nav.iniciarVoz} estado={nav.estado} erro={nav.erro} lado="" numero={nav.segundos} mostrarFalante />
      <aside className="post-it post-it-direito">
        <p>Para ir a um destino sem salvar a rota, toque no botão de reconhecimento de voz e diga o endereço de destino. A rota será carregada automaticamente.</p>
      </aside>
    </section>
    <nav className="inicio-acoes" aria-label="Opções iniciais">
      <button className="botao-rotas-salvas" onClick={abrirRotas}>Rotas salvas</button>
      <button className="botao-vitrine" onClick={abrirVitrine}>Conheça como cada comando é feito</button>
      <button className="botao-simulacao-pronta" onClick={nav.iniciarSimulacao}>Testar simulação pronta</button>
    </nav>
  </main>;
}

function RotasSalvas({ voltar, nav }) {
  const [rotas, definirRotas] = useState([]);
  const [carregando, definirCarregando] = useState(true);
  const [erro, definirErro] = useState('');
  const [editando, definirEditando] = useState(null);
  const [salvando, definirSalvando] = useState(false);

  const carregar = async () => {
    definirCarregando(true); definirErro('');
    try { definirRotas(await Servicos.listarRotas()); }
    catch (falha) { definirErro(falha.message || 'não foi possível consultar as rotas salvas.'); }
    finally { definirCarregando(false); }
  };
  useEffect(() => { carregar(); }, []);

  const salvarEdicao = async evento => {
    evento.preventDefault();
    const dados = new FormData(evento.currentTarget);
    definirSalvando(true); definirErro('');
    try {
      const [inicio, destino] = await Promise.all([
        Servicos.buscarDestino(String(dados.get('inicio'))), Servicos.buscarDestino(String(dados.get('destino')))
      ]);
      const atualizada = await Servicos.atualizarRota(editando.id, {
        nome: String(dados.get('nome')).trim(),
        inicio: { texto: inicio.nome, lat: inicio.lat, lon: inicio.lon },
        destino: { texto: destino.nome, lat: destino.lat, lon: destino.lon }
      });
      definirRotas(lista => lista.map(item => item.id === atualizada.id ? atualizada : item));
      definirEditando(null);
    } catch (falha) { definirErro(falha.message || 'não foi possível atualizar a rota.'); }
    finally { definirSalvando(false); }
  };

  const excluir = async rota => {
    if (rota.exemplo) return;
    try { await Servicos.apagarRota(rota.id); definirRotas(lista => lista.filter(item => item.id !== rota.id)); }
    catch (falha) { definirErro(falha.message || 'Não foi possível excluir a rota.'); }
  };

  return <main className="tela-rotas">
    <header className="barra-tela"><button className="botao-voltar-inicio" onClick={voltar}>VOLTAR</button></header>
    {erro && <p className="erro-rotas" role="alert">{erro}</p>}
    {carregando ? <p>Carregando rotas...</p> : <section className="lista-rotas">
      {rotas.map(rota => <article className="cartao-rota" key={rota.id}>
        {editando?.id === rota.id ? <form onSubmit={salvarEdicao}>
          <label>Nome<input name="nome" defaultValue={rota.nome} required maxLength="80" /></label>
          <label>Início<input name="inicio" defaultValue={rota.inicio.texto} required /></label>
          <label>Destino<input name="destino" defaultValue={rota.destino.texto} required /></label>
          <div className="acoes-rota"><button disabled={salvando}>{salvando ? 'SALVANDO...' : 'SALVAR'}</button><button type="button" onClick={() => definirEditando(null)}>CANCELAR</button></div>
        </form> : <>
          <div><h2>{rota.nome}{rota.exemplo ? ' · EXEMPLO' : ''}</h2><p>Início: {rota.inicio.texto}</p><p>Destino: {rota.destino.texto}</p></div>
          <div className="acoes-rota"><button onClick={() => { nav.iniciarRotaSalva(rota); voltar(); }}>USAR</button>
            {!rota.exemplo && <><button onClick={() => definirEditando(rota)}>EDITAR</button><button onClick={() => excluir(rota)}>EXCLUIR</button></>}</div>
        </>}
      </article>)}
      {!rotas.length && <p>Nenhuma rota salva.</p>}
    </section>}
  </main>;
}

function TelaRota({ pulso, nav }) {
  const evento = nav.passos[nav.indice]?.tipo;
  const lado = nav.estado === 'orientacao' ? evento : '';
  const legenda = nav.estado === 'orientacao' ? `VIBRAÇÃO À ${evento === 'esquerda' ? 'ESQUERDA' : 'DIREITA'}`
    : nav.estado === 'semaforo' && pulso.modo === modos[0] ? 'SOM AGUDO CONTÍNUO'
      : nav.estado === 'semaforo' && pulso.modo === modos[1] ? 'VIBRANDO CONSTANTEMENTE'
        : nav.estado === 'pressionando' && pulso.modo === modos[0] ? 'SOM GRAVE CURTO'
          : nav.estado === 'pressionando' && pulso.modo === modos[1] ? 'PRESSÃO'
            : nav.estado === 'chegada' && pulso.modo === modos[0] ? 'VOCÊ CHEGOU AO SEU DESTINO'
              : nav.estado === 'chegada' && pulso.modo === modos[1] ? 'CHEGADA' : '';
  return <main className="tela-rota">
    <header className="barra-tela"><button className="botao-voltar-inicio" onClick={nav.voltarInicio}>VOLTAR</button></header>
    <div className="arranjo-rota">
      <Pulseira modo={pulso.modo} menuAberto={pulso.menuAberto} alternarMenu={() => pulso.definirMenu(v => !v)} escolherModo={pulso.escolherModo} iniciarVoz={nav.iniciarVoz} estado={nav.estado} lado={lado} legenda={legenda} horizontal erro={nav.erro} />
      <div className="area-mapa">
        <MapaRota rota={nav.rota} origem={nav.origem} destino={nav.destino} progresso={nav.progresso} passos={nav.passos} />
        <AvisoSemaforo estado={nav.estado} segundos={nav.segundos} />
        <button className="botao-transporte" onClick={nav.abrirTransporte}>ÔNIBUS E TREM</button>
      </div>
    </div>
    <BotoesRota comando={nav.comando} bloqueados={nav.estado === 'calculando'} />
  </main>;
}

function Partida({ partida, selecionada, clicar }) {
  return <button className={`partida ${selecionada ? 'partida-selecionada' : ''}`} onClick={clicar}>
    <span className="partida-tipo">{partida.tipo}</span>
    <span className="partida-linha">{partida.linha}</span>
    <span className="partida-destino">{partida.destino}</span>
    <span className="partida-tempo">{partida.minutos} min</span>
  </button>;
}

function TelaTransporte({ pulso, nav }) {
  const item = nav.partidas[nav.selecionada];
  return <main className="tela-transporte">
    <header className="barra-tela"><button className="botao-voltar-inicio" onClick={nav.voltarInicio}>VOLTAR</button></header>
    <div className="arranjo-transporte">
      <Pulseira modo={pulso.modo} menuAberto={pulso.menuAberto} alternarMenu={() => pulso.definirMenu(v => !v)} escolherModo={pulso.escolherModo} iniciarVoz={nav.iniciarVoz} estado="transporte" transporte horizontal brailleAberto={nav.brailleAberto} focarBraille={() => nav.definirBraille(v => !v)} numero={item?.minutos ?? 0} mostrarFalante chegouTransporte={nav.chegouTransporte} legenda={nav.chegouTransporte ? 'CHEGADA' : ''} />
      <section className="app-transporte" aria-label="Horários de ônibus, trem e metrô">
        <h2 className="titulo-chegando">Chegando Agora</h2>
        {nav.partidas.map((partida, indice) => <Partida key={partida.id} partida={partida} selecionada={indice === nav.selecionada} clicar={() => nav.selecionarPartida(indice)} />)}
      </section>
    </div>
    <button className="voltar-mapa" onClick={nav.voltarMapa}>MAPA</button>
  </main>;
}

export function Aplicativo() {
  const [estadoAudio, setEstadoAudio] = React.useState('inicial');
  const [vitrineAberta, definirVitrineAberta] = useState(false);
  const [rotasAbertas, definirRotasAbertas] = useState(false);
  const pulso = usePulseira(estadoAudio);
  const nav = useNavegacao(pulso.modo, pulso.emitirContinuar);
  useEffect(() => setEstadoAudio(nav.estado), [nav.estado]);

  if (vitrineAberta) return <Vitrine voltar={() => definirVitrineAberta(false)} />;
  if (rotasAbertas) return <RotasSalvas voltar={() => definirRotasAbertas(false)} nav={nav} />;
  if (nav.tela === 'inicio') return <TelaInicial pulso={pulso} nav={nav} abrirVitrine={() => definirVitrineAberta(true)} abrirRotas={() => definirRotasAbertas(true)} />;
  if (nav.tela === 'transporte') return <TelaTransporte pulso={pulso} nav={nav} />;
  return <TelaRota pulso={pulso} nav={nav} />;
}
