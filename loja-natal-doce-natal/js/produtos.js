// js/produtos.js - catálogo da Doce Natal Confeitaria (50 produtos)
// Cada produto é um objeto com: id, nome, categoria, preco (número), imagem, descricao e destaque.
// Atenção: as categorias precisam ser escritas SEMPRE do mesmo jeito (o filtro compara os textos).

const produtos = [
  // ---- Panetones e Chocotones ----
  {
    id: 1,
    nome: "Panetone Trufado Belga",
    categoria: "Panetones e Chocotones",
    preco: 59.90,
    imagem: "img/produtos/prod-01.svg",
    descricao: "Massa macia e aerada recheada com trufa de chocolate belga e finalizada com cobertura crocante.",
    destaque: true
  },
  {
    id: 2,
    nome: "Chocotone Doce de Leite",
    categoria: "Panetones e Chocotones",
    preco: 54.90,
    imagem: "img/produtos/prod-02.svg",
    descricao: "Chocotone fofinho com gotas de chocolate e um recheio generoso de doce de leite cremoso.",
    destaque: true
  },
  {
    id: 3,
    nome: "Panetone Tradicional de Frutas",
    categoria: "Panetones e Chocotones",
    preco: 42.90,
    imagem: "img/produtos/prod-03.svg",
    descricao: "A receita clássica da ceia, com frutas cristalizadas, uvas-passas e aroma de laranja.",
    destaque: false
  },
  {
    id: 4,
    nome: "Chocotone Creme de Avelã",
    categoria: "Panetones e Chocotones",
    preco: 64.90,
    imagem: "img/produtos/prod-04.svg",
    descricao: "Massa de cacau recheada com creme de avelã e pedacinhos de chocolate ao leite.",
    destaque: true
  },
  {
    id: 5,
    nome: "Panetone Red Velvet",
    categoria: "Panetones e Chocotones",
    preco: 69.90,
    imagem: "img/produtos/prod-05.svg",
    descricao: "Massa vermelha aveludada com recheio de cream cheese e cobertura de chocolate branco.",
    destaque: false
  },
  {
    id: 6,
    nome: "Chocotone de Pistache",
    categoria: "Panetones e Chocotones",
    preco: 79.90,
    imagem: "img/produtos/prod-06.svg",
    descricao: "Massa amanteigada com creme de pistache e lascas de chocolate branco por cima.",
    destaque: false
  },
  {
    id: 7,
    nome: "Panetone Zero Açúcar",
    categoria: "Panetones e Chocotones",
    preco: 49.90,
    imagem: "img/produtos/prod-07.svg",
    descricao: "Feito com adoçante natural, mantém a maciez do panetone tradicional para quem cuida do açúcar.",
    destaque: false
  },
  {
    id: 8,
    nome: "Panetone Gotas de Chocolate",
    categoria: "Panetones e Chocotones",
    preco: 47.90,
    imagem: "img/produtos/prod-08.svg",
    descricao: "O queridinho da criançada: massa leve repleta de gotas de chocolate meio amargo.",
    destaque: true
  },
  {
    id: 9,
    nome: "Chocotone Brigadeiro Gourmet",
    categoria: "Panetones e Chocotones",
    preco: 58.90,
    imagem: "img/produtos/prod-09.svg",
    descricao: "Recheio de brigadeiro cremoso e granulado crocante sobre uma massa fofinha de chocolate.",
    destaque: false
  },
  {
    id: 10,
    nome: "Mini Panetones em Caixa",
    categoria: "Panetones e Chocotones",
    preco: 38.90,
    imagem: "img/produtos/prod-10.svg",
    descricao: "Quatro mini panetones sortidos em uma caixa natalina, ótima lembrança para amigos e familiares.",
    destaque: false
  },

  // ---- Biscoitos Natalinos ----
  {
    id: 11,
    nome: "Biscoito Homem de Gengibre",
    categoria: "Biscoitos Natalinos",
    preco: 12.90,
    imagem: "img/produtos/prod-11.svg",
    descricao: "Biscoito crocante de gengibre e canela, decorado à mão com glacê colorido.",
    destaque: true
  },
  {
    id: 12,
    nome: "Caixa de Biscoitos Decorados",
    categoria: "Biscoitos Natalinos",
    preco: 34.90,
    imagem: "img/produtos/prod-12.svg",
    descricao: "Doze biscoitos em formatos de estrela, árvore e sino, decorados um a um e embalados em caixa.",
    destaque: true
  },
  {
    id: 13,
    nome: "Biscoito Amanteigado de Amêndoas",
    categoria: "Biscoitos Natalinos",
    preco: 24.90,
    imagem: "img/produtos/prod-13.svg",
    descricao: "Biscoito que derrete na boca, feito com manteiga e farinha de amêndoas, finalizado com açúcar de confeiteiro.",
    destaque: false
  },
  {
    id: 14,
    nome: "Speculoos Amanteigado",
    categoria: "Biscoitos Natalinos",
    preco: 22.90,
    imagem: "img/produtos/prod-14.svg",
    descricao: "Biscoito fino e crocante, temperado com canela, cravo e noz-moscada ao estilo europeu.",
    destaque: false
  },
  {
    id: 15,
    nome: "Biscoito Estrela de Canela",
    categoria: "Biscoitos Natalinos",
    preco: 16.50,
    imagem: "img/produtos/prod-15.svg",
    descricao: "Estrelinhas de massa aromática com canela e uma cobertura leve de açúcar.",
    destaque: false
  },
  {
    id: 16,
    nome: "Biscoito de Glacê Real",
    categoria: "Biscoitos Natalinos",
    preco: 18.90,
    imagem: "img/produtos/prod-16.svg",
    descricao: "Biscoitos de baunilha com acabamento em glacê real, branquinhos como a neve.",
    destaque: true
  },
  {
    id: 17,
    nome: "Cookies Gotas de Natal",
    categoria: "Biscoitos Natalinos",
    preco: 14.90,
    imagem: "img/produtos/prod-17.svg",
    descricao: "Cookies macios com confeitos vermelhos e verdes, as cores do Natal.",
    destaque: false
  },
  {
    id: 18,
    nome: "Biscoito de Mel e Noz-Moscada",
    categoria: "Biscoitos Natalinos",
    preco: 19.90,
    imagem: "img/produtos/prod-18.svg",
    descricao: "Receita caseira de biscoito de mel com toque de noz-moscada, perfeito para acompanhar o café.",
    destaque: false
  },
  {
    id: 19,
    nome: "Biscoito Recheado de Baunilha",
    categoria: "Biscoitos Natalinos",
    preco: 15.90,
    imagem: "img/produtos/prod-19.svg",
    descricao: "Dois biscoitos de cacau com recheio cremoso de baunilha e flocos de açúcar.",
    destaque: false
  },
  {
    id: 20,
    nome: "Lata Vintage de Biscoitos",
    categoria: "Biscoitos Natalinos",
    preco: 44.90,
    imagem: "img/produtos/prod-20.svg",
    descricao: "Lata colecionável com biscoitos sortidos de manteiga e especiarias, que pode ser reaproveitada.",
    destaque: true
  },

  // ---- Bolos e Tortas ----
  {
    id: 21,
    nome: "Bolo Rei Tradicional",
    categoria: "Bolos e Tortas",
    preco: 74.90,
    imagem: "img/produtos/prod-21.svg",
    descricao: "Massa macia com frutas secas e cristalizadas, coroada com a decoração dourada do Bolo Rei.",
    destaque: true
  },
  {
    id: 22,
    nome: "Tronco de Natal",
    categoria: "Bolos e Tortas",
    preco: 89.90,
    imagem: "img/produtos/prod-22.svg",
    descricao: "Rocambole de chocolate recheado com creme e coberto com ganache em formato de tronco.",
    destaque: false
  },
  {
    id: 23,
    nome: "Torta Holandesa de Natal",
    categoria: "Bolos e Tortas",
    preco: 62.90,
    imagem: "img/produtos/prod-23.svg",
    descricao: "Base crocante, creme de baunilha e cobertura de chocolate, decorada com detalhes natalinos.",
    destaque: false
  },
  {
    id: 24,
    nome: "Bolo de Nozes com Baba de Moça",
    categoria: "Bolos e Tortas",
    preco: 79.90,
    imagem: "img/produtos/prod-24.svg",
    descricao: "Bolo úmido de nozes com cobertura de baba de moça, doce típico das festas brasileiras.",
    destaque: true
  },
  {
    id: 25,
    nome: "Torta de Maçã e Canela",
    categoria: "Bolos e Tortas",
    preco: 56.90,
    imagem: "img/produtos/prod-25.svg",
    descricao: "Massa dourada recheada de maçãs cozidas na canela, servida em fatias generosas.",
    destaque: false
  },
  {
    id: 26,
    nome: "Cheesecake de Frutas Vermelhas",
    categoria: "Bolos e Tortas",
    preco: 84.90,
    imagem: "img/produtos/prod-26.svg",
    descricao: "Base de biscoito, creme leve e calda artesanal de morango e framboesa.",
    destaque: false
  },
  {
    id: 27,
    nome: "Bolo de Especiarias Natalinas",
    categoria: "Bolos e Tortas",
    preco: 58.90,
    imagem: "img/produtos/prod-27.svg",
    descricao: "Bolo perfumado com gengibre, cravo e canela, com cobertura de açúcar de confeiteiro.",
    destaque: false
  },
  {
    id: 28,
    nome: "Torta Mousse de Chocolate",
    categoria: "Bolos e Tortas",
    preco: 72.90,
    imagem: "img/produtos/prod-28.svg",
    descricao: "Mousse aerada de chocolate meio amargo sobre massa crocante de cacau.",
    destaque: true
  },
  {
    id: 29,
    nome: "Bolo Vulcão de Chocotone",
    categoria: "Bolos e Tortas",
    preco: 69.90,
    imagem: "img/produtos/prod-29.svg",
    descricao: "Bolo de chocotone com calda quente de chocolate que escorre como um vulcão.",
    destaque: false
  },
  {
    id: 30,
    nome: "Cupcakes Decorados",
    categoria: "Bolos e Tortas",
    preco: 39.90,
    imagem: "img/produtos/prod-30.svg",
    descricao: "Seis cupcakes de baunilha com cobertura cremosa e decorações de Natal.",
    destaque: false
  },

  // ---- Cestas e Kits ----
  {
    id: 31,
    nome: "Cesta Natal Premium",
    categoria: "Cestas e Kits",
    preco: 189.90,
    imagem: "img/produtos/prod-31.svg",
    descricao: "Cesta de luxo com panetone, chocolates, biscoitos e geleia, embalada com laço dourado.",
    destaque: true
  },
  {
    id: 32,
    nome: "Kit Mini Chef Biscoitos",
    categoria: "Cestas e Kits",
    preco: 59.90,
    imagem: "img/produtos/prod-32.svg",
    descricao: "Kit para fazer biscoitos em casa com massa pronta, cortadores e glacê colorido.",
    destaque: true
  },
  {
    id: 33,
    nome: "Cesta Celebração em Família",
    categoria: "Cestas e Kits",
    preco: 149.90,
    imagem: "img/produtos/prod-33.svg",
    descricao: "Cesta farta com bolo, panetone e doces para compartilhar na ceia de Natal.",
    destaque: false
  },
  {
    id: 34,
    nome: "Kit Lembrança Papai Noel",
    categoria: "Cestas e Kits",
    preco: 79.90,
    imagem: "img/produtos/prod-34.svg",
    descricao: "Caixa em formato de presente com bombons, biscoito decorado e cartão personalizado.",
    destaque: false
  },
  {
    id: 35,
    nome: "Cesta Café da Manhã de Natal",
    categoria: "Cestas e Kits",
    preco: 129.90,
    imagem: "img/produtos/prod-35.svg",
    descricao: "Pães doces, geleias, bolo e suco de uva para começar o dia de Natal com carinho.",
    destaque: false
  },
  {
    id: 36,
    nome: "Caixa Degustação de Panetones",
    categoria: "Cestas e Kits",
    preco: 98.90,
    imagem: "img/produtos/prod-36.svg",
    descricao: "Seis fatias de sabores diferentes de panetone para experimentar e escolher o favorito.",
    destaque: true
  },
  {
    id: 37,
    nome: "Kit Harmonização Sucos e Doces",
    categoria: "Cestas e Kits",
    preco: 119.90,
    imagem: "img/produtos/prod-37.svg",
    descricao: "Dois sucos de uva artesanais acompanhados de trufas e biscoitos escolhidos para combinar.",
    destaque: false
  },
  {
    id: 38,
    nome: "Cesta Corporativa Boas Festas",
    categoria: "Cestas e Kits",
    preco: 169.90,
    imagem: "img/produtos/prod-38.svg",
    descricao: "Cesta elegante para presentear equipes e clientes, com mini panetone, chocolates e cartão.",
    destaque: false
  },
  {
    id: 39,
    nome: "Baú de Madeira Natalino",
    categoria: "Cestas e Kits",
    preco: 219.90,
    imagem: "img/produtos/prod-39.svg",
    descricao: "Baú de madeira decorado com guloseimas variadas, que depois vira porta-objetos.",
    destaque: false
  },
  {
    id: 40,
    nome: "Kit Infantil Confeiteiro",
    categoria: "Cestas e Kits",
    preco: 64.90,
    imagem: "img/produtos/prod-40.svg",
    descricao: "Avental infantil, forminhas e mistura para cupcakes para as crianças se divertirem na cozinha.",
    destaque: true
  },

  // ---- Bebidas e Chocolates ----
  {
    id: 41,
    nome: "Chocolate Quente Cremoso",
    categoria: "Bebidas e Chocolates",
    preco: 29.90,
    imagem: "img/produtos/prod-41.svg",
    descricao: "Chocolate quente espesso, feito com chocolate de verdade, ótimo com marshmallow por cima.",
    destaque: true
  },
  {
    id: 42,
    nome: "Creme de Panetone (sem álcool)",
    categoria: "Bebidas e Chocolates",
    preco: 36.90,
    imagem: "img/produtos/prod-42.svg",
    descricao: "Bebida cremosa de panetone com leite e especiarias, servida gelada ou morna.",
    destaque: false
  },
  {
    id: 43,
    nome: "Suco Quente de Uva e Especiarias",
    categoria: "Bebidas e Chocolates",
    preco: 24.90,
    imagem: "img/produtos/prod-43.svg",
    descricao: "Suco de uva integral aquecido com cravo, canela e casca de laranja.",
    destaque: false
  },
  {
    id: 44,
    nome: "Caixa de Trufas Artesanais",
    categoria: "Bebidas e Chocolates",
    preco: 45.90,
    imagem: "img/produtos/prod-44.svg",
    descricao: "Doze trufas de sabores variados: chocolate, maracujá, café e coco.",
    destaque: true
  },
  {
    id: 45,
    nome: "Drágeas de Amêndoa Glaceadas",
    categoria: "Bebidas e Chocolates",
    preco: 27.90,
    imagem: "img/produtos/prod-45.svg",
    descricao: "Amêndoas crocantes cobertas com chocolate e finalizadas com açúcar colorido.",
    destaque: false
  },
  {
    id: 46,
    nome: "Bombons Recheados de Frutas",
    categoria: "Bebidas e Chocolates",
    preco: 32.90,
    imagem: "img/produtos/prod-46.svg",
    descricao: "Bombons de chocolate com recheio de cereja, morango e damasco.",
    destaque: false
  },
  {
    id: 47,
    nome: "Espumante Infantil de Uva",
    categoria: "Bebidas e Chocolates",
    preco: 21.90,
    imagem: "img/produtos/prod-47.svg",
    descricao: "Bebida gaseificada de uva sem álcool, ideal para o brinde das crianças.",
    destaque: false
  },
  {
    id: 48,
    nome: "Chá de Canela e Maçã",
    categoria: "Bebidas e Chocolates",
    preco: 18.90,
    imagem: "img/produtos/prod-48.svg",
    descricao: "Mistura de chá com pedaços de maçã desidratada e canela em pau, em caixinha para presente.",
    destaque: true
  },
  {
    id: 49,
    nome: "Barra de Chocolate Pinheiro",
    categoria: "Bebidas e Chocolates",
    preco: 23.90,
    imagem: "img/produtos/prod-49.svg",
    descricao: "Barra de chocolate ao leite com relevo de pinheiro e confeitos dourados.",
    destaque: false
  },
  {
    id: 50,
    nome: "Creme de Avelã Natalino",
    categoria: "Bebidas e Chocolates",
    preco: 31.90,
    imagem: "img/produtos/prod-50.svg",
    descricao: "Pote de creme de avelã com chocolate e um toque de canela, ótimo para passar no pão.",
    destaque: false
  }
];
