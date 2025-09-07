import { AbrigoAnimais } from "./abrigo-animais.js";

describe('Abrigo de Animais - Cobertura Completa', () => {

    test('Deve rejeitar animal inválido', () => {
        const resultado = new AbrigoAnimais().encontraPessoas('CAIXA,RATO', 'RATO,BOLA', 'Lulu');
        expect(resultado.erro).toBe('Animal inválido');
        expect(resultado.lista).toBeFalsy();
    });

    test('Deve encontrar pessoa para um animal', () => {
        const resultado = new AbrigoAnimais().encontraPessoas(
            'RATO,BOLA', 'RATO,NOVELO', 'Rex,Fofo');
        expect(resultado.lista[0]).toBe('Fofo - abrigo');
        expect(resultado.lista[1]).toBe('Rex - pessoa 1');
        expect(resultado.lista.length).toBe(2);
        expect(resultado.erro).toBeFalsy();
    });

    test('Deve encontrar pessoa para um animal intercalando brinquedos', () => {
        const resultado = new AbrigoAnimais().encontraPessoas('BOLA,LASER',
            'BOLA,NOVELO,RATO,LASER', 'Mimi,Fofo,Rex,Bola');

        expect(resultado.lista[0]).toBe('Bola - abrigo');
        expect(resultado.lista[1]).toBe('Fofo - pessoa 2');
        expect(resultado.lista[2]).toBe('Mimi - abrigo');
        expect(resultado.lista[3]).toBe('Rex - abrigo');
        expect(resultado.lista.length).toBe(4);
        expect(resultado.erro).toBeFalsy();
    });

    //  Garante que o loop #determinarAdotante é executado
    test('Loop #determinarAdotante é executado para múltiplos animais', () => {
        const resultado = new AbrigoAnimais().encontraPessoas('RATO,BOLA', 'CAIXA', 'Rex,Bola');
        expect(resultado.lista.length).toBe(2);
        expect(resultado.erro).toBeFalsy();
    });

    // Retorno de erro em #validarAnimais
    test('#validarAnimais retorna erro se animal inválido', () => {
        const resultado = new AbrigoAnimais().encontraPessoas('RATO', 'BOLA', 'AnimalInvalido');
        expect(resultado.erro).toBe('Animal inválido');
        expect(resultado.lista).toBeFalsy();
    });

    //  Retorno de erro em #validarBrinquedos
    test('#validarBrinquedos retorna erro se brinquedo inválido', () => {
        const resultado = new AbrigoAnimais().encontraPessoas('BRINQUEDO_INVALIDO', 'BOLA', 'Rex');
        expect(resultado.erro).toBe('Brinquedo inválido');
        expect(resultado.lista).toBeFalsy();
    });

    // Adiciona um brinquedo, caso a pessoa não tenha nenhum brinquedo
    test('#podeAdotar deve retornar false se brinquedosPessoa for vazio', () => {
        const resultado = new AbrigoAnimais().encontraPessoas('', 'BOLA', 'Rex');
        expect(resultado.lista).toEqual(['Rex - abrigo']);
        expect(resultado.erro).toBeFalsy();
    });

     //  Loco com companhia, mas pessoa 1 tem brinquedos, e pessoa 2 nao
    test('#determinarAdotante: Loco com companhia, pessoa 1 tem brinquedos, pessoa 2 nao', () => {
        const resultado = new AbrigoAnimais().encontraPessoas('SKATE,RATO', '', 'Loco,Rex');
        expect(resultado.lista).toEqual(['Loco - pessoa 1', 'Rex - abrigo']);
        expect(resultado.erro).toBeFalsy();
    });

     // Loco com companhia, mas pessoa 2 tem brinquedos e pessoa1 nao
     test('#determinarAdotante: Loco com companhia, pessoa 2 tem brinquedos e pessoa 1 nao', () => {
        const resultado = new AbrigoAnimais().encontraPessoas('', 'SKATE,RATO', 'Loco,Rex');
        expect(resultado.lista).toEqual(['Loco - pessoa 2', 'Rex - abrigo']);
        expect(resultado.erro).toBeFalsy();
    });

    // Teste: Ambos sao aptos
    test('#determinarAdotante: Ambos são aptos, vai para o abrigo', () => {
        const resultado = new AbrigoAnimais().encontraPessoas('RATO,BOLA', 'RATO,BOLA', 'Rex');
        expect(resultado.lista).toEqual(['Rex - abrigo']);
        expect(resultado.erro).toBeFalsy();
    });

      // Pessoa 1 apta, nao é gato
    test('#determinarAdotante: Pessoa 1 apta, nao é gato', () => {
        const resultado = new AbrigoAnimais().encontraPessoas('RATO,BOLA', '', 'Rex');
        expect(resultado.lista).toEqual(['Rex - pessoa 1']);
        expect(resultado.erro).toBeFalsy();
    });

    // Cobre linhas 120-121: Pessoa 2 apta para gato, mas pessoa 2 já tem gato
    test('#determinarAdotante: Pessoa 2 apta para gato, mas pessoa 2 já tem gato', () => {
        const resultado = new AbrigoAnimais().encontraPessoas('', 'BOLA,LASER', 'Mimi,Zero');
        expect(resultado.lista).toEqual(['Mimi - pessoa 2', 'Zero - abrigo']);
        expect(resultado.erro).toBeFalsy();
    });

     //  Pessoa 2 apta, não é gato
    test('#determinarAdotante: Pessoa 2 apta, nao é gato', () => {
        const resultado = new AbrigoAnimais().encontraPessoas('', 'RATO,BOLA', 'Rex');
        expect(resultado.lista).toEqual(['Rex - pessoa 2']);
        expect(resultado.erro).toBeFalsy();
    });

    
     test('#aplicarRestricoesDeAdocao incrementa contadores corretamente', () => {
        const resultado = new AbrigoAnimais().encontraPessoas('RATO,BOLA', 'BOLA,LASER', 'Rex,Mimi');
        expect(resultado.lista).toEqual(['Mimi - pessoa 2', 'Rex - pessoa 1']);
        expect(resultado.erro).toBeFalsy();
    });

    test('#aplicarRestricoesDeAdocao verifica limite corretamente 2', () => {
        const resultado = new AbrigoAnimais().encontraPessoas('BOLA,LASER,RATO,CAIXA,NOVELO,SKATE', 'BOLA,LASER,RATO,CAIXA,NOVELO,SKATE', 'Rex,Mimi,Fofo,Zero,Bola,Bebe');
        expect(resultado.lista).toEqual([
            'Bebe - abrigo',
            'Bola - abrigo',
            'Fofo - abrigo',
            'Mimi - abrigo',
            'Rex - abrigo',
            'Zero - abrigo'
          ]);
        expect(resultado.erro).toBeFalsy();
    });

      // Teste para brinquedos duplicados
    test('#validarBrinquedos deve retornar erro para brinquedos duplicados', () => {
      const resultado = new AbrigoAnimais().encontraPessoas('BOLA, BOLA', 'LASER', 'Rex');
      expect(resultado.erro).toBe('Brinquedo inválido');
        expect(resultado.lista).toBeFalsy();
    });

   // Loco com companhia, testa todos os casos de atribuição
    test('#determinarAdotante: Loco com companhia, testa combinações de brinquedos', () => {
      let resultado = new AbrigoAnimais().encontraPessoas('SKATE,RATO', '', 'Loco, Rex');
      expect(resultado.lista).toEqual(['Loco - pessoa 1', 'Rex - abrigo']);

      resultado = new AbrigoAnimais().encontraPessoas('', 'SKATE,RATO', 'Loco, Rex');
      expect(resultado.lista).toEqual(['Loco - pessoa 2', 'Rex - abrigo']);

      resultado = new AbrigoAnimais().encontraPessoas('', '', 'Loco, Rex');
      expect(resultado.lista).toEqual(['Loco - abrigo', 'Rex - abrigo']);
    });
    
    //   Testando casos em que pessoa 1 eh apta, mas quer gato e ja tem outro gato
    test('#determinarAdotante: Pessoa 1 apta para gato, mas já tem outro gato', () => {
      const resultado = new AbrigoAnimais().encontraPessoas('BOLA, LASER', '', 'Mimi, Zero');
      expect(resultado.lista).toEqual(['Mimi - pessoa 1', 'Zero - pessoa 1']);
  
      const resultado2 = new AbrigoAnimais().encontraPessoas('BOLA, LASER', 'RATO, BOLA', 'Mimi, Zero, Fofo');
      expect(resultado2.lista).toEqual(['Fofo - pessoa 2', 'Mimi - pessoa 1', 'Zero - abrigo']);

    });

    //Garante a adoção quando a pessoa 2 já tem gato
    test('#determinarAdotante: Pessoa 2 apta, mas já tem gato', () => {
      const resultado = new AbrigoAnimais().encontraPessoas('', 'BOLA, LASER', 'Mimi, Zero');
      expect(resultado.lista).toEqual(['Mimi - pessoa 2', 'Zero - abrigo']);
    });

    test('#determinarAdotante: pessoa 2 apta para cachorro', () => {
      const resultado = new AbrigoAnimais().encontraPessoas('', 'LASER, RATO, BOLA', 'Bebe');
      expect(resultado.lista).toEqual(['Bebe - pessoa 2']);
    });
   // Garante que se nenhum adotante seja encontrado,seja encaminhado para o abrigo
     test('#determinarAdotante: Nenhum adotante encontrado, encaminha para o abrigo', () => {
      const resultado = new AbrigoAnimais().encontraPessoas('', '', 'Rex');
      expect(resultado.lista).toEqual(['Rex - abrigo']);
    });

   
    test('#aplicarRestricoesDeAdocao: Limite de animais para pessoa 1 e pessoa 2', () => {
      const resultado = new AbrigoAnimais().encontraPessoas(
        'SKATE, RATO, BOLA, LASER, CAIXA, NOVELO',
        'SKATE, RATO, BOLA, LASER, CAIXA, NOVELO',
        'Rex, Mimi, Fofo, Bola, Bebe, Zero, Loco'
      );
      expect(resultado.lista).toEqual([
        'Bebe - abrigo',
        'Bola - abrigo',
        'Fofo - abrigo',
        'Loco - abrigo',
        'Mimi - abrigo',
        'Rex - abrigo',
        'Zero - abrigo'
      ]);
    });
});