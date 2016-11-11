import {
    valid,
    linkObjectObservable,
    observableObject
} from '../util/'

ko.components.store = (props) => {
  if (!props) {
    return null
  }

  const validOpts = valid({}, props)

  observableObject(validOpts)
  linkObjectObservable(validOpts, props)

  return validOpts
}
