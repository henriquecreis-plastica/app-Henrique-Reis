"""
Deriva o lockup da Lipo HD Concept a partir do arquivo original do Face HD
Concept, para que as duas marcas sejam de fato a mesma marca.

Uso:
    pip install Pillow numpy
    python3 scripts/marca-lipo-hd.py caminho/face-hd-original.png

O que é reaproveitado, sem tocar num pixel: o bloco e a sua cor, o "HR", o
"HD" da linha principal, a palavra "CONCEPT" e o fio de contorno. O script
redesenha apenas as quatro letras que faltavam — L, I, P e O — com o traço, a
altura e a construção medidos na própria arte:

    altura de caixa alta   65 px
    espessura do traço      8 px
    "O" circular            65 x 65 px

São letras de um sem-serifa geométrico, então L e I são hastes retas e P e O
saem de elipses concêntricas. Nada aqui é chute de proporção: os números
vieram de medir o "H", o "D" e o "O" pequeno do arquivo da clínica.

A saída sai no mesmo formato do original — "HR" branco, texto branco sobre o
bloco, fundo transparente — para poder passar pelo mesmo scripts/submarcas.py
que prepara as outras duas marcas.
"""
import os
import sys

import numpy as np
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SS = 4  # supersampling, para a curva sair limpa

CAIXA_ALTA = 65
TRACO = 8

# Medidas relativas ao canto superior esquerdo do bloco, tiradas do original.
TEXTO_Y = 42
HD_X0, HD_X1 = 331, 449
LARGURAS = {'L': 36, 'I': TRACO, 'P': 48, 'O': CAIXA_ALTA}
# Espaço entre letras. O "O" é redondo e encosta um pouco mais.
ESPACOS = {'LI': 14, 'IP': 14, 'PO': 12}
ESPACO_PALAVRA = 47


def caixa_do_bloco(a):
    """Retângulo e cor do bloco colorido."""
    opaco = a[:, :, 3] > 200
    colorido = (a[:, :, :3].astype(int).sum(axis=2) < 720) & opaco
    ys, xs = np.nonzero(colorido)
    cores, contagem = np.unique(a[:, :, :3][colorido], axis=0, return_counts=True)
    return (xs.min(), ys.min(), xs.max() + 1, ys.max() + 1), cores[contagem.argmax()]


def desenha_lipo(largura, altura, x0, y0):
    """Máscara das letras L, I, P e O, desenhada em resolução multiplicada."""
    m = Image.new('L', (largura * SS, altura * SS), 0)
    d = ImageDraw.Draw(m)
    s = SS
    t = TRACO * s
    h = CAIXA_ALTA * s
    y = (TEXTO_Y - y0) * s
    x = (77 - x0) * s  # margem esquerda do texto no bloco, como no original

    # L — haste e pé
    d.rectangle([x, y, x + t - 1, y + h - 1], fill=255)
    d.rectangle([x, y + h - t, x + LARGURAS['L'] * s - 1, y + h - 1], fill=255)
    x += (LARGURAS['L'] + ESPACOS['LI']) * s

    # I — só a haste
    d.rectangle([x, y, x + t - 1, y + h - 1], fill=255)
    x += (LARGURAS['I'] + ESPACOS['IP']) * s

    # P — haste inteira mais a barriga, uma elipse vazada que nasce na haste
    largura_p = LARGURAS['P'] * s
    altura_p = round(CAIXA_ALTA * 0.65) * s
    d.rectangle([x, y, x + t - 1, y + h - 1], fill=255)
    d.ellipse([x, y, x + largura_p - 1, y + altura_p - 1], fill=255)
    d.ellipse([x + t, y + t, x + largura_p - t - 1, y + altura_p - t - 1], fill=0)
    d.rectangle([x, y, x + t - 1, y + h - 1], fill=255)
    x += (LARGURAS['P'] + ESPACOS['PO']) * s

    # O — círculo perfeito, como no original
    d.ellipse([x, y, x + h - 1, y + h - 1], fill=255)
    d.ellipse([x + t, y + t, x + h - t - 1, y + h - t - 1], fill=0)

    return m.resize((largura, altura), Image.LANCZOS)


def main(origem):
    img = Image.open(origem).convert('RGBA')
    a = np.array(img)
    (bx0, by0, bx1, by1), cor = caixa_do_bloco(a)

    # Onde ficava "FACE": da margem esquerda do texto até o começo do "HD".
    x0, x1 = bx0 + 77, bx0 + HD_X0 - ESPACO_PALAVRA
    y0, y1 = by0 + TEXTO_Y - 6, by0 + TEXTO_Y + CAIXA_ALTA + 6
    # A limpeza vai um pouco além do "E", senão a sua borda suavizada fica
    # para trás como um risco solto entre as palavras.
    a[y0:y1, x0 : bx0 + HD_X0 - 16, :3] = cor
    a[y0:y1, x0 : bx0 + HD_X0 - 16, 3] = 255

    # A largura de "LIPO" bate com a de "FACE": o lockup não muda de tamanho.
    escrita = sum(LARGURAS.values()) + sum(ESPACOS.values())
    folga = (x1 - x0) - escrita
    if abs(folga) > 12:
        raise SystemExit(f'"LIPO" ficaria {folga:+d} px fora do espaço de "FACE"')

    letras = desenha_lipo(x1 - x0, y1 - y0, x0 - bx0, y0 - by0)
    recorte = Image.fromarray(a[y0:y1, x0:x1], 'RGBA')
    recorte.paste(Image.new('RGBA', recorte.size, (255, 255, 255, 255)), (0, 0), letras)
    a[y0:y1, x0:x1] = np.array(recorte)

    # O bloco original tem um leve ruído de compressão. Onde ele encosta na
    # área recém-pintada, a diferença aparece como um fiapo de costura — então
    # o bloco inteiro é achatado na sua cor, poupando as bordas suaves das
    # letras, que não estão dentro da tolerância.
    bloco = a[by0:by1, bx0:bx1]
    liso = np.abs(bloco[:, :, :3].astype(int) - cor).max(axis=2) <= 12
    bloco[liso, :3] = cor
    bloco[liso, 3] = 255
    a[by0:by1, bx0:bx1] = bloco

    destino = os.path.join(ROOT, 'assets', 'lipo-hd-original.png')
    Image.fromarray(a, 'RGBA').save(destino)
    print(f'gerado {destino}  (folga de {folga:+d} px em relação a "FACE")')


if __name__ == '__main__':
    if len(sys.argv) != 2:
        raise SystemExit('uso: python3 scripts/marca-lipo-hd.py <face-hd-original.png>')
    main(sys.argv[1])
