


















// Have this available on download for code camp. 
// Designing our sound so it sounds better for each note played.
const playKey = (key) => {
    if (!lettersToKeys[key]) {
        return;
    }

    const osc = audioContext.createOscillator();
    const noteGainNode = audioContext.createGain();
    noteGainNode.connect(audioContext.destination);

    const zeroGain = 0.0001;
    const maxGain = 0.5;
    const sustainedGain = 0.04;

    noteGainNode.gain.value = zeroGain;

    const setAttack = () => 
        noteGainNode.gain.exponentialRampToValueAtTime(
            maxGain,
            audioContext.currentTime + 0.01
        );
    
    const setDecay = () =>
         noteGainNode.gain.exponentialRampToValueAtTime(
            sustainedGain,
            audioContext.currentTime + 1
            );

    const setRelease = () =>
        noteGainNode.gain.exponentialRampToValueAtTime(
            zeroGain,
            audioContext.currentTime + 2
        );

    setAttack();
    setDecay();
    setRelease();


    osc.connect(noteGainNode);
    osc.type = "triangle";

    const freq = getHz(lettersToKeys[key].note, (lettersToKeys[key].octaveOffset || 0) + 1);

    if (Number.isFinite(freq)) {
        osc.frequency.value = freq;
    }

    lettersToKeys[key].element.classList.add("pressed");
    pressedNotes.set(key, osc);
    pressedNotes.get(key).start();
};

// Lets our keyboard know how long to play a note for once we stop pressing a key.
const stopKey = (key) => {
    if (!lettersToKeys[key]) {
      return;
    }
    
    lettersToKeys[key].element.classList.remove("pressed");
    const osc = pressedNotes.get(key);
  
    if (osc) {
      setTimeout(() => {
        osc.stop();
      }, 3000);
  
      pressedNotes.delete(key);
    }
  };

  document.addEventListener("keydown", (e) => {
    const eventKey = e.key.toUpperCase();
    const key = eventKey === "," ? "comma" : eventKey;
    
    if (!key || pressedNotes.get(key)) {
      return;
    }
    playKey(key);
  });
  
  document.addEventListener("keyup", (e) => {
    const eventKey = e.key.toUpperCase();
    const key = eventKey === "," ? "comma" : eventKey;
    
    if (!key) {
      return;
    }
    stopKey(key);
  });
  
  for (const [key, { element }] of Object.entries(lettersToKeys)) {
    element.addEventListener("mousedown", () => {
      playKey(key);
      clickedKey = key;
    });
  }
  
  document.addEventListener("mouseup", () => {
    stopKey(clickedKey);
  });