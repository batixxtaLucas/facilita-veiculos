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

const WHATSAPP_NUMERO = "5555999999999";

const WHATSAPP_MENSAGEM =
    "Olá! Gostaria de saber mais sobre os veículos da Facilita.";


// ========================================
// CONFIGURAR LINKS DO WHATSAPP
// ========================================

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

const filterMarca =
    document.getElementById(
        "filterMarca"
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


// ========================================
// MENU MOBILE
// ========================================

if (menuButton) {

    menuButton.addEventListener(
        "click",
        () => {

            alert(
                "Menu mobile em desenvolvimento."
            );

        }
    );

}


// ========================================
// FORMATAR PREÇO
// ========================================

function formatarPreco(
    valor
) {

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
// FORMATAR QUILOMETRAGEM
// ========================================

function formatarQuilometragem(
    valor
) {

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
// PREENCHER FILTRO DE MARCAS
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
        [...new Set(
            marcas.map(
                marca =>
                    String(marca).trim()
            )
        )]
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
// PREENCHER FILTRO DE ANO
// ========================================

function preencherAnos() {

    if (!filterAno) {
        return;
    }


    const anos =
        todosVeiculos
            .map(
                veiculo =>
                    Number(veiculo.ano)
            )
            .filter(
                ano =>
                    Number.isFinite(ano)
            );


    const anosUnicos =
        [...new Set(anos)]
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
// OBTER VEÍCULOS FILTRADOS
// ========================================

function obterVeiculosFiltrados() {

    let resultado =
        [...todosVeiculos];


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
    // ANO MÍNIMO
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


    if (
        ordenacao ===
        "menor-preco"
    ) {

        resultado.sort(
            (a, b) =>
                Number(a.preco || 0) -
                Number(b.preco || 0)
        );

    }


    if (
        ordenacao ===
        "maior-preco"
    ) {

        resultado.sort(
            (a, b) =>
                Number(b.preco || 0) -
                Number(a.preco || 0)
        );

    }


    if (
        ordenacao ===
        "menor-km"
    ) {

        resultado.sort(
            (a, b) =>
                Number(
                    a.quilometragem || 999999999
                ) -
                Number(
                    b.quilometragem || 999999999
                )
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


    // ====================================
    // NENHUM RESULTADO
    // ====================================

    if (
        !veiculos ||
        veiculos.length === 0
    ) {

        vehicleGrid.innerHTML = `
            <div class="vehicle-empty">
                <strong>Nenhum veículo encontrado.</strong>
                <span>
                    Tente alterar os filtros da busca.
                </span>
            </div>
        `;

        return;

    }


    // ====================================
    // CRIAR CARDS
    // ====================================

    veiculos.forEach(
        veiculo => {

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


            const fotoCapa =
                fotosVeiculo[0];


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


            // ==================================
            // IMAGEM
            // ==================================

            const vehicleImage =
                document.createElement(
                    "div"
                );


            vehicleImage.className =
                "vehicle-image";


            if (
                fotoCapa &&
                fotoCapa.url
            ) {

                const imagem =
                    document.createElement(
                        "img"
                    );


                imagem.src =
                    String(
                        fotoCapa.url
                    ).trim();


                imagem.alt =
                    `${veiculo.marca || ""} ${veiculo.modelo || ""}`;


                imagem.loading =
                    "lazy";


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
            // DESTAQUE
            // ==================================

            if (
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

            // ==================================
            // TÍTULO
            // ==================================

            const titulo =
                document.createElement(
                    "h3"
                );


            titulo.textContent =
                `${veiculo.marca || ""} ${veiculo.modelo || ""}`.trim();


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
                veiculo.ano || "—";


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
                "A partir de";


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
            // LINK
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


            // ==================================
            // MONTAR INFORMAÇÕES
            // ==================================

            vehicleInfo.appendChild(
                categoria
            );


            vehicleInfo.appendChild(
                titulo
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
                        )
                    ) {

                        return;

                    }


                    window.location.href =
                        `veiculo.html?id=${veiculo.id}`;

                }
            );


            // ==================================
            // ENTER NO CARD
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


            // ==================================
            // ADICIONAR AO GRID
            // ==================================

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
// CONFIGURAR EVENTOS DOS FILTROS
// ========================================

function configurarFiltros(
    fotos
) {

    // ====================================
    // BUSCA
    // ====================================

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


    // ====================================
    // MARCA
    // ====================================

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


    // ====================================
    // PREÇO
    // ====================================

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


    // ====================================
    // ANO
    // ====================================

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


    // ====================================
    // ORDENAÇÃO
    // ====================================

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


    // ====================================
    // LIMPAR FILTROS
    // ====================================

    if (clearFilters) {

        clearFilters.addEventListener(
            "click",
            () => {

                // Busca
                if (searchVehicle) {

                    searchVehicle.value =
                        "";

                }


                // Marca
                if (filterMarca) {

                    filterMarca.value =
                        "";

                }


                // Preço
                if (filterPreco) {

                    filterPreco.value =
                        "";

                }


                // Ano
                if (filterAno) {

                    filterAno.value =
                        "";

                }


                // Ordenação
                if (sortVehicles) {

                    sortVehicles.value =
                        "destaque";

                }


                // Renderizar novamente
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
        "Buscando veículos disponíveis..."
    );


    if (!vehicleGrid) {

        console.error(
            "Elemento #vehicleGrid não encontrado."
        );

        return;

    }



    try {

        // ==================================
        // BUSCAR VEÍCULOS
        // ==================================

        const {
            data: veiculos,
            error: erroVeiculos
        } =
            await supabase
                .from("veiculos")
                .select("*")
                .eq(
                    "status",
                    "Disponível"
                );


        if (erroVeiculos) {

            throw erroVeiculos;

        }


        todosVeiculos =
            veiculos || [];


        console.log(
            "Veículos disponíveis:",
            todosVeiculos
        );


        // ==================================
        // BUSCAR FOTOS
        // ==================================

        const {
            data: fotos,
            error: erroFotos
        } =
            await supabase
                .from(
                    "fotos_veiculos"
                )
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
        // PREENCHER FILTROS
        // ==================================

        preencherMarcas();

        preencherAnos();


        // ==================================
        // CONFIGURAR FILTROS
        // ==================================

        configurarFiltros(
            fotos || []
        );


        // ==================================
        // RENDERIZAR ESTOQUE
        // ==================================

        aplicarFiltros(
            fotos || []
        );


        console.log(
            "Estoque público carregado com sucesso!"
        );

    } catch (
    erro
    ) {

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
// INICIAR
// ========================================

carregarVeiculos();
configurarWhatsApp();