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
// ELEMENTOS
// ========================================

const vehicleLoading =
    document.getElementById(
        "vehicleLoading"
    );

const vehicleError =
    document.getElementById(
        "vehicleError"
    );

const vehicleContent =
    document.getElementById(
        "vehicleContent"
    );

const mainImage =
    document.getElementById(
        "mainImage"
    );

const thumbnails =
    document.getElementById(
        "thumbnails"
    );


// ========================================
// FORMATAÇÃO
// ========================================

function formatarPreco(valor) {

    if (
        valor === null ||
        valor === undefined ||
        valor === ""
    ) {

        return "Consultar";

    }

    return Number(valor).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


function formatarKm(valor) {

    if (
        valor === null ||
        valor === undefined ||
        valor === ""
    ) {

        return "Não informado";

    }

    return Number(valor).toLocaleString(
        "pt-BR"
    ) + " km";

}


// ========================================
// PEGAR ID DO VEÍCULO
// ========================================

function pegarIdVeiculo() {

    const parametros =
        new URLSearchParams(
            window.location.search
        );

    return parametros.get("id");

}


// ========================================
// MOSTRAR ERRO
// ========================================

function mostrarErro() {

    if (vehicleLoading) {

        vehicleLoading.style.display =
            "none";

    }


    if (vehicleContent) {

        vehicleContent.style.display =
            "none";

    }


    if (vehicleError) {

        vehicleError.style.display =
            "flex";

    }

}


// ========================================
// MOSTRAR CONTEÚDO
// ========================================

function mostrarConteudo() {

    if (vehicleLoading) {

        vehicleLoading.style.display =
            "none";

    }


    if (vehicleError) {

        vehicleError.style.display =
            "none";

    }


    if (vehicleContent) {

        vehicleContent.style.display =
            "grid";

    }

}


// ========================================
// MOSTRAR IMAGEM
// ========================================

function mostrarImagem(
    url,
    indice
) {

    if (!mainImage) {

        return;

    }


    mainImage.innerHTML =
        "";


    const imagem =
        document.createElement(
            "img"
        );


    imagem.src =
        url;


    imagem.alt =
        "Foto do veículo";


    imagem.onerror =
        function () {

            mainImage.innerHTML = `
                <div class="image-error">
                    Não foi possível carregar esta imagem.
                </div>
            `;

        };


    mainImage.appendChild(
        imagem
    );


    const lista =
        document.querySelectorAll(
            ".vehicle-thumbnail"
        );


    lista.forEach(
        function (
            thumbnail,
            index
        ) {

            if (
                index === indice
            ) {

                thumbnail.classList.add(
                    "active"
                );

            } else {

                thumbnail.classList.remove(
                    "active"
                );

            }

        }
    );

}


// ========================================
// NORMALIZAR TEXTO
// ========================================

function normalizarCondicao(
    valor
) {

    if (!valor) {

        return "Seminovo";

    }


    const texto =
        String(valor)
            .trim();


    if (
        texto.toLowerCase() ===
        "novo"
    ) {

        return "Novo";

    }


    if (
        texto.toLowerCase() ===
        "seminovo"
    ) {

        return "Seminovo";

    }


    if (
        texto.toLowerCase() ===
        "usado"
    ) {

        return "Usado";

    }


    return texto;

}


// ========================================
// CARREGAR VEÍCULO
// ========================================

async function carregarVeiculo() {

    const id =
        pegarIdVeiculo();


    console.log(
        "ID do veículo:",
        id
    );


    if (!id) {

        console.error(
            "Nenhum ID de veículo foi encontrado."
        );

        mostrarErro();

        return;

    }


    try {

        // ====================================
        // BUSCAR VEÍCULO
        // ====================================

        const {
            data: veiculo,
            error: erroVeiculo
        } =
            await supabase
                .from("veiculos")
                .select("*")
                .eq(
                    "id",
                    id
                )
                .single();


        if (erroVeiculo) {

            console.error(
                "Erro ao buscar veículo:",
                erroVeiculo
            );

            mostrarErro();

            return;

        }


        if (!veiculo) {

            console.error(
                "Veículo não encontrado."
            );

            mostrarErro();

            return;

        }


        console.log(
            "Veículo encontrado:",
            veiculo
        );


        // ====================================
        // BUSCAR FOTOS
        // ====================================

        const {
            data: fotos,
            error: erroFotos
        } =
            await supabase
                .from(
                    "fotos_veiculos"
                )
                .select("*")
                .eq(
                    "veiculo_id",
                    id
                )
                .order(
                    "ordem",
                    {
                        ascending: true
                    }
                );


        if (erroFotos) {

            console.error(
                "Erro ao buscar fotos:",
                erroFotos
            );

        }


        const listaFotos =
            fotos || [];


        // ====================================
        // CONDIÇÃO DO VEÍCULO
        // ====================================

        const categoria =
            document.getElementById(
                "vehicleCondition"
            );


        if (categoria) {

            categoria.textContent =
                normalizarCondicao(
                    veiculo.condicao
                );

        }


        // ====================================
        // STATUS DO VEÍCULO
        // ====================================

        const status =
            document.getElementById(
                "vehicleStatus"
            );


        if (status) {

            status.textContent =
                veiculo.status ||
                "Disponível";

        }


        // ====================================
        // TÍTULO
        // ====================================

        const titulo =
            document.getElementById(
                "vehicleTitle"
            );


        if (titulo) {

            titulo.textContent =
                `${veiculo.marca || ""} ${veiculo.modelo || ""}`.trim();

        }


        // ====================================
        // VERSÃO
        // ====================================

        const versao =
            document.getElementById(
                "vehicleVersion"
            );


        if (versao) {

            versao.textContent =
                veiculo.versao ||
                "";

            if (!veiculo.versao) {

                versao.style.display =
                    "none";

            } else {

                versao.style.display =
                    "block";

            }

        }


        // ====================================
        // PREÇO
        // ====================================

        const preco =
            document.getElementById(
                "vehiclePrice"
            );


        if (preco) {

            preco.textContent =
                formatarPreco(
                    veiculo.preco
                );

        }


        // ====================================
        // ANO
        // ====================================

        const ano =
            document.getElementById(
                "vehicleYear"
            );


        if (ano) {

            ano.textContent =
                veiculo.ano ||
                "—";

        }


        // ====================================
        // QUILOMETRAGEM
        // ====================================

        const km =
            document.getElementById(
                "vehicleKm"
            );


        if (km) {

            km.textContent =
                formatarKm(
                    veiculo.quilometragem
                );

        }


        // ====================================
        // CÂMBIO
        // ====================================

        const cambio =
            document.getElementById(
                "vehicleCambio"
            );


        if (cambio) {

            cambio.textContent =
                veiculo.cambio ||
                "—";

        }


        // ====================================
        // COMBUSTÍVEL
        // ====================================

        const combustivel =
            document.getElementById(
                "vehicleCombustivel"
            );


        if (combustivel) {

            combustivel.textContent =
                veiculo.combustivel ||
                "—";

        }


        // ====================================
        // COR
        // ====================================

        const cor =
            document.getElementById(
                "vehicleCor"
            );


        if (cor) {

            cor.textContent =
                veiculo.cor ||
                "—";

        }


        // ====================================
        // DESCRIÇÃO
        // ====================================

        const descriptionContainer =
            document.getElementById(
                "descriptionContainer"
            );


        const vehicleDescription =
            document.getElementById(
                "vehicleDescription"
            );


        if (
            veiculo.descricao &&
            descriptionContainer &&
            vehicleDescription
        ) {

            vehicleDescription.textContent =
                veiculo.descricao;


            descriptionContainer.style.display =
                "block";

        } else if (
            descriptionContainer
        ) {

            descriptionContainer.style.display =
                "none";

        }


        // ====================================
        // WHATSAPP
        // ====================================

        const vehicleWhatsapp =
            document.getElementById(
                "vehicleWhatsapp"
            );


        if (vehicleWhatsapp) {

            let mensagem =
                "Olá! Tenho interesse no ";


            mensagem +=
                veiculo.marca ||
                "";


            mensagem +=
                " ";


            mensagem +=
                veiculo.modelo ||
                "";


            if (veiculo.versao) {

                mensagem +=
                    " " +
                    veiculo.versao;

            }


            if (veiculo.preco) {

                mensagem +=
                    ", anunciado por " +
                    formatarPreco(
                        veiculo.preco
                    );

            }


            mensagem +=
                ".";


            /*
             * COLOQUE AQUI O NÚMERO REAL
             * DO WHATSAPP DA LOJA.
             */

            const numeroWhatsapp =
                "5555999999999";


            vehicleWhatsapp.href =
                "https://wa.me/" +
                numeroWhatsapp +
                "?text=" +
                encodeURIComponent(
                    mensagem
                );

        }


        // ====================================
        // GALERIA
        // ====================================

        if (thumbnails) {

            thumbnails.innerHTML =
                "";

        }


        if (
            listaFotos.length > 0
        ) {

            listaFotos.forEach(
                function (
                    foto,
                    index
                ) {

                    const thumbnail =
                        document.createElement(
                            "button"
                        );


                    thumbnail.type =
                        "button";


                    thumbnail.className =
                        "vehicle-thumbnail";


                    if (
                        index === 0
                    ) {

                        thumbnail.classList.add(
                            "active"
                        );

                    }


                    const imagem =
                        document.createElement(
                            "img"
                        );


                    imagem.src =
                        foto.url;


                    imagem.alt =
                        `${veiculo.marca || "Veículo"} ${veiculo.modelo || ""} - Foto ${index + 1}`;


                    imagem.loading =
                        "lazy";


                    thumbnail.appendChild(
                        imagem
                    );


                    thumbnail.addEventListener(
                        "click",
                        function () {

                            mostrarImagem(
                                foto.url,
                                index
                            );

                        }
                    );


                    if (thumbnails) {

                        thumbnails.appendChild(
                            thumbnail
                        );

                    }

                }
            );


            mostrarImagem(
                listaFotos[0].url,
                0
            );

        } else {

            if (mainImage) {

                mainImage.innerHTML = `
                    <div class="image-error">
                        Foto em breve
                    </div>
                `;

            }

        }


        // ====================================
        // TÍTULO DA ABA
        // ====================================

        document.title =
            `${veiculo.marca || ""} ${veiculo.modelo || ""} | Facilita Veículos`;


        // ====================================
        // MOSTRAR PÁGINA
        // ====================================

        mostrarConteudo();


        console.log(
            "Veículo carregado com sucesso:",
            veiculo
        );

    } catch (erro) {

        console.error(
            "Erro inesperado ao carregar veículo:",
            erro
        );

        mostrarErro();

    }

}


// ========================================
// INICIAR
// ========================================

carregarVeiculo();