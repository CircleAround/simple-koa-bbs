/*
[usage]
1. Server accept as `method-override`(ex. koa-override).
2. read scripts
3. run restfulLinks()
4. write `<a data-method="[name of method as lower case string]" href="[path to post]"></a>`

[example]
```
<head>
  <script src="/js/restful_links.js"></script>
  <script>restfulLinks()</script>
</head>
<body
  <a data-method="delete" href="/test">This is delete for method-override</a>
</body>
```
*/
function restfulLinks(options = {}) {
  const auto = options.auto || true
  const anchorMethodAttr = options.anchorMethodAttr || 'data-method'
  const overrideMethodKey = options.overrideMethodKey || '_method'
  const methods = options.methods || ['put', 'patch', 'delete']
  const csrfTokenKey = options.csrfTokenKey || 'authenticity_token'

  const putParamsToForm = options.putParamsToForm || function(context) {
    context.addHidden(overrideMethodKey, context.method)

    const meta = document.querySelector('meta[name=csrf-token]')
    if(meta) { 
      context.addHidden(csrfTokenKey, meta.getAttribute('content'))
    }
  }

  function requestAsForm(anchor) {
    const form = createForm(anchor.getAttribute('href'), anchor.getAttribute(anchorMethodAttr))
    form.submit()
  }

  function createForm(action, method) {
    const form = document.createElement('form')
    form.action = action
    form.method = 'post'

    function addHidden(name, value) {
      const hidden = document.createElement('input')
      hidden.type = 'hidden'
      hidden.name = name
      hidden.value = value
      this.form.appendChild(hidden)
    }

    putParamsToForm({ form, method, addHidden })

    document.body.appendChild(form)
    return form
  }

  function applyToAnchor(anchor) {
    anchor.addEventListener('click', (event) => {
      event.preventDefault()
      requestAsForm(anchor)
    })
  }

  function applyAll() {
    const selector = methods.map((method)=>{ return `a[${anchorMethodAttr}=${method}]` }).join(',')
    for(const node of document.querySelectorAll(selector)) {
      applyToAnchor(node)
    }
  }

  function applyOnDOMContentLoaded() {
    document.addEventListener('DOMContentLoaded', ()=>{
      applyAll()
    })
  }

  if(auto) { applyOnDOMContentLoaded() }

  return {
    applyOnDOMContentLoaded,
    applyAll,
    applyToAnchor,
    createForm,
    requestAsForm
  }
}
