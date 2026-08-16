import {
    createClient
} from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";


// ========================================
// SUPABASE
// ========================================

const SUPABASE_URL =
    "https://izicfuxbzlcvfrkkrbjb.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_mXWuCOenMxAsmKge7-iUgw_vzp_idFj";


const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ========================================
// ELEMENTOS
// ========================================

const loginForm =
    document.getElementById("loginForm");

const loginMessage =
    document.getElementById("loginMessage");


// ========================================
// LOGIN
// ========================================

loginForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;


        loginMessage.textContent =
            "Entrando...";


        loginMessage.style.color =
            "#92979f";


        console.log("Tentando fazer login...");


        const {
            data,
            error
        } = await supabase.auth.signInWithPassword({

            email: email,

            password: password

        });


        if (error) {

            console.error(
                "Erro no login:",
                error
            );


            loginMessage.textContent =
                "E-mail ou senha incorretos.";

            loginMessage.style.color =
                "#ff4d4d";

            return;
        }


        console.log(
            "Login realizado:",
            data.user
        );


        loginMessage.textContent =
            "Login realizado! Entrando...";

        loginMessage.style.color =
            "#39ff14";


        setTimeout(() => {

            window.location.href =
                "admin.html";

        }, 500);

    }
);