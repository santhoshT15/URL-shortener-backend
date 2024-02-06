const Url = require("../models/urlModel");
const shortid = require("shortid");





//route for create the new shorturl 

const createUrl = async(req,res)=>{
    const {longUrl, id} = req.body;
    try {
        let url = await Url.findOne({longUrl})
        if(!url){
            const shortUrl = shortid(8);
            const url = await Url.create({
                longUrl,
                shortUrl,
                userId: id
                
            })
            res.json({
                message: "Url create successfull",
                statusCode: 201,
                url
            });
        }else{
            res.json({
                message:'Given url already found',
                statusCode:400
            })
        }
       
    } catch (error) { 
        console.log(error)
        res.json({
            message:'Internal server error',
            statusCode:500
        })
    }
}

//redirect the given url page

const redirectUrl = async(req,res)=>{
    const {shortUrl} = req.params
    try {
        let data = await Url.findOne({shortUrl})
        if(data){
            await Url.findByIdAndUpdate(
                {_id:data._id},
                {$inc:{clickCount:1}}
            )
            res.redirect(data.longUrl);

        }else{
            res.json({
                message:"Url redirect failed",
                statusCode: 200,
            })
        }

    } catch (error) {
        res.json({
            message:'Internal server error',
            statusCode: 500,
        })
    }
};

//get all url
const allUrl = async(req,res)=>{
    try {
        let allurl = await Url.find() 
        const url = allurl.filter((item)=>item.userId == req.params.id)
        res.json({
            message:'url send successfull',
            statusCode: 200,
            urls:url.reverse()
        });
    } catch (error) {
        res.json({
            message:'Internal server error',
            statusCode: 500
        })
    }
};

//delete the url 
const deleteUrl = async(req,res)=>{
    try {
        await Url.findByIdAndDelete(req.params.id)
        res.json({
            statusCode:200,
            message:"Short url deleted successfully"
        });
    } catch (error) {
        res.json({
            message:'Internal server error',
            statusCode:500,
        })
    }
};
module.exports = {createUrl, redirectUrl, allUrl, deleteUrl}