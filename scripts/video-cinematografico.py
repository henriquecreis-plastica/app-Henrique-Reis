"""
Monta o vídeo institucional do Face HD Concept a partir das gravações do
centro cirúrgico.

Uso:
    pip install Pillow
    sudo apt-get install ffmpeg fonts-montserrat
    python3 scripts/video-cinematografico.py IMG_9272.mov IMG_9276.mov

O primeiro arquivo é o plano aberto (a sala, o cirurgião de corpo inteiro); o
segundo é o plano fechado (o rosto, as lupas). A saída vai para `marketing/`
em 1080x1920 — o formato do Reels e do Stories.

IDENTIDADE
----------
Valem as mesmas três cores do app: Tiffany, branco e preto. E vale a regra do
logotipo, que esta montagem não quebra: a arte nunca é recolorida, então as
cartelas de abertura e de fecho são brancas, com o logo em preto. O Tiffany
entra só onde é acento — o fio sob o logo e o @ do Instagram.

Sobre a imagem, o texto é branco, sempre por cima de um degradê escuro: o
centro cirúrgico é muito claro e sem esse apoio a tipografia sumiria.

O TRATAMENTO
------------
Três coisas fazem o ar de cinema, e nenhuma delas inventa cor:

  - O *slow motion*. As gravações são a 60 fps e saem a 30, então os planos
    fechados podem ir a 0,5x sem repetir um único quadro.
  - O *push in*. Cada plano fecha de 6 a 8% ao longo da duração. Para o
    movimento não escadear, a imagem é ampliada a 1,5x antes do corte e
    reduzida depois — assim o passo do zoom cai abaixo do pixel.
  - A *correção de cor*. Sombra puxada para o azul-esverdeado, alta levemente
    quente, preto erguido, vinheta e um grão fino. É o contraste teal/laranja
    de cinema, que aqui ainda por cima encosta no verde da marca.

NOTA CLÍNICA
------------
O corte foi enquadrado no cirurgião — rosto, mãos, instrumental — e não no
campo operatório. Além de ser o que interessa à marca, é o que mantém a peça
dentro do que o CFM admite em publicidade médica. O CRM e o RQE aparecem na
cartela final, como a resolução exige.
"""
import os
import subprocess
import sys

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS = os.path.join(ROOT, 'assets')
OUT = os.path.join(ROOT, 'marketing')
TMP = os.path.join(OUT, '.trabalho')

L, A = 1080, 1920          # largura e altura do master (9:16)
FPS = 30
TRANSICAO = 0.5            # duração de cada fusão entre planos

TIFFANY = (10, 186, 181)
# O Tiffany escurecido do `brand.ts`: o tom puro não tem contraste suficiente
# para texto pequeno sobre branco.
TIFFANY_FUNDO = (6, 127, 123)
PRETO = (17, 17, 17)
BRANCO = (255, 255, 255)
CINZA = (138, 138, 138)

FONTES = '/usr/share/fonts/truetype/montserrat'
LEVE = f'{FONTES}/Montserrat-Light.ttf'
REGULAR = f'{FONTES}/Montserrat-Regular.ttf'

# Correção de cor aplicada a todo plano de imagem real.
GRADE = (
    'eq=contrast=1.06:saturation=0.90,'
    "curves=master='0/0.02 0.25/0.22 0.5/0.52 0.75/0.79 1/0.985',"
    'colorbalance=rs=-0.05:gs=0.01:bs=0.07:rm=0.02:bm=-0.01:rh=0.04:gh=0.01:bh=-0.04,'
    'vignette=angle=PI/4.6,'
    'noise=alls=4:allf=t,'
    'unsharp=5:5:0.4:5:5:0'
)


# --------------------------------------------------------------------------
# Tipografia
# --------------------------------------------------------------------------

def largura(d, texto, fonte, tracking):
    """Largura da linha já contando o espaçamento entre letras."""
    return sum(d.textlength(c, font=fonte) for c in texto) + tracking * (len(texto) - 1)


def escrever(d, cy, texto, fonte, cor, tracking=0):
    """
    Escreve a linha centrada na horizontal, com `cy` no meio ótico dela.

    O Pillow não tem espaçamento entre letras, e o logotipo é todo construído
    nele — o nome tem tracking largo, o "cirurgia plástica" mais largo ainda.
    Sem isso a tipografia do vídeo não conversaria com a da marca, então as
    letras são desenhadas uma a uma.
    """
    x = (L - largura(d, texto, fonte, tracking)) / 2
    topo, base = fonte.getbbox(texto)[1], fonte.getbbox(texto)[3]
    y = cy - (topo + base) / 2
    for c in texto:
        d.text((x, y), c, font=fonte, fill=cor)
        x += d.textlength(c, font=fonte) + tracking


def fio(d, cy, comprimento, cor, espessura=2):
    """O fio fino de acento, centrado."""
    d.rectangle(
        [(L - comprimento) // 2, cy, (L + comprimento) // 2, cy + espessura - 1],
        fill=cor,
    )


def colar(base, caminho, cy, largura_alvo):
    """Encaixa um PNG da marca centrado, mantendo a proporção original."""
    im = Image.open(caminho).convert('RGBA')
    alt = round(largura_alvo * im.height / im.width)
    im = im.resize((largura_alvo, alt), Image.LANCZOS)
    base.alpha_composite(im, ((L - largura_alvo) // 2, round(cy - alt / 2)))


def degrade(inicio, cheio, opacidade):
    """
    Véu escuro que desce de `inicio`, chega ao máximo em `cheio` e daí segue
    parelho até o pé do quadro.

    A sala é branca e muito iluminada. O degradê precisa estar no máximo
    *antes* da primeira linha de texto — se ainda estiver subindo ali, o
    branco do avental atravessa a tipografia e ela some. Por isso o patamar,
    e não uma rampa que só fecha no rodapé.
    """
    mascara = Image.new('L', (1, A), 0)
    px = mascara.load()
    for y in range(inicio, A):
        t = min(1.0, (y - inicio) / (cheio - inicio))
        px[0, y] = round(255 * opacidade * t ** 1.1)
    camada = Image.new('RGBA', (L, A), (0, 0, 0, 255))
    camada.putalpha(mascara.resize((L, A)))
    return camada


# --------------------------------------------------------------------------
# Cartelas
# --------------------------------------------------------------------------

def cartela_abertura():
    """Fundo branco e o logotipo em preto — o fio entra por fora, animado."""
    im = Image.new('RGBA', (L, A), (*BRANCO, 255))
    colar(im, f'{ASSETS}/logo.png', 900, 660)
    return im


# Onde o fio da abertura é desenhado, e de que tamanho.
FIO_Y, FIO_LARGURA, FIO_CAIXA = 1103, 360, 380


def sequencia_fio(destino, duracao, comeco=1.3, subida=1.1):
    """
    Desenha, quadro a quadro, o fio Tiffany que se abre sob o logotipo.

    O caminho óbvio seria o `drawbox` do ffmpeg com uma expressão em função do
    tempo — mas nele `t` é a *espessura* da caixa, não o instante, e não há
    variável de tempo nenhuma. Uma expressão com `t` ali não falha: ela calcula
    com a espessura e devolve o fio já inteiro no primeiro quadro. Por isso a
    animação vem pronta daqui, como sequência de PNGs.
    """
    os.makedirs(destino, exist_ok=True)
    for i in range(round(duracao * FPS)):
        avanco = min(1.0, max(0.0, (i / FPS - comeco) / subida))
        # Desacelera no fim: o fio chega ao comprimento sem bater.
        larg = round(FIO_LARGURA * (1 - (1 - avanco) ** 3))
        im = Image.new('RGBA', (FIO_CAIXA, 6), (0, 0, 0, 0))
        if larg:
            ImageDraw.Draw(im).rectangle(
                [(FIO_CAIXA - larg) // 2, 2, (FIO_CAIXA + larg) // 2, 3],
                fill=(*TIFFANY, 240),
            )
        im.save(f'{destino}/{i:04d}.png')


def cartela_titulo():
    """O nome do procedimento, no terço inferior, sobre o véu."""
    im = degrade(830, 1265, 0.86)
    d = ImageDraw.Draw(im)
    escrever(d, 1300, 'FACE HD CONCEPT', ImageFont.truetype(LEVE, 74), BRANCO, 9)
    fio(d, 1385, 150, (*TIFFANY, 235))
    escrever(d, 1432, 'cirurgia de face', ImageFont.truetype(LEVE, 30), (235, 235, 235), 13)
    return im


def cartela_frase():
    """Uma linha só, no mesmo lugar do título, para o plano das mãos."""
    im = degrade(900, 1300, 0.82)
    d = ImageDraw.Draw(im)
    escrever(d, 1340, 'cada detalhe em alta definição',
             ImageFont.truetype(REGULAR, 42), BRANCO, 4)
    return im


def cartela_fecho():
    """Assinatura: logo, identificação profissional e os canais da clínica."""
    im = Image.new('RGBA', (L, A), (*BRANCO, 255))
    d = ImageDraw.Draw(im)

    colar(im, f'{ASSETS}/logo.png', 700, 620)
    fio(d, 900, 160, TIFFANY)

    escrever(d, 985, 'Dr. Henrique César dos Reis', ImageFont.truetype(LEVE, 42), PRETO, 2)
    # O CRM e o RQE são obrigatórios em publicidade médica.
    escrever(d, 1048, 'CRM/SC 17913 · RQE 17450', ImageFont.truetype(REGULAR, 24), CINZA, 5)

    colar(im, f'{ASSETS}/face-hd.png', 1250, 300)

    escrever(d, 1440, '@dr.henriquereis', ImageFont.truetype(REGULAR, 34), TIFFANY_FUNDO, 6)
    return im


# --------------------------------------------------------------------------
# Montagem
# --------------------------------------------------------------------------

def rodar(args):
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-stats', *args], check=True)


def plano(origem, inicio, duracao, velocidade, z0, z1, cartao, destino):
    """
    Corta um trecho do material bruto e entrega um plano pronto.

    `velocidade` abaixo de 1 é câmera lenta. `z0`→`z1` é o fechamento do
    enquadramento: 1,0 mostra o quadro inteiro.
    """
    quadros = round(duracao * FPS)
    entrada = [
        '-ss', f'{inicio}', '-t', f'{duracao * velocidade}', '-i', origem,
    ]
    imagem = (
        f'[0:v]setpts=PTS/{velocidade},fps={FPS},'
        f'scale={L * 3 // 2}:{A * 3 // 2}:flags=lanczos,'
        f"zoompan=z='{z0}+({z1}-{z0})*on/{quadros}'"
        f":x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
        f':d=1:s={L}x{A}:fps={FPS},'
        f'{GRADE}[v]'
    )

    if cartao:
        entrada += ['-loop', '1', '-framerate', f'{FPS}', '-t', f'{duracao}', '-i', cartao]
        filtro = (
            f'{imagem};'
            f'[1:v]format=rgba,'
            f'fade=in:st=0.7:d=0.9:alpha=1,'
            f'fade=out:st={duracao - 1.1:.2f}:d=0.8:alpha=1[c];'
            f'[v][c]overlay=0:0:format=auto[saida]'
        )
    else:
        filtro = f'{imagem};[v]null[saida]'

    rodar([*entrada, '-filter_complex', filtro, '-map', '[saida]',
           '-t', f'{duracao}', '-an',
           '-c:v', 'libx264', '-preset', 'medium', '-crf', '14',
           '-pix_fmt', 'yuv420p', destino])


def cartao_animado(cartao, duracao, destino, fio=None):
    """
    Cartela parada ganha vida: um *push in* lento e, na abertura, o fio
    Tiffany que se abre sob o logotipo.
    """
    quadros = round(duracao * FPS)
    entradas = [
        '-f', 'lavfi', '-i', f'color=c=white:s={L}x{A}:r={FPS}:d={duracao}',
        '-loop', '1', '-framerate', f'{FPS}', '-t', f'{duracao}', '-i', cartao,
    ]
    cadeia = '[1:v]format=rgba[c];[0:v][c]overlay=0:0'

    if fio:
        entradas += ['-framerate', f'{FPS}', '-i', f'{fio}/%04d.png']
        cadeia += f'[base];[2:v]format=rgba[f];[base][f]overlay={(L - FIO_CAIXA) // 2}:{FIO_Y}'

    cadeia += (
        f",zoompan=z='1.0+0.05*on/{quadros}'"
        f":x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
        f':d=1:s={L}x{A}:fps={FPS}[saida]'
    )

    rodar([
        *entradas,
        '-filter_complex', cadeia, '-map', '[saida]', '-t', f'{duracao}', '-an',
        '-c:v', 'libx264', '-preset', 'medium', '-crf', '14',
        '-pix_fmt', 'yuv420p', destino,
    ])


def juntar(planos, duracoes, destino):
    """
    Encadeia os planos com fusões e entrega o master.

    Cada fusão consome `TRANSICAO` segundos do total, e é por isso que o
    deslocamento de uma não é a simples soma das durações anteriores: desconta
    o que as fusões já encurtaram.
    """
    entradas = []
    for p in planos:
        entradas += ['-i', p]

    partes, atual, acumulado = [], '[0:v]', duracoes[0]
    for i in range(1, len(planos)):
        partes.append(
            f'{atual}[{i}:v]xfade=transition=fade'
            f':duration={TRANSICAO}:offset={acumulado - TRANSICAO:.3f}[x{i}]'
        )
        atual = f'[x{i}]'
        acumulado += duracoes[i] - TRANSICAO

    # Abre e fecha no branco, que é o fundo da marca.
    partes.append(
        f'{atual}fade=t=in:st=0:d=0.6:color=white,'
        f'fade=t=out:st={acumulado - 0.7:.3f}:d=0.7:color=white,'
        f'format=yuv420p[v]'
    )

    # Trilha muda: alguns players e o próprio upload tropeçam em arquivo sem
    # faixa de áudio. A música entra depois, na biblioteca licenciada do
    # Instagram.
    rodar([
        *entradas,
        '-f', 'lavfi', '-t', f'{acumulado:.3f}', '-i', 'anullsrc=r=48000:cl=stereo',
        '-filter_complex', ';'.join(partes),
        '-map', '[v]', '-map', f'{len(planos)}:a',
        '-c:v', 'libx264', '-preset', 'slow', '-crf', '21',
        '-maxrate', '9M', '-bufsize', '16M',
        '-profile:v', 'high', '-level', '4.1', '-pix_fmt', 'yuv420p',
        '-r', f'{FPS}', '-c:a', 'aac', '-b:a', '128k',
        '-movflags', '+faststart', destino,
    ])
    return acumulado


def main(aberto, fechado):
    os.makedirs(TMP, exist_ok=True)

    cartelas = {
        'abertura': cartela_abertura(),
        'titulo': cartela_titulo(),
        'frase': cartela_frase(),
        'fecho': cartela_fecho(),
    }
    for nome, im in cartelas.items():
        im.save(f'{TMP}/{nome}.png')

    # O roteiro. Os trechos não se repetem: o plano aberto tem 12,6 s de
    # material e o fechado 8,9 s, e a cauda de cada um sai borrada.
    #
    #   origem, entrada, duração final, velocidade, zoom inicial → final
    roteiro = [
        (aberto, 0.6, 5.4, 0.90, 1.00, 1.07, 'titulo'),
        (fechado, 1.2, 5.2, 0.50, 1.02, 1.08, None),
        (aberto, 6.2, 5.2, 0.90, 1.00, 1.06, 'frase'),
        (fechado, 4.4, 4.6, 0.62, 1.00, 1.07, None),
    ]

    planos, duracoes = [], []

    abertura = f'{TMP}/00-abertura.mp4'
    sequencia_fio(f'{TMP}/fio', 3.0)
    cartao_animado(f'{TMP}/abertura.png', 3.0, abertura, fio=f'{TMP}/fio')
    planos.append(abertura)
    duracoes.append(3.0)

    for i, (origem, inicio, duracao, veloc, z0, z1, cartao) in enumerate(roteiro, 1):
        destino = f'{TMP}/{i:02d}-plano.mp4'
        print(f'plano {i}/{len(roteiro)} — {os.path.basename(origem)} a partir de {inicio}s')
        plano(origem, inicio, duracao, veloc, z0, z1,
              f'{TMP}/{cartao}.png' if cartao else None, destino)
        planos.append(destino)
        duracoes.append(duracao)

    fecho = f'{TMP}/99-fecho.mp4'
    cartao_animado(f'{TMP}/fecho.png', 5.2, fecho)
    planos.append(fecho)
    duracoes.append(5.2)

    destino = f'{OUT}/face-hd-concept-reels.mp4'
    print('montando o master…')
    total = juntar(planos, duracoes, destino)

    tamanho = os.path.getsize(destino) / 1e6
    print(f'\n{destino}\n{L}x{A} · {total:.1f}s · {tamanho:.1f} MB')


if __name__ == '__main__':
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(os.path.abspath(sys.argv[1]), os.path.abspath(sys.argv[2]))
