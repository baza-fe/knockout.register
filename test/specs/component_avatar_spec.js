import '../../src/'
import eventMixin from '../samples/mixins/event'
import stateMixin from '../samples/mixins/state'
import Avatar from '../samples/components/avatar'

describe('avatar', () => {
  const body = document.querySelector('body')

  beforeAll(() => {
    ko.components.register(Avatar)
  })

  afterAll(() => {
    ko.components.unregister(Avatar.name)
  })

  beforeEach(() => {
    body.innerHTML = `
            <div id="test">
                <avatar></avatar>
            </div>
        `
    ko.applyBindings(null, document.querySelector('#test'))
  })

  afterEach(() => {
    body.innerHTML = ''
  })

  it('should create constructor properties', () => {
    const vm = ko.components.querySelector('avatar')

    expect(ko.isObservable(vm.first)).toBe(true)
    expect(ko.isObservable(vm.last)).toBe(true)
    expect(vm.first()).toBe(Avatar.defaults.first)
    expect(vm.last()).toBe(Avatar.defaults.last)
  })

  it('should create plugin properties', () => {
    const vm = ko.components.querySelector('avatar')

    expect(vm.$opts).toBeDefined()
    expect(vm.$defaults).toBe(Avatar.defaults)
    expect(vm.$info).toBeDefined()
    expect(vm.$info).toBe(vm.componentInfo)
  })

  it('should create computed properties', () => {
    const vm = ko.components.querySelector('avatar')
    const full = `${vm.first()} ${vm.last()}`

    expect(ko.isComputed(vm.full)).toBe(true)
    expect(ko.isComputed(vm.full2)).toBe(true)
    expect(ko.isComputed(vm.full3)).toBe(true)
    expect(vm.full()).toBe(full)
    expect(vm.full2()).toBe(full)
    expect(vm.full3()).toBe(full)
  })

  it('should not create computed properties', () => {
    const vm = ko.components.querySelector('avatar')

    expect(vm.avatar1()).toBe('avatar')
    expect(vm.avatar2()).toBe('avatar')
    expect(vm.avatar3()[0]).toBe('avatar')
  })

  it('should create methods', () => {
    const vm = ko.components.querySelector('avatar')

    expect(typeof vm.rename === 'function').toBe(true)
    expect(vm.hasOwnProperty('rename')).toBe(false)
  })

  it('should create mixin methods', () => {
    const vm = ko.components.querySelector('avatar')

    expect(vm.hasOwnProperty('on')).toBe(true)
    expect(vm.hasOwnProperty('off')).toBe(true)
    expect(vm.hasOwnProperty('toggle')).toBe(true)
    expect(vm.on).toBe(eventMixin.on)
    expect(vm.off).toBe(eventMixin.off)
    expect(vm.toggle).toBe(stateMixin.toggle)
  })

  it('should insert template in dom', () => {
    const avatarFirst = document.querySelector('.avatar-first')
    const avatarLast = document.querySelector('.avatar-last')
    const avatarFull = document.querySelector('.avatar-full')
    const avatarFull2 = document.querySelector('.avatar-full2')

    avatarFirst.textContent = ''
    avatarLast.textContent = ''
    avatarFull.textContent = ''
    avatarFull2.textContent = ''

    const avatar = document.querySelector('avatar')
    const html = avatar.innerHTML.trim().replace(/[\n\s]+/g, '')
    const template = Avatar.template.trim().replace(/[\n\s]+/g, '')

    expect(html.indexOf(template) > -1).toBe(true)
  })

  it('should binding default value', () => {
    const avatarFirst = document.querySelector('.avatar-first')
    const avatarLast = document.querySelector('.avatar-last')

    expect(avatarFirst.textContent).toBe(Avatar.defaults.first)
    expect(avatarLast.textContent).toBe(Avatar.defaults.last)
  })

  it('should binding computed value', () => {
    const avatarFull = document.querySelector('.avatar-full')
    const avatarFull2 = document.querySelector('.avatar-full2')
    const full = `${Avatar.defaults.first} ${Avatar.defaults.last}`

    expect(avatarFull.textContent).toBe(full)
    expect(avatarFull2.textContent).toBe(full)
  })

  it('should link with dom', () => {
    const vm = ko.components.querySelector('avatar')
    const first = 'foo'
    const last = 'bar'
    const full = `${first} ${last}`

    vm.rename(first, last)

    const avatarFirst = document.querySelector('.avatar-first')
    const avatarLast = document.querySelector('.avatar-last')
    const avatarFull = document.querySelector('.avatar-full')
    const avatarFull2 = document.querySelector('.avatar-full2')

    expect(avatarFirst.textContent).toBe(first)
    expect(avatarLast.textContent).toBe(last)
    expect(avatarFull.textContent).toBe(full)
    expect(avatarFull2.textContent).toBe(full)
  })
})
