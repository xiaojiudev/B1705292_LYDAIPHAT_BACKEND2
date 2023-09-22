const { ObjectId } = require("mongodb")

class ContactService {
    constructor(client) {
        this.Contact = client.db().collection("contacts")
    }

    // Define database access methods using mongodb API
    extractContactData(payload) {
        const contact = {
            name: payload.name,
            email: payload.email,
            address: payload.address,
            phone: payload.phone,
            favorite: payload.favorite,
        }

        // Remove undefined fields
        Object.keys(contact).forEach((key) => contact[key] === undefined && delete contact[key])

        return contact
    }

    async create(payload) {
        const contact = this.extractContactData(payload)
        const result = await this.Contact.findOneAndUpdate(
            contact,
            { $set: { favorite: contact.favorite === true } },
            { returnDocument: "after", upsert: true }
        )


        //result is object so result.value in slide is incorrect
        return result
    }

    //  Searches for documents that meet the condition specified in the condition object, by name
    async find(filter) {
        const cusor = await this.Contact.find(filter)
        return await cusor.toArray()
    }

    async findByName(name) {
        return await this.find({
            name: { $regex: new RegExp(name), $options: "i" },
        })
    }

    // Search documents by Id
    async findById(id) {
        return await this.Contact.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        })
    }

    //search for the document by Id and update it with the data in the document object
    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        }

        const update = this.extractContactData(payload)

        const result = await this.Contact.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        )

        //result is object so result.value in slide is incorrect
        return result
    }

    // search for document by Id and delete this document
    async delete(id) {
        const result = await this.Contact.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        })

        //result is object so result.value in slide is incorrect
        return result
    }

    // find all documents that having a desired property
    async findFavorite() {
        return await this.find({ favorite: true })
    }

    // delete all documents
    async deleteAll() {
        const result = await this.Contact.deleteMany({})

        return result.deletedCount
    }

}

module.exports = ContactService