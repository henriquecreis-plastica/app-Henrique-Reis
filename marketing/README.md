# Peças de divulgação

Material de comunicação da clínica. Nada aqui entra no bundle do app — são
arquivos para publicar nas redes.

## `face-hd-concept-reels.mp4`

Vídeo institucional do Face HD Concept, montado a partir de duas gravações do
centro cirúrgico. 1080×1920, 26 s, 30 fps — o formato do Reels e do Stories.

Para regerar, com os `.mov` originais em mãos:

```sh
python3 scripts/video-cinematografico.py IMG_9272.mov IMG_9276.mov
```

O primeiro arquivo é o plano aberto, o segundo o plano fechado. O script
descreve o tratamento de imagem e as decisões de identidade.

### Antes de publicar

- **O vídeo não tem trilha.** A faixa de áudio existe, mas está muda, de
  propósito: a música deve ser escolhida na biblioteca do próprio Instagram,
  que é licenciada. Subir com trilha de fora costuma render bloqueio por
  direito autoral.
- **Publicidade médica.** O corte foi enquadrado no cirurgião, e não no campo
  operatório, e a cartela final traz CRM e RQE — é o que as resoluções do CFM
  sobre publicidade médica exigem. Ainda assim, divulgar imagem de ato
  cirúrgico é terreno sensível: vale a leitura do Dr. Henrique Reis antes de
  ir ao ar, e a autorização de imagem da paciente, mesmo o rosto dela não
  aparecendo identificável.
