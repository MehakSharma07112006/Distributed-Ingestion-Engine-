// This service here is responsible to give an API to get the user preferences

import { URLS } from './urls';


async function getUserPreferences(userId:string): Promise<any> {
    try{
        const response = await fetch(URLS.USER.PREFERENCES.GET)
        if (response.ok) {
            const data = await response.json();
            return data;
        }
        else {
            throw new Error("Error in getUserPreferences");
        }
    }
    catch(err)
    {
        console.error("[ERROR] Error in getUserPreferences: ", err);
        throw new Error("Error in getUserPreferences");
    }
}

export default getUserPreferences;