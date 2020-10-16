export const GET_BARBERS = "GET_BARBERS"; 
export const GET_REVIEWS = "GET_REVIEWS"; 




export const getBarbers = (sex)=>{

    return async (dispatch) =>{
        try {

            const arr = await fetch(`http://173.212.234.137:3000/barbers/allbarbers/${sex}`);
            const resData = await arr.json ();
         
            dispatch({type : GET_BARBERS , barbers : resData});
        }
        
        catch (error) {
            throw error ;
            // console.log("There is an Error");
        }

                
            };



        };


        


