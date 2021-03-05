export const GET_SERVICES = "GET_SERVICES";
export const GET_WORKTIME = "GET_WORKTIME";



export const getServices = (barberId)=>{

    return async dispatch =>{
        try {
   
            const arr = await fetch(`http://95.111.243.233:3000/barber/services/${barberId}`);
            const resData = await arr.json ();
            let typeNames = [];


            resData.forEach(e => {
                    if(typeNames.indexOf(e.typeOfService)<0) {
                        typeNames.push(e.typeOfService);
                    }
                });

let allServices = [];


typeNames.forEach( type => {

    let same = resData.filter(e=>e.typeOfService === type);
    
        let category = {
         name : type ,
         services : []
  
        }
        same.forEach(e=>{
              const service = {
                    duration : e.duration,
                    id : e.id,
                    name : e.name ,
                    price : e.price
              }
              category.services.push(service);
        });
        allServices.push(category);
          });

          
            
            dispatch({type : GET_SERVICES , services : allServices});
      

            }
        
        catch (error) {
            console.log("There is an Error");
            throw error;
        }

                
            };



        };


    
// export const getWorkingTime = (barberId)=>{
//     return async dispatch =>{
//         try {
   
//             const arr = await fetch(`http://95.111.243.233:3000/barber/hours/${barberId}`);
//             const resData = await arr.json ();

//             dispatch({type : GET_WORKTIME , worktime : resData});


//             }
        
//         catch (error) {
//             console.log("There is an Error");
//         }

                
//             };



//         };





      