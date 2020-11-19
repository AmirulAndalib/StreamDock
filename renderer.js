// Imports and variable declarations
const { ipcRenderer, BrowserView, app } = require('electron')
const $ = require('jquery')
let serviceList = []
let winMax = false
let isMac = false

// Invoke services load
setDefaultServices()
loadServices()

// Open first service
ipcRenderer.send('service-change', serviceList[0].url)

// TODO: Setting: Optop on startup
// Set ontop
ipcRenderer.send('ontop-lock')

// TODO: Get from local storaage
// Iterate through stored services and create buttons/menu entries
function loadServices () {
  if (isMac) {
    $('.ontop-button').show()
    serviceList.forEach(function (serv) {
      if (serv.active) {
        $('.service-button-host').append(`<div class="service-button" data-val="${serv.id}" data-url="${serv.url}" title="${serv.title}" style="color:${serv.color}; background-color:${serv.bgColor};">${serv.glyph}</div>`)
      }
    })
  }
}

function setDefaultServices () {
  serviceList = [
    { id: 'yt', active: true, glyph:'Y', title: 'YouTube', url: 'https://www.youtube.com', color: '#ff0000', bgColor: '#ffffff' },
    { id: 'tv', active: true, glyph:'T', title: 'YouTube TV', url: 'https://tv.youtube.com', color: '#ff0000', bgColor: '#ffffff' },
    { id: 'nf', active: true, glyph:'N', title: 'Netflix', url: 'https://www.netflix.com', color: '#ffffff', bgColor: '#db272e' },
    { id: 'hl', active: true, glyph:'H', title: 'Hulu', url: 'https://www.hulu.com', color: '#ffffff', bgColor: '#1ce783' },
    { id: 'ap', active: true, glyph:'P', title: 'Amazon Prime TV', url: 'https://www.amazon.com/gp/video/storefront', color: '#ffffff', bgColor: '#00aee4' },
    { id: 'dp', active: true, glyph:'D', title: 'Disney+', url: 'https://www.disneyplus.com/home', color: '#ffffff', bgColor: '#1a3676' },
    { id: 'pc', active: true, glyph:'P', title: 'Peacock', url: 'https://www.peacocktv.com/watch/home', color: '#000000', bgColor: '#ffffff' },
    { id: 'ab', active: true, glyph:'A', title: 'ABC', url: 'https://abc.com', color: '#ffffff', bgColor: '#000000' },
    { id: 'cb', active: true, glyph:'C', title: 'CBS', url: 'https://cbs.com', color: '#0095f7', bgColor: '#ffffff' },
    { id: 'hm', active: true, glyph:'H', title: 'HBO Max', url: 'https://play.hbomax.com', color: '#ffffff', bgColor: '#7e5ee4' },
    { id: 'ep', active: false, glyph:'E', title: 'ESPN+', url: 'https://plus.espn.com', color: '#000000', bgColor: '#ffaf00' }
  ]
}

// TODO: Consider moving to main
// Window max/restore on header double click
function maxRestoreWindow () {
  if (!winMax) {
    ipcRenderer.send('win-max')
    winMax = true
  } else {
    ipcRenderer.send('win-restore')
    winMax = false
  }
}

// Toggle keep on top
$('.ontop-button').on('click', function () {
  if ($(this).hasClass('ontop-locked')) {
    $(this).removeClass('ontop-locked').addClass('ontop-unlocked')
    ipcRenderer.send('ontop-unlock')
  } else {
    $(this).removeClass('ontop-unlocked').addClass('ontop-locked')
    ipcRenderer.send('ontop-lock')
  }
})

// Header double-click handler
$('.header-bar').on('dblclick', () => {
  maxRestoreWindow()
})

// TODO: Open services in new window
// TODO: Setting: let user pick whether or not a new window is created
// Service selector click handler
$('.service-button').on('click', function () {
  ipcRenderer.send('service-change', $(this).data('url'))
})

// Settings close restore View
$('#settings-modal').on('hidden.bs.modal', () => {
  ipcRenderer.send('view-show')
})

// TODO: Build list of services and persist
// TODO: Setting: let users pick and add services
// TODO: Setting: let users pick color combo of service buttons

// Settings invoke
ipcRenderer.on('load-settings', () => {
  ipcRenderer.send('view-hide')
  loadSettingsModal()
  $('#settings-modal').modal('show')
})

function loadSettingsModal() {
  $('#collapse-general, #collapse-services').collapse('hide')
  $('#input-agent').val('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.80 Safari/537.36')
  $('#settings-services-available').empty()
  serviceList.forEach(function (serv) {
    const checked = serv.active ? 'checked' : ''
    $('#settings-services-available').append(
      `<div class="service-host">
        <div class="form-check">
          <input type="checkbox" class="service-check" id="check-${serv.id}" data-val="${serv.id}" ${checked}>
          <img class="service-${serv.id}" src="./res/serv_logos/small/${serv.id}.png" for="check-${serv.id}"></img>
        </div>
      </div>`)
  })
}

function saveSettings () {
  $('.service-check').each(function () {
    if ($(this).is(':checked')) {
      console.log($(this).data('val'))
    }
  })
}

function loadDefaultSettings () {

}

$('#settings-save-button').on('click', () => {
  saveSettings()
})

$('#settings-default-button').on('click', () => {
  loadDefaultSettings()
})
