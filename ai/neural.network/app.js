(() => {
    const Network = window.Network

    const network1 = new Network(2, 6, 6, 1)

    console.log('network1 output = ', network1.activate([300, 100]))

    const network2 = Network.fromJSON(network1.toJSON())

    console.log('network2 (from json) output = ', network2.activate([300, 100]))

    const download = (content, fileName, contentType) => {
        let a = document.createElement('a')
        let file = new Blob([JSON.stringify(content)], { type: contentType })
        a.href = URL.createObjectURL(file)
        a.download = fileName
        a.click()
    }

    const downloadJsonEl = document.getElementById('downloadJsonBtn')
    downloadJsonEl.onclick = () => download(network2.toJSON(), 'json.json', 'text/plain')
})()
