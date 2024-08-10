const express=require('express')
const auth=require('../middleware/authMiddleware')
const MCQ=require('../models/MCQ')

//Create MCQ

router.post('/',auth,async (req,res)=>{
    const {body ,explanation,options,difficulty}=req.body;
    try{
        const mcq=new MCQ({
            body,
            explanation,
            options,
            difficulty,
            createdBy:req.user.id,
        })
        await mcq.save();
        res.json(mcq);
    }
    catch(err){
        res.status(500).send('Server error')
    }
})

//Read MCQs
router.get('/',async(req,res)=>{
    try{
        const mcqs=await MCQ.find();
        res.json(mcqs);
    }
    catch(err){
        res.status(500).send('Server error')
    }
})

//Update MCQ

router.put('/:id',auth,async(req,res)=>{
    const {body,explanation,options,difficulty}=req.body;
    try{
        let mcq=await MCQ.findById(req.params.id);
        if(!mcq) return res.status(404).json({msg:'MCQ not found'})

            if(mcq.createdBy.toString()!==req.user.id)
                return res.status(401).json({msg:'Not Authorized'})

            mcq=await MCQ.findByIdAndUpdate(
                req.params.id,
                {
                    $set:{body,explanation,options,difficulty}
                },
                {
                    new: true
                }
            );
            res.json(mcq);
    }
    catch(err){
        res.status(500).send('Server error')
    }
})

//Delete MCQ

router.delete('/:id',auth,async(req,res)=>{
    try{
        const mcq=await MCQ.findById(req.params.id);
        if(!mcq) return res.status(404).json({msg:'MCQ not found'})

        if(mcq.createdBy.toString()!==req.user.id)
            return res.status(401).json({msg:'Not authorized'})
        await MCQ.findByIdAndRemove(req.params.id);
        res.json({msg:'MCQ removed'})
    }
    catch(err){
        res.status(500).send('Server error')
    }
})

module.exports=router;