import { Platform } from 'react-native';
import type { useRouter } from 'expo-router';

type Router = ReturnType<typeof useRouter>;

/**
 * Voltar de uma tela, sem depender do histórico do navegador.
 *
 * Na versão web o app é servido de um único arquivo, e o empacotamento
 * neutraliza `history.pushState` para que o endereço continue válido ao
 * recarregar e ao compartilhar. O efeito colateral é que `router.back()` sai
 * da página: o navegador não tem para onde voltar, e a paciente cai numa tela
 * em branco.
 *
 * No aplicativo instalado a pilha existe e `back()` é o certo. Na web, voltar
 * para um destino explícito é o que se comporta como ela espera.
 */
export const voltar = (router: Router, destino: string = '/(tabs)') => {
  if (Platform.OS !== 'web' && router.canGoBack()) {
    router.back();
    return;
  }
  router.replace(destino as never);
};
