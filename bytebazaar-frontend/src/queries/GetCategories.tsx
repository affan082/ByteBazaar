import axios from "axios";
import config from "../config/global-info.json";

export async function GetCategories(query:Object) {
    try{
        // console.log(query);
        const url = config.server.uri+"category/?"+new URLSearchParams(query).toString();
        const response = await axios.get(url).then((res)=>{
            // console.log(url);
            // console.log(res.data.data);
            return res.data;
        }).catch((err)=>{
            console.log(err);
            throw err;
        })

        return response.data;
    }
    catch(error){
        console.log(error);
        throw error;
    }
}