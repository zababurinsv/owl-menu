
let object = {}

object['varan-pictures'] = function (obj) {
  return new Promise(resolve => {
    let section = document.createElement('section')
    let header = document.createElement('header')
    let main = document.createElement('main')
    let footer = document.createElement('footer')

    let p00 = document.createElement('p')
    let slot00 = document.createElement('slot')
    p00.appendChild(slot00)

    let p01 = document.createElement('p')
    let slot01 = document.createElement('slot')
    p01.appendChild(slot01)

    let p02 = document.createElement('p')
    let slot02 = document.createElement('slot')
    p02.appendChild(slot02)

    let pFooter = document.createElement('p')
    let slotFooter = document.createElement('slot')
    pFooter.appendChild(slotFooter)

    section.appendChild(header)
    section.appendChild(main)
    section.appendChild(footer)

    slot00.name = 'varan-menu'
    slot01.name = 'varan-pictures'
    slotFooter.name = 'varan-footer'

    main.appendChild(p00)
    main.appendChild(p01)

    footer.appendChild(pFooter)

    obj['manifest']['varan-pictures'] = section
    document.body.appendChild(section)
    resolve(obj)
  })
}

async function init (obj) {
  if (!obj) { obj = {} }
  obj['manifest'] = object
  return obj
}

export default {
  init: init
}
