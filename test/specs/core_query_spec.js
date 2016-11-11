import '../../src/'
import Avatar from '../samples/components/avatar'
import List from '../samples/components/list'

describe('query', () => {
  const body = document.querySelector('body')

  beforeEach(() => {
    body.innerHTML = `
            <div id="test">
                <avatar></avatar>
                <list></list>
            </div>
            <div id="empty">
            </div>
        `

    ko.components.register(Avatar)
    ko.components.register(List)
    ko.applyBindings(null, document.querySelector('#test'))
  })

  afterEach(() => {
    body.innerHTML = ''
    ko.components.unregister(Avatar.name)
    ko.components.unregister(List.name)
  })

  it('should return avatar vm', () => {
    const vm = ko.components.querySelector('avatar')

    expect(vm).toBeDefined()
    expect(vm instanceof Avatar.constructor).toBe(true)
  })

  it('should return list vm', () => {
    const vm = ko.components.querySelector('list')

    expect(vm).toBeDefined()
    expect(vm instanceof List.constructor).toBe(true)
  })

  it('should return null', () => {
    const vm = ko.components.querySelector('unknow')

    expect(vm).toBe(null)
  })

  it('should return null(context)', () => {
    const vm1 = ko.components.querySelector('avatar', document.getElementById('empty'))
    const vm2 = ko.components.querySelector('list', document.getElementById('empty'))

    expect(vm1).toBe(null)
    expect(vm2).toBe(null)
  })
})
