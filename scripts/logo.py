"""
Gera as variações do logotipo usadas pelo app a partir do arquivo original.

Uso:
    pip install Pillow numpy
    python3 scripts/logo.py caminho/para/o/logo.png

O arquivo de entrada deve ser um PNG com fundo transparente contendo o lockup
completo em três blocos empilhados: a assinatura "hr", o nome e o subtítulo.
"""
import os
import sys

import numpy as np
from PIL import Image

TIFFANY = (10, 186, 181)
WHITE = (255, 255, 255)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'assets')


def trim(img):
    """Remove as bordas transparentes."""
    a = np.array(img)[:, :, 3]
    ys, xs = np.nonzero(a > 12)
    return img.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))


def recolor(img, rgb):
    """Troca a cor preservando o canal alfa — para a versão branca."""
    a = np.array(img).copy()
    a[:, :, 0], a[:, :, 1], a[:, :, 2] = rgb
    return Image.fromarray(a)


def fit(img, w, h):
    r = min(w / img.width, h / img.height)
    return img.resize((max(1, round(img.width * r)), max(1, round(img.height * r))), Image.LANCZOS)


def centered(img, size, bg=None, pad=0.0):
    canvas = Image.new('RGBA', size, (*bg, 255) if bg else (0, 0, 0, 0))
    inner = fit(img, round(size[0] * (1 - pad)), round(size[1] * (1 - pad)))
    canvas.paste(inner, ((size[0] - inner.width) // 2, (size[1] - inner.height) // 2), inner)
    return canvas


def row_blocks(img):
    """Faixas horizontais que contêm tinta, separadas por linhas vazias."""
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
    """
    Colunas onde a tinta é alta — isola as letras "hr" do traço horizontal,
    que é fino e se estende por toda a largura.
    """
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
    script = trim(im.crop((0, 0, im.width, corte)))
    x0, x1 = letter_span(script)
    monogram = trim(script.crop((x0, 0, x1, script.height)))

    os.makedirs(OUT, exist_ok=True)
    full.save(f'{OUT}/logo.png')
    recolor(full, WHITE).save(f'{OUT}/logo-white.png')
    script.save(f'{OUT}/logo-mark.png')
    recolor(script, WHITE).save(f'{OUT}/logo-mark-white.png')
    monogram.save(f'{OUT}/logo-monogram.png')
    recolor(monogram, WHITE).save(f'{OUT}/logo-monogram-white.png')

    # Ícone do app: monograma branco sobre o verde Tiffany.
    centered(recolor(monogram, WHITE), (1024, 1024), bg=TIFFANY, pad=0.44) \
        .convert('RGB').save(f'{OUT}/icon.png')

    # Android: o recorte adaptativo exige margem de segurança generosa.
    for nome in ('android-icon-foreground.png', 'android-icon-monochrome.png'):
        centered(recolor(monogram, WHITE), (1024, 1024), pad=0.58).save(f'{OUT}/{nome}')

    centered(recolor(full, WHITE), (1200, 600), pad=0.16).save(f'{OUT}/splash-icon.png')
    centered(recolor(monogram, WHITE), (64, 64), bg=TIFFANY, pad=0.30) \
        .convert('RGB').save(f'{OUT}/favicon.png')

    print(f'lockup {full.size} · assinatura {script.size} · monograma {monogram.size}')
    print(f'gerados em {OUT}')


if __name__ == '__main__':
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
