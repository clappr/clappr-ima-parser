/* eslint-disable */

const SECONDS_TO_MILLISECONDS = 1000
const MINUTES_TO_MILLISECONDS = 60000
const HOURS_TO_MILLISECONDS = 3600000

/**
 * Transforms the given string duration time into milliseconds.
 *
 * @param {string} adsTimeOffset - The offset time 00:00:00 format.
 */
export const hmsToMilliseconds = adsTimeOffset => {
  if (adsTimeOffset && adsTimeOffset.split) {
    const values = adsTimeOffset.split(':')

    return parseInt(values[2], 10) * SECONDS_TO_MILLISECONDS
      + parseInt(values[1], 10) * MINUTES_TO_MILLISECONDS
      + parseInt(values[0], 10) * HOURS_TO_MILLISECONDS
  }
}

export const xml2json = xml => {
  let X = {
    toObj: function (xml) {
      let o = {}
      if (xml.nodeType == 1) {   // element node ..
        if (xml.attributes.length)   // element with attributes  ..
          for (let i = 0; i < xml.attributes.length; i++)
            o['@' + xml.attributes[i].nodeName] = (xml.attributes[i].nodeValue || '').toString()
        if (xml.firstChild) { // element has child nodes ..
          let textChild = 0, cdataChild = 0, hasElementChild = false
          for (let n = xml.firstChild; n; n = n.nextSibling) {
            if (n.nodeType == 1) hasElementChild = true
            else if (n.nodeType == 3 && n.nodeValue.match(/[^ \f\n\r\t\v]/)) textChild++ // non-whitespace text
            else if (n.nodeType == 4) cdataChild++ // cdata section node
          }
          if (hasElementChild) {
            if (textChild < 2 && cdataChild < 2) { // structured element with evtl. a single text or/and cdata node ..
              X.removeWhite(xml)
              for (let n = xml.firstChild; n; n = n.nextSibling) {
                if (n.nodeType == 3)  // text node
                  o['#text'] = X.escape(n.nodeValue)
                else if (n.nodeType == 4)  // cdata node
                  o['#cdata'] = X.escape(n.nodeValue)
                else if (o[n.nodeName]) {  // multiple occurence of element ..
                  if (o[n.nodeName] instanceof Array)
                    o[n.nodeName][o[n.nodeName].length] = X.toObj(n)
                  else
                    o[n.nodeName] = [o[n.nodeName], X.toObj(n)]
                } else {  // first occurence of element..
                  o[n.nodeName] = X.toObj(n)
                }
              }
            } else { // mixed content
              if (!xml.attributes.length)
                o = X.escape(X.innerXml(xml))
              else
                o['#text'] = X.escape(X.innerXml(xml))
            }
          } else if (textChild) { // pure text
            if (!xml.attributes.length)
              o = X.escape(X.innerXml(xml))
            else
              o['#text'] = X.escape(X.innerXml(xml))
          } else if (cdataChild) { // cdata
            if (cdataChild > 1)
              o = X.escape(X.innerXml(xml))
            else
              for (let n = xml.firstChild; n; n = n.nextSibling)
                o['#cdata'] = X.escape(n.nodeValue)
          }
        }
        if (!xml.attributes.length && !xml.firstChild) o = null
      } else if (xml.nodeType == 9) { // document.node
        o = X.toObj(xml.documentElement)
      }
      return o
    },
    innerXml: function (node) {
      let s = ''
      if ('innerHTML' in node)
        s = node.innerHTML
      else {
        let asXml = function (n) {
          let s = ''
          if (n.nodeType == 1) {
            s += '<' + n.nodeName
            for (let i = 0; i < n.attributes.length; i++)
              s += ' ' + n.attributes[i].nodeName + '=\'' + (n.attributes[i].nodeValue || '').toString() + '\''
            if (n.firstChild) {
              s += '>'
              for (let c = n.firstChild; c; c = c.nextSibling)
                s += asXml(c)
              s += '</' + n.nodeName + '>'
            } else
              s += '/>'
          } else if (n.nodeType == 3)
            s += n.nodeValue
          else if (n.nodeType == 4)
            s += '<![CDATA[' + n.nodeValue + ']]>'
          return s
        }
        for (let c = node.firstChild; c; c = c.nextSibling)
          s += asXml(c)
      }
      return s
    },
    escape: function (txt) {
      return txt.replace(/[\\]/g, '\\\\')
        .replace(/[']/g, '\\"')
        .replace(/[\n]/g, '\\n')
        .replace(/[\r]/g, '\\r')
    },
    removeWhite: function (e) {
      e.normalize()
      for (let n = e.firstChild; n;) {
        if (n.nodeType == 3) {  // text node
          if (!n.nodeValue.match(/[^ \f\n\r\t\v]/)) { // pure whitespace text node
            let nxt = n.nextSibling
            e.removeChild(n)
            n = nxt
          } else
            n = n.nextSibling
        } else if (n.nodeType == 1) {  // element node
          X.removeWhite(n)
          n = n.nextSibling
        } else                      // any other node
          n = n.nextSibling
      }
      return e
    }
  }
  if (xml.nodeType == 9) // document node
    xml = xml.documentElement
  return X.toObj(xml)
}
