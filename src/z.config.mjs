import manifest from './manifest/manifest.mjs'
import isEmpty from './static/is-empty.mjs'

function getListObject (id, type, obj, ...args) {
  return new Promise(function (resolve, reject) {
    if (id === `components`) {
      let x = []
      x.push('varan-editor')
      resolve(x)
    }
    if (id === `tags`) {
      let tags = []
      tags.push('div')
      tags.push('section')
      tags.push('style')
      tags.push('script')
      resolve(tags)
    }
  })
}

(async () => {
  return window
})()
  .then((win) => {
    (async (win) => {
      let white = []
      let id = 'this'
      let type = 'type'
      let property = 'property'
      let parserProperty = []
      let components = []
      components['external'] = undefined
      components['components'] = await getListObject('components')
      components['tags'] = await getListObject(`tags`)
      // console.assert(false, document.body)
      white[`${id}`] = document.body
      white[`${id}`]['attachShadow']({ mode: 'open' })
      white[`${type}`] = ''
      white[`${property}`] = ''
      white[`class`] = 'public'
      parserProperty.push(components)
      white[`${property}`] = parserProperty
      function createSlot (obj, doc) {
        return new Promise(function (resolve, reject) {
          white[`${type}-slot`] = document.createElement('slot')
          white[`${type}-slot`]['name'] = obj
          doc.appendChild(white[`${type}-slot`])
        })
      }
      function createScript (id, obj) {
        return new Promise(function (resolve, reject) {
          let script = []
          if (!id) { id = 'default' }
          let verify = false
          let slider = true
          for (let i = 0; i < document.querySelectorAll('script').length; i++) {
            if (document.querySelectorAll('script')[i].src.indexOf(id) !== -1) {
              verify = true
            }
          }
          // console.assert(false, id, '~~~~~~~~~~~~~~~~', obj)
          if (slider === false) {
            const zSlider = document.createElement('script')
            zSlider.src = `/static/distrib/zSlider.js`
            zSlider.onload = resolve
            zSlider.onerror = reject
            obj['this'].appendChild(zSlider)
          }
          if (verify === true) {
            console.log('скрипт уже загружен')

          } else {
            const script = document.createElement('script')
            script.type = 'module'
            script.src = obj['property'].querySelector('script').src
            script.setAttribute('async', '')
            script.onload = resolve
            script.onerror = reject
            obj['this'].appendChild(script)
            white[`${id}-script`] = script
            resolve(white[`${id}-script`])
          }
          resolve(white[`${id}-script`])
        })
      }
      function component (obj, doc, target, ...args) {
        return new Promise(function (resolve, reject) {
          let check = []
          check['scoped'] = false
          check['scoped-id'] = ''
          check['slot'] = false
          check['slot-id'] = ''
          for (let key in obj['type']) {
            switch (obj['type'][key]) {
              case `default`:
                break
              case `slot`:
                if (check['slot'] === true && obj['slot'] === check['slot-id']) {
                  // console.log('Свойство повторяется')
                } else {
                  let t = false
                  for (let key in doc.children) {
                    if (typeof (doc.children[key]) === 'object') {
                      if (doc.children[key].tagName.toLowerCase() === target) { t = true }
                    }
                  }
                  if (t === true) {
                    // console.log('сюда можно жобавить слот')
                  } else {
                    createSlot(obj['slot'], doc)
                      .then(resolve => {
                        // console.log(`${obj['slot']}-slot-true`, obj)
                      })
                  }
                  check['slot'] = true
                  check['slot-id'] = obj['slot']
                }
                break
              case `html`:
                let element = document.createElement(`${obj['component']}`)
                element.setAttribute('slot', obj['id'])
                element.setAttribute('type', obj['type-string'])
                document['body'].appendChild(element)
                break
              default:
                // //console.log(`требуется добавить данное свойство  ['${obj['type'][key]}']`)
                break
            }
          }
          createScript(obj['component'], obj)
            .then((resolve) => {
            })
          obj['check'] = check
          resolve(obj)
        })
      }
      function createComponent (doc, id, obj) {
        return new Promise(function (resolve, reject) {
          let componet = new DOMParser()
          componet = componet.parseFromString(obj, 'text/html')
          for (let key in componet['body'].children) {
            if (typeof (componet['body'].children[key]) === 'object') {
              let type = componet['body'].children[key].getAttribute('type')
              type = type + '-html'
              componet['body'].children[key].setAttribute('type', type)
            }
          }
          docObject(componet, 'body')
            .then((data) => {
              appendChild(data)
                .then((create) => {
                  resolve(data)
                })
            })
        })
      }
      function objectProperty (obj, param) {
        return new Promise(function (resolve, reject) {
          let black = []
          black[`this`] = obj
          black[`verify`] = {}
          black[`verify`]['import'] = false
          black[`verify`]['slider'] = false
          black[`verify`]['blog'] = false
          black[`verify`]['quill'] = true
          if (!obj.tagName.toLowerCase()) {
            // console.log('что то пошло не так middleware js objectProperty', '')
          } else {
            black[`component`] = obj.tagName.toLowerCase()
          }
          if (typeof (obj) !== 'object') {
            // console.log('objectProperty middleware.js пришёл не объект')
          } else {
            if (!obj.getAttribute('type')) {
              black[`type`] = 'default'
              // console.log('нет типа ставим default')
              obj.setAttribute('type', 'default')
            } else {
              black[`type`] = obj.getAttribute('type').split('-')
              black[`type-string`] = obj.getAttribute('type')
              console.assert(false, black[`type`])
              for (let i = 0; i < black[`type`].length; i++) {
                if (black[`type`][i].split(':').length > 1) {
                  for (let j = 0; j < black[`type`][i].split(':').length; j++) {
                    switch (black[`type`][i].split(':')[j]) {
                      case 'slider': {
                        black[`verify`]['slider'] = true
                        black[`verify`]['quill'] = true
                      }
                        break
                      case 'blog': {
                        black[`verify`]['blog'] = true
                        black[`verify`]['quill'] = true
                      }
                      default:
                        black[`verify`]['quill'] = true
                        // //console.log(`какой то неизвестный тип`, type)
                        break
                    }
                  }
                }
              }
            }
            if (!obj.slot) {
              // console.log('отсутствует слот, ставится по тегу')
              obj.slot = obj.tagName.toLowerCase()
            } else {
              black[`slot`] = obj.slot
            }
            if (obj.hasAttribute('import') === false) {
            } else {
              black[`verify`]['import'] = true
            }
          }
          black[`property`] = param
          resolve(black)
        })
      }
      function appendChild (obj) {
        return new Promise(function (resolve, reject) {
          for (let key in obj) {
            switch (key) {
              case 'component':
                // console.assert(false, key)
                for (let type in obj[key]) {
                  objectProperty(obj[key][type])
                    .then((property) => {
                      component(property, obj['document']['body']['shadowRoot'], 'body')
                        .then((obj) => {
                          return obj
                        })
                    })
                }
                break
              case 'shadowRoot':
                for (let type in obj[key]) {
                  obj['document']['body']['shadowRoot']['appendChild'](obj[key][type])
                }
                break
              case 'external':
                for (let type in obj[key]) {
                  // getExternalComponent(obj[key][type])
                  getExternalComponent(obj[key][type], obj)
                    .then((verify) => {
                      // console.assert(false, verify)
                      if (!verify) {
                        console.log(`компонент удаляется из документа(component del)`, verify, obj[key][type])
                        obj['document']['body'][`removeChild`](obj[key][type])
                      } else {
                        console.log('нужна записать в localStorage и store данные по компоненту')
                      }
                    })
                }
                break
              default:
                // //console.log(`['${key}'] - возможно стоит добавить`)
                break
            }
          }
        })
      }
      function getExternalComponent (obj, document) {
        return new Promise(function (resolve, reject) {
          fetch('/static/html/components/index.html')
            .then(function (response) {
              if (response.ok) {
                return response.text()
              }
            }).then(function (body) {
            let param = {}
            let parser = new DOMParser()
              let doc = parser.parseFromString(body, 'text/html')
              if (doc.querySelectorAll('section').length !== 1) {
                let verify = false
                for(let key =0; key < doc.querySelectorAll('section').length; key++){
                  if (!doc.querySelectorAll('section')[key].getAttribute('id')) {
                  console.warn('secure у компонента должен быть id')
                  }else{
                    if (!obj.tagName.toLowerCase()) {
                      console.warn('пришёл не понятный объект')
                    } else {
                      if (obj.tagName.toLowerCase() === doc.querySelectorAll('section')[key].getAttribute('id')) {

                        param = doc.querySelectorAll('section')[key]
                        verify = true
                      } else {

                      }
                    }

                  }
                }
                if (verify === true) {
                  if (!obj.slot) {
                    console.log('slot устанавливается по tag', obj)
                    obj.slot = obj.tagName.toLowerCase()
                  }

                  objectProperty(obj, param)
                    .then((obj) => {
                      createScript(obj['this'].tagName.toLowerCase(), obj)
                        .then((obj) => { })
                      resolve(true)
                      // component(property, obj['document']['body']['shadowRoot'], 'body')
                      //   .then((obj) => {
                      //     return obj
                      //   })
                    })
                } else {
                  console.log('пришёл компонент не соответствующий запросу', obj.tagName.toLowerCase())
                  resolve(false)
                }
              } else {
                if (doc.querySelectorAll('section')[0].getAttribute('id') === obj.tagName.toLowerCase()) {
                  // console.log('пришёл нужный компонент', obj.tagName.toLowerCase())
                  if (!obj.slot) {
                    // console.log('slot не установлен компонент не может отображаться', obj)
                    // console.log('slot устанавливается по tag', obj)
                    obj.slot = obj.tagName.toLowerCase()
                  }
                  createScript(obj.tagName.toLowerCase(), obj)
                    .then((obj) => { })
                  resolve(true)
                } else {
                  // console.log('пришёл компонент не соответствующий запросу', obj.tagName.toLowerCase())
                  resolve(false)
                }
              }
            })
            .catch(error => {
              // console.log('middleware возникла ошибка', error)
            })
        })
      }

      function docObject (doc, id, ...args) {
        return new Promise(function (resolve, reject) {
          let black = []
          black[`shadowRoot`] = []
          black[`component`] = []
          black[`external`] = []
          black[`document`] = []
          if (doc.nodeName.toLowerCase() === '#document') {
            for (let key = 0; key < doc[`${id}`].children.length; key++) {
              switch (doc[`${id}`].children[key].tagName.toLowerCase().split('-').length) {
                case 0:
                  // console.log('midleware js нет тегов с нулевой длинной')
                  break
                case 1:
                  if (doc[`${id}`].children[key].tagName.toLowerCase() === 'script' ||
                                            doc[`${id}`].children[key].tagName.toLowerCase() === 'noscript') {
                  } else {
                    black[`shadowRoot`].push(doc[`${id}`].children[key])
                  }
                  break
                case 2:
                  let check = false
                  for (let type in white[`${property}`][0]['components']) {
                    if (doc[`${id}`].children[key].tagName.toLowerCase() === white[`${property}`][0]['components'][type]) { check = true }
                  }
                  if (check === true) {
                    black[`component`].push(doc[`${id}`].children[key])
                  } else {
                    black[`external`].push(doc[`${id}`].children[key])
                  }
                  break
                default:
                  let verify = false
                  for (let type in white[`${property}`][0]['components']) {
                    if (doc[`${id}`].children[key].tagName.toLowerCase() === white[`${property}`][0]['components'][type]) { verify = true }
                  }
                  if (verify === true) {
                    black[`component`].push(doc[`${id}`].children[key])
                  } else {
                    black[`external`].push(doc[`${id}`].children[key])
                  }
                  // console.log('midleware js при необходимости можно добавить длинну')
                  break
              }
            }
          }
          black[`document`] = document
          resolve(black)
        })
      }

      function Manifest (white) {
        return new Promise(function (resolve, reject) {
          manifest['init']()
            .then((obj) => {
              obj['manifest']['varan-pictures'](obj)
                .then((obj) => {
                  let verify = false
                  // for (let i = 0; i < document['head'].querySelectorAll('script').length; i++) {
                  //   if (document.querySelectorAll('script')[i].src.indexOf(`scoped.min.js`) !== -1) {
                  //     verify = true
                  //   }
                  // }
                  // if (verify === true) {
                  //   console.log('модуль загружен')
                  // } else {
                  //   white[`${id}-scoped`] = document.createElement('script')
                  //   white[`${id}-scoped`]['src'] = `/static/distrib/scoped.min.js`
                  //   white[`${id}-scoped`]['setAttribute']('async', '')
                  //   document['head'].appendChild(white['this-scoped'])
                  // }

                  white[`${id}-style`] = document.createElement('style')
                  white[`${id}-style`]['textContent'] = `@import "/static/html/shadow.css" `
                  white[`${id}`]['shadowRoot'].appendChild(white[`${id}-style`])
                  resolve(obj)
                })
            })
        })
      }
      /**
                 * add base manifest
                 * @type {HTMLElement}
                 */

      Manifest(white)
        .then((obj) => {
          docObject(document, 'body')
            .then((obj) => {
              console.log('компоненты проекта', obj)
              appendChild(obj)
                .then((obj) => {
                  return obj
                })
              return obj
            })
          return white
        })
    })(this).then((obj) => {
      (function () {
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.register('./service-worker.js', {
            scope: 'isstracker'
          }).then(function (reg) {
            console.log('Service worker registered')
          }).catch(function (err) {
            console.log(err)
          })
        }
      })()
    })
  })
export default async (event, obj, callback) => {
  console.log('~~~~~~ init object ~~~~~~', event)
  if(isEmpty(obj) === true){ obj = {} }
  obj['smart-contract'] = event
  obj['isEmpty'] = isEmpty
  obj['api'] = api
  obj['excel'] = parseXlsx
  console.log('manifest')
  callback(null, obj)
}