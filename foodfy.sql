--
-- PostgreSQL database dump
--

-- Dumped from database version 12.1
-- Dumped by pg_dump version 12.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: chefs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chefs (
    id integer NOT NULL,
    name text,
    image text,
    created_at timestamp without time zone
);


--
-- Name: chefs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.chefs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: chefs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.chefs_id_seq OWNED BY public.chefs.id;


--
-- Name: recipes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.recipes (
    id integer NOT NULL,
    chef_id integer,
    title text,
    image text,
    ingredients text[],
    preparation text[],
    information text,
    created_at timestamp without time zone
);


--
-- Name: recipes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.recipes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: recipes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.recipes_id_seq OWNED BY public.recipes.id;


--
-- Name: chefs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chefs ALTER COLUMN id SET DEFAULT nextval('public.chefs_id_seq'::regclass);


--
-- Name: recipes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipes ALTER COLUMN id SET DEFAULT nextval('public.recipes_id_seq'::regclass);


--
-- Data for Name: chefs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.chefs (id, name, image, created_at) FROM stdin;
1	Jorge Relato	https://images.unsplash.com/photo-1545167622-3a6ac756afa4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60	2020-03-15 00:00:00
2	Fabiana Melo	https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60	2020-03-15 00:00:00
3	Vania Steroski	https://images.unsplash.com/photo-1549351236-caca0f174515?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60	2020-03-15 00:00:00
4	Juliano Vieira	https://images.unsplash.com/photo-1546672741-d327539d5f13?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60	2020-03-15 00:00:00
6	Ricardo Golvêa	https://images.unsplash.com/photo-1541647376583-8934aaf3448a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60	2020-03-15 00:00:00
7	Vinícius Moreira	https://avatars3.githubusercontent.com/u/46542925?s=460&u=1a5722c94378b69cc86c3ed9e0aec45607233976&v=4	2020-03-15 00:00:00
5	Júlia Kinoto	https://images.unsplash.com/photo-1548142813-c348350df52b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60	2020-03-15 00:00:00
\.


--
-- Data for Name: recipes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.recipes (id, chef_id, title, image, ingredients, preparation, information, created_at) FROM stdin;
1	1	Triplo Bacon Burger	https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/launchbase/receitas/burger.png	{"3 kg de carne moída (escolha uma carne magra e macia)","300 g de bacon moído","1 ovo","3 colheres (sopa) de farinha de trigo","3 colheres (sopa) de tempero caseiro: feito com alho, sal, cebola, pimenta e cheiro verde processados no liquidificador","30 ml de água gelada"}	{"Misture todos os ingredientes muito bem e amasse para que fique tudo muito bem misturado.","Faça porções de 90g a 100g.","Forre um plástico molhado em uma bancada e modele os hambúrgueres utilizando um aro como base.","Faça um de cada vez e retire o aro logo em seguida.","Forre uma assadeira de metal com plástico, coloque os hambúrgueres e intercale camadas de carne e plásticos (sem apertar).","Faça no máximo 4 camadas por forma e leve para congelar.","Retire do congelador, frite ou asse e está pronto."}	Preaqueça a chapa, frigideira ou grelha por 10 minutos antes de levar os hambúrgueres. Adicione um pouquinho de óleo ou manteiga e não amasse os hambúrgueres! Você sabia que a receita que precede o hambúrguer surgiu no século XIII, na Europa? A ideia de moer a carne chegou em Hamburgo no século XVII, onde um açougueiro resolveu também temperá-la. Assim, a receita foi disseminada nos Estados Unidos por alemães da região. Lá surgiu a ideia de colocar o hambúrguer no meio do pão e adicionar outros ingredientes, como queijo, tomates e alface.	2020-03-15 00:00:00
2	2	Pizza 4 estações	https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/launchbase/receitas/pizza.png	{"1 xícara (chá) de leite","1 ovo","1 colher (chá) de sal","1 colher (chá) de açúcar","1 colher (sopa) de margarina","1 e 1/2 xícara (chá) de farinha de trigo","1 colher (sobremesa) de fermento em pó","1/2 lata de molho de tomate","250 g de mussarela ralada grossa","2 tomates fatiados, azeitona picada, orégano a gosto"}	{"No liquidificador bata o leite, o ovo, o sal, o açúcar, a margarina, a farinha de trigo e o fermento em pó até que tudo esteja encorpado.","Despeje a massa em uma assadeira para pizza untada com margarina e leve ao forno preaquecido por 20 minutos.","Retire do forno e despeje o molho de tomate.","Cubra a massa com mussarela ralada, tomate e orégano a gosto.","Leve novamente ao forno até derreter a mussarela."}	Pizza de liquidificador é uma receita deliciosa e supersimples de preparar. Feita toda no liquidificador, ela é bem prática para o dia a dia.	2020-03-15 00:00:00
3	3	Asinhas de frango ao barbecue	https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/launchbase/receitas/asinha.png	{"12 encontros de asinha de galinha, temperados a gosto","2 colheres de sopa de farinha de trigo","1/2 xícara (chá) de óleo","1 xícara de molho barbecue"}	{"Em uma tigela coloque o encontro de asinha de galinha e polvilhe a farinha de trigo e misture com as mãos.","Em uma frigideira ou assador coloque o óleo quando estiver quente frite até ficarem douradas.","Para servir fica bonito com salada, ou abuse da criatividade."}	 	2020-03-15 00:00:00
4	7	Hambúrguer artesanal recheado com mussarela	https://img.itdg.com.br/tdg/images/recipes/000/304/904/332797/332797_original.jpg?mode=crop&width=710&height=400	{"500g de contra filé moído","1/2 pacote de creme de cebola","Pedaços de mussarela (cerca de 2 cm cada)","Temperos a gosto (exceto sal, pois o creme de cebola já tem)"}	{"Misture a carne com o creme de cebola e os temperos.","Use um molde para bifes ou algo que dê o formato de um bife de hambúrguer, faça eles mais grossos.","Coloque um pedaço de mussarela em cada bife e tampe, não coloque pedaços muito grandes para não vazar na hora de assar.","Asse na churrasqueira ou em forno médio por mais ou menos 20 minutos.","Vire o bife para grelhar os dois lados.","Monte o hambúrguer ao seu gosto."}	O ideal é deixar na geladeira de um dia para o outro para pegar bem o tempero. Os bifes podem ser congelados.\r\n\r\n	2020-03-15 00:00:00
5	4	Lasanha mac n' cheese	https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/launchbase/receitas/lasanha.png	{"Massa pronta de lasanha","400g de presunto","400g de mussarela ralada","2 copos de requeijão","150g de mussarela para gratinar"}	{"Em uma panela, coloque a manteiga para derreter.","Acrescente a farinha de trigo e misture bem com auxílio de um fouet.","Adicione o leite e misture até formar um creme homogêneo.","Tempere com sal, pimenta e noz-moscada a gosto.","Desligue o fogo e acrescente o creme de leite; misture bem e reserve."}	Recheie a lasanha com o que preferir.\r\n	2020-03-15 00:00:00
6	5	Espaguete ao alho	https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/launchbase/receitas/macarrao.png	{"1 pacote de macarrão 500g (tipo do macarrão a gosto)","1 saquinho de alho granulado","1/2 tablete de manteiga (não use margarina)","1 colher (sopa) de azeite extra virgem","Ervas (manjericão, orégano, salsa, cebolinha, tomilho, a gosto)",Sal,"1 dente de alho","Gengibre em pó a gosto,","1 folha de louro"}	{"Quando faltar mais ou menos 5 minutos para ficar no ponto de escorrer o macarrão, comece o preparo da receita.","Na frigideira quente coloque a manteiga, o azeite, a folha de louro, e o alho granulado.,","Nesta hora um pouco de agilidade, pois o macarrão escorrido vai para a frigideira, sendo mexido e dosado com sal a gosto, as ervas, o gengibre em pó a gosto também.","O dente de alho, serve para você untar os pratos onde serão servidos o macarrão.","Coloque as porções nos pratos já com o cheiro do alho, e enfeite com algumas ervas."}	Não lave o macarrão nem passe óleo ou gordura nele depois de escorrê-lo. Coloque direto na frigideira.\r\n	2020-03-15 00:00:00
7	6	Docinhos pão-do-céu	https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/launchbase/receitas/doce.png	{"1 kg de batata-doce","100 g de manteiga","3 ovos","1 pacote de coco seco ralado (100g)","3 colheres (sopa) de açúcar 1 lata de Leite Moça","1 colher (sopa) de fermento em pó","Manteiga para untar","Açúcar de confeiteiro"}	{"Cozinhe a batata-doce numa panela de pressão, com meio litro de água, por cerca de 20 minutos. Descasque e passe pelo espremedor, ainda quente.","Junte a manteiga, os ovos, o coco ralado, o açúcar, o Leite Moça e o fermento em pó, mexendo bem após cada adição.","Despeje em assadeira retangular média, untada e leve ao forno médio (180°C), por aproximadamente 45 minutos. Depois de frio, polvilhe, com o açúcar de confeiteiro e corte em quadrados."}	 	2020-03-15 00:00:00
8	5	Bombom de Travessa	https://img.itdg.com.br/tdg/images/recipes/000/049/802/297847/297847_original.jpg?mode=crop&width=710&height=400	{"250g de chocolate ao leite","250g de chocolate meio amargo","2 latas de leite condensado","2 latas de creme de leite","2 colheres de margarina","2 caixas de morango"}	{"Coloque as latas de leite condensado em uma panela com a manteiga e faça uma massa como um brigadeiro mole.","Coloque em uma travessa e, por cima deste brigadeiro mole, coloque os morangos cortados ao meio.","Reserve para fazer a cobertura.","Para fazer a cobertura, rale o chocolate ao leite e o meio amargo e misture ao creme de leite.","Misture e coloque no micro-ondas durante 1 minuto.","Retire e mexa","Coloque de novo no micro-ondas por mais 1 minuto.","Despeje a cobertura por cima dos morangos e leve à geladeira coberta por papel-filme."}	Você sabia que existem dicas para escolher os melhores e mais doces morangos? Isso mesmo! Na hora do mercado se atente ao tamanho das frutas: os menores normalmente são mais doces. Além disso, fique ligado no aspecto das folhas, no cheiro e na cor do morango. Se eles estiver bem vivo e sem manchas aparentes, está perfeito para o consumo. \r\n\r\n	2020-03-15 00:00:00
\.


--
-- Name: chefs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.chefs_id_seq', 7, true);


--
-- Name: recipes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.recipes_id_seq', 8, true);


--
-- Name: chefs chefs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chefs
    ADD CONSTRAINT chefs_pkey PRIMARY KEY (id);


--
-- Name: recipes recipes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT recipes_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

