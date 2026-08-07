"""
Prepara as marcas dos protocolos da clínica — Face HD Concept, Lipo HD Concept
e HR Recovery Protocol — a partir dos arquivos originais.

Uso:
    pip install Pillow numpy
    python3 scripts/submarcas.py face-hd.png hr-recovery.png [lipo-hd.png]

A arte não é redesenhada: o script recorta a margem, reduz para o tamanho em
que o app exibe e faz uma única troca de cor, autorizada pela clínica.

O lockup traz um "HR" em branco acima do bloco colorido. Sobre o fundo claro
do app ele simplesmente desaparecia, e a parte que invade o topo do bloco
reaparecia como uma sombra suja. Por orientação do Dr. Henrique Reis, esse
"HR" passa a ser desenhado na cor do próprio bloco — o verde do Face HD, o
azul do Recovery Protocol. Nenhuma cor nova entra na identidade.
"""
import os
import sys

import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'assets')

# Largura em que o app exibe as marcas, em pontos, vezes 3 para telas @3x.
LARGURA = 260 * 3

# Espessura, em pixels do arquivo original, abaixo da qual o traço é o fio de
# contorno e não o "HR".
RAIO_FIO = 4


def sobre_transparente(img):
    """
    Põe o arquivo no formato que o resto do script espera: fundo transparente,
    arte opaca.

    A clínica entrega as marcas de dois jeitos — umas com fundo transparente,
    outras achatadas sobre preto. No segundo caso o "HR" e o fio foram
    desenhados em branco sobre preto, então o quanto cada pixel tem de branco é
    exatamente o quanto ele tem de opacidade.
    """
    a = np.array(img)
    if (a[:, :, 3] < 250).any():
        return img  # já veio com transparência

    rgb = a[:, :, :3].astype(int)
    if rgb[0, 0].max() > 40 or rgb[-1, -1].max() > 40:
        return img  # o fundo não é preto; nada a converter

    colorido = rgb.sum(axis=2) > 60
    cores, contagem = np.unique(a[:, :, :3][colorido & (rgb.max(axis=2) < 200)],
                                axis=0, return_counts=True)
    cor = cores[contagem.argmax()].astype(int)
    bloco = np.abs(rgb - cor).max(axis=2) <= 40

    saida = a.copy()
    saida[..., 3] = rgb.max(axis=2)  # branco sobre preto vira branco sobre nada
    saida[..., :3] = 255
    saida[bloco, :3] = cor
    saida[bloco, 3] = 255
    return Image.fromarray(saida, 'RGBA')


def caixa_do_bloco(img):
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

    return (esq, topo, dir_, base), cor


def lockup(img):
    """
    Monta o lockup inteiro — o "HR" mais o bloco — pronto para fundo claro.

    Dentro do bloco, achata a transparência contra a própria cor do bloco:
    é o que apaga a sombra do "HR" vazado. Fora do bloco, o "HR" branco é
    repintado na cor do bloco, mantendo o desenho e as bordas suaves.
    """
    (esq, topo, dir_, base), cor = caixa_do_bloco(img)

    a = np.array(img)
    ys, xs = np.nonzero(a[:, :, 3] > 12)
    x0, y0, x1, y1 = xs.min(), ys.min(), xs.max() + 1, ys.max() + 1

    recorte = a[y0:y1, x0:x1].astype(float)
    dentro = np.zeros(recorte.shape[:2], bool)
    dentro[topo - y0 : base - y0, esq - x0 : dir_ - x0] = True

    # Fora do bloco há dois elementos brancos: o "HR" e um fio de contorno que
    # abraça a arte inteira. O fio existe para fundos escuros; repintado, viraria
    # uma moldura que a marca não tem. Os dois se distinguem pela espessura — o
    # fio tem poucos pixels, os traços do "HR" são largos.
    marca = (recorte[:, :, 3] > 12) & ~dentro
    hr = maior_componente(traco_grosso(marca, RAIO_FIO))
    fio = marca & ~reconstroi(hr, marca)

    alfa = recorte[:, :, 3:4] / 255.0
    composto = recorte[:, :, :3] * alfa + cor * (1 - alfa)

    saida = recorte.copy()
    saida[dentro, :3] = composto[dentro]
    saida[dentro, 3] = 255
    saida[marca & ~fio, :3] = cor
    saida[fio, 3] = 0

    img = Image.fromarray(saida.round().clip(0, 255).astype(np.uint8), 'RGBA')
    return recorta_transparente(img)


def _encolhe(mascara):
    m = mascara.copy()
    m[1:] &= mascara[:-1]
    m[:-1] &= mascara[1:]
    m[:, 1:] &= mascara[:, :-1]
    m[:, :-1] &= mascara[:, 1:]
    return m


def _engorda(mascara):
    m = mascara.copy()
    m[1:] |= mascara[:-1]
    m[:-1] |= mascara[1:]
    m[:, 1:] |= mascara[:, :-1]
    m[:, :-1] |= mascara[:, 1:]
    return m


def reconstroi(semente, mascara):
    """Cresce a semente dentro da máscara até recuperar a forma inteira."""
    atual = semente & mascara
    while True:
        proximo = _engorda(atual) & mascara
        if (proximo == atual).all():
            return atual
        atual = proximo


def maior_componente(mascara):
    """
    Só o maior pedaço da máscara. Depois de descartar o fio pela espessura,
    sobram farpas nos cantos do bloco, onde ele era mais grosso; o "HR" é,
    de longe, a maior peça que resta.
    """
    restante = mascara.copy()
    maior = np.zeros_like(mascara)
    while restante.any():
        ys, xs = np.nonzero(restante)
        semente = np.zeros_like(mascara)
        semente[ys[0], xs[0]] = True
        peca = reconstroi(semente, restante)
        if peca.sum() > maior.sum():
            maior = peca
        restante &= ~peca
    return maior


def traco_grosso(mascara, raio):
    """O que sobra da máscara depois de descartar tudo mais fino que o raio."""
    nucleo = mascara
    for _ in range(raio):
        nucleo = _encolhe(nucleo)
    for _ in range(raio):
        nucleo = _engorda(nucleo)
    return nucleo & mascara


def recorta_transparente(img):
    """Tira a margem transparente que sobra depois de remover o fio."""
    al = np.array(img)[:, :, 3]
    ys, xs = np.nonzero(al > 12)
    return img.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))


def prepara(origem, nome):
    img = lockup(sobre_transparente(Image.open(origem).convert('RGBA')))
    escala = LARGURA / img.width
    img = img.resize((LARGURA, max(1, round(img.height * escala))), Image.LANCZOS)
    destino = os.path.join(OUT, nome)
    img.save(destino)
    print(f'{nome}: {img.width}x{img.height}  proporção {img.width / img.height:.2f}')


if __name__ == '__main__':
    if len(sys.argv) not in (3, 4):
        raise SystemExit(
            'uso: python3 scripts/submarcas.py <face-hd.png> <hr-recovery.png> [lipo-hd.png]'
        )
    prepara(sys.argv[1], 'face-hd.png')
    prepara(sys.argv[2], 'hr-recovery.png')
    if len(sys.argv) == 4:
        prepara(sys.argv[3], 'lipo-hd.png')
