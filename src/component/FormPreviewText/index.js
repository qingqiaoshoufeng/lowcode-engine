import formPreviewText from './form-preview-text.js'

export default {
  install(app) {
    app.directive('preview-text', formPreviewText)
  },
}

export { formPreviewText }
