(function () {
  var scriptEl = document.currentScript
  var PLUGIN_ID = scriptEl
    ? (scriptEl.dataset.idxPlugin || scriptEl.dataset.idxPluginId || "")
    : ""

  var root = null
  var open = false
  var outsideHandler = null
  var escapeHandler = null

  var WA_ICON_PATH = "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"

  function getConfig() {
    var rt = window.IDX_PLUGIN
    if (!rt) return null

    if (PLUGIN_ID && typeof rt.getPluginConfig === "function") {
      var pluginCfg = rt.getPluginConfig(PLUGIN_ID)
      if (pluginCfg && Array.isArray(pluginCfg.branches) && pluginCfg.branches.length) {
        return pluginCfg
      }
    }

    var t = rt.tenant || {}
    var tenantWa = t.whatsapp
      || (t.client && t.client.settings && t.client.settings.whatsapp)
      || (t.settings && t.settings.whatsapp)
    if (tenantWa && Array.isArray(tenantWa.branches) && tenantWa.branches.length) {
      return tenantWa
    }

    var plugins = rt.plugins || []
    for (var i = 0; i < plugins.length; i++) {
      if ((plugins[i].name || "").toLowerCase().indexOf("whatsapp") !== -1) {
        return plugins[i].config || {}
      }
    }
    return null
  }

  function formatPhone(phone) {
    return String(phone || "").replace(/[\s\-()]/g, "")
  }

  function formatPhoneDisplay(phone) {
    var clean = formatPhone(phone)
    if (clean.length > 6) {
      return clean.replace(/(\d{3})(\d{3})(\d+)/, "$1 $2 $3")
    }
    return clean
  }

  function buildWaUrl(phone, message) {
    var url = "https://wa.me/" + formatPhone(phone)
    if (message) {
      url += "?text=" + encodeURIComponent(message)
    }
    return url
  }

  function svg(size) {
    var ns = "http://www.w3.org/2000/svg"
    var el = document.createElementNS(ns, "svg")
    el.setAttribute("viewBox", "0 0 24 24")
    el.setAttribute("fill", "currentColor")
    el.setAttribute("width", String(size))
    el.setAttribute("height", String(size))
    var p = document.createElementNS(ns, "path")
    p.setAttribute("d", WA_ICON_PATH)
    el.appendChild(p)
    return el
  }

  function el(tag, cls, attrs) {
    var node = document.createElement(tag)
    if (cls) node.className = cls
    if (attrs) {
      for (var k in attrs) {
        if (Object.prototype.hasOwnProperty.call(attrs, k)) {
          node.setAttribute(k, attrs[k])
        }
      }
    }
    return node
  }

  function setOpen(next) {
    open = next
    if (root) root.setAttribute("data-open", open ? "true" : "false")
  }

  function createBranchItem(branch, message) {
    var item = el("a", "idx-wa-branch-item", {
      href: buildWaUrl(branch.phone, message),
      target: "_blank",
      rel: "noopener"
    })

    var iconWrap = el("span", "idx-wa-branch-icon")
    iconWrap.appendChild(svg(20))

    var info = el("span", "idx-wa-branch-info")

    var name = el("span", "idx-wa-branch-name")
    name.textContent = branch.name || "Sucursal"

    var phone = el("span", "idx-wa-branch-phone")
    phone.textContent = formatPhoneDisplay(branch.phone)

    info.appendChild(name)
    info.appendChild(phone)
    item.appendChild(iconWrap)
    item.appendChild(info)
    return item
  }

  function createFab(color) {
    var fab = el("button", "idx-wa-fab", {
      type: "button",
      "aria-label": "Abrir WhatsApp"
    })
    fab.style.backgroundColor = color
    fab.appendChild(svg(28))
    return fab
  }

  function createDirectLink(branch, message, color) {
    var link = el("a", "idx-wa-fab", {
      href: buildWaUrl(branch.phone, message),
      target: "_blank",
      rel: "noopener",
      "aria-label": "Contactar por WhatsApp"
    })
    link.style.backgroundColor = color
    link.appendChild(svg(28))
    return link
  }

  function bindOutsideClick() {
    outsideHandler = function (e) {
      if (open && root && !root.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("click", outsideHandler)
  }

  function bindEscape() {
    escapeHandler = function (e) {
      if (e.key === "Escape" && open) {
        setOpen(false)
      }
    }
    document.addEventListener("keydown", escapeHandler)
  }

  function createUI(config) {
    var branches = Array.isArray(config.branches) ? config.branches : []
    branches = branches.filter(function (b) {
      return b && typeof b === "object" && b.phone
    })
    if (!branches.length) return

    var message = typeof config.message === "string" ? config.message : ""
    var position = config.position === "bottom-left" ? "bottom-left" : "bottom-right"
    var color = typeof config.buttonColor === "string" && config.buttonColor ? config.buttonColor : "#25D366"
    var title = typeof config.popupTitle === "string" && config.popupTitle ? config.popupTitle : "Selecciona un local"

    root = el("div", "idx-wa-container")
    root.setAttribute("data-position", position)
    root.setAttribute("data-open", "false")

    if (branches.length === 1) {
      root.appendChild(createDirectLink(branches[0], message, color))
      document.body.appendChild(root)
      return
    }

    var popup = el("div", "idx-wa-popup", {
      role: "dialog",
      "aria-label": title
    })

    var header = el("p", "idx-wa-popup-title")
    header.textContent = title
    popup.appendChild(header)

    var list = el("div", "idx-wa-branch-list")
    for (var i = 0; i < branches.length; i++) {
      list.appendChild(createBranchItem(branches[i], message))
    }
    popup.appendChild(list)
    root.appendChild(popup)

    var fab = createFab(color)
    fab.addEventListener("click", function (e) {
      e.stopPropagation()
      setOpen(!open)
    })
    root.appendChild(fab)

    bindOutsideClick()
    bindEscape()
    document.body.appendChild(root)
  }

  function destroy() {
    if (root && root.parentNode) {
      root.parentNode.removeChild(root)
      root = null
    }
    if (outsideHandler) {
      document.removeEventListener("click", outsideHandler)
      outsideHandler = null
    }
    if (escapeHandler) {
      document.removeEventListener("keydown", escapeHandler)
      escapeHandler = null
    }
    open = false
  }

  var booted = false

  function boot() {
    if (booted) return
    var config = getConfig()
    if (!config) return
    var branches = Array.isArray(config.branches) ? config.branches : []
    if (!branches.length) return
    booted = true
    createUI(config)
  }

  boot()

  if (!booted && window.IDX_PLUGIN && typeof window.IDX_PLUGIN.on === "function") {
    window.IDX_PLUGIN.on("runtime.ready", boot)
  }

  if (window.IDX_PLUGIN && typeof window.IDX_PLUGIN.on === "function") {
    window.IDX_PLUGIN.on("runtime.dispose", destroy)
  }
})()
