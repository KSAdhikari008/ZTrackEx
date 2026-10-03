import { User } from "../models/user.model.js";

async function updateUsername(req, res) {
    res.status(501).json({ message: "Not implemented" });
}

async function updatePassword(req, res) {
    res.status(501).json({ message: "Not implemented" });
}

async function deleteUser(req, res) {

    try{

        const {id} = req.params;
        
        await User.findByIdAndDelete(id);
        
        res.status(200).json({ message: "User deleted succesfully." });
    }catch(err){
        res.status(500).json({ message: err.message });
    }
}

export { updateUsername, updatePassword, deleteUser };
