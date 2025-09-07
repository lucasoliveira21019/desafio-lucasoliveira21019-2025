class AbrigoAnimais {

  encontraPessoas(brinquedosPessoa1, brinquedosPessoa2, ordemAnimais) {
    /**
     * Organiza um abrigo de animais, encontrando pessoas aptas a adotá-los.
     *
     * @param {string} brinquedosPessoa1 Uma string contendo os brinquedos da primeira pessoa, separados por vírgula.
     * @param {string} brinquedosPessoa2 Uma string contendo os brinquedos da segunda pessoa, separados por vírgula.
     * @param {string} ordemAnimais Uma string contendo os nomes dos animais a serem considerados, separados por vírgula.
     * @returns {object} Um objeto contendo a lista de animais e com quem ficaram (ou "abrigo"),
     *                   ordenada alfabeticamente, ou uma mensagem de erro em caso de dados inválidos.
     */

    const animais = {
      "Rex": { tipo: "cão", brinquedos: ["RATO", "BOLA"] },
      "Mimi": { tipo: "gato", brinquedos: ["BOLA", "LASER"] },
      "Fofo": { tipo: "gato", brinquedos: ["BOLA", "RATO", "LASER"] },
      "Zero": { tipo: "gato", brinquedos: ["RATO", "BOLA"] },
      "Bola": { tipo: "cão", brinquedos: ["CAIXA", "NOVELO"] },
      "Bebe": { tipo: "cão", brinquedos: ["LASER", "RATO", "BOLA"] },
      "Loco": { tipo: "jabuti", brinquedos: ["SKATE", "RATO"] },
    };

    // Validação dos animais
    const listaAnimais = ordemAnimais.split(",").map(animal => animal.trim());
    for (const animal of listaAnimais) {
      if (!animais[animal]) {
        return { erro: "Animal inválido" };
      }
    }

    // Validação dos brinquedos e limpeza
    const validarBrinquedos = (brinquedosStr) => {
      const brinquedos = brinquedosStr.split(",").map(brinquedo => brinquedo.trim());

      if (new Set(brinquedos).size !== brinquedos.length) { // Checa por duplicatas
        return [null, { erro: "Brinquedo inválido" }]; // Brinquedos duplicados
      }

      const brinquedosValidos = new Set(["RATO", "BOLA", "LASER", "CAIXA", "NOVELO", "SKATE"]);
      for (const brinquedo of brinquedos) {
        if (!brinquedosValidos.has(brinquedo)) {
          return [null, { erro: "Brinquedo inválido" }]; // Brinquedo inválido
        }
      }
      return [brinquedos, null];
    };

    const [brinquedosPessoa1Lista, erro1] = validarBrinquedos(brinquedosPessoa1);
    if (erro1) {
      return erro1;
    }
    const [brinquedosPessoa2Lista, erro2] = validarBrinquedos(brinquedosPessoa2);
    if (erro2) {
      return erro2;
    }

    const adocoes = {};
    const pessoasComAnimais = [0, 0]; // Contador de animais por pessoa. Posição 0 = pessoa1, 1 = pessoa2

    // Função auxiliar para verificar se uma pessoa pode adotar um animal
    const podeAdotar = (brinquedosPessoa, brinquedosAnimal) => {
      let idx = 0;
      for (const brinquedo of brinquedosPessoa) {
        if (idx < brinquedosAnimal.length && brinquedo === brinquedosAnimal[idx]) {
          idx++;
        }
      }
      return idx === brinquedosAnimal.length;
    };

    for (const nomeAnimal of listaAnimais) {
      const animal = animais[nomeAnimal];
      const brinquedosAnimal = animal.brinquedos;

      let adotante = null;

      if (nomeAnimal === "Loco") {
        // Loco precisa de companhia
        const temCompanhia = listaAnimais.some(nome => nome !== "Loco" && adocoes[nome]);
        if (temCompanhia) {
          adotante = "abrigo"; // Não importa quem o leva, se ele tem companhia. Se ninguém o quer, fica no abrigo
          if (brinquedosPessoa1Lista.length > 0) {
            adotante = "pessoa 1";
          } else if (brinquedosPessoa2Lista.length > 0) {
            adotante = "pessoa 2";
          }
        }

      } else {
        const pessoa1Apta = podeAdotar(brinquedosPessoa1Lista, brinquedosAnimal);
        const pessoa2Apta = podeAdotar(brinquedosPessoa2Lista, brinquedosAnimal);

        if (pessoa1Apta && pessoa2Apta) {
          adotante = "abrigo"; //ninguém fica com o animal se ambos forem aptos

        } else if (pessoa1Apta) {
          if (animal.tipo === "gato") {
            if (listaAnimais.some(nome => nome !== nomeAnimal && animais[nome].tipo === "gato" && adocoes[nome] === "pessoa 1")) {
              adotante = "abrigo"; //gatos não dividem seus brinquedos
            } else {
              adotante = "pessoa 1";
            }
          } else {
            adotante = "pessoa 1";
          }
        } else if (pessoa2Apta) {
          if (animal.tipo === "gato") {
            if (listaAnimais.some(nome => nome !== nomeAnimal && animais[nome].tipo === "gato" && adocoes[nome] === "pessoa 2")) {
              adotante = "abrigo"; //gatos não dividem seus brinquedos
            } else {
              adotante = "pessoa 2";
            }
          } else {
            adotante = "pessoa 2";
          }
        } else {
          adotante = "abrigo"; //ninguém quer adotar
        }
      }

      adocoes[nomeAnimal] = adotante;
    }


    // Aplicar limite de animais por pessoa e loco precisa de companhia
    const resetPessoasComAnimais = [0, 0]; // Reinicializar o contador
    for (const animal in adocoes) {
      const pessoa = adocoes[animal];
      if (pessoa === "pessoa 1") {
        resetPessoasComAnimais[0]++;
      } else if (pessoa === "pessoa 2") {
        resetPessoasComAnimais[1]++;
      }
    }

    for (const animal in adocoes) {
      const pessoa = adocoes[animal];
      if (pessoa === "pessoa 1" && resetPessoasComAnimais[0] > 3) {
        adocoes[animal] = "abrigo";
        resetPessoasComAnimais[0]--;
      } else if (pessoa === "pessoa 2" && resetPessoasComAnimais[1] > 3) {
        adocoes[animal] = "abrigo";
        resetPessoasComAnimais[1]--;
      }
    }

    // Formatar a saída
    const listaSaida = [];
    const animaisOrdenados = Object.keys(adocoes).sort();
    for (const animal of animaisOrdenados) {
      const pessoa = adocoes[animal];
      if (pessoa === "pessoa 1") {
        listaSaida.push(`${animal} - pessoa 1`);
      } else if (pessoa === "pessoa 2") {
        listaSaida.push(`${animal} - pessoa 2`);
      } else {
        listaSaida.push(`${animal} - abrigo`);
      }
    }

    return { lista: listaSaida };
  }
}

export { AbrigoAnimais as AbrigoAnimais };