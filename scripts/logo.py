"""
Gera os arquivos de logotipo usados pelo app a partir do original da clínica.

Uso:
    pip install Pillow numpy
    python3 scripts/logo.py caminho/para/o/logo.png

REGRA: o logotipo nunca é recolorido nem redesenhado. Ele aparece sempre em
preto, exatamente como foi entregue. O script apenas recorta bordas
transparentes e separa a assinatura do lockup — a arte em si não muda.

Única exceção, e por limitação física: o ícone do app é um quadrado, e o
lockup tem proporção de 4:1. Nele entra a assinatura "hr", em preto, sobre o
verde Tiffany. Para usar o lockup inteiro no ícone, troque `monogram` por
`full` na chamada que gera `icon.png`.
"""
import os
import sys

import numpy as np
from PIL import Image

TIFFANY = (10, 186, 181)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'assets')


def trim(img):
    """Remove as bordas transparentes, sem tocar no traço."""
    a = np.array(img)[:, :, 3]
    ys, xs = np.nonzero(a > 12)
    return img.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))


def fit(img, w, h):
    r = min(w / img.width, h / img.height)
    return img.resize((max(1, round(img.width * r)), max(1, round(img.height * r))), Image.LANCZOS)


def centered(img, size, bg=None, pad=0.0):
    canvas = Image.new('RGBA', size, (*bg, 255) if bg else (0, 0, 0, 0))
    inner = fit(img, round(size[0] * (1 - pad)), round(size[1] * (1 - pad)))
    canvas.paste(inner, ((size[0] - inner.width) // 2, (size[1] - inner.height) // 2), inner)
    return canvas


def row_blocks(img):
    """Faixas horizontais com tinta, separadas por linhas vazias."""
    a = np.array(img)[:, :, 3] > 12
    rows = a.sum(axis=1)
    blocks, start = [], None
    for i, v in enumerate(rows):
        if v > 0 and start is None:
            start = i
        elif v == 0 and start is not None:
            blocks.append((start, i - 1))
            start = None
    if start is not None:
        blocks.append((start, len(rows) - 1))
    return blocks


def letter_span(block):
    """Colunas das letras "hr" — o traço horizontal é fino e se estende por tudo."""
    a = np.array(block)[:, :, 3] > 12
    limiar = 0.06 * block.height
    ext = np.array([
        0 if not a[:, x].any() else np.ptp(np.nonzero(a[:, x])[0]) + 1
        for x in range(block.width)
    ])
    cols = np.nonzero(ext > limiar)[0]
    folga = round(block.width * 0.03)
    return max(0, cols.min() - folga), min(block.width, cols.max() + folga)


def main(src):
    im = Image.open(src).convert('RGBA')
    blocks = row_blocks(im)
    if len(blocks) < 2:
        sys.exit('Esperava ao menos dois blocos (assinatura e nome) no arquivo de origem.')

    corte = blocks[0][1] + (blocks[1][0] - blocks[0][1]) // 2

    full = trim(im)
    signature = trim(im.crop((0, 0, im.width, corte)))
    x0, x1 = letter_span(signature)
    monogram = trim(signature.crop((x0, 0, x1, signature.height)))

    os.makedirs(OUT, exist_ok=True)
    full.save(f'{OUT}/logo.png')
    signature.save(f'{OUT}/logo-mark.png')
    monogram.save(f'{OUT}/logo-monogram.png')

    # Ícone e favicon: assinatura em preto sobre o verde Tiffany.
    centered(monogram, (1024, 1024), bg=TIFFANY, pad=0.42).convert('RGB').save(f'{OUT}/icon.png')
    centered(monogram, (64, 64), bg=TIFFANY, pad=0.28).convert('RGB').save(f'{OUT}/favicon.png')

    # Android: o fundo adaptativo é o Tiffany, definido em app.json.
    for nome in ('android-icon-foreground.png', 'android-icon-monochrome.png'):
        centered(monogram, (1024, 1024), pad=0.56).save(f'{OUT}/{nome}')

    # Abertura: lockup preto sobre fundo branco, também definido em app.json.
    centered(full, (1200, 600), pad=0.14).save(f'{OUT}/splash-icon.png')

    print(f'lockup {full.size} · assinatura {signature.size} · monograma {monogram.size}')
    print(f'gerados em {OUT}')


if __name__ == '__main__':
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
