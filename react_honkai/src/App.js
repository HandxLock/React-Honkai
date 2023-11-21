import puppeteer from 'puppeteer'

async function abrirPaginas () {
  const navegador = await puppeteer.launch({
    headless: false
  })
  const pagina = await navegador.newPage()
  await pagina.goto('https://wiki.hoyolab.com/pc/hsr/aggregate/character?bbs_presentation_style=fullscreen&lang=es-es')
  await pagina.waitForSelector('.rpg-character-card-pc')
  const alturaTotal = await pagina.evaluate(() => {
    return document.body.scrollHeight
  })
  await pagina.evaluate((altura) => {
    window.scrollTo(0, altura)
  }, alturaTotal)
  await new Promise(resolve => setTimeout(resolve, 2000))
  await pagina.click('body > div.c-overlay.c-lne-overlay > div > svg > path')

  const elementos = await pagina.$$('.rpg-character-card-pc')

  const paginas = await navegador.pages()
  for (let i = 0; i < elementos.length; i++) {
    await elementos[i].click()
    await paginas[1].bringToFront()
  }
  const newPaginas = await navegador.pages()
  newPaginas[0].close()
  newPaginas[1].close()
  console.log(newPaginas.length)
  const data = []
  for (let i = 2; i < newPaginas.length; i++) {
    const paginaActual = newPaginas[i]
    await paginaActual.bringToFront()
    await paginaActual.waitForSelector('.base-info-item > div > div > div > div > p')
    const resultado = await paginaActual.$$('.base-info-item > div > div > div > div > p')
    const nombre = await paginaActual.evaluate(el => el.textContent, resultado[0])
    const tipoDeCombate = await paginaActual.evaluate(el => el.textContent, resultado[1])
    const via = await paginaActual.evaluate(el => el.textContent.substring(3), resultado[2])
    const faccion = await paginaActual.evaluate(el => el.textContent, resultado[3])
    await paginaActual.click('.language-selector>.c-selector-btn')
    console.log('Hice clic en cambiar idioma')
    await paginaActual.click('.popper-container>div>ul>li:nth-child(4)')
    await paginaActual.waitForNavigation()
    await paginaActual.waitForSelector('.base-info-item > div > div > div > div > p')
    const resultado2 = await paginaActual.$$('.base-info-item > div > div > div > div > p')
    const vozIngles = await paginaActual.evaluate(el => el.textContent, resultado2[4])
    const vozChina = await paginaActual.evaluate(el => el.textContent, resultado2[5])
    const vozJaponesa = await paginaActual.evaluate(el => el.textContent, resultado2[6])
    const vozKoreana = await paginaActual.evaluate(el => el.textContent, resultado2[7])
    await new Promise(resolve => setTimeout(resolve, 1000))
    await paginaActual.waitForSelector('#__layout > main > div.rpg-entry > div.rpg-entry-page > div.rpg-entry-child-page > div.detail-header > div > div.detail-header-cover-top > div.detail-header-cover-avatar-wrapper.rpg.character > div > img')
    const SelectorAvatarImagen = await paginaActual.$('#__layout > main > div.rpg-entry > div.rpg-entry-page > div.rpg-entry-child-page > div.detail-header > div > div.detail-header-cover-top > div.detail-header-cover-avatar-wrapper.rpg.character > div > img')
    const avatarImagen = await paginaActual.evaluate(el => el.getAttribute('src'), SelectorAvatarImagen)
    await paginaActual.waitForSelector('.default-img-wrapper>img')
    const selectorImagenCompleta = await paginaActual.$('.default-img-wrapper>img')
    const imagenCompleta = await paginaActual.evaluate(el => el.getAttribute('src'), selectorImagenCompleta)

    const datos = {
      nombre,
      tipoDeCombate,
      via,
      faccion,
      vozIngles,
      vozChina,
      vozJaponesa,
      vozKoreana,
      avatarImagen,
      imagenCompleta
    }
    data.push(datos)
    await paginaActual.close()
  }

  await navegador.close()
  console.log(data)
  return data
}
abrirPaginas()
