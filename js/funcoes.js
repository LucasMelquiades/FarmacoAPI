function openNav() {
document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
document.getElementById("mySidenav").style.width = "0";
}


let todasPlantas = [];

// Função principal para renderizar as plantas
function renderPlantas(plantas) {
  const listTab = document.getElementById("list-tab");
  const tabContent = document.getElementById("nav-tabContent");

  listTab.innerHTML = "";
  tabContent.innerHTML = "";

  plantas.forEach((planta, index) => {
    const tabId = `planta-${index}`;
    const isActive = index === 0 ? "active" : "";

    // Criar item da lista
    const listItem = document.createElement("a");
    listItem.className = `list-group-item list-group-item-action ${isActive}`;
    listItem.id = `${tabId}-list`;
    listItem.setAttribute("data-bs-toggle", "list");
    listItem.href = `#${tabId}`;
    listItem.role = "tab";
    listItem.setAttribute("aria-controls", tabId);
    listItem.textContent = planta.nomes_populares?.join(", ") || "Sem nome popular";
    listTab.appendChild(listItem);

    // Criar conteúdo da aba
    const tabPane = document.createElement("div");
    tabPane.className = `tab-pane fade ${isActive ? "show active" : ""}`;
    tabPane.id = tabId;
    tabPane.role = "tabpanel";
    tabPane.setAttribute("aria-labelledby", `${tabId}-list`);

    tabPane.innerHTML = `
      <h4>${planta.nome_cientifico}</h4>
      <h5>${planta.nomes_populares?.join(", ") || ""}</h5>
      ${planta.sinonimia ? `<p><strong>Sinonímia:</strong> ${planta.sinonimia}</p>` : ""}
      <div id="imagem-planta-${index}" class="pt-5 text-center mb-3"><p class="text-muted">Carregando imagem...</p></div>
      <h5 class="mt-4 text-center pb-3">Modos de Aplicação</h5>
      <div id="aplicacoes-container-${index}"></div>
    `;

    tabContent.appendChild(tabPane);

    // Renderizar aplicações
    renderAplicacoes(planta, `aplicacoes-container-${index}`);

    // Buscar imagem da planta
    buscarImagemWikimedia(planta.nome_cientifico, planta.nomes_populares?.[0]).then(imagem => {
      const imagemContainer = document.getElementById(`imagem-planta-${index}`);
      if (!imagemContainer) return;

      if (imagem) {
        imagemContainer.innerHTML = `
          <img src="${imagem.url}" alt="${planta.nome_cientifico}" class="img-fluid" style="max-height: 225px;">
          <p class="mt-2 pb-3"><small>
            <strong>Créditos:</strong> ${imagem.autor}<br>
            <strong>Licença:</strong> ${imagem.licenca}
          </small></p>
        `;
      } else {
        imagemContainer.innerHTML = `<p class="text-muted">Imagem não encontrada</p>`;
      }
    });
  });
}

// Função para buscar imagem no Wikimedia Commons
async function buscarImagemWikimedia(nomeCientifico, nomePopular = "") {
  const termosBusca = [
    `${nomeCientifico}`, 
    `${nomeCientifico} planta`,
    `${nomePopular} planta`,    
    `${nomePopular}`,       
    `${nomeCientifico} flower`
  ];

  //  Função para gerar URL leve (thumbnail)
  const gerarThumbUrl = (originalUrl, largura = 300) => {
    const match = originalUrl.match(/\/commons\/([^/]+)\/([^/]+)\/(.+\.(jpg|jpeg|png|gif))/i);
    if (!match) return originalUrl;

    const [_, pasta1, pasta2, nomeArquivo] = match;
    return `https://upload.wikimedia.org/wikipedia/commons/thumb/${pasta1}/${pasta2}/${nomeArquivo}/${largura}px-${nomeArquivo}`;
  };

  //  Função para limpar HTML embutido
  const cleanHTML = (html) => {
    const temp = document.createElement("div");
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || "";
  };

  for (const termoBusca of termosBusca) {
    const endpoint = "https://commons.wikimedia.org/w/api.php";
    const params = new URLSearchParams({
      action: "query",
      format: "json",
      origin: "*",
      prop: "imageinfo",
      generator: "search",
      gsrsearch: termoBusca,
      gsrnamespace: 6,
      gsrlimit: 1,
      iiprop: "url|extmetadata"
    });

    try {
      const response = await fetch(`${endpoint}?${params}`);
      const data = await response.json();

      const pages = data.query?.pages;
      if (!pages) continue;

      const page = Object.values(pages)[0];
      const imageInfo = page.imageinfo?.[0];
      if (!imageInfo) continue;

      //  Filtra apenas imagens válidas
      const extensaoValida = /\.(jpg|jpeg|png|gif)$/i;
      if (!extensaoValida.test(imageInfo.url)) continue;

      //  Retorno com imagem leve
      return {
        url: gerarThumbUrl(imageInfo.url),
        autor: cleanHTML(imageInfo.extmetadata?.Artist?.value || "Desconhecido"),
        licenca: imageInfo.extmetadata?.LicenseShortName?.value || "Desconhecida",
        descricao: cleanHTML(imageInfo.extmetadata?.ImageDescription?.value || "")
      };
    } catch (error) {
      console.error(`Erro ao buscar imagem com termo "${termoBusca}":`, error);
      continue;
    }
  }

  return null; // Nenhuma imagem válida encontrada
}

// Função para trocar fórmula exibida
function trocarFormula(containerId, index) {
  const plantaIndex = parseInt(containerId.split("-")[1]);
  const modoIndex = parseInt(containerId.split("-")[2]);
  const formulaIndex = parseInt(index);

  const modo = todasPlantas[plantaIndex].modos_aplicacao[modoIndex];
  const formula = modo.formulas[formulaIndex];

  const container = document.getElementById(`formula-${containerId}`);
  if (container && formula) {
    container.innerHTML = `
      <p><strong>ID da fórmula:</strong> ${formula.id_formula}</p>
      ${formula.componentes ? `<p><strong>Componentes:</strong> ${formula.componentes.join(", ")}</p>` : ""}
      ${formula.modo_de_usar ? `<p><strong>Modo de usar:</strong> ${formula.modo_de_usar}</p>` : ""}
      ${formula.advertencias ? `<p><strong>Advertências:</strong> ${formula.advertencias}</p>` : ""}
      ${formula.orientacoes_preparo ? `<p><strong>Preparo:</strong> ${formula.orientacoes_preparo}</p>` : ""}
      ${formula.indicacoes ? `<p><strong>Indicações:</strong> ${formula.indicacoes}</p>` : ""}
    `;
  }
}

// Função principal para renderizar os cards de aplicação
function renderAplicacoes(planta, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  if (!Array.isArray(planta.modos_aplicacao)) {
    container.innerHTML = "<p>Sem modos de aplicação disponíveis.</p>";
    return;
  }

  const row = document.createElement("div");
  row.className = "row";

  const icones = {
    "Pomada": "💆‍♂️",
    "Preparação extemporânea": "🧪",
    "Tintura": "🌱💧",
    "Gel": "🧴",
    "Alcoolatura": "🍶",
    "Cápsula com Droga Vegetal":"🌿💊",
    "Cápsula com Derivado":"🧬💊",
    "Cápsula ou Comprimido com Derivado":"⚪💊",
    "Extrato Fluido":"💧",
    "Xarope":"🥄",
    "Creme":"🧴🌿",
    "Sabonete Líquido":"🧴🧼",
    "Outro":"🌿"
  };

  planta.modos_aplicacao.forEach((modo) => {
    const col = document.createElement("div");
    col.className = "col-md-6 mb-4";

    const card = document.createElement("div");
    card.className = "card h-100 shadow-sm";
    card.style.cursor = "pointer";

    const icone = icones[modo.tipo] || "🌿";

    card.innerHTML = `
      <div class="card-body text-center">
        <div style="font-size: 2rem;">${icone}</div>
        <h5 class="card-title mt-2">${modo.tipo}</h5>
      </div>
    `;

    const primeiraFormula = Array.isArray(modo.formulas) ? modo.formulas[0] : null;
    card.onclick = () => {
  abrirModalAplicacao(modo);
};



    col.appendChild(card);
    row.appendChild(col);
  });

  container.appendChild(row);
}

// Função para abrir o SweetAlert2 com os detalhes
function abrirModalAplicacao(modo) {

  const formulas = Array.isArray(modo.formulas) ? modo.formulas : [];
  let htmlContent = "";

  // 🔹 Informações de embalagem
  if (Array.isArray(modo.embalagem_e_armazenamento)) {
    htmlContent += `<h5>Informações sobre Embalagem</h5>`;
    modo.embalagem_e_armazenamento.forEach((emb, index) => {
      htmlContent += `
        <div class="mb-3 p-2 border rounded" style="background-color: #eef2f7;">
          <p><strong>Geral:</strong> ${emb.geral || "—"}</p>
          <p><strong>Especificação:</strong> ${emb.tipo_especificado || "—"}</p>
        </div>
      `;
    });
  }

  //  Verificação de fórmulas
  if (formulas.length === 0) {
    htmlContent += "<p>Este modo de aplicação não possui fórmulas cadastradas.</p>";
  } else {
    //  Select para escolher fórmula
    if (formulas.length > 1) {
  htmlContent += `
    <label for="selectFormula"><strong>Escolha a fórmula:</strong></label>
    <select id="selectFormula" class="form-select mb-3" onchange="exibirFormulaSelecionada(this.value)">
      ${formulas.map((f, i) => `<option value="${i}">Fórmula ${i + 1}</option>`).join("")}
    </select>
    <div id="formulaContent"></div>
  `;
} else {
  htmlContent += `<div id="formulaContent"></div>`;
}


  }

  //  Exibe o popup
  Swal.fire({
    title: modo.tipo || 'Modo de Aplicação',
    html: htmlContent,
    width: '700px',
    showCloseButton: true,
    confirmButtonText: 'Fechar',
    didOpen: () => {
      if (formulas.length > 0) {
        exibirFormulaSelecionada(0, formulas); // Exibe a primeira fórmula ao abrir
      }
    },
    customClass: {
      popup: 'swal2-custom-popup'
    }
  });

  //  Função auxiliar para renderizar fórmula
  window.exibirFormulaSelecionada = function (index, lista = formulas) {
    const formula = lista[parseInt(index)];
    const container = document.getElementById("formulaContent");

    if (!formula || !container) return;

    let formulaHTML = `
      <div class="mb-4 p-3 border rounded" style="background-color: #f9f9f9;">
        <h5>Fórmula ${parseInt(index) + 1}</h5>
        ${formula?.id_formula ? `<p><strong>ID da fórmula:</strong> ${formula.id_formula}</p>` : ""}
    `;

    // Componentes por fases
    if (Array.isArray(formula?.fases)) {
      formulaHTML += `<h6 class="mt-3">Componentes por Fases</h6>`;
      formula.fases.forEach(fase => {
        formulaHTML += `
          <div class="mb-2">
            <p><strong>${fase?.nome || "Fase sem nome"}:</strong></p>
            <ul>
              ${Array.isArray(fase?.componentes)
                ? fase.componentes.map(comp => `<li>${comp}</li>`).join("")
                : "<li>Sem componentes</li>"}
            </ul>
          </div>
        `;
      });
    } else if (Array.isArray(formula?.componentes)) {
      formulaHTML += `
        <p><strong>Componentes:</strong></p>
        <ul>
          ${formula.componentes.map(comp => `<li>${comp}</li>`).join("")}
        </ul>
      `;
    }

    // Campos gerais
    formulaHTML += `
      ${formula?.orientacoes_preparo ? `<p><strong>Preparo:</strong> ${formula.orientacoes_preparo}</p>` : ""}
      ${formula?.indicacoes ? `<p><strong>Indicações:</strong> ${formula.indicacoes}</p>` : ""}
      ${formula?.modo_de_usar ? `<p><strong>Modo de usar:</strong> ${formula.modo_de_usar}</p>` : ""}
      ${formula?.advertencias ? `<p><strong>Advertências:</strong> ${formula.advertencias}</p>` : ""}
    `;

    formulaHTML += `</div>`;
    container.innerHTML = formulaHTML;
  };
}

function renderGeneralidades(generalidades) {
  const select = document.getElementById("selectGeneralidade");
  const infoContainer = document.getElementById("infoGeneralidade");

  generalidades.forEach((gen, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = gen.nome;
    select.appendChild(option);
  });

  select.addEventListener("change", function () {
    const selectedIndex = this.value;
    if (selectedIndex === "") {
      infoContainer.innerHTML = "";
      return;
    }

    const selectedGen = generalidades[selectedIndex];
    let html = `<p><strong>Descrição:</strong> ${selectedGen.descricao}</p>`;

    if (Array.isArray(selectedGen.detalhes)) {
      html += `<p><strong></strong></p><ul>`;
      selectedGen.detalhes.forEach(item => {
        html += `<li>${item}</li>`;
      });
      html += `</ul>`;
    }

    infoContainer.innerHTML = html;
  });
}

// Carregar JSON
fetch('js/farmacopeia.json')
  .then(response => response.json())
  .then(data => {
    todasPlantas = data.plantas;
    renderPlantas(todasPlantas);
    todasGeneralidades = data.generalidades;
    renderGeneralidades(todasGeneralidades);
  })
  .catch(error => console.error("Erro ao carregar JSON:", error));

// Filtro de busca
document.getElementById("searchInput").addEventListener("input", function () {
  const termo = this.value.toLowerCase();
  const filtradas = todasPlantas.filter(planta =>
    planta.nomes_populares?.some(nome => nome.toLowerCase().includes(termo))
  );
  renderPlantas(filtradas);
});