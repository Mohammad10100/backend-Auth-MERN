const User = require("../models/User")

exports.getEmail = async (req, res) => {
    try {
        const id = req.user.id;
        let user = await User.findOne({_id:id})
        user.password= undefined


        res.status(200).json({
            success:true,
            data:user,
            messege:"User fetched "
        })

    } catch (error) {
        res.status(500).json(
            {
                success: false,
                data: "Internal server error hogaya",
                messege: error.messege
            }
        );
    }
}