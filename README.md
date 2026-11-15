# Sito accademico di Matteo Tortora

Sito React pubblicato su [GitHub Pages](https://matteotortora.github.io).
La toolchain usa Vite; l'output di produzione rimane nella cartella `build`.

## Ambiente e installazione

Usare Node **22.23.5** e npm **10.9.9**, inclusi nella versione Node indicata.
Con [nvm](https://github.com/nvm-sh/nvm):

```sh
nvm install
nvm use
npm ci
```

`package-lock.json` è l'unico lockfile del progetto. Per riprodurre
l'installazione usare `npm ci`, che non aggiorna le versioni bloccate.
Per aggiornamenti intenzionali usare `npm install`, quindi controllare e
versionare insieme `package.json` e `package-lock.json`.

## Sviluppo e verifica

```sh
npm start
```

Il server è disponibile su `http://127.0.0.1:3000` ed è accessibile solo
dal computer locale. I componenti che contengono JSX usano l'estensione `.jsx`.

```sh
npm run check
```

Il controllo verifica versione Node, coerenza del lockfile, conflitti Git,
pattern di token GitHub e credenziali nei remote; esegue i test del controllo, l'audit di tutte
le dipendenze e la build. La ricerca di pattern non sostituisce uno scanner
completo di segreti e non verifica la storia Git.

```sh
npm run build
npm run preview
```

L'anteprima della build è disponibile su `http://127.0.0.1:4173`.
Per verifiche isolate è possibile impostare `BUILD_PATH` su una cartella
temporanea, senza sovrascrivere la build locale.

## Pubblicazione

```sh
npm run deploy
```

Il comando genera la build e pubblica il contenuto di `build` sul ramo
`master`. Il ramo `main` contiene i sorgenti. Non cambiare il ramo di
pubblicazione senza aggiornare anche le impostazioni di GitHub Pages.
Prima della pubblicazione vengono eseguiti automaticamente tutti i controlli
di `npm run check`; un controllo fallito interrompe il deploy.

Il workflow GitHub Actions `Security and build` ripete installazione pulita,
controlli e build a ogni push su `main` e sulle pull request. Le azioni sono
fissate a commit specifici; il workflow ha soltanto accesso in lettura e non
pubblica il sito.

Configurare GitHub attraverso un credential manager o SSH. L'URL HTTPS
di origin deve essere privo di credenziali:

```text
https://github.com/matteotortora/matteotortora.github.io
```

Un token esposto va revocato su GitHub: rimuoverlo dal remote non lo revoca.
Non inserire segreti nel codice, nel lockfile o nelle variabili destinate al
browser. Le variabili `VITE_*` sono pubbliche nel sito compilato.

## Aggiornamenti di sicurezza

Eseguire `npm run audit` e aggiornare le dipendenze in modo intenzionale.
Evitare `npm audit fix --force` senza valutare i cambi di versione.
Quando si aggiorna Node, mantenere coerenti `.nvmrc`, `engines` e questa
documentazione, quindi ripetere installazione pulita, controlli e verifica
nel browser. Non applicare eccezioni all'audit solo per far passare i controlli.

## Attribuzione del template

Il design iniziale deriva da
[ReactPortfolioTemplate](https://github.com/paytonjewell/ReactPortfolioTemplate)
di [Payton Pierce](https://paytonpierce.dev/), successivamente adattato al
sito accademico di Matteo Tortora. Il README originale consente di spostare
il credito dal footer al README, mantenendo un collegamento al profilo
dell'autrice. L'attribuzione viene conservata qui.

L'icona ORCID proviene da
[Font Awesome Free](https://github.com/FortAwesome/Font-Awesome/blob/7.x/svgs/brands/orcid.svg),
copyright Fonticons, Inc., distribuita con licenza
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
