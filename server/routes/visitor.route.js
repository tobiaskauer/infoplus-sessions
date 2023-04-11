const { Router } = require('express')
const Visitor = require('../models/visitor.model')

//TODO: SANItIZE INPUTS

const router = Router()

router.get('/', async (req, res) => {
    try {
        const visitors = await Visitor.find()
        if (!visitors) throw new Error('No Visitors found')
        res.status(200).json(visitors)
    
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/', async (req, res) => {
    const newVisitor = new Visitor(req.body)
    try {
        const visitor = await newVisitor.save()
        if (!visitor) throw new Error('Something went wrong saving the Visitor')
        res.status(200).json(visitor)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
})

router.post('/:id', async (req, res) => {
    try {
        const updatedVisitor = await Visitor.findOneAndUpdate(req.params.id,req.body)
        res.status(200).json(updatedVisitor)
        
    } catch (error) {
        console.log(error) 
        res.status(500).json({ message: error.message })
    }
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const removed = await Todo.findByIdAndDelete(id)
        if (!removed) throw Error('Something went wrong ')
        res.status(200).json(removed)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router