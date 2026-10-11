import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDown, Heart, Sparkles, Music2, ChevronDown, Star } from 'lucide-react';
import { birthdaySongs, birthdayPhotos } from './personalize.js';
import './style.css';

const touchEmojis = ['🩷', '💗', '🐧', '✨', '🦋', '💖', '🌷', '💕', '🎀', '🤍', '⭐', '🐻', '💌'];
const nicknames = ['Anishka', 'Anni', 'Penguin', 'Sweetu', 'Sweetie', 'Shawti', 'Cutu', 'Cutie', 'Betu', 'Wifeyy', 'Darling'];

function App() {
  const [slide, setSlide] = useState(0);
  const [touches, setTouches] = useState([]);
  const [songIndex, setSongIndex] = useState(0);
  const [musicStarted, setMusicStarted] = useState(false);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [cakeLit, setCakeLit] = useState(false);
  const [blownCandles, setBlownCandles] = useState([]);
  const [wishInProgress, setWishInProgress] = useState(false);
  const wishTimers = useRef([]);
  const [selectedNickname, setSelectedNickname] = useState('Penguin');
  const audioRef = useRef(null);
  const touchId = useRef(0);
  const selectedSong = birthdaySongs[songIndex] || birthdaySongs[0];

  useEffect(() => () => wishTimers.current.forEach(window.clearTimeout), []);

  const makeWish = () => {
    if (cakeLit || wishInProgress) return;
    setWishInProgress(true);
    setBlownCandles([]);
    wishTimers.current.forEach(window.clearTimeout);
    wishTimers.current = [];
    [0, 1, 2, 3, 4].forEach((candleIndex, order) => {
      wishTimers.current.push(window.setTimeout(() => {
        setBlownCandles(current => current.includes(candleIndex) ? current : [...current, candleIndex]);
        if (order === 4) {
          window.setTimeout(() => { setCakeLit(true); setWishInProgress(false); }, 360);
        }
      }, 260 + order * 330));
    });
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (birthdayPhotos.length > 1) setSlide(current => (current + 1) % birthdayPhotos.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!touches.length) return;
    const timers = touches.map(item => window.setTimeout(() => setTouches(current => current.filter(t => t.id !== item.id)), 1550));
    return () => timers.forEach(window.clearTimeout);
  }, [touches]);

  useEffect(() => {
    if (!musicStarted || !audioRef.current || !selectedSong) return;
    audioRef.current.src = selectedSong.src;
    audioRef.current.load();
    audioRef.current.play().then(() => setAudioBlocked(false)).catch(() => setAudioBlocked(true));
  }, [songIndex, musicStarted, selectedSong]);

  const makeTouch = event => {
    if (event.target.closest('select, a')) return;
    const item = { id: ++touchId.current, x: event.clientX, y: event.clientY, emoji: touchEmojis[Math.floor(Math.random() * touchEmojis.length)], tilt: Math.round(Math.random() * 36 - 18) };
    setTouches(current => [...current.slice(-22), item]);
  };

  const goTo = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  const begin = () => {
    setMusicStarted(true);
    if (audioRef.current) {
      audioRef.current.src = selectedSong.src;
      audioRef.current.load();
      audioRef.current.play().then(() => setAudioBlocked(false)).catch(() => setAudioBlocked(true));
    }
    goTo('universe');
  };

  return <div className="birthday-site" onClick={makeTouch}>
    <audio ref={audioRef} loop preload="auto" />
    <div className="grain" aria-hidden="true" />
    <div className="ambient ambient-a" aria-hidden="true" /><div className="ambient ambient-b" aria-hidden="true" />
    <div className="touch-layer" aria-hidden="true">{touches.map(t => <span key={t.id} className="touch-emoji" style={{ left: t.x, top: t.y, '--tilt': `${t.tilt}deg` }}>{t.emoji}</span>)}</div>

    <header className="site-header"><button className="mini-brand" onClick={() => goTo('start')}><span className="brand-heart">♡</span><span>ANISHKA <i>·</i> XXI</span></button><div className="header-note"><span className="status-dot" /> A LITTLE WORLD MADE FOR YOU</div></header>

    <section id="start" className="hero start-page" aria-label="Birthday greeting">
      <div className="hero-stars star-one">✦</div><div className="hero-stars star-two">✧</div><div className="hero-stars star-three">✧</div><div className="hero-stars star-four">✦</div>
      <div className="hero-orbit orbit-one"/><div className="hero-orbit orbit-two"/>
      <div className="hero-content">
        <p className="eyebrow"><span /> A LITTLE SURPRISE FOR MY GIRL <span /></p>
        <div className="birthday-number">21</div>
        <p className="number-caption">ELEVEN NICKNAMES · A MILLION FEELINGS · ONE YOU</p>
        <h1>Happy Birthday,<br/><em>Anishka.</em></h1>
        <p className="hero-copy">For my Anni, my Penguinn, my sweetu, my cutu.<br/>For every version of you — soft, chaotic, overthinking, and impossible not to love.</p>
        <div className="song-picker-wrap"><label htmlFor="birthday-song"><Music2 size={15}/> PICK THE SOUNDTRACK OF YOUR LITTLE UNIVERSE</label><select id="birthday-song" value={songIndex} onChange={e => setSongIndex(Number(e.target.value))}>{birthdaySongs.map((song, index) => <option value={index} key={song.src}>{String(index + 1).padStart(2, '0')} · {song.title}</option>)}</select><p className="song-note">Choose a song, then keep it playing as you wander through every page ♡</p></div>
        <button className="enter-button" onClick={begin}><Heart size={16} fill="currentColor" /> Enter your little universe <span>↗</span></button>
        <p className="sound-note">♫ made to be explored slowly</p>
        {audioBlocked && <p className="audio-hint">If the song didn't start, tap the enter button once more ♡</p>}
      </div>
      <div className="scroll-hint" onClick={() => goTo('universe')}><span>YOUR LITTLE UNIVERSE AWAITS</span><ArrowDown size={15}/></div>
      <div className="hero-bottom-left">A WHOLE PAGE FULL OF FEELINGS</div><div className="hero-bottom-right">MADE WITH ♡ FOR YOU</div>
    </section>

    <main id="universe" className="universe-section page-section">
      <div className="section-topline"><span>01 — THE UNIVERSE PAGE</span><span>YOU ARE THE MAIN CHARACTER ♡</span></div>
      <div className="universe-intro"><p className="eyebrow"><Sparkles size={14}/> IN A UNIVERSE FULL OF PEOPLE</p><h2>I'd still look for<br/><em>my favourite star.</em></h2><p className="section-copy">And somehow, in all this chaos, the universe gave me you.</p></div>
      <div className="orbit-scene" aria-label="A little animated universe"><div className="planet-ring ring-a"/><div className="planet-ring ring-b"/><div className="planet planet-one">♡</div><div className="planet planet-two">✦</div><div className="planet planet-three">✧</div><div className={`universe-core ${selectedNickname !== 'Penguin' ? 'name-selected' : ''}`} key={selectedNickname}><span>MY FAVOURITE NAME FOR YOU</span><strong>{selectedNickname}</strong><small>{selectedNickname === 'Penguin' ? 'MY LITTLE CONSTELLATION 🐧' : 'TAPPED WITH ALL MY LOVE ♡'}</small></div><span className="universe-star us-one">✦</span><span className="universe-star us-two">✧</span><span className="universe-star us-three">⋆</span><span className="universe-star us-four">✦</span></div>
      <p className="nickname-instruction">Tap a name. Watch your little universe call you that. ✧</p><div className="nickname-cloud">{nicknames.map((name, i) => <button type="button" key={name} aria-pressed={selectedNickname === name} onClick={() => setSelectedNickname(name)} className={`nickname n-${i + 1} ${selectedNickname === name ? 'selected' : ''}`}>{name}{i === 2 ? ' 🐧' : i === 9 ? ' ♡' : ''}</button>)}</div>
      <p className="universe-whisper">Every name is a different way of saying: <em>you're precious to me.</em></p>
      <div className="film-divider"><span>✧</span><i>AND HERE ARE SOME LITTLE MOMENTS I KEEP CLOSE</i><span>✧</span></div>
      <div className="gallery-heading"><p className="eyebrow"><Sparkles size={14}/> THE ANISHKA ARCHIVE</p><h3>Little memories.<br/><em>Endless feelings.</em></h3><p className="gallery-intro">A tiny photo film of you, us, and the moments worth keeping forever.</p></div>
      <div className="memory-gallery"><div className="photo-stage">
        {birthdayPhotos.length > 0 ? birthdayPhotos.map((src, index) => <img key={src} src={src} alt="A favourite birthday memory" className={`memory-photo ${index === slide ? 'active' : ''}`} />) : <div className="photo-placeholder"><div className="placeholder-orbit"/><div className="placeholder-heart">♡</div><p>YOUR FAVOURITE MOMENTS</p><span>Your photos will live here, darling</span></div>}
        <div className="photo-overlay"/><div className="photo-caption"><span>FOR MY {selectedNickname.toUpperCase()}</span><strong>you make ordinary feel golden.</strong></div>
      </div><div className="memory-progress" aria-hidden="true"><span style={{width: `${100 / Math.max(1, birthdayPhotos.length)}%`, transform: `translateX(${slide * 100}%)`}} /></div></div>
      <p className="gallery-footnote">little reminder, darling: you are loved more than your brain lets you believe <span>✧</span></p>
      <button className="page-next" onClick={() => goTo('letter')}>Next, a letter for you <span>↓</span></button>
    </main>

    <section id="letter" className="letter-section page-section">
      <div className="section-topline"><span>02 — A LETTER, JUST FOR YOU</span><span>OPEN WHEN YOU NEED A HUG ♡</span></div>
      <article className="letter-paper"><div className="letter-stamp">TO MY<br/>FAVOURITE<br/>HUMAN <span>♡</span></div><p className="letter-date">A little letter for your 21st birthday</p><h2>My dearest<br/><em>Sweetie,</em></h2>
        <p>First of all, happy birthday, my Anni. My sweetie, my cutie, my betu, my darling, my wifeyy — my Penguin. I don't think one name could ever fit all the little versions of you that I adore.</p>
        <p>I know your mind can get so loud sometimes. You overthink the tiny things, replay conversations, imagine a hundred different endings, and feel things much more deeply than you let on. And then, out of nowhere, your chaotic side appears and makes everything ten times funnier. Somehow, both versions are so wonderfully, completely <em>you</em>.</p>
        <p>I hope this new chapter is gentler with your heart. I hope you learn to give yourself the same patience you give everyone else. When your thoughts tell you that you're not enough, I hope life keeps finding little ways to remind you that you are. You don't have to be cheerful every second, have everything figured out, or hide the parts of you that feel too much.</p>
        <p>You can be emotional. You can be a mess. You can change your mind, cry over something small, laugh at the worst possible moment, or need reassurance more than once. You deserve kindness on the hard days too — not just when you're easy to understand.</p>
        <p>And please, never forget how much magic you bring just by being yourself. The softness, the drama, the silliness, the caring, the overthinking, the random chaos — all of it makes you the person I want to celebrate today.</p>
        <p>So here's to 21: to more peace in your head, warmth in your heart, dreams that come true, and moments that make you feel safe, seen, and loved. I hope you get to meet even more beautiful versions of yourself this year.</p>
        <p className="letter-final">No matter which nickname I use, the wish behind it is the same: may you always know how loved you are. ♡</p><div className="letter-sign">Happy birthday, my Penguinn.<br/><em>Always rooting for you,</em><br/><strong>your Pranju ♡</strong></div><div className="letter-bottom-mark">✦ &nbsp; 21 &nbsp; ✦</div>
      </article>
      <button className="page-next" onClick={() => goTo('cake')}>One last little surprise <span>↓</span></button>
    </section>

    <section id="cake" className="cake-section page-section">
      <div className="section-topline"><span>03 — MAKE A WISH</span><span>THE CANDLE IS WAITING FOR YOU</span></div>
      <p className="eyebrow"><Sparkles size={14}/> A WISH FOR MY BIRTHDAY GIRL</p><h2>Twenty-one looks<br/><em>lovely on you.</em></h2><p className="cake-copy">Close your eyes for a second, sweetie. Think of the thing your heart has been quietly wishing for. You don't have to tell anyone. Just make a little wish for yourself.</p>
      <div className={`cake-scene ${cakeLit ? 'wish-made' : ''}`}>
        <div className="cake-glow"/><div className="cake-halo"/><div className="cake-sparkle cs-one">✧</div><div className="cake-sparkle cs-two">✦</div><div className="cake-sparkle cs-three">⋆</div><div className="cake-sparkle cs-four">✧</div>
        <div className={`candle-row ${wishInProgress ? 'candle-row-blowing' : ''}`} aria-hidden="true">{[0,1,2,3,4].map((n) => { const isBlown = blownCandles.includes(n); return <div className={`candle candle-${n + 1} ${isBlown ? 'candle-blown' : ''}`} key={n} style={{'--blow-delay': `${n * 70}ms`}}><span className={`flame ${isBlown ? 'flame-out' : ''}`}/><span className={`candle-smoke ${isBlown ? 'smoke-rise' : ''}`}/><span className="candle-wick"/></div>; })}</div>
        <div className="cake-topper"><span className="topper-heart">✦</span><strong>21</strong><span className="topper-heart">✦</span></div>
        <div className="cake-layer layer-top"><div className="icing-drips"/><div className="cake-decor">✦　♡　✦　♡　✦</div><div className="cake-pearls"/><div className="cake-rosette-row"><i/><i/><i/><i/><i/></div></div>
        <div className="cake-layer layer-middle"><div className="icing-drips"/><div className="cake-decor">♡　✧　♡　✧　♡</div><div className="cake-pearls"/><div className="cake-rosette-row"><i/><i/><i/><i/><i/><i/></div></div>
        <div className="cake-layer layer-bottom"><div className="icing-drips"/><div className="cake-decor">✦　♡　✦　♡　✦</div><div className="cake-pearls"/><div className="cake-rosette-row"><i/><i/><i/><i/><i/><i/><i/></div></div>
        <div className="cake-plate"><span>MADE WITH LOVE · ANNI 21</span></div>
        {wishInProgress && <div className="wish-wind" aria-hidden="true"><i/><i/><i/><i/><i/></div>}
        {cakeLit && <div className="wish-burst" aria-hidden="true"><span>✧</span> YOUR WISH IS IN THE UNIVERSE <span>✧</span><b>♡　✦　♡　✦　♡</b></div>}
        {cakeLit && <div className="wish-confetti" aria-hidden="true">{Array.from({length:18}, (_,i) => <i key={i} style={{'--i':i}}>{['✦','♡','✧','·'][i%4]}</i>)}</div>}
      </div>
      <button className={`wish-button ${cakeLit ? 'wish-button-done' : ''} ${wishInProgress ? 'wish-button-busy' : ''}`} onClick={makeWish} disabled={cakeLit || wishInProgress}><Star size={16} fill="currentColor"/> {cakeLit ? 'WISH MADE — MAY IT FIND YOU ✨' : wishInProgress ? 'YOUR WISH IS TAKING FLIGHT…' : 'CLOSE YOUR EYES & MAKE A WISH'} <span>♡</span></button>
      <p className={`wish-afterline ${cakeLit ? 'wish-afterline-visible' : ''}`} aria-live="polite">{cakeLit ? 'Every little flame is out, my sweetie. May the universe be gentle with your wish. ♡' : wishInProgress ? 'One candle for every little hope your heart is holding…' : 'Close your eyes, make your wish quietly, then tap once to blow out the candles.'}</p>
      <div className="wish-message"><p>Dear universe, please be extra gentle with my girl.</p><p>Give my darling reasons to smile, courage for the uncertain days, people who make her feel safe, and dreams that feel even better when they come true.</p><p>And when she forgets how special she is, please remind her. Again and again. ♡</p></div>
      <div className="closing-heart">♡</div><h3 className="final-happy">Happy 21st birthday,<br/><em>my Anishka.</em></h3><p className="final-names">Anni · Penguinn · Sweetu · Sweetie · Shawti · Cutu · Cutie · Betu · Wifeyy · Darling</p><p className="final-sign">You deserve a universe of good things. Always. ♡</p><button className="back-top" onClick={() => goTo('start')}>Back to the beginning ↑</button>
    </section>
    <footer className="site-footer"><span>ANISHKA · CHAPTER 21</span><span>MADE WITH LOVE & A LITTLE STARDUST ♡</span></footer>
  </div>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
