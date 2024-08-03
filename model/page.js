const fileHandler = require('./helpers/fileHandler')
const crypto = require('crypto')
const fileName = 'pages.txt'

let pages = []


function dataAtualFormatada(){
    var data = new Date(),
        dia  = data.getDate().toString().padStart(2, '0'),
        mes  = (data.getMonth()+1).toString().padStart(2, '0'), //+1 pois no getMonth Janeiro começa com zero.
        ano  = data.getFullYear();
    return dia+"/"+mes+"/"+ano;
}

module.exports = {

    async populate() {
        pages = await fileHandler.read(fileName)
    },

    async create(data) {
        const page = {
            id: crypto.randomUUID(),
            url: data.url,
            title: data.title,
            content: data.content,
            date: dataAtualFormatada()
        }

        pages.push(page)
        await fileHandler.write(fileName, pages)
    },

    async update(id, data) {
        const page = {
            id: id,
            url: data.url,
            title: data.title,
            content: data.content,
            date: dataAtualFormatada()
        }

        const index = pages.findIndex(oldUser => oldUser.id === page.id)
        if (index !== -1) {
            pages[index] = page
        }
        
        await fileHandler.write(fileName, pages)
    },

    async delete(id) {
        const updatedPages = pages.filter(page => page.id != id)
        pages = updatedPages

        await fileHandler.write(fileName, pages)
    },

    async search(id) {
        await this.populate()
        return pages.find(page => page.id == id)
    },

    async search(url) {
        await this.populate()
        return pages.find(page => page.url == url)
    },

    async getAll() {
        await this.populate()
        return pages
    }
}