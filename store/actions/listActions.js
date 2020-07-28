export const GET_BARBERS = "GET_BARBERS"; 



export const getBarbers = ()=>{

    return async dispatch =>{
        try {
   
            const arr = await fetch(`http://192.168.1.5:3000/barbers/allbarbers`);
            const resData = await arr.json ();
            dispatch({type : GET_BARBERS , barbers : resData});

            }
        
        catch (error) {
            console.log("There is an Error");
        }

                
            };



        };
