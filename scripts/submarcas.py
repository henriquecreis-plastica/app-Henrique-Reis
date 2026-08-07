"""
Prepara as marcas dos protocolos da clínica — Face HD Concept e HR Recovery
Protocol — a partir dos arquivos originais.

Uso:
    pip install Pillow numpy
    python3 scripts/submarcas.py face-hd.png hr-recovery.png

REGRA, a mesma do logotipo principal: a arte não é recolorida nem
redesenhada. O script apenas recorta a margem em volta do bloco colorido e
reduz para o tamanho em que o app exibe.

Uma observação sobre o original: o lockup traz um "HR" em branco acima do
bloco colorido. Como o app tem fundo claro, esse "HR" fica invisível — por
isso o recorte fica no bloco, que é a parte que se lê em qualquer fundo. Se
a clínica tiver uma versão do lockup com o "HR" em cor, é só trocar o
arquivo de entrada: o recorte passa a incluí-lo sozinho.
"""
import os
import sys

import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'assets')

# Largura em que o app exibe as marcas, em pontos, vezes 3 para telas @3x.
LARGURA = 260 * 3


def bloco_colorido(img):
    """
    Recorta o bloco de cor.

    Não basta procurar o que não é branco: o "HR" do lockup é branco e invade
    o topo do bloco, e o original ainda traz uma borda branca de um lado. Por
    isso o recorte começa pela área colorida e depois encolhe enquanto a linha
    da borda tiver pixel claro — o que sobra é o retângulo limpo.
    """
    a = np.array(img)
    opaco = a[:, :, 3] > 12
    colorido = (a[:, :, :3].astype(int).sum(axis=2) < 720) & opaco
    ys, xs = np.nonzero(colorido)
    topo, base, esq, dir_ = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1

    # A cor do bloco é, de longe, a que mais aparece na área colorida.
    cores, contagem = np.unique(a[:, :, :3][colorido], axis=0, return_counts=True)
    cor = cores[contagem.argmax()].astype(int)

    # Tolerância folgada o bastante para o ruído do próprio arquivo, e apertada
    # o bastante para pegar o "HR" esbranquiçado que invade o topo do bloco.
    def puro(faixa):
        """
        A borda só está limpa quando é toda da cor do bloco e toda opaca. O
        "HR" do lockup é branco e foi vazado sobre o bloco com transparência
        parcial: sem olhar o alfa, ele passa despercebido aqui e reaparece
        como uma sombra clara quando o app desenha a arte sobre o branco.
        """
        return bool(
            (np.abs(faixa[..., :3].astype(int) - cor).max(axis=-1) <= 8).all()
            and (faixa[..., 3] >= 250).all()
        )

    # Trava de segurança: o recorte tira uma franja, nunca o bloco.
    limite_y = max(1, (base - topo) // 12)
    limite_x = max(1, (dir_ - esq) // 12)
    px = a

    for _ in range(limite_y):
        if puro(px[topo, esq:dir_]):
            break
        topo += 1
    for _ in range(limite_y):
        if puro(px[base - 1, esq:dir_]):
            break
        base -= 1
    for _ in range(limite_x):
        if puro(px[topo:base, esq]):
            break
        esq += 1
    for _ in range(limite_x):
        if puro(px[topo:base, dir_ - 1]):
            break
        dir_ -= 1

    return img.crop((esq, topo, dir_, base))


def prepara(origem, nome):
    img = bloco_colorido(Image.open(origem).convert('RGBA'))
    escala = LARGURA / img.width
    img = img.resize((LARGURA, max(1, round(img.height * escala))), Image.LANCZOS)
    destino = os.path.join(OUT, nome)
    img.save(destino)
    cor = tuple(np.array(img)[img.height // 2, img.width // 20][:3])
    print(f'{nome}: {img.width}x{img.height}  cor do bloco #{cor[0]:02X}{cor[1]:02X}{cor[2]:02X}')


if __name__ == '__main__':
    if len(sys.argv) != 3:
        raise SystemExit('uso: python3 scripts/submarcas.py <face-hd.png> <hr-recovery.png>')
    prepara(sys.argv[1], 'face-hd.png')
    prepara(sys.argv[2], 'hr-recovery.png')
