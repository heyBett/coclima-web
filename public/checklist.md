Bom dia Igor, passando para atualizar sobre a dashboard.

---

A parte de layout está quase pronta, faltando apenas os renders do admin e a parte de gráfico e mapas. Pode ser vista aqui (já responsiva): https://co-clima-dashboard-v2.vercel.app/

Estamos mudando o ORM da API para o Prisma. Vai facilitar a manutenção futura e a criação (e correção) das regras de negócio da API.

Algumas regras novas podem precisar de um overview manual(ex. campo de email do user ser @unique vai fazer todos os users com email igual serem deletados, sobrando apenas um, o que pelo que vi no db não vai ser problema, os únicos duplicados foram dos testes que fiz)

Vamos usar o recharts para a parte de gráficos e google-map-react para o map, já que as bibliotecas do projeto antigo têm vulnerabilidades

Se conseguirmos implementar no VPS as API ROUTES do nextjs direto na aplicação o endpoint api.coclima pode nem ser necessário mais. Assim fazemos um monólito e tudo é acessado "localmente" sem necessidade de requests para outro subdomínio. Exemplo de como ficaria a rota de API https://co-clima-dashboard-v2.vercel.app/api/hello (com o domínio dashboard.coclima.com depois de tudo pronto)

Estamos pensando em tirar a imagem do cliente da dashboard. O campo nem existe no db e não tem necessidade da existência dele. O que você acha?

---

Precisamos do seguinte para deixar a aplicação redonda:

Conta de email compatível com SMTP. (noreply@coclima.com para envio de emails de redefinição de senha)

Credenciais de dev para a API do Maps (podemos criar aqui, mas o ideal seria vocês terem poder sobre essas credenciais. Se a CODX acabar amanhã a aplicação de vocês não deveria parar de funcionar)

---

Uma dúvida, é possível não deixar esse repositório público depois da entrega? Podemos autenticar o VPS para copiar o repo privado.
