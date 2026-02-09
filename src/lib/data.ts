import type { Post, Comment } from '@/types';

// In-memory store
let posts: Post[] = [
  {
    id: '1',
    title: 'A Ilusão do Óbvio',
    content: 'Por que algumas ideias parecem tão autoevidentes? Navegamos nossas vidas guiados por um conjunto de verdades "óbvias" — noções de senso comum que nos ajudam a tomar decisões rapidamente. Mas você já parou para questionar de onde vem essa obviedade? Quando dizemos que algo é óbvio, estamos afirmando um fato sobre o mundo ou estamos revelando mais sobre nossas próprias perspectivas e condicionamento cultural?\n\nO filósofo René Descartes construiu todo o seu sistema na busca por uma verdade indubitável e óbvia. Ele a encontrou em "Penso, logo existo". Para ele, o próprio ato de duvidar era a prova de sua própria existência. Esse se tornou seu ponto de partida fundamental e óbvio. Mas a maioria de nossas verdades "óbvias" diárias não são testadas com tanto rigor. Elas são herdadas, absorvidas de nosso ambiente. O que é óbvio para alguém em uma cultura pode ser absurdo para alguém em outra.\n\nÉ aqui que a filosofia se torna uma ferramenta poderosa. Ela nos encoraja a descascar as camadas do autoevidente. Pense na ideia "óbvia" de que sucesso significa riqueza e uma carreira. É verdade? Ou é uma narrativa que nos foi vendida? Filósofos como Albert Camus poderiam argumentar que a única coisa verdadeiramente óbvia é o absurdo de nossa existência em um universo sem sentido, e nossa tarefa é encontrar nosso próprio significado apesar disso. Então, da próxima vez que você se pegar concordando com um ponto "óbvio", pare. Pergunte-se: óbvio para quem? E por quê? O que você não está vendo?',
    author: 'Alexandre P.',
    authorImage: 'https://picsum.photos/seed/author1/40/40',
    date: '2024-07-28T10:00:00Z',
    tags: ['Epistemologia', 'Verdade', 'Senso Comum'],
    imageUrl: 'https://picsum.photos/seed/post1/1200/800',
    imageHint: 'luz abstrata',
  },
  {
    id: '2',
    title: 'Seu Eu Digital: Mais Real do que Você Pensa?',
    content: 'Nós curamos nossas vidas digitais com um cuidado meticuloso. As fotos que postamos, as opiniões que compartilhamos, os perfis que construímos — eles formam uma persona digital. Mas essa persona é apenas uma máscara, ou está se tornando uma versão mais autêntica de nós mesmos? Em uma era dominada pelas redes sociais, a linha entre nosso eu "real" e nosso eu online está se tornando inexistente. Estamos atuando para uma audiência ou estamos expressando genuinamente quem somos?\n\nJean-Paul Sartre, um existencialista, disse a famosa frase: "a existência precede a essência". Isso significa que não nascemos com uma natureza fixa; nós nos criamos através de nossas ações e escolhas. No reino digital, cada post, curtida e compartilhamento é uma escolha que define nossa essência online. Esse eu curado não é necessariamente falso; é um eu construído, assim como nosso eu offline. A diferença é a escala e a permanência. Nossas pegadas digitais são vastas e, muitas vezes, indeléveis.\n\nIsso levanta questões críticas sobre autenticidade. É possível ser autêntico online quando os algoritmos recompensam certos tipos de comportamento em detrimento de outros? Somos incentivados à indignação, à positividade ou a qualquer coisa que gere mais engajamento. As ideias de Michel Foucault sobre poder e disciplina são surpreendentemente relevantes aqui. Ele argumentou que o poder não é apenas uma força de cima para baixo; é uma rede de relações que molda nosso comportamento. As plataformas de mídia social são um Panóptico moderno, uma prisão onde estamos constantemente cientes de sermos observados e, assim, nos disciplinamos para nos conformar. Então, seu eu digital é um produto de sua liberdade ou um testemunho de sua conformidade?',
    author: 'Alexandre P.',
    authorImage: 'https://picsum.photos/seed/author1/40/40',
    date: '2024-07-25T14:30:00Z',
    tags: ['Existencialismo', 'Tecnologia', 'Mídia Social'],
    imageUrl: 'https://picsum.photos/seed/post2/1200/800',
    imageHint: 'mídia social',
  },
  {
    id: '3',
    title: 'Sobre a Liberdade e o Fardo da Escolha',
    content: 'Nós valorizamos a liberdade. É um pilar da sociedade moderna. Mas e se a liberdade também for um fardo pesado? Filósofos existencialistas como Jean-Paul Sartre argumentaram que estamos "condenados a ser livres". Isso significa que, com a liberdade absoluta, vem a responsabilidade absoluta. Cada escolha que fazemos define quem somos, e não podemos culpar nossas circunstâncias, nossa genética ou nossa criação. Esta é uma perspectiva aterrorizante.\n\nPense no paradoxo da escolha na vida cotidiana. Ter centenas de opções no supermercado não nos torna necessariamente mais felizes; muitas vezes leva à ansiedade e ao "medo de ficar de fora". Ficamos paralisados pelo peso de fazer a escolha "perfeita". Este é um eco em pequena escala do pavor existencial de que Sartre estava falando. Quando as apostas são mais altas — carreira, relacionamentos, dilemas morais — essa liberdade pode parecer esmagadora.\n\nEntão, como vivemos com essa condenação? A resposta existencialista é abraçá-la. Devemos agir de "boa fé", o que significa reconhecer autenticamente nossa liberdade e assumir a responsabilidade por nossas decisões. Devemos criar nossos próprios valores em um universo sem sentido. Não se trata de encontrar o caminho "certo", mas de escolher corajosamente um caminho e percorrê-lo. O peso da liberdade é uma maldição ou é a própria coisa que dá sentido às nossas vidas?',
    author: 'Alexandre P.',
    authorImage: 'https://picsum.photos/seed/author1/40/40',
    date: '2024-07-22T11:00:00Z',
    tags: ['Existencialismo', 'Liberdade', 'Ética'],
    imageUrl: 'https://picsum.photos/seed/post3/1200/800',
    imageHint: 'caminho bifurcado',
  },
  {
    id: '4',
    title: 'A Filosofia da Rotina Diária',
    content: 'Acordar, café, trabalho, almoço, trabalho, academia, jantar, dormir, repetir. Nossas vidas são frequentemente estruturadas por rotinas. Nós as vemos como necessidades mundanas e até chatas. Mas filósofos de Aristóteles a Kant viram a rotina e o hábito como centrais para uma boa vida. Nossos rituais diários poderiam ser a chave para a virtude e o significado?\n\nAristóteles argumentou que a virtude é um hábito. Não nos tornamos corajosos realizando um ato de bravura; nos tornamos corajosos agindo bravamente de forma consistente até que se torne uma segunda natureza. Nosso caráter é a soma de nossos hábitos. Nessa visão, uma rotina bem estruturada não é uma prisão, mas um campo de treinamento para a alma. É uma maneira de cultivar conscientemente a pessoa que você quer ser.\n\nNo nosso mundo moderno, somos obcecados por "life hacks" e sistemas de produtividade. Estes são apenas termos modernos para uma ideia antiga: o cultivo intencional do hábito. Os estoicos, por exemplo, praticavam rotinas diárias de reflexão e meditação para construir resiliência e paz interior. Ao projetar conscientemente nossas rotinas, passamos de criaturas de hábito a criadores de nosso próprio caráter. O que sua rotina diária diz sobre a pessoa que você está construindo?',
    author: 'Alexandre P.',
    authorImage: 'https://picsum.photos/seed/author1/40/40',
    date: '2024-07-20T09:00:00Z',
    tags: ['Estoicismo', 'Ética da Virtude', 'Hábito'],
    imageUrl: 'https://picsum.photos/seed/post4/1200/800',
    imageHint: 'café da manhã',
  },
  {
    id: '5',
    title: 'A Verdade é Descoberta ou Criada?',
    content: 'Temos a tendência de pensar na verdade como algo objetivo, "lá fora", esperando para ser descoberto, como um cientista descobrindo uma nova espécie. Esta é a teoria da correspondência da verdade: uma declaração é verdadeira se corresponde a um fato no mundo. Mas e se a verdade for mais complicada? E se nós, como sociedades e indivíduos, a criarmos?\n\nNietzsche afirmou famosamente: "Não há fatos, apenas interpretações." Para ele, a verdade era uma questão de perspectiva. Cada declaração que fazemos é moldada por nossos valores, nossa linguagem e nossa vontade de poder. Isso não significa que tudo é relativo e nada importa. Significa que devemos estar cientes das forças que moldam nossas "verdades". Da mesma forma, filósofos pragmáticos como William James sugeriram que uma crença verdadeira é simplesmente uma crença que "funciona" — uma que nos ajuda a navegar pelo mundo de forma eficaz.\n\nConsidere a "verdade" de um evento histórico. Não é uma coisa única e estática. É uma narrativa construída a partir de evidências, mas a seleção e interpretação dessas evidências são moldadas pela perspectiva do historiador. A história muda à medida que novas vozes e perspectivas são incluídas. Isso não torna a história uma mentira; torna-a um entendimento vivo e em evolução. Então, da próxima vez que ouvir alguém afirmar ter a "verdade absoluta", pergunte-se: a que perspectiva essa verdade serve? É uma descoberta ou uma invenção?',
    author: 'Alexandre P.',
    authorImage: 'https://picsum.photos/seed/author1/40/40',
    date: '2024-07-18T16:00:00Z',
    tags: ['Epistemologia', 'Nietzsche', 'Pragmatismo'],
    imageUrl: 'https://picsum.photos/seed/post5/1200/800',
    imageHint: 'biblioteca antiga',
  },
  {
    id: '6',
    title: 'O Problema Difícil da Consciência',
    content: 'Por que temos experiências subjetivas? Podemos entender o cérebro como uma máquina biológica complexa, processando informações e produzindo comportamento. Mas por que parece "algo" ser você? Isso é o que o filósofo David Chalmers chama de "problema difícil da consciência". É a questão de por que temos qualia — a qualidade subjetiva da experiência, como a vermelhidão de uma rosa ou o sabor do chocolate.\n\nA neurociência pode explicar os "problemas fáceis": como o cérebro distingue entre vermelho e azul, como processa a entrada sensorial e como controla nossas ações. Mas ainda não consegue explicar por que esses processos são acompanhados por um rico mundo interior. A consciência é uma propriedade emergente da computação complexa? É uma propriedade fundamental do universo, como o espaço-tempo? Ou é apenas uma ilusão?\n\nEste mistério está na interseção da filosofia, neurociência e física. Algumas teorias, como a Teoria da Informação Integrada (IIT), propõem que a consciência é uma medida da complexidade e integração de um sistema, o que significa que até sistemas simples podem ter um pouco dela. Outros permanecem céticos de que algum dia poderemos resolver esse quebra-cabeça com nosso paradigma científico atual. O problema difícil nos lembra que, apesar de todo o nosso conhecimento, ainda somos estranhos para nós mesmos. O que significa ser um ser pensante e senciente em um universo de matéria e energia?',
    author: 'Alexandre P.',
    authorImage: 'https://picsum.photos/seed/author1/40/40',
    date: '2024-07-15T11:00:00Z',
    tags: ['Consciência', 'Mente', 'Neurociência'],
    imageUrl: 'https://picsum.photos/seed/post6/1200/800',
    imageHint: 'rede neural cérebro',
  },
  {
    id: '7',
    title: 'Podemos ser Bons sem Deus?',
    content: 'Durante séculos, a moralidade esteve ancorada no divino. Textos e autoridades religiosas forneciam uma estrutura clara para o certo e o errado. Mas em um mundo em secularização, muitas pessoas lidam com uma questão profunda: se não há Deus, pode haver uma base objetiva para a moralidade? Tudo é permitido, como temia o personagem de Dostoiévski, Ivan Karamazov?\n\nFilósofos humanistas argumentam que a moralidade não precisa de uma fonte divina. Nossa capacidade de empatia, razão e cooperação fornece uma base sólida para a ética. Podemos entender que causar sofrimento desnecessário é ruim, não porque um livro sagrado o diz, mas porque podemos nos identificar com quem sofre. Estruturas como o utilitarismo (buscar o maior bem para o maior número) ou a deontologia (agir com base em deveres morais universais) oferecem maneiras de raciocinar sobre a ética sem crença religiosa.\n\nAlém disso, a evolução pode ter nos dotado de um senso moral. A cooperação e o altruísmo podem ser vantajosos para uma espécie social. Isso não reduz a moralidade à mera biologia; sugere que nossas inclinações éticas têm raízes profundas. O desafio para um mundo secular não é uma descida ao niilismo, mas o projeto contínuo de construir uma sociedade justa e compassiva baseada em valores humanos compartilhados. Nós somos os autores do nosso próprio código moral. Não é essa uma responsabilidade mais profunda do que simplesmente seguir ordens?',
    author: 'Alexandre P.',
    authorImage: 'https://picsum.photos/seed/author1/40/40',
    date: '2024-07-12T15:00:00Z',
    tags: ['Ética', 'Moralidade', 'Secularismo'],
    imageUrl: 'https://picsum.photos/seed/post7/1200/800',
    imageHint: 'bússola moral',
  },
  {
    id: '8',
    title: 'A Prisão da Linguagem',
    content: 'Ludwig Wittgenstein afirmou famosamente: "Os limites da minha linguagem significam os limites do meu mundo." Essa ideia poderosa sugere que nossa realidade é moldada e restringida pelas palavras que usamos. Só podemos pensar pensamentos que nossa linguagem nos permite formular. Estamos vivendo em um mundo de pura experiência ou estamos confinados dentro da estrutura de nossa linguagem?\n\nPense em conceitos que existem em outras línguas, mas não têm equivalente direto em português, como o alemão "Schadenfreude" (alegria com o infortúnio alheio) ou o japonês "Komorebi" (luz do sol filtrando por entre as árvores). A existência dessas palavras permite que os falantes percebam e categorizem o mundo de maneiras menos acessíveis aos não falantes. A linguagem não é apenas uma ferramenta para descrever a realidade; ela a constrói ativamente.\n\nIsso tem implicações profundas. Se nossa linguagem é tendenciosa, nossos pensamentos serão tendenciosos. Se nossa linguagem carece de palavras para descrever certas injustiças, essas injustiças podem permanecer invisíveis. É por isso que os movimentos por mudança social geralmente envolvem uma luta pela linguagem — reivindicando palavras, cunhando novos termos e desafiando definições antigas. Para expandir nosso mundo, devemos expandir nossa linguagem. Ao aprender novas línguas, ler amplamente e questionar as palavras que usamos todos os dias, podemos começar a ver as paredes de nossa prisão linguística. Que pensamentos você é incapaz de pensar simplesmente porque lhe faltam as palavras?',
    author: 'Alexandre P.',
    authorImage: 'https://picsum.photos/seed/author1/40/40',
    date: '2024-07-10T18:00:00Z',
    tags: ['Linguagem', 'Wittgenstein', 'Realidade'],
    imageUrl: 'https://picsum.photos/seed/post8/1200/800',
    imageHint: 'livros biblioteca',
  },
];

let comments: Comment[] = [
    { id: '1', postId: '1', author: 'Sophia', content: 'Isso realmente me fez pensar sobre minhas próprias suposições. Ótimo post!', date: '2024-07-28T12:00:00Z' },
    { id: '2', postId: '1', author: 'David', content: 'Eu discordo. Algumas coisas são universalmente óbvias, como 2+2=4.', date: '2024-07-28T13:00:00Z' },
    { id: '3', postId: '2', author: 'Chloe', content: 'Muito verdade! Meu Instagram é definitivamente um "carretel de destaques" e não a história completa.', date: '2024-07-25T15:00:00Z' },
    { id: '4', postId: '3', author: 'Marcus', content: '"Condenado a ser livre" é uma frase muito poderosa. Parece assustador, mas também empoderador.', date: '2024-07-22T14:00:00Z' },
    { id: '5', postId: '6', author: 'Elena', content: 'O problema difícil da consciência é algo em que penso o tempo todo. É fascinante e um pouco assustador!', date: '2024-07-15T14:00:00Z' },
    { id: '6', postId: '7', author: 'Ben', content: 'Ótimos pontos. Não precisamos de mitos antigos para sermos bons uns com os outros.', date: '2024-07-12T18:00:00Z' },
];

const generateId = () => Math.random().toString(36).substring(2, 9);

// Simulating API latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function getPosts(): Promise<Post[]> {
  await delay(100);
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPostById(id: string): Promise<Post | undefined> {
  await delay(100);
  return posts.find(p => p.id === id);
}

export async function createPost(postData: Omit<Post, 'id' | 'date' | 'author' | 'authorImage'>): Promise<Post> {
  await delay(500);
  const newPost: Post = {
    ...postData,
    id: generateId(),
    date: new Date().toISOString(),
    author: 'Alexandre P.', // Hardcoded for now
    authorImage: 'https://picsum.photos/seed/author1/40/40',
  };
  posts.unshift(newPost);
  return newPost;
}

export async function updatePost(id: string, postData: Partial<Post>): Promise<Post | undefined> {
  await delay(500);
  const postIndex = posts.findIndex(p => p.id === id);
  if (postIndex === -1) return undefined;
  posts[postIndex] = { ...posts[postIndex], ...postData };
  return posts[postIndex];
}

export async function deletePost(id: string): Promise<void> {
  await delay(500);
  posts = posts.filter(p => p.id !== id);
  comments = comments.filter(c => c.postId !== id);
}

export async function getCommentsByPostId(postId: string): Promise<Comment[]> {
  await delay(100);
  return comments
    .filter(c => c.postId === postId)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export async function createComment(commentData: Omit<Comment, 'id' | 'date'>): Promise<Comment> {
  await delay(300);
  const newComment: Comment = {
    ...commentData,
    id: generateId(),
    date: new Date().toISOString(),
  };
  comments.push(newComment);
  return newComment;
}
