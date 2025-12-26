class CassettePlayer {
  constructor() {
    this.audio = document.getElementById('audio');
    this.insertSound = document.getElementById('insertSound');
    this.cassette = document.getElementById('cassette');
    this.tapePath = document.getElementById('tapePath');

    this.leftReel = document.querySelector('.reel.left');
    this.rightReel = document.querySelector('.reel.right');

    this.playBtn = document.getElementById('play');
    this.stopBtn = document.getElementById('stop');
    this.rewBtn = document.getElementById('rewind');
    this.loadBtn = document.getElementById('load');

    this.inserted = false;
    this.playing = false;
    this.rewinding = false;

    this.audio.volume = 0;

    this.bind();
    this.animate();
  }

  bind() {
    this.loadBtn.onclick = () => this.toggleCassette();
    this.playBtn.onclick = () => this.play();
    this.stopBtn.onclick = () => this.stop();
    this.rewBtn.onclick = () => this.rewind();
    this.audio.onended = () => this.stop();
  }

  toggleCassette() {
    this.stop();

    this.inserted = !this.inserted;
    this.cassette.classList.toggle('inserted', this.inserted);

    // Insert sound (iPad-safe, user-triggered)
    this.insertSound.currentTime = 0;
    this.insertSound.play();

    this.audio.currentTime = 0;
  }

  play() {
    if (!this.inserted || this.playing) return;

    this.playing = true;
    this.rewinding = false;
    this.playBtn.classList.add('locked');

    // Slight motor delay for realism
    setTimeout(() => {
      this.audio.play();
      this.fadeIn();
    }, 500);
  }

  stop() {
    this.playing = false;
    this.rewinding = false;
    this.playBtn.classList.remove('locked');
    this.fadeOut();
  }

  rewind() {
    if (!this.inserted) return;
    this.stop();
    this.rewinding = true;

    const r = setInterval(() => {
      if (!this.rewinding || this.audio.currentTime <= 0) {
        clearInterval(r);
        this.rewinding = false;
      } else {
        this.audio.currentTime -= 0.25;
      }
    }, 30);
  }

  fadeIn() {
    let v = 0;
    const f = setInterval(() => {
      v += 0.02;
      this.audio.volume = Math.min(v, 1);
      if (v >= 1) clearInterval(f);
    }, 60);
  }

  fadeOut() {
    let v = this.audio.volume;
    const f = setInterval(() => {
      v -= 0.02;
      this.audio.volume = Math.max(v, 0);
      if (v <= 0) {
        clearInterval(f);
        this.audio.pause();
      }
    }, 40);
  }

  animate() {
    let l = 0, r = 0;

    const loop = () => {
      if (this.playing) {
        l += 0.4;
        r += 1.2;
      } else if (this.rewinding) {
        l -= 1.6;
        r -= 0.8;
      }

      this.leftReel.style.transform = `rotate(${l}deg)`;
      this.rightReel.style.transform = `rotate(${r}deg)`;

      const t = this.audio.duration
        ? this.audio.currentTime / this.audio.duration
        : 0;

      const bend = 20 + t * 30;
      this.tapePath.setAttribute(
        "d",
        `M30 30 C90 ${30 - bend}, 210 ${30 + bend}, 270 30`
      );

      requestAnimationFrame(loop);
    };

    loop();
  }
}

new CassettePlayer();
