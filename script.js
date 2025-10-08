// Lista de produtos
const produtos = [
  { nome: "Kit de Banho", descricao: "Transforme seu banho em um momento único com limpeza, hidratação e perfume duradouro.", preco: "R$ 89,90", imagem: "images/Kit de Banho.jpg.jpeg", estoque: 12 },
  { nome: "Sabonete Íntimo", descricao: "Limpeza suave e fragrância leve de lavanda para cuidado íntimo diário.", preco: "R$ 59,90", imagem: "images/Sabonete Intimo.jpg.jpeg", estoque: 8 },
  { nome: "Demaquilante", descricao: "Remove maquiagem de forma eficaz, deixando a pele fresca e hidratada.", preco: "R$ 49,99", imagem: "images/Demaquilante.jpg.jpeg", estoque: 15 },
  { nome: "Esfoliante Corporal", descricao: "Pele mais macia e radiante com sensação de renovação a cada uso.", preco: "R$ 79,90", imagem: "images/Esfoliante Corporal.jpg.jpeg", estoque: 6 },
  { nome: "Sabonete Facial Detox", descricao: "Com ingredientes naturais, limpa profundamente e hidrata sua pele.", preco: "R$ 35,00", imagem: "images/Sabonete facial detox.jpg.jpeg", estoque: 20 },
  { nome: "Mascara facial", descricao: "Um momento de cuidado que renova e hidrata, revelando uma pele mais fresca e luminosa.", preco: "R$ 29,90", imagem: "images/Mascara facial detox.jpg.jpeg", estoque: 10 },
  { nome: "Serum antirrugas", descricao: "Textura leve e de rápida absorção que suaviza linhas finas e devolve firmeza.", preco: "R$ 95,50", imagem: "images/Serum antirrugas.jpg.jpeg", estoque: 5 },
  { nome: "Skincare", descricao: "Um ritual completo para realçar a beleza natural da pele.", preco: "R$ 79,99", imagem: "images/Skincare.jpg.jpeg", estoque: 7 },
  { nome: "Kit de skincare", descricao: "Kit perfeito para hidratar e relaxar seu corpo.", preco: "R$ 89,99", imagem: "images/Kit de skincare.jpg.jpeg", estoque: 3 },
  { nome: "Óleo Corporal", descricao: "Toque leve e hidratante que transforma a pele.", preco: "R$ 25,00", imagem: "images/Óleo Corporal.jpg.jpeg", estoque: 4 },
];

// Containers
const container = document.getElementById("produtos-container");
const btnCarrinho = document.getElementById("btn-carrinho");
const carrinhoContainer = document.getElementById("carrinho-container");
const listaCarrinho = document.getElementById("lista-carrinho");
const contadorCarrinho = document.getElementById("contador-carrinho");
const containerNotificacoes = document.getElementById("notificacoes");

// Carrinho
let carrinho = [];

// Login admin
const adminLogin = document.getElementById("admin-login");
const btnLogin = document.getElementById("btn-login");
const emailInput = document.getElementById("admin-email");
const senhaInput = document.getElementById("admin-senha");
const loginStatus = document.getElementById("login-status");
let adminLogado = false;

btnLogin.addEventListener("click", () => {
  const email = emailInput.value.trim();
  const senha = senhaInput.value.trim();

  if (email === "seuemail@gmail.com" && senha === "123456") {
    adminLogado = true;
    loginStatus.style.color = "green";
    loginStatus.textContent = "Login realizado com sucesso!";
    adminLogin.style.display = "none";
    notificar("Administrador logado com sucesso!");
  } else {
    loginStatus.textContent = "E-mail ou senha incorretos.";
  }
});

// Função de notificação
function notificar(mensagem, tipo = "normal") {
  const div = document.createElement("div");
  div.className = "notificacao" + (tipo === "baixo" ? " baixo" : "");
  div.textContent = mensagem;
  containerNotificacoes.appendChild(div);
  setTimeout(() => div.classList.add("show"), 100);
  setTimeout(() => { div.classList.remove("show"); setTimeout(() => div.remove(), 500); }, 4000);
}

// Atualizar carrinho
function atualizarCarrinho() {
  listaCarrinho.innerHTML = "";
  let totalItens = 0;
  carrinho.forEach(item => {
    totalItens += item.quantidade;
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.produto.nome} (x${item.quantidade})
      <button class="remover" data-nome="${item.produto.nome}">Remover</button>
    `;
    listaCarrinho.appendChild(li);
  });
  contadorCarrinho.textContent = totalItens;
}

// Mostrar/ocultar carrinho
btnCarrinho.addEventListener("click", () => {
  carrinhoContainer.style.display = carrinhoContainer.style.display === "block" ? "none" : "block";
});

// Renderizar produtos
produtos.forEach((produto, index) => {
  const div = document.createElement("div");
  div.className = "produto produto-" + index;
  div.setAttribute("data-nome", produto.nome);

  const estoqueTexto = produto.estoque > 5 ? `<p class="estoque">Estoque: ${produto.estoque}</p>` : 
                       produto.estoque > 0 ? `<p class="estoque baixo">⚠️ Estoque baixo: ${produto.estoque}</p>` : 
                       `<p class="estoque esgotado">❌ Produto esgotado</p>`;

  div.innerHTML = `
    <img src="${produto.imagem}" alt="${produto.nome}">
    <h2>${produto.nome}</h2>
    <p>${produto.descricao}</p>
    <p class="preco">${produto.preco}</p>
    <div class="estoque-container">${estoqueTexto}</div>
    <button class="btn-comprar" ${produto.estoque===0?"disabled":""}>Comprar</button>
  `;

  const btn = div.querySelector(".btn-comprar");
  const estoqueEl = div.querySelector(".estoque-container");

  btn.addEventListener("click", () => {
    if(produto.estoque > 0){
      produto.estoque -= 1;

      // Adiciona ao carrinho
      const itemCarrinho = carrinho.find(item=>item.produto.nome===produto.nome);
      if(itemCarrinho) itemCarrinho.quantidade +=1;
      else carrinho.push({produto:produto,quantidade:1});

      atualizarCarrinho();
      notificar(`${produto.nome} adicionado ao carrinho!`);

      // Atualizar estoque
      if(produto.estoque===0){
        estoqueEl.innerHTML=`<p class="estoque esgotado">❌ Produto esgotado</p>`;
        btn.disabled=true;
      } else if(produto.estoque<=5){
        estoqueEl.innerHTML=`<p class="estoque baixo">⚠️ Estoque baixo: ${produto.estoque}</p>`;
        notificar(`⚠️ Estoque baixo de ${produto.nome}: ${produto.estoque} restantes`,"baixo");

        // Envia email se admin estiver logado
        if(produto.estoque <= 3 && adminLogado){
          emailjs.send("SEU_SERVICE_ID", "SEU_TEMPLATE_ID", {
            produto: produto.nome,
            estoque: produto.estoque,
          }).then(() => {
            notificar(`📧 Email enviado: ${produto.nome} quase esgotando!`);
          }).catch(err => console.error("Erro ao enviar email:", err));
        }

      } else{
        estoqueEl.innerHTML=`<p class="estoque">Estoque: ${produto.estoque}</p>`;
      }
    }
  });

  container.appendChild(div);
});

// Remover item do carrinho
listaCarrinho.addEventListener("click", e=>{
  if(e.target.classList.contains("remover")){
    const nome = e.target.getAttribute("data-nome");
    const index = carrinho.findIndex(item=>item.produto.nome===nome);
    if(index>-1){
      const produto = carrinho[index].produto;
      produto.estoque += carrinho[index].quantidade;

      const card = document.querySelector(`.produto[data-nome="${nome}"]`);
      const estoqueEl = card.querySelector(".estoque-container");
      const btn = card.querySelector(".btn-comprar");

      estoqueEl.innerHTML=`<p class="estoque">Estoque: ${produto.estoque}</p>`;
      btn.disabled=false;

      carrinho.splice(index,1);
      atualizarCarrinho();
    }
  }
});
