let currentAudioEnd = {};
function endSegment() {
  currentAudioEnd[this.id] = this.duration
  document.querySelectorAll('.poetry.text').forEach((e) => e.classList.remove('active'))
}

function playSegment(audio,start,end) {
  audio.currentTime = start
  currentAudioEnd[audio.id] = end
  audio.play()
}

function playText() {
  let tElem = document.getElementById(this.dataset.track)
  let audio = tElem.parentElement
  playSegment(audio,this.dataset.start,this.dataset.end)
  $(`#${audio.id}-carousel`).carousel(parseInt(this.dataset.image))
}

function playSlide() {
  let cue = document.getElementById(this.parentElement.dataset.cue)
  let track = cue.dataset.track
  let audio = document.getElementById(track).parentElement
  playSegment(audio,cue.dataset.start,cue.dataset.end)
}

function loadCues() {
  let track = this.track
  for (let j = 0; j < track.cues.length; ++j) {
    let cue = track.cues[j]
    let text = document.createElement('span')
      text.classList.add('poetry')
      text.classList.add('text')
      text.setAttribute('id',`track-${track.id}-cue-${cue.id}`)
      text.setAttribute('data-start',cue.startTime)
      text.setAttribute('data-end',cue.endTime)
      text.setAttribute('data-track',track.id)
      text.setAttribute('data-image',cue.id-1)
      text.innerHTML = cue.text
      document.getElementById("current-transcript").appendChild(text)
      text.addEventListener("mouseover", playText, false)
    }
}
function watchCues() {
  for (let c of this.track.activeCues) {
    document.querySelectorAll('.poetry.text').forEach((e) => e.classList.remove('active'))
    document.getElementById(`track-${this.track.id}-cue-${c.id}`).classList.add('active')
    $(`#${this.parentElement.id}-carousel`).carousel(parseInt(c.id)-1)
  }
}
function setupAudio() {
  document.querySelectorAll('audio').forEach((a) => {
    currentAudioEnd[a.id] = a.duration
    a.addEventListener('timeupdate',pauseAudio, false)
    a.addEventListener('ended',endSegment,false)
    a.addEventListener('pause',endSegment,false)
    $(`#${a.id}-carousel`).carousel({interval: false})
  })
  document.querySelectorAll('track').forEach((t) => {
    t.addEventListener("load", loadCues, false)
    t.addEventListener("cuechange", watchCues, false)
  })
  $(`.carousel-caption`).on('mouseover', playSlide)
}

function pauseAudio() {
  if (this.currentTime > currentAudioEnd[this.id]) {
    this.pause()
  }
}
setupAudio()
;
