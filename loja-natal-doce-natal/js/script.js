/* ==========================================================
   JAVASCRIPT PRINCIPAL - LOJA NATALINA DOCE NATAL
   Um único arquivo para o site todo. Cada recurso só roda se o
   elemento dele existir na página (por isso não dá erro nas outras).
   Obrigatórios: 1 Slideshow, 2 Parallax, 3 Sons, 4 Cards, 5 Filtro
   Extras: 6 Carrinho, 7 Contagem, 8 Formulário, 9 Menu, 10 Modal,
           11 Neve, 12 Animação ao rolar, 13 Voltar ao topo
   ========================================================== */

/* ---------- Funções de apoio ---------- */
function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Tira acentos e maiúsculas para a busca achar "acucar" em "Açúcar"
function normalizar(texto) {
  return texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

// Aviso rápido que some sozinho (substitui os alert() do projeto antigo)
function mostrarAviso(mensagem) {
  const aviso = document.createElement("div");
  aviso.className = "aviso";
  aviso.setAttribute("role", "status");
  aviso.textContent = mensagem;
  document.body.appendChild(aviso);
  setTimeout(() => aviso.remove(), 2600);
}

/* ---------- 1. SLIDESHOW (obrigatório) ---------- */
function initSlideshow() {
  const slides = document.querySelectorAll(".slide");
  if (!slides.length) return;

  const caixaIndicadores = document.getElementById("indicadores");
  const botoes = [];          // as bolinhas
  let atual = 0;
  let timer = null;

  // Só um slide tem a classe "ativo"; as bolinhas seguem o mesmo slide
  function mostrarSlide(indice) {
    slides.forEach(s => s.classList.remove("ativo"));
    botoes.forEach(b => b.classList.remove("ativo"));
    atual = (indice + slides.length) % slides.length;   // volta ao início/fim
    slides[atual].classList.add("ativo");
    if (botoes[atual]) botoes[atual].classList.add("ativo");
  }

  // Troca automática a cada 5s. Reiniciamos o relógio quando a pessoa clica.
  function iniciarTimer() {
    clearInterval(timer);
    timer = setInterval(() => mostrarSlide(atual + 1), 5000);
  }

  function irPara(indice) {
    mostrarSlide(indice);
    iniciarTimer();
  }

  // Cria uma bolinha (button) para cada slide com um laço
  if (caixaIndicadores) {
    slides.forEach((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "indicador";
      b.setAttribute("aria-label", `Ir para o slide ${i + 1}`);
      b.addEventListener("click", () => irPara(i));
      caixaIndicadores.appendChild(b);
      botoes.push(b);
    });
  }

  const proximo = document.getElementById("proximo");
  const anterior = document.getElementById("anterior");
  if (proximo) proximo.addEventListener("click", () => irPara(atual + 1));
  if (anterior) anterior.addEventListener("click", () => irPara(atual - 1));

  mostrarSlide(0);
  iniciarTimer();
}

/* ---------- 2. PARALLAX (obrigatório) ----------
   Cada camada anda uma fração da posição da seção na tela.
   Camadas com velocidades diferentes dão a sensação de profundidade. */
function initParallax() {
  const camadas = document.querySelectorAll("[data-velocidade]");
  if (!camadas.length) return;

  let esperando = false;   // evita recalcular mais de uma vez por quadro

  function atualizar() {
    esperando = false;
    camadas.forEach(camada => {
      const area = camada.parentElement.getBoundingClientRect();
      // -1 quando a seção entra por baixo, 0 no meio da tela, +1 quando sai por cima
      const meioDaSecao = area.top + area.height / 2;
      const posicao = (meioDaSecao - window.innerHeight / 2) / (window.innerHeight / 2 + area.height / 2);
      const limitada = Math.max(-1, Math.min(1, posicao));
      const velocidade = parseFloat(camada.dataset.velocidade);
      camada.style.transform = `translateY(${limitada * velocidade * 120}px)`;
    });
  }

  window.addEventListener("scroll", () => {
    if (!esperando) {
      esperando = true;
      requestAnimationFrame(atualizar);
    }
  });
  atualizar();
}

/* ---------- 3. SONS (obrigatório) ----------
   Não usamos arquivo .mp3: o som é criado pelo navegador (Web Audio API).
   A música é "Jingle Bells" (domínio público), em volume baixo.
   O navegador só libera som depois de um clique, por isso há o botão. */
let audioCtx = null;
let ganhoMusica = null;      // controle de volume da música
let timerMusica = null;
let musicaTocando = false;

// Notas da melodia: [frequência em Hz, duração em "tempos"]
const DO = 523.25, RE = 587.33, MI = 659.25, FA = 698.46, SOL = 783.99;
const MELODIA = [
  [MI, 1], [MI, 1], [MI, 2], [MI, 1], [MI, 1], [MI, 2],
  [MI, 1], [SOL, 1], [DO, 1.5], [RE, 0.5], [MI, 4],
  [FA, 1], [FA, 1], [FA, 1.5], [FA, 0.5], [FA, 1], [MI, 1], [MI, 1], [MI, 0.5], [MI, 0.5],
  [SOL, 1], [SOL, 1], [FA, 1], [RE, 1], [DO, 4]
];
const DURACAO_TEMPO = 0.3;   // segundos por tempo

function obterAudio() {
  if (!audioCtx) {
    const Contexto = window.AudioContext || window.webkitAudioContext;
    if (!Contexto) return null;
    audioCtx = new Contexto();
  }
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

// Toca uma nota: sobe o volume rápido e desce devagar (som de "sininho")
function tocarNota(frequencia, inicio, duracao) {
  const osc = audioCtx.createOscillator();
  const ganho = audioCtx.createGain();
  osc.type = "triangle";
  osc.frequency.value = frequencia;
  ganho.gain.setValueAtTime(0.0001, inicio);
  ganho.gain.exponentialRampToValueAtTime(1, inicio + 0.02);
  ganho.gain.exponentialRampToValueAtTime(0.0001, inicio + duracao);
  osc.connect(ganho);
  ganho.connect(ganhoMusica);
  osc.start(inicio);
  osc.stop(inicio + duracao + 0.05);
}

// Agenda a melodia inteira e, quando ela acaba, agenda de novo (loop)
function agendarMelodia() {
  if (!musicaTocando) return;
  let momento = audioCtx.currentTime + 0.1;
  MELODIA.forEach(([frequencia, tempos]) => {
    const duracao = tempos * DURACAO_TEMPO;
    tocarNota(frequencia, momento, duracao * 0.9);
    momento += duracao;
  });
  momento += DURACAO_TEMPO * 2;   // pausa antes de repetir
  timerMusica = setTimeout(agendarMelodia, (momento - audioCtx.currentTime) * 1000);
}

function ligarMusica() {
  if (!obterAudio()) return;
  ganhoMusica = audioCtx.createGain();
  ganhoMusica.gain.value = 0.07;            // volume baixo (vai de 0 a 1)
  ganhoMusica.connect(audioCtx.destination);
  musicaTocando = true;
  agendarMelodia();
}

function desligarMusica() {
  musicaTocando = false;
  clearTimeout(timerMusica);
  if (ganhoMusica) {
    ganhoMusica.disconnect();               // corta o som na hora
    ganhoMusica = null;
  }
}

function initSons() {
  const botao = document.getElementById("btn-musica");
  if (!botao) return;
  const icone = botao.querySelector(".icone");
  const rotulo = botao.querySelector(".rotulo");

  botao.addEventListener("click", () => {
    if (musicaTocando) desligarMusica(); else ligarMusica();
    botao.setAttribute("aria-pressed", String(musicaTocando));
    botao.setAttribute("aria-label", musicaTocando ? "Pausar música de Natal" : "Tocar música de Natal");
    if (icone) icone.textContent = musicaTocando ? "🔊" : "🎵";
    if (rotulo) rotulo.textContent = musicaTocando ? "Pausar música" : "Tocar música";
  });
}

// Efeito sonoro curtinho (sininho) usado ao adicionar no carrinho e ao enviar o formulário
function tocarSino() {
  try {
    const ctx = obterAudio();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const ganho = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.5);
    ganho.gain.setValueAtTime(0.15, ctx.currentTime);
    ganho.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.connect(ganho);
    ganho.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch (erro) {
    console.log("Áudio bloqueado pelo navegador.");
  }
}

/* ---------- 4. CARDS DINÂMICOS (obrigatório) ----------
   Um produto vira HTML de um card; map() faz isso para os 50 e
   join("") junta tudo em um texto único que vai para o innerHTML. */
function criarCard(produto) {
  return `
    <article class="card revelar">
      <button type="button" class="card-img-btn" data-detalhes="${produto.id}" aria-label="Ver detalhes de ${produto.nome}">
        <img src="${produto.imagem}" alt="${produto.nome}" loading="lazy">
      </button>
      <div class="card-body">
        <span class="card-categoria">${produto.categoria}</span>
        <h3>${produto.nome}</h3>
        <p>${produto.descricao}</p>
        <div class="card-preco">${formatarPreco(produto.preco)}</div>
        <button type="button" class="btn-comprar" data-id="${produto.id}">Adicionar ao Carrinho 🛒</button>
      </div>
    </article>
  `;
}

function mostrarProdutos(lista) {
  const area = document.getElementById("lista-produtos");
  if (!area) return;

  if (lista.length === 0) {
    area.innerHTML = `
      <div class="sem-resultado">
        <h2>🎅 Ops! Nenhum produto encontrado.</h2>
        <p>Tente buscar por outro termo ou categoria natalina! ❄️</p>
      </div>`;
    return;
  }

  area.innerHTML = lista.map(criarCard).join("");
  observarElementos();   // os cards novos também precisam da animação ao rolar
}

/* ---------- 5. FILTRO E BUSCA (obrigatório) ---------- */
function initFiltroEBusca() {
  const campoBusca = document.getElementById("busca");
  const seletorCat = document.getElementById("categoria");
  const contador = document.getElementById("contador");
  if (!campoBusca || !seletorCat) return;

  function filtrar() {
    const texto = normalizar(campoBusca.value.trim());
    const categoria = seletorCat.value;

    const resultado = produtos.filter(p => {
      const combinaTexto = normalizar(p.nome).includes(texto) || normalizar(p.descricao).includes(texto);
      const combinaCategoria = categoria === "todas" || p.categoria === categoria;
      return combinaTexto && combinaCategoria;
    });

    mostrarProdutos(resultado);
    if (contador) {
      contador.textContent = `Mostrando ${resultado.length} de ${produtos.length} produtos`;
    }
  }

  campoBusca.addEventListener("input", filtrar);
  seletorCat.addEventListener("change", filtrar);
}

/* ---------- 6. CARRINHO DE COMPRAS (extra) ----------
   O carrinho guarda só { id, qtd } de cada item no localStorage.
   Nome, preço e imagem são buscados no array "produtos" pelo id. */
const CHAVE_CARRINHO = "carrinho_doce_natal_v2";
let carrinho = lerCarrinho();

function lerCarrinho() {
  try {
    const dados = JSON.parse(localStorage.getItem(CHAVE_CARRINHO));
    if (!Array.isArray(dados)) return [];
    return dados.filter(i => i && Number.isInteger(i.id) && i.qtd > 0);
  } catch (erro) {
    return [];   // localStorage bloqueado ou texto inválido
  }
}

function salvarCarrinho() {
  try {
    localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(carrinho));
  } catch (erro) {
    console.log("Não foi possível salvar o carrinho neste navegador.");
  }
}

function quantidadeTotal() {
  return carrinho.reduce((soma, item) => soma + item.qtd, 0);
}

function valorTotal() {
  return carrinho.reduce((soma, item) => {
    const p = produtos.find(prod => prod.id === item.id);
    return soma + (p ? p.preco * item.qtd : 0);
  }, 0);
}

function adicionarAoCarrinho(id) {
  const p = produtos.find(item => item.id === id);
  if (!p) return;
  const existente = carrinho.find(item => item.id === id);
  if (existente) existente.qtd++; else carrinho.push({ id, qtd: 1 });
  salvarCarrinho();
  atualizarCarrinho();
  tocarSino();
  mostrarAviso(`✨ "${p.nome}" foi para o carrinho!`);
}

function alterarQuantidade(id, delta) {
  const item = carrinho.find(i => i.id === id);
  if (!item) return;
  item.qtd += delta;
  if (item.qtd <= 0) carrinho = carrinho.filter(i => i.id !== id);   // chegou a 0: remove
  salvarCarrinho();
  atualizarCarrinho();
}

function removerDoCarrinho(id) {
  carrinho = carrinho.filter(i => i.id !== id);
  salvarCarrinho();
  atualizarCarrinho();
}

function limparCarrinho() {
  carrinho = [];
  salvarCarrinho();
  atualizarCarrinho();
}

// Atualiza o número no cabeçalho e, se o painel existir, a lista e o total
function atualizarCarrinho() {
  const badge = document.getElementById("qtd-carrinho");
  if (badge) badge.textContent = quantidadeTotal();

  const lista = document.getElementById("carrinho-lista");
  const total = document.getElementById("carrinho-total");
  if (!lista || !total) return;

  if (carrinho.length === 0) {
    lista.innerHTML = `<li class="carrinho-vazio">🎄 Seu carrinho natalino está vazio.<br>Adicione deliciosos produtos para a sua ceia!</li>`;
  } else {
    lista.innerHTML = carrinho.map(item => {
      const p = produtos.find(prod => prod.id === item.id);
      if (!p) return "";
      return `
        <li class="item-carrinho">
          <img src="${p.imagem}" alt="${p.nome}">
          <div>
            <div class="item-nome">${p.nome}</div>
            <div class="item-preco">${formatarPreco(p.preco * item.qtd)}</div>
            <div class="item-qtd">
              <button type="button" data-diminuir="${p.id}" aria-label="Diminuir quantidade de ${p.nome}">−</button>
              <span aria-label="Quantidade">${item.qtd}</span>
              <button type="button" data-aumentar="${p.id}" aria-label="Aumentar quantidade de ${p.nome}">+</button>
            </div>
          </div>
          <button type="button" class="item-remover" data-remover="${p.id}" aria-label="Remover ${p.nome} do carrinho">🗑️</button>
        </li>`;
    }).join("");
  }
  total.textContent = formatarPreco(valorTotal());
}

// Cria o painel do carrinho uma vez só (assim não precisa repetir o HTML nas 5 páginas)
function criarPainelCarrinho() {
  const fundo = document.createElement("div");
  fundo.className = "carrinho-fundo";
  fundo.id = "carrinho-fundo";

  const painel = document.createElement("aside");
  painel.className = "carrinho-painel";
  painel.id = "carrinho-painel";
  painel.setAttribute("aria-label", "Carrinho de compras");
  painel.innerHTML = `
    <div class="carrinho-topo">
      <h2>🛒 Seu Carrinho</h2>
      <button type="button" class="carrinho-fechar" aria-label="Fechar carrinho">&times;</button>
    </div>
    <ul class="carrinho-lista" id="carrinho-lista"></ul>
    <div class="carrinho-rodape">
      <div class="carrinho-total"><span>Total:</span> <strong id="carrinho-total">R$ 0,00</strong></div>
      <div class="carrinho-acoes">
        <button type="button" class="btn-comprar btn-secundario" id="carrinho-limpar">Limpar</button>
        <button type="button" class="btn-comprar" id="carrinho-finalizar">Finalizar compra</button>
      </div>
    </div>`;
  document.body.appendChild(fundo);
  document.body.appendChild(painel);

  fundo.addEventListener("click", fecharCarrinho);
  painel.querySelector(".carrinho-fechar").addEventListener("click", fecharCarrinho);
  document.getElementById("carrinho-limpar").addEventListener("click", limparCarrinho);
  document.getElementById("carrinho-finalizar").addEventListener("click", () => {
    if (carrinho.length === 0) {
      mostrarAviso("Seu carrinho está vazio!");
      return;
    }
    limparCarrinho();
    fecharCarrinho();
    tocarSino();
    mostrarAviso("🎁 Pedido simulado com sucesso! Feliz Natal!");   // a loja é fictícia
  });

  // Botões + − 🗑️ da lista (delegação: a lista é recriada a cada mudança)
  painel.addEventListener("click", (e) => {
    const mais = e.target.closest("[data-aumentar]");
    const menos = e.target.closest("[data-diminuir]");
    const remover = e.target.closest("[data-remover]");
    if (mais) alterarQuantidade(Number(mais.dataset.aumentar), 1);
    if (menos) alterarQuantidade(Number(menos.dataset.diminuir), -1);
    if (remover) removerDoCarrinho(Number(remover.dataset.remover));
  });
}

function abrirCarrinho() {
  document.body.classList.add("carrinho-aberto");
}

function fecharCarrinho() {
  document.body.classList.remove("carrinho-aberto");
}

function initCarrinho() {
  criarPainelCarrinho();
  const botao = document.getElementById("btn-carrinho");
  if (botao) botao.addEventListener("click", abrirCarrinho);
  atualizarCarrinho();
}

/* ---------- 7. CONTAGEM REGRESSIVA (extra) ---------- */
function initContagemRegressiva() {
  const elementos = document.querySelectorAll("[data-contagem]");
  if (!elementos.length) return;

  function atualizar() {
    const agora = new Date();
    let natal = new Date(agora.getFullYear(), 11, 25);          // mês 11 = dezembro!
    if (agora > natal) natal = new Date(agora.getFullYear() + 1, 11, 25);

    const falta = natal - agora;                                // milissegundos
    const dias = Math.floor(falta / (1000 * 60 * 60 * 24));
    const horas = Math.floor(falta / (1000 * 60 * 60)) % 24;
    const minutos = Math.floor(falta / (1000 * 60)) % 60;
    const segundos = Math.floor(falta / 1000) % 60;

    const texto = `Faltam ${dias}d ${horas}h ${minutos}min ${segundos}s para o Natal! 🎅🎁`;
    elementos.forEach(el => el.textContent = texto);
  }

  atualizar();
  setInterval(atualizar, 1000);
}

/* ---------- 8. VALIDAÇÃO DE FORMULÁRIO (extra) ---------- */
function initValidacaoForm() {
  const form = document.getElementById("form-contato");
  const alerta = document.getElementById("mensagem-alerta");
  if (!form || !alerta) return;

  const campos = {
    nome: document.getElementById("nome"),
    email: document.getElementById("email"),
    mensagem: document.getElementById("mensagem")
  };

  // Mostra (ou limpa) o erro embaixo de um campo
  function marcarErro(nomeCampo, texto) {
    const campo = campos[nomeCampo];
    const span = document.getElementById("erro-" + nomeCampo);
    campo.setAttribute("aria-invalid", texto ? "true" : "false");
    if (span) span.textContent = texto;
  }

  // Devolve o texto do erro de cada campo ("" quando está tudo certo)
  function validarCampo(nomeCampo) {
    const valor = campos[nomeCampo].value.trim();
    if (nomeCampo === "nome") {
      if (valor === "") return "Por favor, digite seu nome.";
      if (valor.length < 3) return "O nome precisa ter pelo menos 3 letras.";
    }
    if (nomeCampo === "email") {
      const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
      if (valor === "") return "Por favor, digite seu e-mail.";
      if (!emailValido) return "Digite um e-mail válido, como nome@exemplo.com.";
    }
    if (nomeCampo === "mensagem") {
      if (valor === "") return "Escreva a sua mensagem.";
      if (valor.length < 10) return "A mensagem precisa ter pelo menos 10 caracteres.";
    }
    return "";
  }

  // Limpa o erro assim que a pessoa corrige o campo
  Object.keys(campos).forEach(nomeCampo => {
    campos[nomeCampo].addEventListener("input", () => {
      if (campos[nomeCampo].getAttribute("aria-invalid") === "true") {
        marcarErro(nomeCampo, validarCampo(nomeCampo));
      }
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();                      // impede a página de recarregar
    let primeiroComErro = null;

    Object.keys(campos).forEach(nomeCampo => {
      const erro = validarCampo(nomeCampo);
      marcarErro(nomeCampo, erro);
      if (erro && !primeiroComErro) primeiroComErro = campos[nomeCampo];
    });

    if (primeiroComErro) {
      alerta.className = "mensagem-alerta erro";
      alerta.textContent = "⚠️ Corrija os campos destacados e tente novamente.";
      alerta.style.display = "block";
      primeiroComErro.focus();
      return;
    }

    const nome = campos.nome.value.trim();
    alerta.className = "mensagem-alerta sucesso";
    alerta.textContent = `✨ Obrigado, ${nome}! Sua mensagem de Natal foi enviada com sucesso!`;
    alerta.style.display = "block";
    form.reset();
    tocarSino();
  });
}

/* ---------- 9. MENU RESPONSIVO / HAMBÚRGUER (extra) ---------- */
function initMenuResponsivo() {
  const botao = document.querySelector(".btn-menu");
  const menu = document.querySelector(".menu");
  if (!botao || !menu) return;

  function definirMenu(aberto) {
    menu.classList.toggle("aberto", aberto);
    botao.setAttribute("aria-expanded", String(aberto));
    botao.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
    botao.textContent = aberto ? "✕" : "☰";
  }

  botao.addEventListener("click", () => definirMenu(!menu.classList.contains("aberto")));
  menu.addEventListener("click", (e) => {
    if (e.target.closest("a")) definirMenu(false);       // fecha ao escolher uma página
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 992) definirMenu(false);    // no desktop o menu já aparece
  });
}

/* ---------- 10. MODAL / LIGHTBOX (extra) ---------- */
function abrirModalProduto(id) {
  const p = produtos.find(item => item.id === id);
  const modal = document.getElementById("modal-produto");
  const corpo = document.getElementById("modal-corpo");
  if (!p || !modal || !corpo) return;

  corpo.innerHTML = `
    <img class="modal-img" src="${p.imagem}" alt="${p.nome}">
    <h2 class="modal-titulo">${p.nome}</h2>
    <p class="modal-categoria">${p.categoria}</p>
    <p class="modal-texto">${p.descricao}</p>
    <h3 class="modal-preco">${formatarPreco(p.preco)}</h3>
    <button type="button" class="btn-comprar" data-id="${p.id}">Adicionar ao Carrinho 🛒</button>
  `;
  modal.classList.add("aberto");
  modal.querySelector(".fechar-modal").focus();
}

function fecharModal() {
  const modal = document.getElementById("modal-produto");
  if (modal) modal.classList.remove("aberto");
}

function initModal() {
  const modal = document.getElementById("modal-produto");
  if (!modal) return;

  modal.querySelector(".fechar-modal").addEventListener("click", fecharModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) fecharModal();               // clique no fundo escuro
  });
}

/* ---------- 11. EFEITO DE NEVE (extra) ---------- */
function initEfeitoNeve() {
  const quantidade = 25;
  for (let i = 0; i < quantidade; i++) {
    const floco = document.createElement("div");
    floco.className = "floco";
    floco.textContent = "❄";
    floco.setAttribute("aria-hidden", "true");
    floco.style.left = Math.random() * 100 + "vw";
    floco.style.animationDuration = (Math.random() * 5 + 6) + "s";
    floco.style.animationDelay = (-Math.random() * 10) + "s";   // começam em alturas diferentes
    floco.style.fontSize = (Math.random() * 14 + 10) + "px";
    document.body.appendChild(floco);
  }
}

/* ---------- 12. ANIMAÇÃO AO ROLAR (extra) ----------
   Um único observador vigia todos os elementos .revelar. Quando um
   deles aparece na tela, ganha a classe .visivel (o CSS faz a animação). */
let observador = null;

function initObservador() {
  observador = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("visivel");
        observador.unobserve(entrada.target);            // já apareceu: não precisa vigiar mais
      }
    });
  }, { threshold: 0.1 });
  observarElementos();
}

// Chamada na inicialização e toda vez que novos cards são criados
function observarElementos() {
  if (!observador) return;
  document.querySelectorAll(".revelar:not(.visivel)").forEach(el => observador.observe(el));
}

/* ---------- 13. BOTÃO VOLTAR AO TOPO (extra) ---------- */
function initBotaoTopo() {
  const botao = document.getElementById("topo");
  if (!botao) return;

  window.addEventListener("scroll", () => {
    botao.style.display = window.scrollY > 400 ? "block" : "none";
  });
  botao.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* ---------- CLIQUES NOS CARDS, NA GALERIA E NO MODAL ----------
   Os cards são criados pelo JavaScript depois que a página carrega,
   então escutamos o clique no documento inteiro (delegação de evento)
   e perguntamos "qual elemento foi clicado?" com e.target.closest(). */
function initCliquesGerais() {
  document.addEventListener("click", (e) => {
    const comprar = e.target.closest(".btn-comprar[data-id]");
    if (comprar) {
      adicionarAoCarrinho(Number(comprar.dataset.id));
      return;
    }
    const detalhes = e.target.closest("[data-detalhes]");
    if (detalhes) abrirModalProduto(Number(detalhes.dataset.detalhes));
  });

  // Tecla Esc fecha o modal, o carrinho e o menu aberto
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    fecharModal();
    fecharCarrinho();
  });
}

/* ---------- INICIALIZAÇÃO GERAL ---------- */
document.addEventListener("DOMContentLoaded", () => {
  initSlideshow();
  initParallax();
  initSons();
  initFiltroEBusca();
  initCarrinho();
  initContagemRegressiva();
  initValidacaoForm();
  initMenuResponsivo();
  initModal();
  initEfeitoNeve();
  initObservador();
  initBotaoTopo();
  initCliquesGerais();

  // Home mostra só os destaques; Produtos mostra os 50
  const area = document.getElementById("lista-produtos");
  if (area && typeof produtos !== "undefined") {
    if (document.body.classList.contains("pagina-home")) {
      mostrarProdutos(produtos.filter(p => p.destaque));
    } else {
      mostrarProdutos(produtos);
    }
  }
});
