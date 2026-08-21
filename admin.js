import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// ========================================
// CONFIGURAÇÃO SUPABASE
// ========================================

const SUPABASE_URL = "https://izicfuxbzlcvfrkkrbjb.supabase.co";
const SUPABASE_KEY = "sb_publishable_mXWuCOenMxAsmKge7-iUgw_vzp_idFj";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);


// ========================================
// ELEMENTOS
// ========================================

const form = document.getElementById("vehicleForm");
const fotosInput = document.getElementById("fotos");
const preview = document.getElementById("preview");
const submitButton = document.getElementById("submitButton");
const formMessage = document.getElementById("formMessage");
const adminVehicleGrid = document.getElementById("adminVehicleGrid");
const logoutButton = document.getElementById("logoutButton");

// tipo de veículo — cadastro
const tipoVeiculoButtons = document.querySelectorAll("#tipoVeiculoOptions .tipo-veiculo-btn");
const tipoVeiculoInput = document.getElementById("tipoVeiculo");
const tipoVeiculoOutroInput = document.getElementById("tipoVeiculoOutro");


// ========================================
// ELEMENTOS DO MODAL
// ========================================

const editModal = document.getElementById("editModal");
const modalOverlay = document.getElementById("modalOverlay");
const closeEditModal = document.getElementById("closeEditModal");
const cancelEdit = document.getElementById("cancelEdit");
const editForm = document.getElementById("editForm");
const editMessage = document.getElementById("editMessage");
const editPhotoGrid = document.getElementById("editPhotoGrid");
const noPhotosMessage = document.getElementById("noPhotosMessage");
const editFotos = document.getElementById("editFotos");

// tipo de veículo — edição
const editTipoVeiculoButtons = document.querySelectorAll("#editTipoVeiculoOptions .tipo-veiculo-btn");
const editTipoVeiculoInput = document.getElementById("editTipoVeiculo");
const editTipoVeiculoOutroInput = document.getElementById("editTipoVeiculoOutro");


// ========================================
// ESTADO
// ========================================

let fotosEditando = [];
let fotoArrastadaId = null;


// ========================================
// VERIFICAR LOGIN
// ========================================

async function verificarLogin() {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        window.location.href = "login.html";
        return false;
    }

    console.log("Usuário autenticado:", session.user.email);
    return true;
}


// ========================================
// LOGOUT
// ========================================

if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
        logoutButton.disabled = true;
        logoutButton.textContent = "Saindo...";

        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error("Erro ao sair:", error);
            alert("Não foi possível sair.");
            logoutButton.disabled = false;
            logoutButton.textContent = "Sair";
            return;
        }

        window.location.href = "login.html";
    });
}


// ========================================
// FORMATAÇÕES
// ========================================

function formatarPreco(valor) {
    if (valor === null || valor === undefined) {
        return "Consultar";
    }

    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function formatarKm(valor) {
    if (valor === null || valor === undefined) {
        return "Km não informado";
    }

    return Number(valor).toLocaleString("pt-BR") + " km";
}


// ========================================
// MENSAGEM
// ========================================

function mostrarMensagem(texto, tipo) {
    if (!formMessage) {
        return;
    }

    formMessage.textContent = texto;
    formMessage.className = `form-message ${tipo}`;
}

function mostrarMensagemEdicao(texto, tipo) {
    editMessage.textContent = texto;
    editMessage.className = `form-message ${tipo}`;
}


// ========================================
// TIPO DE VEÍCULO — CADASTRO
// ========================================

function selecionarTipoVeiculo(botao, botoesGrupo, inputTipo, inputOutro) {
    botoesGrupo.forEach(b => b.classList.remove("active"));
    botao.classList.add("active");
    inputTipo.value = botao.dataset.tipo;

    if (botao.dataset.tipo === "Outro") {
        inputOutro.style.display = "block";
        inputOutro.required = true;
    } else {
        inputOutro.style.display = "none";
        inputOutro.required = false;
        inputOutro.value = "";
    }
}

tipoVeiculoButtons.forEach(botao => {
    botao.addEventListener("click", () => {
        selecionarTipoVeiculo(botao, tipoVeiculoButtons, tipoVeiculoInput, tipoVeiculoOutroInput);
    });
});

function resetarTipoVeiculo() {
    tipoVeiculoButtons.forEach(b => b.classList.remove("active"));

    const botaoCarro = document.querySelector('#tipoVeiculoOptions .tipo-veiculo-btn[data-tipo="Carro"]');

    if (botaoCarro) {
        botaoCarro.classList.add("active");
    }

    tipoVeiculoInput.value = "Carro";
    tipoVeiculoOutroInput.style.display = "none";
    tipoVeiculoOutroInput.required = false;
    tipoVeiculoOutroInput.value = "";
}


// ========================================
// TIPO DE VEÍCULO — EDIÇÃO
// ========================================

editTipoVeiculoButtons.forEach(botao => {
    botao.addEventListener("click", () => {
        selecionarTipoVeiculo(botao, editTipoVeiculoButtons, editTipoVeiculoInput, editTipoVeiculoOutroInput);
    });
});

function definirTipoVeiculoEditor(tipo, tipoOutro) {
    const tipoAtual = tipo || "Carro";

    editTipoVeiculoButtons.forEach(b => {
        b.classList.toggle("active", b.dataset.tipo === tipoAtual);
    });

    editTipoVeiculoInput.value = tipoAtual;

    if (tipoAtual === "Outro") {
        editTipoVeiculoOutroInput.style.display = "block";
        editTipoVeiculoOutroInput.value = tipoOutro || "";
    } else {
        editTipoVeiculoOutroInput.style.display = "none";
        editTipoVeiculoOutroInput.value = "";
    }
}


// ========================================
// PREVIEW DO CADASTRO
// ========================================

if (fotosInput) {
    fotosInput.addEventListener("change", () => {
        preview.innerHTML = "";

        const arquivos = Array.from(fotosInput.files);

        arquivos.forEach((arquivo, index) => {
            const reader = new FileReader();

            reader.onload = (evento) => {
                const item = document.createElement("div");
                item.className = "preview-item";

                item.innerHTML = `
                    <img src="${evento.target.result}" alt="Foto ${index + 1}">
                    <span class="preview-number">${index + 1}</span>
                `;

                preview.appendChild(item);
            };

            reader.readAsDataURL(arquivo);
        });
    });
}


// ========================================
// CADASTRAR VEÍCULO
// ========================================

if (form) {
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const autenticado = await verificarLogin();
        if (!autenticado) {
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = "Cadastrando...";

        formMessage.className = "form-message";
        formMessage.textContent = "";

        try {
            const marca = document.getElementById("marca").value.trim();
            const modelo = document.getElementById("modelo").value.trim();
            const versao = document.getElementById("versao").value.trim();
            const ano = Number(document.getElementById("ano").value);
            const quilometragem = Number(document.getElementById("quilometragem").value);
            const preco = Number(document.getElementById("preco").value);
            const cambio = document.getElementById("cambio").value;
            const combustivel = document.getElementById("combustivel").value;
            const condicao = document.getElementById("condicao").value;
            const cor = document.getElementById("cor").value.trim();
            const descricao = document.getElementById("descricao").value.trim();
            const status = document.getElementById("status").value;
            const destaque = document.getElementById("destaque").checked;

            const tipoVeiculo = tipoVeiculoInput.value;
            const tipoVeiculoOutro = tipoVeiculoOutroInput.value.trim();

            if (
                !marca ||
                !modelo ||
                !ano ||
                !cambio ||
                !condicao ||
                quilometragem < 0 ||
                preco <= 0
            ) {
                throw new Error("Preencha corretamente os campos obrigatórios.");
            }

            if (!tipoVeiculo || (tipoVeiculo === "Outro" && !tipoVeiculoOutro)) {
                throw new Error("Selecione o tipo de veículo (e especifique qual, se for \"Outro\").");
            }

            const arquivos = Array.from(fotosInput.files);

            const { data: veiculo, error: erroVeiculo } = await supabase
                .from("veiculos")
                .insert({
                    marca,
                    modelo,
                    versao: versao || null,
                    ano,
                    quilometragem,
                    preco,
                    cambio,
                    combustivel: combustivel || null,
                    condicao: condicao,
                    cor: cor || null,
                    descricao: descricao || null,
                    status: status || "Disponível",
                    destaque,
                    tipo: tipoVeiculo,
                    tipo_outro: tipoVeiculo === "Outro" ? (tipoVeiculoOutro || null) : null
                })
                .select()
                .single();

            if (erroVeiculo) {
                throw new Error(erroVeiculo.message);
            }

            for (let i = 0; i < arquivos.length; i++) {
                const arquivo = arquivos[i];
                const extensao = arquivo.name.split(".").pop().toLowerCase();
                const nomeArquivo = `${veiculo.id}/${Date.now()}-${i}.${extensao}`;

                const { error: erroUpload } = await supabase.storage
                    .from("veiculos")
                    .upload(nomeArquivo, arquivo, {
                        cacheControl: "3600",
                        upsert: false
                    });

                if (erroUpload) {
                    throw new Error(`Erro ao enviar foto ${i + 1}: ${erroUpload.message}`);
                }

                const { data: urlData } = supabase.storage
                    .from("veiculos")
                    .getPublicUrl(nomeArquivo);

                const { error: erroFoto } = await supabase
                    .from("fotos_veiculos")
                    .insert({
                        veiculo_id: veiculo.id,
                        url: urlData.publicUrl,
                        ordem: i + 1
                    });

                if (erroFoto) {
                    throw new Error(`Erro ao salvar foto ${i + 1}: ${erroFoto.message}`);
                }
            }

            mostrarMensagem("✓ Veículo cadastrado com sucesso!", "success");

            form.reset();
            preview.innerHTML = "";
            resetarTipoVeiculo();

            await carregarEstoque();

        } catch (erro) {
            console.error("Erro ao cadastrar:", erro);
            mostrarMensagem(erro.message || "Ocorreu um erro.", "error");

        } finally {
            submitButton.disabled = false;
            submitButton.textContent = "Cadastrar veículo";
        }
    });
}


// ========================================
// CARREGAR ESTOQUE
// ========================================

async function carregarEstoque() {
    const { data: veiculos, error: erroVeiculos } = await supabase
        .from("veiculos")
        .select("*")
        .order("destaque", { ascending: false })
        .order("id", { ascending: false });

    if (erroVeiculos) {
        console.error("Erro ao carregar veículos:", erroVeiculos);
        adminVehicleGrid.innerHTML = `<div class="empty-stock">Erro ao carregar estoque.</div>`;
        return;
    }

    const { data: fotos, error: erroFotos } = await supabase
        .from("fotos_veiculos")
        .select("*")
        .order("ordem", { ascending: true });

    if (erroFotos) {
        console.error("Erro ao carregar fotos:", erroFotos);
    }

    adminVehicleGrid.innerHTML = "";

    if (!veiculos || veiculos.length === 0) {
        adminVehicleGrid.innerHTML = `<div class="empty-stock">Nenhum veículo cadastrado.</div>`;
        return;
    }

    veiculos.forEach((veiculo) => {
        const fotosVeiculo = (fotos || [])
            .filter(foto => String(foto.veiculo_id) === String(veiculo.id))
            .sort((a, b) => (a.ordem || 0) - (b.ordem || 0));

        const primeiraFoto = fotosVeiculo[0];
        const imagem = primeiraFoto ? primeiraFoto.url : "";

        criarCardAdmin(veiculo, imagem, fotosVeiculo.length);
    });
}


// ========================================
// LABEL DO TIPO DE VEÍCULO
// ========================================

function labelTipoVeiculo(veiculo) {
    if (!veiculo.tipo || veiculo.tipo === "Carro") {
        return "Carro";
    }

    if (veiculo.tipo === "Outro") {
        return veiculo.tipo_outro || "Outro";
    }

    return veiculo.tipo;
}


// ========================================
// CRIAR CARD
// ========================================

function criarCardAdmin(veiculo, imagem, quantidadeFotos) {
    const card = document.createElement("article");
    card.className = "admin-card";

    const statusClasse = String(veiculo.status || "Disponível")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    const imagemHTML = imagem
        ? `<img src="${imagem}" alt="${veiculo.marca} ${veiculo.modelo}">`
        : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#666;font-size:12px;">Sem foto</div>`;

    card.innerHTML = `
        <div class="admin-card-image">
            ${imagemHTML}
            <span class="admin-card-status ${statusClasse}">${veiculo.status || "Disponível"}</span>
            ${veiculo.destaque ? `<span class="admin-card-featured">★ DESTAQUE</span>` : ""}
        </div>

        <div class="admin-card-body">
            <span class="admin-card-category">
                ${labelTipoVeiculo(veiculo)} · ${quantidadeFotos} ${quantidadeFotos === 1 ? "FOTO" : "FOTOS"}
            </span>

            <h3>${veiculo.marca} ${veiculo.modelo}</h3>

            ${veiculo.versao ? `<span class="admin-card-version">${veiculo.versao}</span>` : ""}

            <div class="admin-card-details">
                <span>${veiculo.ano}</span>
                <span>${formatarKm(veiculo.quilometragem)}</span>
                <span>${veiculo.cambio || "-"}</span>
                ${veiculo.combustivel ? `<span>${veiculo.combustivel}</span>` : ""}
            </div>

            <div class="admin-card-price">${formatarPreco(veiculo.preco)}</div>

            <div class="admin-card-actions">
                <button type="button" class="card-button edit-button" data-id="${veiculo.id}">Editar</button>
                <button type="button" class="card-button delete delete-button" data-id="${veiculo.id}">Excluir</button>
            </div>
        </div>
    `;

    adminVehicleGrid.appendChild(card);

    const editButton = card.querySelector(".edit-button");
    const deleteButton = card.querySelector(".delete-button");

    editButton.addEventListener("click", () => {
        abrirEditor(veiculo.id);
    });

    deleteButton.addEventListener("click", () => {
        excluirVeiculo(veiculo.id, veiculo.marca, veiculo.modelo);
    });
}


// ========================================
// ABRIR EDITOR
// ========================================

async function abrirEditor(id) {
    mostrarMensagemEdicao("", "");

    editModal.classList.add("open");
    document.body.style.overflow = "hidden";

    const { data: veiculo, error: erroVeiculo } = await supabase
        .from("veiculos")
        .select("*")
        .eq("id", id)
        .single();

    if (erroVeiculo) {
        console.error("Erro ao carregar veículo:", erroVeiculo);
        mostrarMensagemEdicao(erroVeiculo.message, "error");
        return;
    }

    const { data: fotos, error: erroFotos } = await supabase
        .from("fotos_veiculos")
        .select("*")
        .eq("veiculo_id", id)
        .order("ordem", { ascending: true });

    if (erroFotos) {
        console.error("Erro ao carregar fotos:", erroFotos);
    }

    document.getElementById("editId").value = veiculo.id;
    document.getElementById("editMarca").value = veiculo.marca || "";
    document.getElementById("editModelo").value = veiculo.modelo || "";
    document.getElementById("editVersao").value = veiculo.versao || "";
    document.getElementById("editAno").value = veiculo.ano || "";
    document.getElementById("editKm").value = veiculo.quilometragem ?? "";
    document.getElementById("editPreco").value = veiculo.preco ?? "";
    document.getElementById("editCambio").value = veiculo.cambio || "Manual";
    document.getElementById("editCombustivel").value = veiculo.combustivel || "";
    document.getElementById("editCondicao").value = veiculo.condicao || "Seminovo";
    document.getElementById("editCor").value = veiculo.cor || "";
    document.getElementById("editDescricao").value = veiculo.descricao || "";
    document.getElementById("editStatus").value = veiculo.status || "Disponível";
    document.getElementById("editDestaque").checked = Boolean(veiculo.destaque);
    document.getElementById("editModalTitle").textContent = `${veiculo.marca} ${veiculo.modelo}`;

    definirTipoVeiculoEditor(veiculo.tipo, veiculo.tipo_outro);

    fotosEditando = fotos || [];
    renderizarFotosEditor();
}


// ========================================
// RENDERIZAR FOTOS DO EDITOR
// ========================================

function renderizarFotosEditor() {
    editPhotoGrid.innerHTML = "";

    if (!fotosEditando || fotosEditando.length === 0) {
        noPhotosMessage.style.display = "block";
        return;
    }

    noPhotosMessage.style.display = "none";

    fotosEditando
        .sort((a, b) => (a.ordem || 0) - (b.ordem || 0))
        .forEach((foto, index) => {
            const item = document.createElement("div");
            item.className = "edit-photo-item";
            item.draggable = true;
            item.dataset.fotoId = foto.id;

            if (index === 0) {
                item.classList.add("cover");
            }

            item.innerHTML = `
                <img src="${foto.url}" alt="Foto ${index + 1}" draggable="false">
                <span class="photo-order">${index + 1}</span>
                ${index === 0
                    ? `<span class="photo-cover">★ CAPA</span>`
                    : `<button type="button" class="photo-cover-button">Tornar capa</button>`
                }
                <button type="button" class="photo-delete" title="Excluir foto">×</button>
            `;

            const deleteButton = item.querySelector(".photo-delete");
            deleteButton.addEventListener("click", (event) => {
                event.stopPropagation();
                excluirFoto(foto);
            });

            const coverButton = item.querySelector(".photo-cover-button");
            if (coverButton) {
                coverButton.addEventListener("click", (event) => {
                    event.stopPropagation();
                    tornarFotoCapa(foto.id);
                });
            }

            configurarDragAndDrop(item);
            editPhotoGrid.appendChild(item);
        });
}


// ========================================
// DRAG AND DROP DAS FOTOS
// ========================================

function configurarDragAndDrop(item) {
    item.addEventListener("dragstart", (event) => {
        fotoArrastadaId = Number(item.dataset.fotoId);
        item.classList.add("dragging");
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", String(fotoArrastadaId));
    });

    item.addEventListener("dragend", () => {
        fotoArrastadaId = null;
        item.classList.remove("dragging");
        limparIndicadoresDrag();
    });

    item.addEventListener("dragover", (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";

        const idDestino = Number(item.dataset.fotoId);

        if (!fotoArrastadaId || fotoArrastadaId === idDestino) {
            return;
        }

        limparIndicadoresDrag();

        const rect = item.getBoundingClientRect();
        const metade = rect.left + rect.width / 2;

        if (event.clientX < metade) {
            item.classList.add("drag-over-left");
        } else {
            item.classList.add("drag-over-right");
        }
    });

    item.addEventListener("dragleave", () => {
        item.classList.remove("drag-over-left", "drag-over-right");
    });

    item.addEventListener("drop", (event) => {
        event.preventDefault();

        const idArrastado = Number(event.dataTransfer.getData("text/plain"));
        const idDestino = Number(item.dataset.fotoId);

        if (!idArrastado || !idDestino || idArrastado === idDestino) {
            limparIndicadoresDrag();
            return;
        }

        const rect = item.getBoundingClientRect();
        const metade = rect.left + rect.width / 2;
        const inserirAntes = event.clientX < metade;

        moverFoto(idArrastado, idDestino, inserirAntes);
        limparIndicadoresDrag();
    });
}

function limparIndicadoresDrag() {
    document.querySelectorAll(".edit-photo-item").forEach((item) => {
        item.classList.remove("drag-over-left", "drag-over-right", "dragging");
    });
}


// ========================================
// MOVER FOTO
// ========================================

function moverFoto(idArrastado, idDestino, inserirAntes) {
    const indiceOrigem = fotosEditando.findIndex(foto => Number(foto.id) === Number(idArrastado));
    const indiceDestino = fotosEditando.findIndex(foto => Number(foto.id) === Number(idDestino));

    if (indiceOrigem === -1 || indiceDestino === -1 || indiceOrigem === indiceDestino) {
        return;
    }

    const foto = fotosEditando.splice(indiceOrigem, 1)[0];

    let novoIndice = fotosEditando.findIndex(item => Number(item.id) === Number(idDestino));

    if (!inserirAntes) {
        novoIndice++;
    }

    fotosEditando.splice(novoIndice, 0, foto);

    reorganizarFotos();
    renderizarFotosEditor();

    mostrarMensagemEdicao(
        "Ordem das fotos alterada. Clique em \u201cSalvar alterações\u201d para confirmar.",
        "success"
    );
}


// ========================================
// EXCLUIR FOTO
// ========================================

async function excluirFoto(foto) {
    const confirmar = confirm("Deseja realmente excluir esta foto?");
    if (!confirmar) {
        return;
    }

    try {
        const caminho = extrairCaminhoStorage(foto.url);

        if (caminho) {
            const { error: erroStorage } = await supabase.storage
                .from("veiculos")
                .remove([caminho]);

            if (erroStorage) {
                console.warn("Erro ao apagar arquivo do Storage:", erroStorage);
            }
        }

        const { error } = await supabase
            .from("fotos_veiculos")
            .delete()
            .eq("id", foto.id);

        if (error) {
            throw new Error(error.message);
        }

        fotosEditando = fotosEditando.filter(item => item.id !== foto.id);

        reorganizarFotos();
        renderizarFotosEditor();

    } catch (erro) {
        console.error("Erro ao excluir foto:", erro);
        mostrarMensagemEdicao(erro.message, "error");
    }
}


// ========================================
// TORNAR FOTO CAPA
// ========================================

function tornarFotoCapa(id) {
    const foto = fotosEditando.find(item => item.id === id);
    if (!foto) {
        return;
    }

    fotosEditando = [foto, ...fotosEditando.filter(item => item.id !== id)];

    reorganizarFotos();
    renderizarFotosEditor();

    mostrarMensagemEdicao(
        "Foto definida como capa. Clique em \u201cSalvar alterações\u201d para confirmar.",
        "success"
    );
}


// ========================================
// REORGANIZAR ORDENS
// ========================================

function reorganizarFotos() {
    fotosEditando.forEach((foto, index) => {
        foto.ordem = index + 1;
    });
}


// ========================================
// CAMINHO DO STORAGE
// ========================================

function extrairCaminhoStorage(url) {
    if (!url) {
        return null;
    }

    const marcador = "/storage/v1/object/public/veiculos/";
    const posicao = url.indexOf(marcador);

    if (posicao === -1) {
        return null;
    }

    return url.substring(posicao + marcador.length);
}


// ========================================
// ADICIONAR FOTOS PELO EDITOR
// ========================================

if (editFotos) {
    editFotos.addEventListener("change", async () => {
        const id = Number(document.getElementById("editId").value);
        const arquivos = Array.from(editFotos.files);

        if (!id || arquivos.length === 0) {
            return;
        }

        try {
            editFotos.disabled = true;
            mostrarMensagemEdicao("Enviando fotos...", "success");

            let proximaOrdem = fotosEditando.length + 1;

            for (const arquivo of arquivos) {
                const extensao = arquivo.name.split(".").pop().toLowerCase();
                const nomeArquivo = `${id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${extensao}`;

                const { error: erroUpload } = await supabase.storage
                    .from("veiculos")
                    .upload(nomeArquivo, arquivo, {
                        cacheControl: "3600",
                        upsert: false
                    });

                if (erroUpload) {
                    throw new Error(erroUpload.message);
                }

                const { data: urlData } = supabase.storage
                    .from("veiculos")
                    .getPublicUrl(nomeArquivo);

                const { data: novaFoto, error: erroFoto } = await supabase
                    .from("fotos_veiculos")
                    .insert({
                        veiculo_id: id,
                        url: urlData.publicUrl,
                        ordem: proximaOrdem++
                    })
                    .select()
                    .single();

                if (erroFoto) {
                    throw new Error(erroFoto.message);
                }

                fotosEditando.push(novaFoto);
            }

            reorganizarFotos();

            mostrarMensagemEdicao("✓ Fotos adicionadas com sucesso!", "success");

            editFotos.value = "";

            renderizarFotosEditor();
            await carregarEstoque();

        } catch (erro) {
            console.error("Erro ao adicionar fotos:", erro);
            mostrarMensagemEdicao(erro.message, "error");

        } finally {
            editFotos.disabled = false;
        }
    });
}


// ========================================
// SALVAR EDIÇÃO
// ========================================

if (editForm) {
    editForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const autenticado = await verificarLogin();
        if (!autenticado) {
            return;
        }

        const id = Number(document.getElementById("editId").value);
        const saveButton = document.getElementById("saveEditButton");

        saveButton.disabled = true;
        saveButton.textContent = "Salvando...";

        try {
            const tipoVeiculo = editTipoVeiculoInput.value;
            const tipoVeiculoOutro = editTipoVeiculoOutroInput.value.trim();

            if (!tipoVeiculo || (tipoVeiculo === "Outro" && !tipoVeiculoOutro)) {
                throw new Error("Selecione o tipo de veículo (e especifique qual, se for \"Outro\").");
            }

            // -----------------------------
            // ATUALIZAR VEÍCULO
            // -----------------------------

            const { error } = await supabase
                .from("veiculos")
                .update({
                    marca: document.getElementById("editMarca").value.trim(),
                    modelo: document.getElementById("editModelo").value.trim(),
                    versao: document.getElementById("editVersao").value.trim() || null,
                    ano: Number(document.getElementById("editAno").value),
                    quilometragem: Number(document.getElementById("editKm").value),
                    preco: Number(document.getElementById("editPreco").value),
                    cambio: document.getElementById("editCambio").value,
                    combustivel: document.getElementById("editCombustivel").value || null,
                    condicao: document.getElementById("editCondicao").value,
                    cor: document.getElementById("editCor").value.trim() || null,
                    descricao: document.getElementById("editDescricao").value.trim() || null,
                    status: document.getElementById("editStatus").value,
                    destaque: document.getElementById("editDestaque").checked,
                    tipo: tipoVeiculo,
                    tipo_outro: tipoVeiculo === "Outro" ? (tipoVeiculoOutro || null) : null
                })
                .eq("id", id);

            if (error) {
                throw new Error(error.message);
            }

            // -----------------------------
            // SALVAR ORDEM DAS FOTOS
            // -----------------------------

            reorganizarFotos();

            for (const foto of fotosEditando) {
                const { error: erroOrdem } = await supabase
                    .from("fotos_veiculos")
                    .update({ ordem: foto.ordem })
                    .eq("id", foto.id);

                if (erroOrdem) {
                    throw new Error(erroOrdem.message);
                }
            }

            mostrarMensagemEdicao("✓ Alterações salvas com sucesso!", "success");

            await carregarEstoque();

            setTimeout(() => {
                fecharEditor();
            }, 700);

        } catch (erro) {
            console.error("Erro ao salvar:", erro);
            mostrarMensagemEdicao(erro.message, "error");

        } finally {
            saveButton.disabled = false;
            saveButton.textContent = "Salvar alterações";
        }
    });
}


// ========================================
// EXCLUIR VEÍCULO
// ========================================

async function excluirVeiculo(id, marca, modelo) {
    const confirmar = confirm(`Deseja realmente excluir ${marca} ${modelo}?\n\nEsta ação também removerá as fotos cadastradas.`);
    if (!confirmar) {
        return;
    }

    try {
        const { data: fotos } = await supabase
            .from("fotos_veiculos")
            .select("*")
            .eq("veiculo_id", id);

        if (fotos && fotos.length) {
            const caminhos = fotos
                .map(foto => extrairCaminhoStorage(foto.url))
                .filter(Boolean);

            if (caminhos.length) {
                const { error: erroStorage } = await supabase.storage
                    .from("veiculos")
                    .remove(caminhos);

                if (erroStorage) {
                    console.warn("Erro ao remover fotos do Storage:", erroStorage);
                }
            }
        }

        const { error: erroFotos } = await supabase
            .from("fotos_veiculos")
            .delete()
            .eq("veiculo_id", id);

        if (erroFotos) {
            throw new Error(erroFotos.message);
        }

        const { error: erroVeiculo } = await supabase
            .from("veiculos")
            .delete()
            .eq("id", id);

        if (erroVeiculo) {
            throw new Error(erroVeiculo.message);
        }

        await carregarEstoque();

    } catch (erro) {
        console.error("Erro ao excluir veículo:", erro);
        alert(`Erro ao excluir veículo:\n${erro.message}`);
    }
}


// ========================================
// FECHAR EDITOR
// ========================================

function fecharEditor() {
    editModal.classList.remove("open");
    document.body.style.overflow = "";

    editForm.reset();

    fotosEditando = [];
    fotoArrastadaId = null;

    editPhotoGrid.innerHTML = "";
    noPhotosMessage.style.display = "block";

    editMessage.className = "form-message";
    editMessage.textContent = "";
}


// ========================================
// EVENTOS MODAL
// ========================================

if (closeEditModal) {
    closeEditModal.addEventListener("click", fecharEditor);
}

if (cancelEdit) {
    cancelEdit.addEventListener("click", fecharEditor);
}

if (modalOverlay) {
    modalOverlay.addEventListener("click", fecharEditor);
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && editModal.classList.contains("open")) {
        fecharEditor();
    }
});


// ========================================
// INICIALIZAÇÃO
// ========================================

async function iniciarAdmin() {
    const autenticado = await verificarLogin();
    if (!autenticado) {
        return;
    }

    await carregarEstoque();
    console.log("Admin iniciado.");
}

iniciarAdmin();