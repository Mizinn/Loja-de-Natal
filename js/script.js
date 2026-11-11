/* ==========================================================
   DOCE NATAL - script.js
   Um arquivo só para o site inteiro. Cada função começa
   verificando se o elemento existe na página; se não existir,
   ela para ali (return) e não dá erro nas outras páginas.

   Obrigatórios: 1 Slideshow · 2 Parallax · 3 Sons · 4 Cards · 5 Filtro e busca
   Extras: 6 Carrinho · 7 Contagem regressiva · 8 Validação do formulário
           9 Menu hambúrguer · 10 Modal e lightbox · 11 Neve
           12 Animação ao rolar · 13 Voltar ao topo
   ========================================================== */

/* ---------- Funções de apoio ---------- */

// 59.9 -> "R$ 59,90"
function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// Deixa o texto minúsculo e sem acento, para "acucar" achar "Açúcar"
function normalizar(texto) {
  return texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

// Mensagem rápida no rodapé da tela, que some sozinha
function mostrarAviso(texto) {
  const aviso = document.createElement("div");
  aviso.className = "aviso";
  aviso.setAttribute("role", "status");
  aviso.textContent = texto;
  document.body.appendChild(aviso);
  setTimeout(() => aviso.remove(), 2500);
}


/* ---------- 1. SLIDESHOW ----------
   Os slides ficam empilhados no mesmo lugar (CSS position: absolute).
   Só o que tem a classe "ativo" fica visível. Como as fotos têm a mesma
   proporção da caixa (4:3), nenhuma aparece cortada ao trocar. */
function iniciarSlideshow() {
  const slides = document.querySelectorAll(".slide");
  if (slides.length === 0) return;

  const caixaBolinhas = document.getElementById("indicadores");
  const bolinhas = [];
  let atual = 0;
  let relogio;

  function mostrarSlide(indice) {
    slides[atual].classList.remove("ativo");
    bolinhas[atual].classList.remove("ativo");

    // o % faz voltar ao primeiro depois do último (e ao último antes do primeiro)
    atual = (indice + slides.length) % slides.length;

    slides[atual].classList.add("ativo");
    bolinhas[atual].classList.add("ativo");
  }

  // troca sozinho a cada 5 segundos; quando a pessoa clica, o tempo recomeça
  function reiniciarRelogio() {
    clearInterval(relogio);
    relogio = setInterval(() => mostrarSlide(atual + 1), 5000);
  }

  // uma bolinha para cada slide
  slides.forEach((slide, i) => {
    const bolinha = document.createElement("button");
    bolinha.type = "button";
    bolinha.className = "indicador";
    bolinha.setAttribute("aria-label", "Mostrar foto " + (i + 1));
    bolinha.addEventListener("click", () => {
      mostrarSlide(i);
      reiniciarRelogio();
    });
    caixaBolinhas.appendChild(bolinha);
    bolinhas.push(bolinha);
  });

  document.getElementById("proximo").addEventListener("click", () => {
    mostrarSlide(atual + 1);
    reiniciarRelogio();
  });
  document.getElementById("anterior").addEventListener("click", () => {
    mostrarSlide(atual - 1);
    reiniciarRelogio();
  });

  bolinhas[0].classList.add("ativo");
  reiniciarRelogio();
}


/* ---------- 2. PARALLAX ----------
   Quando a página rola, cada camada se move uma fração diferente
   (data-velocidade). O fundo anda pouco e os pinheiros andam mais:
   isso dá a sensação de profundidade. */
function iniciarParallax() {
  const camadas = document.querySelectorAll("[data-velocidade]");
  if (camadas.length === 0) return;

  const secao = camadas[0].parentElement;

  function mover() {
    // distância entre o meio da seção e o meio da tela
    const caixa = secao.getBoundingClientRect();
    const distancia = caixa.top + caixa.height / 2 - window.innerHeight / 2;

    camadas.forEach(camada => {
      const velocidade = Number(camada.dataset.velocidade);
      camada.style.transform = `translateY(${distancia * velocidade * -0.3}px)`;
    });
  }

  window.addEventListener("scroll", mover);
  mover();
}


/* ---------- 3. SONS ----------
   Não usamos arquivo de áudio: a música "Jingle Bells" (domínio público)
   é tocada nota por nota pelo próprio navegador, com a Web Audio API.
   O navegador só deixa tocar som depois de um clique, por isso existe o botão. */
let audio = null;            // o "aparelho de som" do navegador
let volumeMusica = null;     // controla o volume só da música
let tocando = false;
let proximaVolta = null;

// cada nota: [frequência em Hz, duração em tempos]
const DO = 523.25, RE = 587.33, MI = 659.25, FA = 698.46, SOL = 783.99;
const MUSICA = [
  [MI, 1], [MI, 1], [MI, 2],   [MI, 1], [MI, 1], [MI, 2],
  [MI, 1], [SOL, 1], [DO, 1.5], [RE, 0.5], [MI, 4],
  [FA, 1], [FA, 1], [FA, 1.5], [FA, 0.5], [FA, 1], [MI, 1], [MI, 1], [MI, 0.5], [MI, 0.5],
  [MI, 1], [RE, 1], [RE, 1], [MI, 1], [RE, 2], [SOL, 2]
];
const TEMPO = 0.28;          // segundos de cada tempo

function prepararAudio() {
  if (!audio) audio = new (window.AudioContext || window.webkitAudioContext)();
  if (audio.state === "suspended") audio.resume();
}

// toca uma nota com som de sininho: começa forte e vai sumindo
function tocarNota(frequencia, inicio, duracao, saida) {
  const oscilador = audio.createOscillator();
  const volume = audio.createGain();
  oscilador.type = "triangle";
  oscilador.frequency.value = frequencia;
  volume.gain.setValueAtTime(0.0001, inicio);
  volume.gain.exponentialRampToValueAtTime(1, inicio + 0.02);
  volume.gain.exponentialRampToValueAtTime(0.0001, inicio + duracao);
  oscilador.connect(volume);
  volume.connect(saida);
  oscilador.start(inicio);
  oscilador.stop(inicio + duracao + 0.05);
}

// agenda a música inteira e, quando acabar, agenda de novo (repete)
function tocarMusica() {
  if (!tocando) return;
  let momento = audio.currentTime + 0.1;
  MUSICA.forEach(([frequencia, tempos]) => {
    tocarNota(frequencia, momento, tempos * TEMPO * 0.9, volumeMusica);
    momento += tempos * TEMPO;
  });
  proximaVolta = setTimeout(tocarMusica, (momento - audio.currentTime + 0.6) * 1000);
}

function ligarDesligarMusica(botao) {
  prepararAudio();
  if (tocando) {
    tocando = false;
    clearTimeout(proximaVolta);
    volumeMusica.disconnect();        // corta o som na hora
  } else {
    tocando = true;
    volumeMusica = audio.createGain();
    volumeMusica.gain.value = 0.06;   // volume baixinho
    volumeMusica.connect(audio.destination);
    tocarMusica();
  }
  botao.setAttribute("aria-pressed", String(tocando));
  botao.querySelector(".rotulo").textContent = tocando ? "Pausar" : "Música";
}

// "plim" curtinho: ao colocar na sacola e ao enviar o formulário
function tocarSino() {
  try {
    prepararAudio();
    tocarNota(1318.5, audio.currentTime, 0.5, audio.destination);
    tocarNota(1975.5, audio.currentTime + 0.08, 0.6, audio.destination);
  } catch (erro) {
    // se o navegador bloquear o som, o site continua funcionando
  }
}

function iniciarSons() {
  const botao = document.getElementById("btn-musica");
  if (!botao) return;
  botao.addEventListener("click", () => ligarDesligarMusica(botao));
}


/* ---------- 4. CARDS DINÂMICOS ----------
   criarCard recebe UM produto e devolve o HTML do card (template literal).
   mostrarProdutos usa map() para fazer isso com a lista toda e join("")
   para juntar tudo em um texto só, que vai para o innerHTML. */
function criarCard(produto) {
  return `
    <article class="card revelar">
      ${produto.destaque ? '<span class="fita">Mais pedido</span>' : ""}
      <button type="button" class="card-foto" data-detalhes="${produto.id}" aria-label="Ver detalhes: ${produto.nome}">
        <img src="${produto.imagem}" alt="${produto.nome}" loading="lazy">
      </button>
      <div class="card-corpo">
        <span class="card-categoria">${produto.categoria}</span>
        <h3>${produto.nome}</h3>
        <p>${produto.descricao}</p>
        <div class="card-rodape">
          <span class="etiqueta">${formatarPreco(produto.preco)}</span>
          <button type="button" class="botao btn-comprar" data-id="${produto.id}">+ Sacola</button>
        </div>
      </div>
    </article>`;
}

function mostrarProdutos(lista) {
  const area = document.getElementById("lista-produtos");
  if (!area) return;

  if (lista.length === 0) {
    area.innerHTML = `
      <div class="sem-resultado">
        <h2>Nenhum doce encontrado</h2>
        <p>Tente outra palavra ou escolha "Todas" nas categorias.</p>
      </div>`;
    return;
  }

  area.innerHTML = lista.map(criarCard).join("");
  observarNovos();   // os cards novos também ganham a animação ao rolar
}


/* ---------- 5. FILTRO E BUSCA ----------
   A cada letra digitada ou categoria clicada, filtramos o array
   completo e desenhamos os cards de novo. */
function iniciarFiltro() {
  const campoBusca = document.getElementById("busca");
  const botoesCategoria = document.querySelectorAll("#categorias button");
  const contador = document.getElementById("contador");
  if (!campoBusca) return;

  let categoriaEscolhida = "todas";

  function filtrar() {
    const texto = normalizar(campoBusca.value.trim());

    const resultado = produtos.filter(produto => {
      const achouTexto = normalizar(produto.nome).includes(texto) ||
                         normalizar(produto.descricao).includes(texto);
      const achouCategoria = categoriaEscolhida === "todas" ||
                             produto.categoria === categoriaEscolhida;
      return achouTexto && achouCategoria;
    });

    mostrarProdutos(resultado);
    contador.textContent = `Mostrando ${resultado.length} de ${produtos.length} produtos`;
  }

  campoBusca.addEventListener("input", filtrar);

  botoesCategoria.forEach(botao => {
    botao.addEventListener("click", () => {
      botoesCategoria.forEach(b => b.classList.remove("ativo"));
      botao.classList.add("ativo");
      categoriaEscolhida = botao.dataset.categoria;
      filtrar();
    });
  });
}


/* ---------- 6. CARRINHO (sacola) ----------
   Guardamos só { id, qtd } de cada item no localStorage.
   Nome, preço e foto são buscados no array "produtos" pelo id. */
const CHAVE = "sacola-doce-natal";
let carrinho = lerCarrinho();

function lerCarrinho() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE)) || [];
  } catch (erro) {
    return [];
  }
}

function salvarCarrinho() {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(carrinho));
  } catch (erro) {
    // navegador sem localStorage: a sacola funciona, só não fica salva
  }
  atualizarCarrinho();
}

function buscarProduto(id) {
  return produtos.find(p => p.id === id);
}

function adicionarAoCarrinho(id) {
  const produto = buscarProduto(id);
  if (!produto) return;

  const item = carrinho.find(i => i.id === id);
  if (item) {
    item.qtd++;
  } else {
    carrinho.push({ id: id, qtd: 1 });
  }
  salvarCarrinho();
  tocarSino();
  mostrarAviso(`"${produto.nome}" foi para a sacola`);
}

function mudarQuantidade(id, mudanca) {
  const item = carrinho.find(i => i.id === id);
  if (!item) return;
  item.qtd += mudanca;
  if (item.qtd <= 0) {
    carrinho = carrinho.filter(i => i.id !== id);   // chegou a zero: sai da sacola
  }
  salvarCarrinho();
}

function removerDoCarrinho(id) {
  carrinho = carrinho.filter(i => i.id !== id);
  salvarCarrinho();
}

function atualizarCarrinho() {
  // número no botão do cabeçalho (soma das quantidades)
  const quantidade = carrinho.reduce((soma, item) => soma + item.qtd, 0);
  document.getElementById("qtd-carrinho").textContent = quantidade;

  // valor total
  const total = carrinho.reduce((soma, item) => {
    const produto = buscarProduto(item.id);
    return produto ? soma + produto.preco * item.qtd : soma;
  }, 0);
  document.getElementById("carrinho-total").textContent = formatarPreco(total);

  // lista de itens
  const lista = document.getElementById("carrinho-lista");
  if (carrinho.length === 0) {
    lista.innerHTML = `<li class="carrinho-vazio">Sua sacola está vazia.<br>Que tal um panetone?</li>`;
    return;
  }
  lista.innerHTML = carrinho.map(item => {
    const p = buscarProduto(item.id);
    if (!p) return "";
    return `
      <li class="item">
        <img src="${p.imagem}" alt="${p.nome}">
        <div>
          <div class="item-nome">${p.nome}</div>
          <div class="item-preco">${formatarPreco(p.preco * item.qtd)}</div>
          <div class="item-qtd">
            <button type="button" data-menos="${p.id}" aria-label="Diminuir ${p.nome}">−</button>
            <span>${item.qtd}</span>
            <button type="button" data-mais="${p.id}" aria-label="Aumentar ${p.nome}">+</button>
          </div>
        </div>
        <button type="button" class="item-remover" data-remover="${p.id}" aria-label="Remover ${p.nome}">×</button>
      </li>`;
  }).join("");
}

// O HTML da sacola é criado aqui uma vez só, para não repetir nas 5 páginas
function iniciarCarrinho() {
  const fundo = document.createElement("div");
  fundo.className = "carrinho-fundo";

  const gaveta = document.createElement("aside");
  gaveta.className = "carrinho";
  gaveta.setAttribute("aria-label", "Sacola de compras");
  gaveta.innerHTML = `
    <div class="carrinho-topo">
      <h2>Sua sacola</h2>
      <button type="button" class="fechar" id="fechar-carrinho" aria-label="Fechar sacola">×</button>
    </div>
    <ul class="carrinho-lista" id="carrinho-lista"></ul>
    <div class="carrinho-rodape">
      <div class="carrinho-total"><span>Total</span><strong id="carrinho-total">R$ 0,00</strong></div>
      <div class="carrinho-botoes">
        <button type="button" class="botao botao-contorno" id="esvaziar">Esvaziar</button>
        <button type="button" class="botao botao-verde" id="finalizar">Finalizar pedido</button>
      </div>
    </div>`;
  document.body.append(fundo, gaveta);

  const abrir = () => document.body.classList.add("carrinho-aberto");
  const fechar = () => document.body.classList.remove("carrinho-aberto");

  document.getElementById("btn-carrinho").addEventListener("click", abrir);
  document.getElementById("fechar-carrinho").addEventListener("click", fechar);
  fundo.addEventListener("click", fechar);

  document.getElementById("esvaziar").addEventListener("click", () => {
    carrinho = [];
    salvarCarrinho();
  });

  document.getElementById("finalizar").addEventListener("click", () => {
    if (carrinho.length === 0) {
      mostrarAviso("A sacola está vazia.");
      return;
    }
    carrinho = [];
    salvarCarrinho();
    fechar();
    tocarSino();
    mostrarAviso("Pedido de teste enviado! (a loja é fictícia)");
  });

  // botões + − × da lista (delegação: a lista é recriada a cada mudança)
  gaveta.addEventListener("click", evento => {
    const alvo = evento.target;
    if (alvo.dataset.mais) mudarQuantidade(Number(alvo.dataset.mais), 1);
    if (alvo.dataset.menos) mudarQuantidade(Number(alvo.dataset.menos), -1);
    if (alvo.dataset.remover) removerDoCarrinho(Number(alvo.dataset.remover));
  });

  atualizarCarrinho();
}


/* ---------- 7. CONTAGEM REGRESSIVA ----------
   setInterval chama a função a cada 1 segundo. */
function iniciarContagem() {
  const caixas = document.querySelectorAll("[data-contagem]");
  if (caixas.length === 0) return;

  function atualizar() {
    const agora = new Date();
    let natal = new Date(agora.getFullYear(), 11, 25);   // mês 11 = dezembro (começa no 0)
    if (agora > natal) natal = new Date(agora.getFullYear() + 1, 11, 25);

    const falta = natal - agora;                         // em milissegundos
    const dias = Math.floor(falta / (1000 * 60 * 60 * 24));
    const horas = Math.floor(falta / (1000 * 60 * 60)) % 24;
    const minutos = Math.floor(falta / (1000 * 60)) % 60;
    const segundos = Math.floor(falta / 1000) % 60;

    // padStart deixa sempre com 2 dígitos: 7 -> "07"
    caixas.forEach(caixa => {
      caixa.querySelector("[data-dias]").textContent = dias;
      caixa.querySelector("[data-horas]").textContent = String(horas).padStart(2, "0");
      caixa.querySelector("[data-minutos]").textContent = String(minutos).padStart(2, "0");
      caixa.querySelector("[data-segundos]").textContent = String(segundos).padStart(2, "0");
    });
  }

  atualizar();
  setInterval(atualizar, 1000);
}


/* ---------- 8. VALIDAÇÃO DO FORMULÁRIO ---------- */
function iniciarFormulario() {
  const form = document.getElementById("form-contato");
  if (!form) return;

  const mensagemFinal = document.getElementById("mensagem-form");
  const nomesCampos = ["nome", "email", "assunto", "mensagem"];

  // devolve o texto do erro, ou "" se o campo estiver certo
  function verificar(nomeCampo) {
    const valor = document.getElementById(nomeCampo).value.trim();

    if (nomeCampo === "nome") {
      if (valor === "") return "Escreva o seu nome.";
      if (valor.length < 3) return "O nome precisa ter pelo menos 3 letras.";
    }
    if (nomeCampo === "email") {
      if (valor === "") return "Escreva o seu e-mail.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) return "Esse e-mail parece incompleto. Exemplo: nome@email.com";
    }
    if (nomeCampo === "assunto" && valor === "") {
      return "Escolha um assunto.";
    }
    if (nomeCampo === "mensagem") {
      if (valor === "") return "Escreva a sua mensagem.";
      if (valor.length < 10) return "A mensagem precisa ter pelo menos 10 letras.";
    }
    return "";
  }

  // mostra o erro embaixo do campo e marca a borda de vermelho
  function marcar(nomeCampo, erro) {
    document.getElementById(nomeCampo).setAttribute("aria-invalid", erro ? "true" : "false");
    document.getElementById("erro-" + nomeCampo).textContent = erro;
  }

  // quando a pessoa corrige o campo, o erro some na hora
  nomesCampos.forEach(nomeCampo => {
    document.getElementById(nomeCampo).addEventListener("input", () => {
      if (document.getElementById(nomeCampo).getAttribute("aria-invalid") === "true") {
        marcar(nomeCampo, verificar(nomeCampo));
      }
    });
  });

  form.addEventListener("submit", evento => {
    evento.preventDefault();             // não deixa a página recarregar

    let temErro = false;
    nomesCampos.forEach(nomeCampo => {
      const erro = verificar(nomeCampo);
      marcar(nomeCampo, erro);
      if (erro && !temErro) {
        document.getElementById(nomeCampo).focus();
        temErro = true;
      }
    });

    if (temErro) {
      mensagemFinal.className = "mensagem-form erro";
      mensagemFinal.textContent = "Confira os campos marcados em vermelho.";
      return;
    }

    const primeiroNome = document.getElementById("nome").value.trim().split(" ")[0];
    mensagemFinal.className = "mensagem-form sucesso";
    mensagemFinal.textContent = `Obrigado, ${primeiroNome}! Recebemos sua mensagem e respondemos em até 1 dia útil.`;
    form.reset();
    tocarSino();
  });
}


/* ---------- 9. MENU HAMBÚRGUER ---------- */
function iniciarMenu() {
  const botao = document.querySelector(".btn-menu");
  const menu = document.getElementById("menu");
  if (!botao || !menu) return;

  function abrirOuFechar(abrir) {
    menu.classList.toggle("aberto", abrir);
    botao.setAttribute("aria-expanded", String(abrir));
    botao.setAttribute("aria-label", abrir ? "Fechar menu" : "Abrir menu");
    botao.textContent = abrir ? "✕" : "☰";
  }

  botao.addEventListener("click", () => abrirOuFechar(!menu.classList.contains("aberto")));
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") abrirOuFechar(false);
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 992) abrirOuFechar(false);
  });
}


/* ---------- 10. MODAL (detalhes do produto) E LIGHTBOX (galeria) ---------- */
const modal = {
  janela: null,
  conteudo: null,
  fotos: [],        // fotos da galeria
  fotoAtual: 0
};

function abrirModal(html) {
  modal.conteudo.innerHTML = html;
  modal.janela.classList.add("aberto");
  modal.janela.querySelector(".fechar").focus();
}

function fecharModal() {
  modal.janela.classList.remove("aberto");
  modal.conteudo.innerHTML = "";
}

function abrirDetalhes(id) {
  const p = buscarProduto(id);
  if (!p) return;
  abrirModal(`
    <div class="modal-produto">
      <img src="${p.imagem}" alt="${p.nome}">
      <div class="modal-info">
        <span class="card-categoria">${p.categoria}</span>
        <h2>${p.nome}</h2>
        <p>${p.descricao}</p>
        <span class="etiqueta">${formatarPreco(p.preco)}</span><br>
        <button type="button" class="botao btn-comprar" data-id="${p.id}">Colocar na sacola</button>
      </div>
    </div>`);
}

function mostrarFoto(indice) {
  // volta ao começo depois da última foto (igual ao slideshow)
  modal.fotoAtual = (indice + modal.fotos.length) % modal.fotos.length;
  const foto = modal.fotos[modal.fotoAtual];
  abrirModal(`
    <div class="modal-foto">
      <img src="${foto.src}" alt="${foto.alt}">
      <p>${foto.legenda} <small>(${modal.fotoAtual + 1} de ${modal.fotos.length})</small></p>
      <button type="button" class="seta seta-anterior" data-foto-anterior aria-label="Foto anterior">‹</button>
      <button type="button" class="seta seta-proxima" data-foto-proxima aria-label="Próxima foto">›</button>
    </div>`);
}

function iniciarModal() {
  modal.janela = document.getElementById("modal");
  modal.conteudo = document.getElementById("modal-conteudo");
  if (!modal.janela) return;

  // guarda as fotos da galeria (se a página tiver galeria)
  document.querySelectorAll(".foto-galeria").forEach(botao => {
    const img = botao.querySelector("img");
    modal.fotos.push({ src: img.src, alt: img.alt, legenda: botao.querySelector("span").textContent });
  });

  modal.janela.querySelector(".fechar").addEventListener("click", fecharModal);
  modal.janela.addEventListener("click", e => {
    if (e.target === modal.janela) fecharModal();              // clique no fundo escuro
    if (e.target.closest("[data-foto-anterior]")) mostrarFoto(modal.fotoAtual - 1);
    if (e.target.closest("[data-foto-proxima]")) mostrarFoto(modal.fotoAtual + 1);
  });

  document.addEventListener("keydown", e => {
    if (!modal.janela.classList.contains("aberto")) return;
    if (e.key === "Escape") fecharModal();
    if (modal.fotos.length && modal.conteudo.querySelector(".modal-foto")) {
      if (e.key === "ArrowRight") mostrarFoto(modal.fotoAtual + 1);
      if (e.key === "ArrowLeft") mostrarFoto(modal.fotoAtual - 1);
    }
  });
}


/* ---------- 11. NEVE ----------
   Criamos bolinhas brancas com o DOM. Cada uma tem tamanho, posição,
   velocidade e atraso sorteados, e a animação "cair" do CSS faz o resto. */
function iniciarNeve() {
  for (let i = 0; i < 28; i++) {
    const floco = document.createElement("span");
    let tamanho = Math.random() * 5 + 3;
    floco.className = "floco";

    // 1 a cada 3 flocos é maior e tem o desenho de floco de neve (CSS .desenhado)
    if (i % 3 === 0) {
      floco.classList.add("desenhado");
      tamanho = Math.random() * 8 + 10;
    }
    floco.setAttribute("aria-hidden", "true");
    floco.style.width = tamanho + "px";
    floco.style.height = tamanho + "px";
    floco.style.left = Math.random() * 100 + "vw";
    floco.style.opacity = Math.random() * 0.5 + 0.4;
    floco.style.animationDuration = Math.random() * 8 + 9 + "s";
    floco.style.animationDelay = -Math.random() * 15 + "s";
    document.body.appendChild(floco);
  }
}


/* ---------- 12. ANIMAÇÃO AO ROLAR ----------
   O IntersectionObserver avisa quando um elemento .revelar entra na tela.
   Aí colocamos a classe .visivel e o CSS faz ele aparecer. */
let observador = null;

function observarNovos() {
  if (!observador) return;
  document.querySelectorAll(".revelar:not(.visivel)").forEach(el => observador.observe(el));
}

function iniciarRevelar() {
  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(".revelar").forEach(el => el.classList.add("visivel"));
    return;
  }
  observador = new IntersectionObserver(entradas => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("visivel");
        observador.unobserve(entrada.target);   // já apareceu, não precisa vigiar mais
      }
    });
  }, { threshold: 0.12 });
  observarNovos();
}


/* ---------- 13. VOLTAR AO TOPO ---------- */
function iniciarTopo() {
  const botao = document.getElementById("topo");
  if (!botao) return;

  window.addEventListener("scroll", () => {
    botao.classList.toggle("mostrar", window.scrollY > 500);
  });
  botao.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}


/* ---------- CLIQUES EM ELEMENTOS CRIADOS PELO JAVASCRIPT ----------
   Os cards não existem quando a página carrega, então ouvimos o clique
   no documento inteiro (delegação de evento) e vemos o que foi clicado. */
function iniciarCliques() {
  document.addEventListener("click", evento => {
    const comprar = evento.target.closest(".btn-comprar");
    if (comprar) {
      adicionarAoCarrinho(Number(comprar.dataset.id));
      return;
    }
    const detalhes = evento.target.closest("[data-detalhes]");
    if (detalhes) {
      abrirDetalhes(Number(detalhes.dataset.detalhes));
      return;
    }
    const foto = evento.target.closest("[data-foto]");
    if (foto) mostrarFoto(Number(foto.dataset.foto));
  });
}


/* ---------- COMEÇA TUDO QUANDO A PÁGINA TERMINA DE CARREGAR ---------- */
document.addEventListener("DOMContentLoaded", () => {
  iniciarRevelar();
  iniciarSlideshow();
  iniciarParallax();
  iniciarSons();
  iniciarFiltro();
  iniciarCarrinho();
  iniciarContagem();
  iniciarFormulario();
  iniciarMenu();
  iniciarModal();
  iniciarNeve();
  iniciarTopo();
  iniciarCliques();

  // Início mostra 8 destaques; a página Produtos mostra os 50
  if (document.body.classList.contains("pagina-home")) {
    mostrarProdutos(produtos.filter(p => p.destaque).slice(0, 8));
  } else {
    mostrarProdutos(produtos);
  }
});
