let currentAudioEnd = {}
let currentCue = {}
let timers = []
let showAll = false
function endSegment() {
  currentAudioEnd[this.id] = this.duration
}

function playCue(audio,cue,withImage) {
  audio.currentTime = cue.dataset.start
  currentAudioEnd[audio.id] = cue.dataset.end
  currentCue[audio.id] = parseInt(cue.dataset.cue)
  audio.play()
  cue.classList.add('played')
  document.querySelectorAll('.poetry.control.step').forEach((e) => {e.classList.remove('disabled')})
  document.querySelectorAll('.poetry.control.play').forEach((e) => {e.classList.remove('disabled')})
  document.querySelectorAll('.poetry.control.repeat').forEach((e) => {e.classList.remove('disabled')})
  document.querySelectorAll('.poetry.control.restart').forEach((e) => {e.classList.remove('disabled')})
  if (withImage) {
    $(`#${audio.id}-carousel`).carousel(parseInt(cue.dataset.image))
  }
}

function restartAudio() {
  this.classList.add('disabled')
  document.querySelectorAll('.poetry.control.step').forEach((e) => {e.classList.remove('disabled')})
  document.querySelectorAll('.poetry.control.play').forEach((e) => {e.classList.add('disabled')})
  document.querySelectorAll('.poetry.control.repeat').forEach((e) => {e.classList.add('disabled')})
  let tElem = document.getElementById(this.dataset.track)
  let audio = tElem.parentElement
  currentCue[audio.id] = 0
  showAll = false
  document.querySelectorAll('.poetry.text').forEach((e) => e.classList.remove('active'))
  document.querySelectorAll('.poetry.text').forEach((e) => e.classList.remove('played'))
  $(`#${audio.id}-carousel`).carousel(0)
}

function playToCurrent() {
  document.querySelectorAll('.poetry.text').forEach((e) => e.classList.remove('played'))
  document.querySelectorAll('.poetry.text').forEach((e) => e.classList.add('small'))
  let tElem = document.getElementById(this.dataset.track)
  let audio = tElem.parentElement
  let cue = document.getElementById(`track-${tElem.id}-cue-${1}`)
  audio.currentTime = cue.dataset.start
  showAll = true
  audio.play()
  $(`#${audio.id}-carousel`).carousel(parseInt(cue.dataset.image))
}

function replayCurrent() {
  let tElem = document.getElementById(this.dataset.track)
  let audio = tElem.parentElement
  let lastCue = currentCue[audio.id] || 0
  let cue = document.getElementById(`track-${tElem.id}-cue-${lastCue}`)
  showAll = false
  playCue(audio,cue,true)
}

function playNext() {
  let tElem = document.getElementById(this.dataset.track)
  let audio = tElem.parentElement
  let lastCue = currentCue[audio.id] || 0
  let nextCue = lastCue + 1
  let cue = document.getElementById(`track-${tElem.id}-cue-${nextCue}`)
  if (cue) {
    document.querySelectorAll('.poetry.text').forEach((e) => e.classList.remove('played'))
    document.querySelectorAll('.poetry.text').forEach((e) => e.classList.remove('small'))
    showAll = false
    playCue(audio,cue,true)
  } else {
    this.classList.add('disabled')
  }
}

function playText() {
  let tElem = document.getElementById(this.dataset.track)
  let audio = tElem.parentElement
  showAll = false
  playCue(audio,this,true)
}

function playSlide() {
  let cue = document.getElementById(this.parentElement.dataset.cue)
  let track = cue.dataset.track
  let audio = document.getElementById(track).parentElement
  showAll = false
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
  if (playToCurrent) {
    for (let c of this.track.activeCues) {
      //document.querySelectorAll('.poetry.text').forEach((e) => e.classList.remove('active'))
      //document.getElementById(`track-${this.track.id}-cue-${c.id}`).classList.add('active')
      document.getElementById(`track-${this.track.id}-cue-${c.id}`).classList.add('played')
      $(`#${this.parentElement.id}-carousel`).carousel(parseInt(c.id))
    }
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
    // timeupdate isn't consistent or granular enough so we set our own
    // interval timer whenever we start to play
    a.addEventListener('play',checkAudio,false)
    a.addEventListener('timeupdate',pauseAudio, false)
    a.addEventListener('ended',endSegment,false)
    a.load()
    $(`#${a.id}-carousel`).carousel({interval: false})
  })
  $('.carousel-caption').on('mouseover', playSlide)
  $('.poetry.control.step').on('click', playNext)
  $('.poetry.control.step').on('touchend', playNext)
  $('.poetry.control.play').on('click', playToCurrent)
  $('.poetry.control.play').on('touchend', playToCurrent)
  $('.poetry.control.restart').on('click', restartAudio)
  $('.poetry.control.restart').on('touchend', restartAudio)
  $('.poetry.control.repeat').on('click', replayCurrent)
  $('.poetry.control.repeat').on('touchend', replayCurrent)
  $('.poetry.control.settings').on('click', toggleSettings)
  $('.poetry.control.settings').on('touchend', toggleSettings)
  $('#toggleImages').on('click',toggleImages)
  $('#toggleImages').on('touchend',toggleImages)
  $('#togglePlayer').on('click',togglePlayer)
  $('#togglePlayer').on('touchend',togglePlayer)
}

function toggleSettings() {
  document.querySelector('.poetry.settings-form').classList.toggle('visible')
}

function toggleImages() {
  document.querySelector('.carousel').classList.toggle('disabled')
}

function togglePlayer() {
  document.querySelectorAll('audio').forEach((a) => {
    if (a.getAttribute('controls') || a.getAttribute('controls') === "") {
      a.removeAttribute('controls')
    } else {
      a.setAttribute('controls',true)
    }
  })
}

function checkAudio() {
  let audio = this
  timers.push(setInterval(function(){
    pauseAudio.bind(audio)()
  },2))
}

function pauseAudio() {
  console.log(this.currentTime)
  console.log(currentAudioEnd)
  if (this.currentTime > currentAudioEnd[this.id]) {
    this.pause()
    // make sure we clear out all intervals in case multiple were started
    while (timers.length> 0) {
      clearInterval(timers.pop())
    }
  }
}
