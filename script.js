/* =====================================================
   ELEMENTOS
===================================================== */

const video = document.getElementById("introVideo");

const intro = document.querySelector(".intro");
const black = document.querySelector(".black");
const flash = document.querySelector(".sun-flash");
const vignette = document.querySelector(".vignette");

const cena = document.querySelector(".cena");
const logo = document.querySelector(".logo");

const pedestal = document.querySelector(".layer-pedestal");
const montanhaEsquerda = document.querySelector(".layer-montanha-esquerda");
const montanhaDireita = document.querySelector(".layer-montanha-direita");

const fogBack = document.querySelector(".fog-back");
const fogFront = document.querySelector(".fog-front");
const lightRay = document.querySelector(".light-ray");

const camera = document.querySelector(".camera");
const background = document.querySelector(".background");


/* =====================================================
   CONFIGURAÇÃO DE PERFORMANCE
===================================================== */

/*
   Detecta preferência do usuário por menos movimento.
   Também podemos usar isso para reduzir efeitos em
   dispositivos mais fracos sem destruir a experiência.
*/

const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;


/* =====================================================
   INTRO CINEMATOGRÁFICA
===================================================== */

function introAnimation() {

    const tl = gsap.timeline();

    tl.set(video, {
        opacity: 0
    })

    .set(black, {
        opacity: 1
    })

    .set(flash, {
        opacity: 0,
        scale: 0.7
    })

    .set(vignette, {
        opacity: 0
    })

    /* Luz inicial */

    .to(flash, {
        opacity: 1,
        scale: 1.25,
        duration: 1.1,
        ease: "power3.out"
    })

    /* Entrada do vídeo */

    .to(video, {
        opacity: 1,
        duration: 0.8
    }, "<0.15")

    /* Retira o preto */

    .to(black, {
        opacity: 0,
        duration: 0.9
    }, "<")

    /* Vinheta */

    .to(vignette, {
        opacity: 1,
        duration: 0.5
    }, "<")

    /* Luz desaparecendo */

    .to(flash, {
        opacity: 0,
        scale: 1.6,
        duration: 1.2
    })

    .to(vignette, {
        opacity: 0,
        duration: 0.8
    }, "<")

    /* Remove o overlay */

    .to(intro, {
        opacity: 0,
        duration: 0.5,

        onComplete() {
            intro.remove();
        }
    });
}


/* =====================================================
   LOGO FLUTUANDO
===================================================== */

function logoFloat() {

    gsap.to(logo, {

        y: -18,
        rotation: 1,

        duration: 3.8,
        ease: "sine.inOut",

        repeat: -1,
        yoyo: true

    });
}


/* =====================================================
   VIDA DO DIORAMA
===================================================== */

/*
   Aqui juntamos os movimentos que antes estavam
   espalhados em animateDiorama() + depthMotion().

   Isso reduz a quantidade de tweens independentes
   trabalhando ao mesmo tempo.
*/

function animateDiorama() {

    /* -----------------------------------------
       PEDESTAL
    ----------------------------------------- */

    gsap.to(pedestal, {

        y: -12,

        duration: 6,
        ease: "sine.inOut",

        repeat: -1,
        yoyo: true

    });


    /* -----------------------------------------
       MONTANHA ESQUERDA
    ----------------------------------------- */

    gsap.to(montanhaEsquerda, {

        x: 15,
        scale: 1.015,

        duration: 10,
        ease: "sine.inOut",

        repeat: -1,
        yoyo: true

    });


    /* -----------------------------------------
       MONTANHA DIREITA
    ----------------------------------------- */

    gsap.to(montanhaDireita, {

        x: -15,
        scale: 1.01,

        duration: 12,
        ease: "sine.inOut",

        repeat: -1,
        yoyo: true

    });


    /* -----------------------------------------
       FUNDO
    ----------------------------------------- */

    gsap.to(background, {

        scale: 1.02,

        duration: 20,
        ease: "sine.inOut",

        repeat: -1,
        yoyo: true

    });
}


/* =====================================================
   ATMOSFERA
===================================================== */

function atmosphere() {

    /*
       A atmosfera só começa depois que a cena
       realmente apareceu.
    */

    gsap.to(fogBack, {

        opacity: 1,

        duration: 4,
        ease: "power2.out"

    });


    gsap.to(fogFront, {

        opacity: 0.7,

        duration: 5,
        ease: "power2.out"

    });


    gsap.to(lightRay, {

        opacity: 1,

        duration: 3,
        ease: "power2.out"

    });
}


/* =====================================================
   CÂMERA CINEMATOGRÁFICA
===================================================== */

function cameraMotion() {

    /*
       Movimento extremamente lento.
       Continua dando sensação de câmera,
       mas evita movimentações agressivas.
    */

    gsap.to(camera, {

        scale: 1.04,
        y: -12,

        duration: 20,

        ease: "sine.inOut",

        repeat: -1,
        yoyo: true

    });
}


/* =====================================================
   ENTRADA DA CENA
===================================================== */

function showScene() {

    cena.classList.remove("hidden");


    /*
       Entrada da cena
    */

    gsap.fromTo(

        cena,

        {
            opacity: 0,
            y: 40,
            scale: 0.96
        },

        {
            opacity: 1,
            y: 0,
            scale: 1,

            duration: 1.3,
            ease: "power3.out",

            onComplete() {

                /*
                   Só iniciamos os movimentos contínuos
                   quando a entrada terminou.
                */

                logoFloat();

                atmosphere();

                animateDiorama();

                cameraMotion();

            }

        }

    );
}


/* =====================================================
   FINAL DO VÍDEO
===================================================== */

function endVideo() {

    video.addEventListener("ended", () => {

        gsap.to(video, {

            opacity: 0,

            duration: 0.6,
            ease: "power2.out",

            onComplete() {

                /*
                   Libera o vídeo da página.
                   Isso é importante porque o vídeo é
                   um dos elementos mais pesados.
                */

                video.remove();

                showScene();

            }

        });

    }, { once: true });
}


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

window.addEventListener("load", () => {

    /*
       Garante que o vídeo comece do início.
    */

    video.currentTime = 0;


    /*
       Tenta iniciar o vídeo.
       Como ele está muted + autoplay, normalmente
       o navegador permite.
    */

    const playPromise = video.play();

    if (playPromise !== undefined) {

        playPromise.catch(() => {

            /*
               Se o navegador bloquear o autoplay,
               simplesmente deixamos o vídeo seguir
               conforme a interação/navegador.
            */

            console.log("Autoplay bloqueado pelo navegador.");

        });

    }


    /*
       Inicia a sequência cinematográfica.
    */

    introAnimation();

    endVideo();

});