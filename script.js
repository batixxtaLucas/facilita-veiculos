import {
    createClient
} from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";


// ========================================
// CONFIGURAÇÃO SUPABASE
// ========================================

const SUPABASE_URL =
    "https://izicfuxbzlcvfrkkrbjb.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_mXWuCOenMxAsmKge7-iUgw_vzp_idFj";

const supabase =
    createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// ========================================
// WHATSAPP
// ========================================

const WHATSAPP_NUMERO =
    "5555999999999";

const WHATSAPP_MENSAGEM =
    "Olá! Gostaria de saber mais sobre os veículos da Facilita.";


function configurarWhatsApp() {

    const linksWhatsApp =
        document.querySelectorAll(
            ".whatsapp-link"
        );

    if (!linksWhatsApp.length) {
        return;
    }

    const mensagem =
        encodeURIComponent(
            WHATSAPP_MENSAGEM
        );

    const urlWhatsApp =
        `https://wa.me/${WHATSAPP_NUMERO}?text=${mensagem}`;

    linksWhatsApp.forEach(
        link => {

            link.href =
                urlWhatsApp;

        }
    );

}


// ========================================
// VARIÁVEIS
// ========================================

let todosVeiculos = [];


// ========================================
// ELEMENTOS
// ========================================

const vehicleGrid =
    document.getElementById(
        "vehicleGrid"
    );

const vehicleCount =
    document.getElementById(
        "vehicleCount"
    );

const searchVehicle =
    document.getElementById(
        "searchVehicle"
    );

const filterTipo =
    document.getElementById(
        "filterTipo"
    );

const filterMarca =
    document.getElementById(
        "filterMarca"
    );

const filterCambio =
    document.getElementById(
        "filterCambio"
    );

const filterPreco =
    document.getElementById(
        "filterPreco"
    );

const filterAno =
    document.getElementById(
        "filterAno"
    );

const sortVehicles =
    document.getElementById(
        "sortVehicles"
    );

const clearFilters =
    document.getElementById(
        "clearFilters"
    );

const menuButton =
    document.getElementById(
        "menuButton"
    );

const headerMenu =
    document.getElementById(
        "headerMenu"
    );


// ========================================
// MENU
// ========================================

function configurarMenu() {

    if (
        !menuButton ||
        !headerMenu
    ) {
        return;
    }

    menuButton.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            const aberto =
                headerMenu.classList.toggle(
                    "open"
                );

            menuButton.classList.toggle(
                "active",
                aberto
            );

            menuButton.setAttribute(
                "aria-expanded",
                String(aberto)
            );

        }
    );


    headerMenu
        .querySelectorAll("a")
        .forEach(
            link => {

                link.addEventListener(
                    "click",
                    () => {

                        headerMenu.classList.remove(
                            "open"
                        );

                        menuButton.classList.remove(
                            "active"
                        );

                        menuButton.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }
                );

            }
        );


    document.addEventListener(
        "click",
        event => {

            if (
                !headerMenu.contains(event.target) &&
                !menuButton.contains(event.target)
            ) {

                headerMenu.classList.remove(
                    "open"
                );

                menuButton.classList.remove(
                    "active"
                );

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }
    );

}


// ========================================
// FORMATAR PREÇO
// ========================================

function formatarPreco(valor) {

    if (
        valor === null ||
        valor === undefined ||
        valor === ""
    ) {

        return "Consultar";

    }

    return Number(valor)
        .toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

}


// ========================================
// FORMATAR KM
// ========================================

function formatarQuilometragem(valor) {

    if (
        valor === null ||
        valor === undefined ||
        valor === ""
    ) {

        return "Km não informado";

    }

    return Number(valor)
        .toLocaleString(
            "pt-BR"
        ) + " km";

}


// ========================================
// ATUALIZAR CONTADOR
// ========================================

function atualizarContador(
    quantidade
) {

    if (!vehicleCount) {
        return;
    }

    if (quantidade === 1) {

        vehicleCount.textContent =
            "1 veículo encontrado";

        return;

    }

    vehicleCount.textContent =
        `${quantidade} veículos encontrados`;

}


// ========================================
// NORMALIZAR TIPO
// ========================================

function normalizarTipo(
    veiculo
) {

    const tipo =
        String(
            veiculo.tipo ||
            veiculo.categoria ||
            "Carro"
        )
            .trim()
            .toLowerCase();

    if (
        tipo.includes("moto")
    ) {

        return "motocicleta";

    }

    return "carro";

}


// ========================================
// NORMALIZAR STATUS
// ========================================

function normalizarStatus(
    veiculo
) {

    return String(
        veiculo.status || ""
    )
        .trim()
        .toLowerCase();

}


// ========================================
// PREENCHER MARCAS
// ========================================

function preencherMarcas() {

    if (!filterMarca) {
        return;
    }

    const marcas =
        todosVeiculos
            .map(
                veiculo =>
                    veiculo.marca
            )
            .filter(
                marca =>
                    marca !== null &&
                    marca !== undefined &&
                    String(marca).trim() !== ""
            );

    const marcasUnicas =
        [
            ...new Set(
                marcas.map(
                    marca =>
                        String(marca).trim()
                )
            )
        ]
            .sort(
                (a, b) =>
                    a.localeCompare(
                        b,
                        "pt-BR"
                    )
            );

    filterMarca.innerHTML = `
        <option value="">
            Todas as marcas
        </option>
    `;

    marcasUnicas.forEach(
        marca => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                marca;

            option.textContent =
                marca;

            filterMarca.appendChild(
                option
            );

        }
    );

}


// ========================================
// PREENCHER CÂMBIOS
// ========================================

function preencherCambios() {

    if (!filterCambio) {
        return;
    }

    const cambios =
        todosVeiculos
            .map(
                veiculo =>
                    veiculo.cambio
            )
            .filter(
                cambio =>
                    cambio !== null &&
                    cambio !== undefined &&
                    String(cambio).trim() !== ""
            );

    const cambiosUnicos =
        [
            ...new Set(
                cambios.map(
                    cambio =>
                        String(cambio).trim()
                )
            )
        ]
            .sort(
                (a, b) =>
                    a.localeCompare(
                        b,
                        "pt-BR"
                    )
            );

    filterCambio.innerHTML = `
        <option value="">
            Todos
        </option>
    `;

    cambiosUnicos.forEach(
        cambio => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                cambio;

            option.textContent =
                cambio;

            filterCambio.appendChild(
                option
            );

        }
    );

}


// ========================================
// PREENCHER ANOS
// ========================================

function preencherAnos() {

    if (!filterAno) {
        return;
    }

    const anos =
        todosVeiculos
            .map(
                veiculo =>
                    Number(
                        veiculo.ano
                    )
            )
            .filter(
                ano =>
                    Number.isFinite(ano)
            );

    const anosUnicos =
        [
            ...new Set(anos)
        ]
            .sort(
                (a, b) =>
                    b - a
            );

    filterAno.innerHTML = `
        <option value="">
            Qualquer ano
        </option>
    `;

    anosUnicos.forEach(
        ano => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                String(ano);

            option.textContent =
                String(ano);

            filterAno.appendChild(
                option
            );

        }
    );

}


// ========================================
// OBTER FILTRADOS
// ========================================

function obterVeiculosFiltrados() {

    let resultado =
        [
            ...todosVeiculos
        ];


    // ====================================
    // BUSCA
    // ====================================

    const busca =
        searchVehicle
            ? searchVehicle.value
                .trim()
                .toLowerCase()
            : "";

    if (busca) {

        resultado =
            resultado.filter(
                veiculo => {

                    const marca =
                        String(
                            veiculo.marca || ""
                        )
                            .toLowerCase();

                    const modelo =
                        String(
                            veiculo.modelo || ""
                        )
                            .toLowerCase();

                    const versao =
                        String(
                            veiculo.versao || ""
                        )
                            .toLowerCase();

                    const texto =
                        `${marca} ${modelo} ${versao}`;

                    return texto.includes(
                        busca
                    );

                }
            );

    }


    // ====================================
    // TIPO
    // ====================================

    if (
        filterTipo &&
        filterTipo.value
    ) {

        const tipoSelecionado =
            filterTipo.value;

        resultado =
            resultado.filter(
                veiculo =>
                    normalizarTipo(
                        veiculo
                    ) ===
                    tipoSelecionado
            );

    }


    // ====================================
    // MARCA
    // ====================================

    if (
        filterMarca &&
        filterMarca.value
    ) {

        const marcaSelecionada =
            filterMarca.value
                .trim()
                .toLowerCase();

        resultado =
            resultado.filter(
                veiculo =>
                    String(
                        veiculo.marca || ""
                    )
                        .trim()
                        .toLowerCase() ===
                    marcaSelecionada
            );

    }


    // ====================================
    // CÂMBIO
    // ====================================

    if (
        filterCambio &&
        filterCambio.value
    ) {

        const cambioSelecionado =
            filterCambio.value
                .trim()
                .toLowerCase();

        resultado =
            resultado.filter(
                veiculo =>
                    String(
                        veiculo.cambio || ""
                    )
                        .trim()
                        .toLowerCase() ===
                    cambioSelecionado
            );

    }


    // ====================================
    // PREÇO
    // ====================================

    if (
        filterPreco &&
        filterPreco.value
    ) {

        const precoMaximo =
            Number(
                filterPreco.value
            );

        if (
            Number.isFinite(
                precoMaximo
            )
        ) {

            resultado =
                resultado.filter(
                    veiculo => {

                        const preco =
                            Number(
                                veiculo.preco
                            );

                        if (
                            !Number.isFinite(
                                preco
                            )
                        ) {

                            return false;

                        }

                        return preco <=
                            precoMaximo;

                    }
                );

        }

    }


    // ====================================
    // ANO
    // ====================================

    if (
        filterAno &&
        filterAno.value
    ) {

        const anoMinimo =
            Number(
                filterAno.value
            );

        if (
            Number.isFinite(
                anoMinimo
            )
        ) {

            resultado =
                resultado.filter(
                    veiculo => {

                        const ano =
                            Number(
                                veiculo.ano
                            );

                        if (
                            !Number.isFinite(
                                ano
                            )
                        ) {

                            return false;

                        }

                        return ano >=
                            anoMinimo;

                    }
                );

        }

    }


    // ====================================
    // ORDENAÇÃO
    // ====================================

    const ordenacao =
        sortVehicles
            ? sortVehicles.value
            : "destaque";


    // ====================================
    // DESTAQUES
    // ====================================

    if (
        ordenacao ===
        "destaque"
    ) {

        resultado.sort(
            (a, b) => {

                const destaqueA =
                    a.destaque ? 1 : 0;

                const destaqueB =
                    b.destaque ? 1 : 0;

                if (
                    destaqueA !==
                    destaqueB
                ) {

                    return destaqueB -
                        destaqueA;

                }

                return Number(b.id) -
                    Number(a.id);

            }
        );

    }


    // ====================================
    // MAIS RECENTES
    // ====================================

    if (
        ordenacao ===
        "recentes"
    ) {

        resultado.sort(
            (a, b) =>
                Number(b.id) -
                Number(a.id)
        );

    }


    // ====================================
    // MENOR PREÇO
    // ====================================

    if (
        ordenacao ===
        "menor-preco"
    ) {

        resultado.sort(
            (a, b) => {

                const precoA =
                    Number(
                        a.preco
                    );

                const precoB =
                    Number(
                        b.preco
                    );

                const valorA =
                    Number.isFinite(
                        precoA
                    )
                        ? precoA
                        : Infinity;

                const valorB =
                    Number.isFinite(
                        precoB
                    )
                        ? precoB
                        : Infinity;

                return valorA -
                    valorB;

            }
        );

    }


    // ====================================
    // MAIOR PREÇO
    // ====================================

    if (
        ordenacao ===
        "maior-preco"
    ) {

        resultado.sort(
            (a, b) => {

                const precoA =
                    Number(
                        a.preco
                    );

                const precoB =
                    Number(
                        b.preco
                    );

                const valorA =
                    Number.isFinite(
                        precoA
                    )
                        ? precoA
                        : -Infinity;

                const valorB =
                    Number.isFinite(
                        precoB
                    )
                        ? precoB
                        : -Infinity;

                return valorB -
                    valorA;

            }
        );

    }


    // ====================================
    // MENOR QUILOMETRAGEM
    // ====================================

    if (
        ordenacao ===
        "menor-km"
    ) {

        resultado.sort(
            (a, b) => {

                const kmA =
                    Number(
                        a.quilometragem
                    );

                const kmB =
                    Number(
                        b.quilometragem
                    );

                const valorA =
                    Number.isFinite(
                        kmA
                    )
                        ? kmA
                        : Infinity;

                const valorB =
                    Number.isFinite(
                        kmB
                    )
                        ? kmB
                        : Infinity;

                return valorA -
                    valorB;

            }
        );

    }


    return resultado;

}


// ========================================
// RENDERIZAR VEÍCULOS
// ========================================

function renderizarVeiculos(
    veiculos,
    fotos
) {

    if (!vehicleGrid) {
        return;
    }

    vehicleGrid.innerHTML =
        "";

    atualizarContador(
        veiculos.length
    );


    if (
        !veiculos ||
        veiculos.length === 0
    ) {

        vehicleGrid.innerHTML = `
            <div class="vehicle-empty">

                <strong>
                    Nenhum veículo encontrado.
                </strong>

                <span>
                    Tente alterar os filtros da busca.
                </span>

            </div>
        `;

        return;

    }


    veiculos.forEach(
        veiculo => {

            // ==================================
            // FOTOS
            // ==================================

            const fotosVeiculo =
                (fotos || [])
                    .filter(
                        foto =>
                            String(
                                foto.veiculo_id
                            ) ===
                            String(
                                veiculo.id
                            )
                    )
                    .sort(
                        (a, b) =>
                            Number(
                                a.ordem || 0
                            ) -
                            Number(
                                b.ordem || 0
                            )
                    );


            // ==================================
            // STATUS
            // ==================================

            const status =
                normalizarStatus(
                    veiculo
                );

            const disponivel =
                status === "disponível" ||
                status === "disponivel";


            const reservado =
                status === "reservado";


            const vendido =
                status === "vendido";


            // ==================================
            // CARD
            // ==================================

            const card =
                document.createElement(
                    "article"
                );

            card.className =
                "vehicle-card";

            card.setAttribute(
                "tabindex",
                "0"
            );


            if (!disponivel) {

                card.classList.add(
                    "vehicle-unavailable"
                );

            }


            // ==================================
            // IMAGEM
            // ==================================

            const vehicleImage =
                document.createElement(
                    "div"
                );

            vehicleImage.className =
                "vehicle-image";


            let imagem =
                null;


            if (
                fotosVeiculo.length > 0 &&
                fotosVeiculo[0].url
            ) {

                imagem =
                    document.createElement(
                        "img"
                    );

                imagem.alt =
                    `${veiculo.marca || ""} ${veiculo.modelo || ""}`;

                imagem.loading =
                    "lazy";

                imagem.src =
                    String(
                        fotosVeiculo[0].url
                    ).trim();


                imagem.onerror =
                    function () {

                        this.remove();

                        vehicleImage.classList.add(
                            "no-image"
                        );

                        vehicleImage.innerHTML = `
                            <span>
                                Foto indisponível
                            </span>
                        `;

                    };


                vehicleImage.appendChild(
                    imagem
                );

            } else {

                vehicleImage.classList.add(
                    "no-image"
                );

                vehicleImage.innerHTML = `
                    <span>
                        Foto em breve
                    </span>
                `;

            }


            // ==================================
            // TARJA DE STATUS
            // ==================================

            if (vendido) {

                const statusBadge =
                    document.createElement(
                        "span"
                    );

                statusBadge.className =
                    "vehicle-badge vehicle-badge-sold";

                statusBadge.textContent =
                    "VENDIDO";

                vehicleImage.appendChild(
                    statusBadge
                );

            } else if (reservado) {

                const statusBadge =
                    document.createElement(
                        "span"
                    );

                statusBadge.className =
                    "vehicle-badge vehicle-badge-reserved";

                statusBadge.textContent =
                    "RESERVADO";

                vehicleImage.appendChild(
                    statusBadge
                );

            } else if (
                veiculo.destaque
            ) {

                const destaque =
                    document.createElement(
                        "span"
                    );

                destaque.className =
                    "vehicle-badge";

                destaque.textContent =
                    "DESTAQUE";

                vehicleImage.appendChild(
                    destaque
                );

            }


            // ==================================
            // INFORMAÇÕES
            // ==================================

            const vehicleInfo =
                document.createElement(
                    "div"
                );

            vehicleInfo.className =
                "vehicle-info";


            // ==================================
            // CATEGORIA
            // ==================================

            const categoria =
                document.createElement(
                    "span"
                );

            categoria.className =
                "vehicle-category";

            categoria.textContent =
                veiculo.condicao ||
                "SEMINOVO";

            vehicleInfo.appendChild(
                categoria
            );


            // ==================================
            // TÍTULO
            // ==================================

            const titulo =
                document.createElement(
                    "h3"
                );

            titulo.textContent =
                `${veiculo.marca || ""} ${veiculo.modelo || ""}`.trim();

            vehicleInfo.appendChild(
                titulo
            );


            // ==================================
            // VERSÃO
            // ==================================

            if (
                veiculo.versao
            ) {

                const versao =
                    document.createElement(
                        "span"
                    );

                versao.className =
                    "vehicle-version";

                versao.textContent =
                    veiculo.versao;

                vehicleInfo.appendChild(
                    versao
                );

            }


            // ==================================
            // DETALHES
            // ==================================

            const detalhes =
                document.createElement(
                    "div"
                );

            detalhes.className =
                "vehicle-details";


            const ano =
                document.createElement(
                    "span"
                );

            ano.textContent =
                veiculo.ano ||
                "—";


            const km =
                document.createElement(
                    "span"
                );

            km.textContent =
                formatarQuilometragem(
                    veiculo.quilometragem
                );


            const cambio =
                document.createElement(
                    "span"
                );

            cambio.textContent =
                veiculo.cambio ||
                "-";


            detalhes.appendChild(
                ano
            );

            detalhes.appendChild(
                km
            );

            detalhes.appendChild(
                cambio
            );


            // ==================================
            // FOOTER
            // ==================================

            const footer =
                document.createElement(
                    "div"
                );

            footer.className =
                "vehicle-footer";


            const precoContainer =
                document.createElement(
                    "div"
                );


            const pequeno =
                document.createElement(
                    "small"
                );

            pequeno.textContent =
                "Valor";


            const preco =
                document.createElement(
                    "strong"
                );

            preco.textContent =
                formatarPreco(
                    veiculo.preco
                );


            precoContainer.appendChild(
                pequeno
            );

            precoContainer.appendChild(
                preco
            );


            // ==================================
            // LINK DO VEÍCULO
            // ==================================

            const link =
                document.createElement(
                    "a"
                );

            link.href =
                `veiculo.html?id=${veiculo.id}`;

            link.className =
                "vehicle-link";

            link.setAttribute(
                "aria-label",
                `Ver ${veiculo.marca || ""} ${veiculo.modelo || ""}`
            );

            link.textContent =
                "→";


            footer.appendChild(
                precoContainer
            );

            footer.appendChild(
                link
            );


            vehicleInfo.appendChild(
                detalhes
            );

            vehicleInfo.appendChild(
                footer
            );


            // ==================================
            // MONTAR CARD
            // ==================================

            card.appendChild(
                vehicleImage
            );

            card.appendChild(
                vehicleInfo
            );


            // ==================================
            // CARD CLICÁVEL
            // ==================================

            card.addEventListener(
                "click",
                event => {

                    if (
                        event.target.closest(
                            "a"
                        ) ||
                        event.target.closest(
                            "button"
                        )
                    ) {

                        return;

                    }

                    window.location.href =
                        `veiculo.html?id=${veiculo.id}`;

                }
            );


            // ==================================
            // ENTER
            // ==================================

            card.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key ===
                        "Enter"
                    ) {

                        window.location.href =
                            `veiculo.html?id=${veiculo.id}`;

                    }

                }
            );


            vehicleGrid.appendChild(
                card
            );

        }
    );

}


// ========================================
// APLICAR FILTROS
// ========================================

function aplicarFiltros(
    fotos
) {

    const filtrados =
        obterVeiculosFiltrados();

    renderizarVeiculos(
        filtrados,
        fotos
    );

}


// ========================================
// CONFIGURAR FILTROS
// ========================================

function configurarFiltros(
    fotos
) {

    if (searchVehicle) {

        searchVehicle.addEventListener(
            "input",
            () => {

                aplicarFiltros(
                    fotos
                );

            }
        );

    }


    if (filterTipo) {

        filterTipo.addEventListener(
            "change",
            () => {

                aplicarFiltros(
                    fotos
                );

            }
        );

    }


    if (filterMarca) {

        filterMarca.addEventListener(
            "change",
            () => {

                aplicarFiltros(
                    fotos
                );

            }
        );

    }


    if (filterCambio) {

        filterCambio.addEventListener(
            "change",
            () => {

                aplicarFiltros(
                    fotos
                );

            }
        );

    }


    if (filterPreco) {

        filterPreco.addEventListener(
            "change",
            () => {

                aplicarFiltros(
                    fotos
                );

            }
        );

    }


    if (filterAno) {

        filterAno.addEventListener(
            "change",
            () => {

                aplicarFiltros(
                    fotos
                );

            }
        );

    }


    if (sortVehicles) {

        sortVehicles.addEventListener(
            "change",
            () => {

                aplicarFiltros(
                    fotos
                );

            }
        );

    }


    if (clearFilters) {

        clearFilters.addEventListener(
            "click",
            () => {

                if (searchVehicle) {
                    searchVehicle.value = "";
                }

                if (filterTipo) {
                    filterTipo.value = "";
                }

                if (filterMarca) {
                    filterMarca.value = "";
                }

                if (filterCambio) {
                    filterCambio.value = "";
                }

                if (filterPreco) {
                    filterPreco.value = "";
                }

                if (filterAno) {
                    filterAno.value = "";
                }

                if (sortVehicles) {
                    sortVehicles.value =
                        "destaque";
                }

                aplicarFiltros(
                    fotos
                );

            }
        );

    }

}


// ========================================
// CARREGAR VEÍCULOS
// ========================================

async function carregarVeiculos() {

    console.log(
        "Buscando veículos do estoque público..."
    );


    if (!vehicleGrid) {

        console.error(
            "Elemento #vehicleGrid não encontrado."
        );

        return;

    }


    try {

        // ==================================
        // VEÍCULOS
        // ==================================
        //
        // IMPORTANTE:
        //
        // Agora NÃO filtramos apenas
        // "Disponível".
        //
        // Carregamos:
        //
        // Disponível
        // Reservado
        // Vendido
        //
        // Assim o público consegue ver
        // o histórico do estoque.
        //
        // ==================================

        const {
            data: veiculos,
            error: erroVeiculos
        } =
            await supabase
                .from("veiculos")
                .select("*")
                .in(
                    "status",
                    [
                        "Disponível",
                        "Reservado",
                        "Vendido"
                    ]
                );


        if (erroVeiculos) {

            throw erroVeiculos;

        }


        todosVeiculos =
            veiculos || [];


        console.log(
            "Veículos encontrados:",
            todosVeiculos
        );


        // ==================================
        // FOTOS
        // ==================================

        const {
            data: fotos,
            error: erroFotos
        } =
            await supabase
                .from("fotos_veiculos")
                .select("*")
                .order(
                    "ordem",
                    {
                        ascending: true
                    }
                );


        if (erroFotos) {

            throw erroFotos;

        }


        console.log(
            "Fotos encontradas:",
            fotos
        );


        // ==================================
        // FILTROS
        // ==================================

        preencherMarcas();

        preencherCambios();

        preencherAnos();


        configurarFiltros(
            fotos || []
        );


        // ==================================
        // RENDERIZAR
        // ==================================

        aplicarFiltros(
            fotos || []
        );


        console.log(
            "Estoque público carregado com sucesso!"
        );


    } catch (erro) {

        console.error(
            "Erro ao carregar estoque:",
            erro
        );


        vehicleGrid.innerHTML = `
            <p class="vehicle-error">
                Não foi possível carregar o estoque.
                Tente novamente mais tarde.
            </p>
        `;


        atualizarContador(
            0
        );

    }

}


// ========================================
// INICIALIZAÇÃO
// ========================================

configurarMenu();

configurarWhatsApp();

carregarVeiculos();