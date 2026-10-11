# Anishka — Chapter 21

A romantic birthday website with four scrollable chapters:

1. **Starting page** — choose one of 12 soundtrack options, then enter the site.
2. **Our little universe** — animated universe, tappable nicknames that become the universe centerpiece, and an automatic photo slideshow.
3. **A letter for you** — a personal birthday letter for Anishka.
4. **Make a wish** — a redesigned three-tier cake with piped icing, five candles, candlelight, a wish animation, and closing birthday message.

Tap/click anywhere—including the nickname buttons—to create floating heart, penguin, butterfly, and sparkle emojis. The selected song continues across the chapters. The visitor cannot upload or edit the site's content.

## Add the soundtrack

Put your own audio files in `public/music/`. The 12 default song titles and expected filenames are listed in `public/music/README.txt`. Edit `src/personalize.js` if you want different songs or filenames. The song selector appears only on the starting page.

Browsers often block sound autoplay until a user gesture. The Enter button attempts to start the selected track, and the music keeps looping while the visitor scrolls through the site.

## Add your photos

Put your photos in `public/photos/` and add their paths to the `birthdayPhotos` array in `src/personalize.js`. The slideshow runs automatically on the universe page.

## Run on Windows

Open PowerShell in this folder and run:

```powershell
npm.cmd install
npm.cmd run dev
```

To make a production build:

```powershell
npm.cmd run build
```

Deploy the generated `dist` folder to a static hosting service when ready. Check the live website on both phone and laptop before sharing.
