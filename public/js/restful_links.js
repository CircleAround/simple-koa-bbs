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
function restfulLinks(auto = true) {
  function requestAsForm(anchor) {
    const form = createForm(anchor.getAttribute('href'), anchor.getAttribute('data-method'))
    form.submit()
  }

  function addHidden(form, name, value) {
    const hidden = document.createElement('input')
    hidden.type = 'hidden'
    hidden.name = name
    hidden.value = value
    form.appendChild(hidden)
  }

  function createForm(action, method) {
    const form = document.createElement('form')
    form.action = action
    form.method = 'POST'

    addHidden(form, '_method', method)

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
    const methods = ['put', 'patch', 'delete']
    const selector = methods.map((method)=>{ return `a[data-method=${method}]` }).join(',')
  
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
    requestAsForm
  }
}
