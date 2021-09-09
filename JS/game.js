
    /*********** DECLARAÇÃO DE VARIÁVEIS ************/

    // DOM Control
    var tela = document.querySelector("#tela");
    var pincel = tela.getContext("2d");
    var placar = document.querySelector("#placar");
    var box = document.querySelector("#box");
    var boxPlacar = document.querySelector("#boxPlacar");
    var jogar = document.querySelector("#iniciarJogo");
    var velocidadeInput = document.querySelector("#nivelVelocidade");
    var numBlackHolesInput = document.querySelector("#numObstaculos");
    var playerColorInput = document.querySelector("#corPersonagem");
    var foodColorInput = document.querySelector("#corComida");

    // Generate Player position
    var posicaoPlayerX = generateRandom(40);
    var posicaoPlayerY = generateRandom(20);

    // Set Food variable positions
    var posicaoComidinhaX;
    var posicaoComidinhaY;

    // Set Black Holes array of positions
    var obstaculosX = [];
    var obstaculosY = [];

    // Controls and data (default values)
    var velocidade = 120;
    var numBlackHoles = 1;
    var contadorPontos = 0;
    var jogando = false;
    var playerColor = "#666666";
    var foodColor = "#FF0000";

    var playerSize = 20;
    /*
    var screenWidth = 800;
    var screenHeight = 400;
    var numBlocksX = 40;
    var numBlocksY = 20;
    */

    // Movement controls
    var andaBaixo;
    var andaBaixoAtivado = false;
    var andaCima;
    var andaCimaAtivado = false;
    var andaDireita;
    var andaDireitaAtivado = false;
    var andaEsquerda;
    var andaEsquerdaAtivado = false;
    
    /************** INICIALIZANDO ***************/

    // Inicia o jogo quando clica o notão de começar
    function controlaJogo() {
        if (jogando == false) {
            jogando = true;
            document.querySelector("#modalGame").style.display = "block";
            document.querySelector("footer").style.display = "none";
            tela.style.display = "block";
            box.style.display = "block";
            boxPlacar.style.display = "none";
            velocidade = adjustSpeed(velocidadeInput.value);
            numBlackHoles = numBlackHolesInput.value;
            playerColor = playerColorInput.value;
            foodColor = foodColorInput.value;
            desenhaTela();
            geraPlayer();
            criaNovaComidinha();
        } else {
            jogando = false;
            document.querySelector("#modalGame").style.display = "none";
            document.querySelector("footer").style.display = "block";
            contadorPontos = 0;
            box.style.padding = "15px 40px";
            placar.innerText = "Avoid Black Holes";
            obstaculosX = [];
            obstaculosY = [];
            posicaoPlayerX = generateRandom(40);
            posicaoPlayerY = generateRandom(20);
            limpaCima();
            limpaDireita();
            limpaBaixo();
            limpaEsquerda();
        }
    }

    function adjustSpeed(speedInputVal) {
        return 250 - (speedInputVal * 2);
    }

    // Desenha a tela inicial quando começa (e em cada movimento)
    function desenhaTela() {
        for(let x = 0; x < 800; x += 20) {
            for(let y = 0; y < 400; y += 20) {
                pincel.fillStyle = "#efefef";
                pincel.fillRect(x, y, 20, 20);
                pincel.strokeStyle = "#e3e3e3";
                pincel.strokeRect(x, y, 20, 20);
            }
        }
    }

    // Gera um valor aleatorio usado nos eixos X e Y de otodos os elementos
    function generateRandom(maxValue) {
        var num = (Math.round(Math.random()*maxValue) * 20) - 20;
        if (num <= 20) {
            num += 20;
        }
        return num;
    }

    /************** PLAYER **************/

    // Desenha o player
    function geraPlayer() {
        pincel.fillStyle = playerColor;
        pincel.fillRect(posicaoPlayerX, posicaoPlayerY, 20, 20);
    }

    /************ COMIDA *************/

    // Cria nova comidinha
    function criaNovaComidinha() {
        posicaoComidinhaX = generateRandom(40);
        posicaoComidinhaY = generateRandom(20);
        for (let i = 0; i < obstaculosX.length; i++) {
            if (posicaoComidinhaX == obstaculosX[i] && posicaoComidinhaY == obstaculosY[i]) {
                posicaoComidinhaX = generateRandom(40);
                posicaoComidinhaY = generateRandom(20);
            }
        }
        desenhaComidinha();
    }

    // Desenha a comida
    function desenhaComidinha() {
        pincel.fillStyle = foodColor;
        pincel.fillRect(posicaoComidinhaX, posicaoComidinhaY, 20, 20);
    }

    /****************** BLACK HOLES *****************/

    // Cria novos Back Holes
    function criaNovosBlackholes() {
        for (let i = 0; i < numBlackHoles; i++) {
            var novoObstaculoX = generateRandom(40);
            var novoObstaculoY = generateRandom(20);
            obstaculosX.push(novoObstaculoX);
            obstaculosY.push(novoObstaculoY);
            desenhaBlackholes();
        }
    }

    // Desenha os Black Holes
    function desenhaBlackholes() {
        for(let i = 0; i < obstaculosX.length; i++) {
            pincel.fillStyle = "black";
            pincel.fillRect(obstaculosX[i], obstaculosY[i], 20, 20);
        }
    }

    /********************* MECANISMOS DO JOGO *********************/

    // Verifica se pontuou
    function verificaPonto() {
        if (posicaoPlayerX == posicaoComidinhaX && posicaoPlayerY == posicaoComidinhaY) {
            contadorPontos++;
            placar.innerText = contadorPontos;
            box.style.padding = "15px 110px";
            criaNovosBlackholes();
            criaNovaComidinha();
            desenhaComidinha();
        }
    }

    // Verifica se perdeu
    function verificaDerrota() {
        for(let i = 0; i < obstaculosX.length; i++) {
            if(posicaoPlayerX == obstaculosX[i] && posicaoPlayerY == obstaculosY[i]) {
                //console.log("Comidinha: X - " + posicaoComidinhaX + " | Y - " + posicaoComidinhaY);
                //console.log("Player: X - " + posicaoPlayerX + " | Y - " + posicaoPlayerY);
                //console.log(obstaculosX);
                //console.log(obstaculosY);
                limpaCima();
                limpaDireita();
                limpaBaixo();
                limpaEsquerda();
                tela.style.display = "none";
                box.style.display = "none";
                boxPlacar.style.display = "block";
                boxPlacar.querySelector("#placarPontuacao").textContent = contadorPontos;
                boxPlacar.querySelector("#placarVelocidade").textContent = velocidadeInput.value;
                boxPlacar.querySelector("#placarBlackHoles").textContent = numBlackHoles;
            }
        }
    }

    // Teletransporte
    function teletransporte() {
        //console.log(posicaoPlayerX);
        //console.log(posicaoPlayerY);
        if (posicaoPlayerX >= 800) {
            posicaoPlayerX = -20;
        } else if (posicaoPlayerX < 0) {
            posicaoPlayerX = 800;
        } else if (posicaoPlayerY >= 400) {
            posicaoPlayerY = -20;
        } else if (posicaoPlayerY < 0) {
            posicaoPlayerY = 400;
        }
    }

    /****************** COMANDOS USUÁRIO ***************/

    // Comandos de direção
    function playerAnda(event) {
        if (event.which == 37 && jogando == true && andaEsquerdaAtivado == false) {
            andaEsquerdaAtivado = true;
            limpaCima();
            limpaDireita();
            limpaBaixo();
            andaEsquerda = setInterval(function() {
                posicaoPlayerX -= 20;
                chamaTudo();
            }, velocidade);
        } else if (event.which == 38 && jogando == true && andaCimaAtivado == false) {
            andaCimaAtivado = true;
            limpaDireita();
            limpaBaixo();
            limpaEsquerda();
            andaCima = setInterval(function() {
                posicaoPlayerY -= 20;
                chamaTudo();
            }, velocidade);
        } else if (event.which == 39 && jogando == true && andaDireitaAtivado == false) {
            andaDireitaAtivado = true;
            limpaCima();
            limpaBaixo();
            limpaEsquerda();
            andaDireita = setInterval(function() {
                posicaoPlayerX += 20;
                chamaTudo();
            }, velocidade);
        } else if (event.which == 40 && jogando == true && andaBaixoAtivado == false) {
            andaBaixoAtivado = true;
            limpaCima();
            limpaDireita();
            limpaEsquerda();
            andaBaixo = setInterval(function() {
                posicaoPlayerY += 20;
                chamaTudo();
            }, velocidade);
        }
    }

    // Renderiza toda uma nova tela a medida que o player anda
    function chamaTudo() {
        desenhaTela();
        desenhaBlackholes();
        desenhaComidinha();
        teletransporte();
        geraPlayer();
        verificaDerrota();
        verificaPonto();
    }

    function limpaCima() {
        clearInterval(andaCima);
        andaCimaAtivado = false;
    }

    function limpaEsquerda() {
        clearInterval(andaEsquerda);
        andaEsquerdaAtivado = false;
    }

    function limpaBaixo() {
        clearInterval(andaBaixo);
        andaBaixoAtivado = false;
    }

    function limpaDireita() {
        clearInterval(andaDireita);
        andaDireitaAtivado = false;
    }

    /******************* CHAMANDO FUNÇÕES *******************/

    // Inicializa a tela renderizanodo a bolinha e a comida

    // Pega o valor da direção e dá o comando de andar
    document.onkeyup = playerAnda;

    // Pega o click no botão para começar o jogo
    jogar.addEventListener("click", controlaJogo);

    // Pego o click no plalcar/resultado para caso o usuário queira reiniciar
    box.addEventListener("click", controlaJogo);

    boxPlacar.addEventListener("click", controlaJogo);
