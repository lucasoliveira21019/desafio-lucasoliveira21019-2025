class AbrigoAnimais {

    encontraPessoas(brinquedosPessoa1, brinquedosPessoa2, ordemAnimais) {
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
        const listaAnimaisResult = this.#validarAnimais(ordemAnimais, animais);
        if (listaAnimaisResult.erro) return listaAnimaisResult;
        const listaAnimais = listaAnimaisResult.lista;

        // Validação dos brinquedos e limpeza
        const brinquedosPessoa1Result = this.#validarBrinquedos(brinquedosPessoa1);
        if (brinquedosPessoa1Result.erro) return brinquedosPessoa1Result;
        const brinquedosPessoa1Lista = brinquedosPessoa1Result[0];

        const brinquedosPessoa2Result = this.#validarBrinquedos(brinquedosPessoa2);
        if (brinquedosPessoa2Result.erro) return brinquedosPessoa2Result;
        const brinquedosPessoa2Lista = brinquedosPessoa2Result[0];


        const adocoes = {};
        const pessoasComAnimais = [0, 0];

        for (const nomeAnimal of listaAnimais) {
            adocoes[nomeAnimal] = this.#determinarAdotante(
                nomeAnimal,
                animais,
                listaAnimais,
                brinquedosPessoa1Lista,
                brinquedosPessoa2Lista,
                adocoes
            );
        }

        this.#aplicarRestricoesDeAdocao(adocoes);

        return this.#formatarSaida(adocoes);
    }

    // Métodos privados para organização e encapsulamento
    #validarAnimais(ordemAnimais, animais) {
        const listaAnimais = ordemAnimais.split(",").map(animal => animal.trim());
        for (const animal of listaAnimais) {
            if (!animais[animal]) {
                return { erro: "Animal inválido" };
            }
        }
        return { lista: listaAnimais };
    }

    #validarBrinquedos(brinquedosStr) {
        const brinquedos = brinquedosStr.split(",").map(brinquedo => brinquedo.trim());

        if (new Set(brinquedos).size !== brinquedos.length) {
            return { erro: "Brinquedo inválido" };
        }

        const brinquedosValidos = new Set(["RATO", "BOLA", "LASER", "CAIXA", "NOVELO", "SKATE"]);
        for (const brinquedo of brinquedos) {
            if (!brinquedosValidos.has(brinquedo)) {
                return { erro: "Brinquedo inválido" };
            }
        }
        return [brinquedos, null];
    }

    #podeAdotar(brinquedosPessoa, brinquedosAnimal) {
        let idx = 0;
        for (const brinquedo of brinquedosPessoa) {
            if (idx < brinquedosAnimal.length && brinquedo === brinquedosAnimal[idx]) {
                idx++;
            }
        }
        return idx === brinquedosAnimal.length;
    }

    #determinarAdotante(nomeAnimal, animais, listaAnimais, brinquedosPessoa1Lista, brinquedosPessoa2Lista, adocoes) {
        const animal = animais[nomeAnimal];
        const brinquedosAnimal = animal.brinquedos;

        if (nomeAnimal === "Loco") {
            const temCompanhia = listaAnimais.some(nome => nome !== "Loco" && adocoes[nome]);
            if (temCompanhia) {
                let adotante = "abrigo";
                if (brinquedosPessoa1Lista.length > 0) {
                    adotante = "pessoa 1";
                } else if (brinquedosPessoa2Lista.length > 0) {
                    adotante = "pessoa 2";
                }
                return adotante;
            }
        } else {
            const pessoa1Apta = this.#podeAdotar(brinquedosPessoa1Lista, brinquedosAnimal);
            const pessoa2Apta = this.#podeAdotar(brinquedosPessoa2Lista, brinquedosAnimal);

            if (pessoa1Apta && pessoa2Apta) {
                return "abrigo";
            } else if (pessoa1Apta) {
                if (animal.tipo === "gato") {
                    if (listaAnimais.some(nome => nome !== nomeAnimal && animais[nome].tipo === "gato" && adocoes[nome] === "pessoa 1")) {
                        return "abrigo";
                    } else {
                        return "pessoa 1";
                    }
                } else {
                    return "pessoa 1";
                }
            } else if (pessoa2Apta) {
                if (animal.tipo === "gato") {
                    if (listaAnimais.some(nome => nome !== nomeAnimal && animais[nome].tipo === "gato" && adocoes[nome] === "pessoa 2")) {
                        return "abrigo";
                    } else {
                        return "pessoa 2";
                    }
                } else {
                    return "pessoa 2";
                }
            } else {
                return "abrigo";
            }
        }
        return "abrigo"; 
    }

    #aplicarRestricoesDeAdocao(adocoes) {
        const pessoasComAnimais = [0, 0];
        for (const animal in adocoes) {
            const pessoa = adocoes[animal];
            if (pessoa === "pessoa 1") {
                pessoasComAnimais[0]++;
            } else if (pessoa === "pessoa 2") {
                pessoasComAnimais[1]++;
            }
        }

        for (const animal in adocoes) {
            const pessoa = adocoes[animal];
            if (pessoa === "pessoa 1" && pessoasComAnimais[0] > 3) {
                adocoes[animal] = "abrigo";
                pessoasComAnimais[0]--;
            } else if (pessoa === "pessoa 2" && pessoasComAnimais[1] > 3) {
                adocoes[animal] = "abrigo";
                pessoasComAnimais[1]--;
            }
        }
    }

    #formatarSaida(adocoes) {
        const listaSaida = [];
        const animaisOrdenados = Object.keys(adocoes).sort();
        for (const animal of animaisOrdenados) {
            const pessoa = adocoes[animal];
            listaSaida.push(`${animal} - ${pessoa}`);
        }
        return { lista: listaSaida };
    }
}

export { AbrigoAnimais as AbrigoAnimais };