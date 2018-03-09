let currentAudioEnd = {}
let currentCue = {}
function endSegment() {
  currentAudioEnd[this.id] = this.duration
  document.querySelectorAll('.poetry.control.play').forEach((e) => {e.classList.add('disabled')})
  //document.querySelectorAll('.poetry.text').forEach((e) => e.classList.remove('active'))
}

function playCue(audio,cue,withImage) {
  audio.currentTime = cue.dataset.start
  currentAudioEnd[audio.id] = cue.dataset.end
  currentCue[audio.id] = parseInt(cue.dataset.cue)
  audio.play()
  document.querySelectorAll('.poetry.control.play').forEach((e) => {e.classList.remove('disabled')})
  document.querySelectorAll('.poetry.control.restart').forEach((e) => {e.classList.remove('disabled')})
  if (withImage) {
    $(`#${audio.id}-carousel`).carousel(parseInt(cue.dataset.image))
  }
}

function restartAudio() {
  this.classList.add('disabled')
  document.querySelectorAll('.poetry.control.play').forEach((e) => {e.classList.add('disabled')})
  let tElem = document.getElementById(this.dataset.track)
  let audio = tElem.parentElement
  currentCue[audio.id] = 0
  document.querySelectorAll('.poetry.text').forEach((e) => e.classList.remove('active'))
  document.querySelectorAll('.poetry.text').forEach((e) => e.classList.remove('played'))
  $(`#${audio.id}-carousel`).carousel(0)
}

function playToCurrent() {
  let tElem = document.getElementById(this.dataset.track)
  let audio = tElem.parentElement
  if (currentAudioEnd[audio.id] < audio.duration) {
    let cue = document.getElementById(`track-${tElem.id}-cue-${1}`)
    audio.currentTime = cue.dataset.start
    audio.play()
    $(`#${audio.id}-carousel`).carousel(parseInt(cue.dataset.image))
  }
}

function playNext() {
  let tElem = document.getElementById(this.dataset.track)
  let audio = tElem.parentElement
  let lastCue = currentCue[audio.id] || 0
  let nextCue = lastCue + 1
  let cue = document.getElementById(`track-${tElem.id}-cue-${nextCue}`)
  playCue(audio,cue,true)
}

function playText() {
  let tElem = document.getElementById(this.dataset.track)
  let audio = tElem.parentElement
  playCue(audio,this,true)
}

function playSlide() {
  let cue = document.getElementById(this.parentElement.dataset.cue)
  let track = cue.dataset.track
  let audio = document.getElementById(track).parentElement
  playCue(audio,cue,false)
}

function loadCues() {
  let track = this.track
  for (let j = 0; j < track.cues.length; ++j) {
    let cue = track.cues[j]
    let text = document.createElement('span')
      text.classList.add('poetry')
      text.classList.add('text')
      text.setAttribute('id',`track-${track.id}-cue-${cue.id}`)
      text.setAttribute('data-cue',cue.id)
      text.setAttribute('data-start',cue.startTime)
      text.setAttribute('data-end',cue.endTime)
      text.setAttribute('data-track',track.id)
      text.setAttribute('data-image',cue.id)
      text.innerHTML = cue.text
      document.getElementById("current-transcript").appendChild(text)
      text.addEventListener("mouseover", playText, false)
    }
}
function watchCues() {
  for (let c of this.track.activeCues) {
    //document.querySelectorAll('.poetry.text').forEach((e) => e.classList.remove('active'))
    //document.getElementById(`track-${this.track.id}-cue-${c.id}`).classList.add('active')
    document.getElementById(`track-${this.track.id}-cue-${c.id}`).classList.add('played')
    $(`#${this.parentElement.id}-carousel`).carousel(parseInt(c.id))
  }
}
function setupAudio() {
  document.querySelectorAll('track').forEach((t) => {
    if (t.readyState === 2) {
      loadCues.bind(t)()
    }
    t.addEventListener("load", loadCues, false)
    t.addEventListener("cuechange", watchCues, false)
  })
  document.querySelectorAll('audio').forEach((a) => {
    currentAudioEnd[a.id] = a.duration
    a.addEventListener('timeupdate',pauseAudio, false)
    a.addEventListener('ended',endSegment,false)
    a.addEventListener('loadeddata',false)
    a.load()
    $(`#${a.id}-carousel`).carousel({interval: false})
  })
  $('.carousel-caption').on('mouseover', playSlide)
  $('.poetry.control.step').on('click', playNext)
  $('.poetry.control.play').on('click', playToCurrent)
  $('.poetry.control.restart').on('click', restartAudio)
  $('.poetry.control.images').on('click', toggleImages)
}

function toggleImages() {
  document.querySelector('.carousel').classList.toggle('disabled')

}

function pauseAudio() {
  if (this.currentTime >= currentAudioEnd[this.id]) {
    this.pause()
  }
}
;
